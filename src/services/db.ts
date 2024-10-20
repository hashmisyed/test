import mysql, { createPool } from 'mysql2/promise';
import { Request, Response } from 'express';

export class DBInstance {
    private static ConnectionPool: mysql.Pool
    static InitalizeDbPool() {
        this.ConnectionPool = createPool(JSON.parse(process.env.EngineDB));// TODO: read from .env individual values and put coding default for values not found.
        this.ConnectionPool.on('enqueue', function () {
            console.warn('Waiting for available connection slot');
        });
    }

    static DestroyPool() {
        this.ConnectionPool.end();
    }

    static async VerifyInitialization()
    {
        const connection = await DBInstance.GetPoolConnection();
        try {
          const [results, ] = await connection.execute('select 1+1 As Result');
          console.log(results);
        }
        catch (error) {
            throw new Error('DB Connection Error');
            console.log(error);
        } finally {
            connection && DBInstance.ReleaseConnection(connection);
        }
    }
    static ReleaseConnection(connection: mysql.PoolConnection) {
        this.ConnectionPool.releaseConnection(connection);
    }

    static async GetPoolConnection():Promise<mysql.PoolConnection> {
       return await this.ConnectionPool.getConnection();
    }
}

export async function executeMultiple(sqlstatements: any[]) {
    let results: any;
    const connection = await DBInstance.GetPoolConnection();
    try {
        for (let i = 0; i < sqlstatements.length; i++) {
          [results,] = await connection.execute(sqlstatements[i].sql, sqlstatements[i].params);
        }
    }
    catch (error) {
        console.log(error);
    } finally {
        connection && DBInstance.ReleaseConnection(connection);
    }
    return results;
}
export async function executePathProc(procName: string, req: Request): Promise<Response> {
    const connection = await DBInstance.GetPoolConnection();
    try {
        const sql = 'SET @v_res=NULL, @v_ReturnCode=NULL; CALL ' + procName + '(?, @v_res, @v_ReturnCode); SELECT @v_res, @v_ReturnCode;';// TODO: test without multiple statements
        const [result, fields] = await connection.execute(sql, [req]);
        console.log(fields);
        const returnCode = result[0][0]['@v_ReturnCode'];
        if (returnCode === 0) {
            const res = result[0][0]['@v_Res'];
            return res;
        }
        throw new Error('DB Application Error');
    }
    catch (error) {
        throw new Error('DB Connection Error');
        console.log(error);
    } finally {
        connection && DBInstance.ReleaseConnection(connection);
    }
}
