'use strict';

const mysql = require('mysql');
const config = require('../config.json');

const getConnection = () => {
    const conn = mysql.createConnection({
        host: config.db.host,
        port: config.db.port,
        user: config.db.username,
        password: config.db.password,
        database: config.db.database,
        charset: config.db.charset,
        supportBigNumbers: true
    });
    
    conn.connect((err) => {
        if (err) {
            console.error('Failed to connect to the database:', config.db);
            return;
        }
    });
    
    conn.on('error', (err) => {
        console.error(`Mysql error: ${err}`);
    });
    return conn;
};

const query = async (sql, args) => {
    return new Promise((resolve, reject) => {
        // The Promise constructor should catch any errors thrown on
        // this tick. Alternately, try/catch and reject(err) on catch.
        const conn = getConnection();
        /* eslint-disable no-unused-vars */
        conn.query(sql, args, (err, rows, fields) => {
        /* eslint-enable no-unused-vars */
            // Call reject on error states,
            // call resolve with results
            if (err) {
                return reject(err);
            }
            resolve(rows);
            conn.end((err, args) => {
                if (err) {
                    console.error(`Failed to close mysql connection: ${args}`);
                    return;
                }
            });
        });
    });
};

module.exports = query;