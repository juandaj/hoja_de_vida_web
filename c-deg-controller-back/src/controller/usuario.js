const pool = require('../config/config').pool;
const express = require('express');
const moment = require('moment-timezone');
const md5 = require('md5');
const { verificaToken } = require('../middleware/general');
const jwt = require('jsonwebtoken')

const app = express();

/**
 * trae todos los elementos de usuario
 * @route GET /usuario
 * @group USUARIO manejo de usuarios
 * @returns {object} 200 - un arreglo de usuario
 * @returns {Error}  default - Unexpected error
 */
app.get('/usuario', verificaToken, function(req, res) {
    let query = 'SELECT id_usuario, nombre, correo, updated_at, id_rol, id_bodega FROM public.usuario order by id_usuario;';
    pool.query(query, (error, results) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                error
            });
        }
        results.rows.forEach((item) => {
            item.updated_at = moment(item.updated_at).tz('America/Bogota').format();
        });
        res.json(results.rows);
    });

});


/**
 * trae un solo elemento de usuario
 * @route GET /usuario/:id
 * @group USUARIO manejo de usuarios
 * @param {int} id.path el id con el que se trae el objeto.
 * @returns {object} 200 - un objeto de usuario
 * @returns {Error}  default - Unexpected error
 */
app.get('/usuario/:id', verificaToken, function(req, res) {
    let id = req.params.id;
    let query = `SELECT id_usuario, nombre, correo, updated_at, id_rol, id_bodega FROM public.usuario WHERE id_usuario=${id}`;
    pool.query(query, (error, results) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                error
            });
        }
        if (results.rows.length != 0) {
            results.rows[0].updated_at = moment(results.rows[0].updated_at).tz('America/Bogota').format();
        }
        res.json(results.rows[0]);
    });

});

/**
 * filtra elementos de usuario de acuerdo a los campos suministrados
 * @route POST /usuario/filter
 * @group USUARIO manejo de usuarios
 * @param {object} body el objeto.
 * @returns {object} 200 - un objeto de usuario
 * @returns {Error}  default - Unexpected error
 */
app.post('/usuario/filter', verificaToken, function(req, res) {
    let { nombre, correo, updated_at, id_rol, id_bodega } = req.body;

    nombre = nombre == null ? '%' + '%' : '%' + nombre + '%';
    correo = correo == null ? '%' + '%' : '%' + correo + '%';


    let query = 'SELECT id_usuario, nombre, correo, updated_at, id_rol, id_bodega FROM public.usuario where ';
    query += '(REPLACE( REPLACE( REPLACE( REPLACE( REPLACE ( lower(nombre),\'á\',\'a\'), \'é\',\'e\'),\'í\',\'i\'),\'ó\',\'o\'),\'ú\',\'u\') like REPLACE( REPLACE( REPLACE( REPLACE( REPLACE ( lower(cast($1 as text)),\'á\',\'a\'), \'é\',\'e\'),\'í\',\'i\'),\'ó\',\'o\'),\'ú\',\'u\')) and ';
    query += '(REPLACE( REPLACE( REPLACE( REPLACE( REPLACE ( lower(correo),\'á\',\'a\'), \'é\',\'e\'),\'í\',\'i\'),\'ó\',\'o\'),\'ú\',\'u\') like REPLACE( REPLACE( REPLACE( REPLACE( REPLACE ( lower(cast($2 as text)),\'á\',\'a\'), \'é\',\'e\'),\'í\',\'i\'),\'ó\',\'o\'),\'ú\',\'u\')) and ';
    query += '(cast($3 as timestamp) is null or updated_at>=$3) and ';
    query += '(cast($4 as integer) is null or id_rol=$4) and ';
    query += '(cast($5 as integer) is null or id_bodega=$5) order by nombre';

    pool.query(query, [nombre, correo, updated_at, id_rol, id_bodega], (error, results) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                error
            });
        }
        results.rows.forEach((item) => {
            item.updated_at = moment(item.updated_at).tz('America/Bogota').format();
        });
        res.json(results.rows);
    });

});

/**
 * autentica un usuario
 * @route POST /usuario/auth
 * @group USUARIO manejo de usuarios
 * @param {object} body el objeto.
 * @returns {object} 200 - un objeto de usuario
 * @returns {Error}  default - Unexpected error
 */
