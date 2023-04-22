const fs = require('fs/promises');

const createData = async (nick, role) => {
    const file = await fs.appendFile('./data.sql', `INSERT INTO cats_entity (nick, role) VALUES('${nick}', '${role}');\n`);
}

const createStr = 
`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE cats_entity (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    nick VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(255) NOT NULL
);\n`

const main = async () => {
    await fs.writeFile('./migrations/data.sql', createStr);
    for(let i = 0; i < 150; i++) {
        if(i < 50) {
            await createData(`test${i}`, 'junior cat');
        } else if (i < 100) {
            await createData(`test${i}`, 'middle cat');
        } else {
            await createData(`test${i}`, 'senior cat');
        }
    }
}

main();