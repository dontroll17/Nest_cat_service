const fs = require('fs/promises');

const filePath = './migrations/data.sql';

const createData = async (filePath, nick, role) => {
    await fs.appendFile(filePath, `INSERT INTO cats_entity (nick, role) VALUES('${nick}', '${role}');\n`);
}

const createStr = 
`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE cats_entity (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    nick VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(255) NOT NULL
);
CREATE TABLE auth (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    login VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);`;

const main = async () => {
    await fs.writeFile(filePath, createStr);
    for(let i = 0; i < 150; i++) {
        if(i < 50) {
            await createData(filePath,`test${i}`, 'junior cat');
        } else if (i < 100) {
            await createData(filePath, `test${i}`, 'middle cat');
        } else {
            await createData(filePath, `test${i}`, 'senior cat');
        }
    }
}

main();