app.post('/usuario/auth', function(req, res) {
    let { correo, contrasena } = req.body;
    contrasena = md5(contrasena);
    let query = 'SELECT id_usuario, nombre, correo, updated_at, id_rol, id_bodega FROM public.usuario where ';
    query += 'correo = $1 and '
    query += 'contrasena = $2'

    pool.query(query, [correo, contrasena], (error, results) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                error
            });
        }

        if (results.rowCount) {
            let token = jwt.sign({
                usuario: results.rows[0]
            }, process.env.SEED, { expiresIn: parseInt(process.env.EXPIRES) })
            res.json({
                ok: true,
                results: results.rows,
                count: results.rowCount,
                token,
                expiresIn: process.env.EXPIRES
            });
        } else {
            res.json({
                ok: false,
                message: 'Correo o contraseña incorrectos'
            });
        }

    });

});

/**
 * crea un solo elemento de usuario
 * @route POST /usuario
 * @group USUARIO manejo de usuarios
 * @param {object} body el objeto.
 * @returns {object} 200 - un objeto de usuario
 * @returns {Error}  default - Unexpected error
 */
app.post('/usuario', verificaToken, function(req, res) {
    let { nombre, correo, contrasena, id_rol, id_bodega } = req.body;
    let updated_at = moment().tz('America/Bogota').format();
    contrasena = md5(contrasena);
    let query = 'INSERT INTO public.usuario(nombre, correo, contrasena, updated_at, id_rol, id_bodega) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id_usuario, nombre, correo, updated_at, id_rol, id_bodega;';
    pool.query(query, [nombre, correo, contrasena, updated_at, id_rol, id_bodega], (error, results) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                error
            });
        }
        results.rows[0].updated_at = moment(results.rows[0].updated_at).tz('America/Bogota').format();
        res.json(results.rows[0]);
    });

});

/**
 * actualiza un solo elemento de usuario
 * @route PUT /usuario
 * @group USUARIO manejo de usuarios
 * @param {object} body el objeto.
 * @returns {object} 200 - un objeto de usuario
 * @returns {Error}  default - Unexpected error
 */
app.put('/usuario', verificaToken, function(req, res) {
    const { id_usuario, nombre, correo, id_rol, id_bodega } = req.body;
    let updated_at = moment().tz('America/Bogota').format();
    let query = `UPDATE public.usuario SET nombre=$1, correo=$2, updated_at=$3, id_rol=$4, id_bodega=$5 WHERE id_usuario=$6 RETURNING id_usuario, nombre, correo, updated_at, id_rol, id_bodega;`;
    pool.query(query, [nombre, correo, updated_at, id_rol, id_bodega, id_usuario], (error, results) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                error
            });
        }
        results.rows[0].updated_at = moment(results.rows[0].updated_at).tz('America/Bogota').format();
        res.json(results.rows[0]);
    });

});

/**
 * actualiza un contraseña de un usuario
 * @route PUT /usuario/:id/pass
 * @group USUARIO manejo de usuarios
 * @param {int} id.path el id con el que se trae el objeto.
 * @param {text} pass.param el nuevo password, se envia como parametro ?.
 * @returns {object} 200 - un objeto de usuario
 * @returns {Error}  default - Unexpected error
 */
app.put('/usuario/:id/pass', verificaToken, function(req, res) {
    const id_usuario = req.params.id;
    let contrasena = req.body.contrasena;
    let updated_at = moment().tz('America/Bogota').format();
    contrasena = md5(contrasena);
    let query = `UPDATE public.usuario SET contrasena = $1, updated_at = $2 WHERE id_usuario = $3 RETURNING id_usuario, nombre, correo, updated_at, id_rol, id_bodega;`;
    pool.query(query, [contrasena, updated_at, id_usuario], (error, results) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                error
            });
        }

        results.rows[0].updated_at = moment(results.rows[0].updated_at).tz('America/Bogota').format();
        res.json(results.rows[0]);
    });

});

/**
 * elimina un solo elemento de usuario
 * @route DELETE /usuario/:id
 * @group USUARIO manejo de usuarios
 * @param {int} id.path el id con el que se trae el objeto.
 * @returns {object} 200 - un objeto de usuario
 * @returns {Error}  default - Unexpected error
 */
app.delete('/usuario/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let query = `DELETE FROM public.usuario WHERE id_usuario=${id};`;
    pool.query(query, (error1, results1) => {
        if (error1) {
            return res.status(400).json({
                ok: false,
                error1
            });
        }
        res.json({
            ok: true
        });
    });

});

module.exports = app;
