const jwt = require('jsonwebtoken');
const { pool } = require('../config/config');

let verificaToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'token invalido',
                err
            });
        }
        next();
    });

};

let verificaTokenFile = (req, res, next) => {

    let token = req.query['token'];

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'token invalido',
                err
            });
        }
        next();
    });


};


module.exports = {
    verificaToken,
    verificaTokenFile
};