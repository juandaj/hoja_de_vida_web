process.env.PORTS = process.env.PORTS || 4000;
process.env.PORT = process.env.PORT || 4001;
process.env.SEED = process.env.SEED || 'c-deg-seed';
process.env.EXPIRES = process.env.EXPIRES || (60 * 60)*9;

const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'qvohahhutvzvzb',
    host: 'ec2-3-216-40-16.compute-1.amazonaws.com',
    database: 'd8h45r1a5263lc',
    password: 'af9570178664ead3aa73dd78b05234d01ed5b37f075ca77b38c66cc3d0b12895',
    port: 5432,
    ssl: { rejectUnauthorized: false }
});

module.exports = {
    pool
};
