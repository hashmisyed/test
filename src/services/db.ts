import mysql, { createPool } from 'mysql2/promise';

export class DBInstance {
    private static ConnectionPool: mysql.Pool
    static InitalizeDbPool() {
        this.ConnectionPool = createPool(JSON.parse(process.env.EngineDB));
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
          let [results,] = await connection.execute('select 1+1 As Result');
          console.log(results);
        }
        catch (error) {
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
