const pool = require('../config/config').pool;
const express = require('express');
const moment = require('moment-timezone');
const { verificaToken } = require('../middleware/general');

const app = express();

/**
 * trae todos los elementos de rol
 * @route GET /rol
 * @group ROL manejo de roles
 * @returns {object} 200 - un arreglo de rol
 * @returns {Error}  default - Unexpected error
 */
app.get('/rol', verificaToken, function(req, res) {
    let query = 'SELECT * FROM public.rol order by id_rol;';
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
 * trae un solo elemento de rol
 * @route GET /rol/:id
 * @group ROL manejo de roles
 * @param {int} id.path el id con el que se trae el objeto.
 * @returns {object} 200 - un objeto de rol
 * @returns {Error}  default - Unexpected error
 */
app.get('/rol/:id', verificaToken, function(req, res) {
    let id = req.params.id;
    let query = `SELECT * FROM public.rol WHERE id_rol=${id}`;
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
        res.json(results.rows);
    });

});

/**
 * filtra elementos de rol de acuerdo a los campos suministrados
 * @route POST /rol/filter
 * @group ROL manejo de roles
 * @param {object} body el objeto.
 * @returns {object} 200 - un objeto de rol
 * @returns {Error}  default - Unexpected error
 */
app.post('/rol/filter', verificaToken, function(req, res) {
    let { rol, descripcion, updated_at } = req.body;

    rol = rol == null ? '%' + '%' : '%' + rol + '%';
    descripcion = descripcion == null ? '%' + '%' : '%' + descripcion + '%';

    let query = 'SELECT * FROM public.rol where ';
    query += '(REPLACE( REPLACE( REPLACE( REPLACE( REPLACE ( lower(rol),\'á\',\'a\'), \'é\',\'e\'),\'í\',\'i\'),\'ó\',\'o\'),\'ú\',\'u\') like REPLACE( REPLACE( REPLACE( REPLACE( REPLACE ( lower(cast($1 as text)),\'á\',\'a\'), \'é\',\'e\'),\'í\',\'i\'),\'ó\',\'o\'),\'ú\',\'u\')) and ';
    query += '(REPLACE( REPLACE( REPLACE( REPLACE( REPLACE ( lower(descripcion),\'á\',\'a\'), \'é\',\'e\'),\'í\',\'i\'),\'ó\',\'o\'),\'ú\',\'u\') like REPLACE( REPLACE( REPLACE( REPLACE( REPLACE ( lower(cast($2 as text)),\'á\',\'a\'), \'é\',\'e\'),\'í\',\'i\'),\'ó\',\'o\'),\'ú\',\'u\')) and ';
    query += '(cast($3 as timestamp) is null or updated_at>=$3) order by rol';

    pool.query(query, [rol, descripcion, updated_at], (error, results) => {
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
 * crea un solo elemento de rol
 * @route POST /rol
 * @group ROL manejo de roles
 * @param {object} body el objeto.
 * @returns {object} 200 - un objeto de rol
 * @returns {Error}  default - Unexpected error
 */
app.post('/rol', verificaToken, function(req, res) {
    const { rol, descripcion, can_delete, can_update, can_create, can_delete_user, can_update_user, can_create_user, can_delete_himself, can_assign_rol, can_change_correo } = req.body;
    let updated_at = moment().tz('America/Bogota').format();
    let query = 'INSERT INTO public.rol(rol, descripcion, can_delete, can_update, can_create, can_delete_user, can_update_user, can_create_user, can_delete_himself, can_assign_rol, can_change_correo, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *;';
    pool.query(query, [rol, descripcion, can_delete, can_update, can_create, can_delete_user, can_update_user, can_create_user, can_delete_himself, can_assign_rol, can_change_correo, updated_at], (error, results) => {
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
 * actualiza un solo elemento de rol
 * @route PUT /rol
 * @group ROL manejo de roles
 * @param {object} body el objeto.
 * @returns {object} 200 - un objeto de rol
 * @returns {Error}  default - Unexpected error
 */
app.put('/rol', verificaToken, function(req, res) {
    const { id_rol, rol, descripcion, can_delete, can_update, can_create, can_delete_user, can_update_user, can_create_user, can_delete_himself, can_assign_rol, can_change_correo } = req.body;
    let updated_at = moment().tz('America/Bogota').format();
    let query = `UPDATE public.rol SET rol=$1, descripcion=$2, can_delete = $3, can_update = $4, can_create = $5, can_delete_user = $6, can_update_user = $7, can_create_user = $8, can_delete_himself = $9, can_assign_rol = $10, can_change_correo = $11, updated_at=$12 WHERE id_rol=$13 RETURNING *;`;
    pool.query(query, [rol, descripcion, can_delete, can_update, can_create, can_delete_user, can_update_user, can_create_user, can_delete_himself, can_assign_rol, can_change_correo, updated_at, id_rol], (error, results) => {
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
 * elimina un solo elemento de rol
 * @route DELETE /rol/:id
 * @group ROL manejo de roles
 * @param {int} id.path el id con el que se trae el objeto.
 * @returns {object} 200 - un objeto de rol
 * @returns {Error}  default - Unexpected error
 */
app.delete('/rol/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let query = `DELETE FROM public.rol WHERE id_rol=${id};`;
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