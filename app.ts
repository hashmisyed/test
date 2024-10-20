import bcrypt from 'bcrypt';

const saltRounds = 13; // Adjust this value (typically between 10 and 12 is a good range)
const myPlaintextPassword = 'My Long Password with spaces and others';

const salt = bcrypt.genSaltSync(saltRounds);
const hash = bcrypt.hashSync(myPlaintextPassword, salt);
console.log(salt);
console.log(hash);
