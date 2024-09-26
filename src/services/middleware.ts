const { createSign, createVerify } = await import('node:crypto');
  
const privateKey = process.env.PRIVATE_KEY;
const publicKey = process.env.PUBLIC_KEY;

export const verifyToken = async function(jwt: string): Promise<boolean | null> {
    const tokenArray = jwt.split(".");
    const verify = createVerify('SHA256').update(tokenArray[0]).end();
    return verify.verify(publicKey, tokenArray[2]);
}

export const signToken = async function(jwt: string): Promise<string | null> {
    const sign = createSign('SHA256').update('some data to sign').end();
    return sign.sign(privateKey).toString();
}



