const fs = require('fs/promises');

const filePath = './migrations/data.sql';

const createData = async (filePath, nick, role, coast) => {
    await fs.appendFile(filePath, `INSERT INTO cats_entity (nick, role, vacant, coast) VALUES('${nick}', '${role}', TRUE, ${coast});\n`);
}

const createStr = 
`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE cats_entity (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    nick VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(255) NOT NULL,
    vacant BOOLEAN NOT NULL,
    coast INTEGER NOT NULL
);
CREATE TYPE Role AS ENUM ('Admin', 'User');
CREATE TABLE auth (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    login VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role Role NOT NULL
);
CREATE TABLE files (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    filename VARCHAR(255) NOT NULL UNIQUE,
    deployed VARCHAR(255) NOT NULL,
    inwork uuid[] DEFAULT NULL
);\n`;

const main = async () => {
    await fs.writeFile(filePath, createStr);
    for(let i = 0; i < 150; i++) {
        if(i < 50) {
            await createData(filePath,`test${i}`, 'junior cat', 500);
        } else if (i < 100) {
            await createData(filePath, `test${i}`, 'middle cat', 1000);
        } else {
            await createData(filePath, `test${i}`, 'senior cat', 1500);
        }
    }
}

main();
