const pool = require('../config/config').pool;
const express = require('express');
const moment = require('moment-timezone');
const { verificaToken } = require('../middleware/general');

const app = express();

/**
 * trae todos los elementos de producto_usuario
 * @route GET /producto_usuario
 * @group PU manejo conjunto de relacion entre producto y usuario
 * @returns {object} 200 - un arreglo de producto_usuario
 * @returns {Error}  default - Unexpected error
 */
app.get('/producto_usuario', verificaToken, function(req, res) {
    let query = 'SELECT * FROM public.producto_usuario order by id_producto_usuario;';
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
 * trae un solo elemento de producto_usuario
 * @route GET /producto_usuario/:id
 * @group PU manejo conjunto de relacion entre producto y usuario
 * @param {int} id.path el id con el que se trae el objeto.
 * @returns {object} 200 - un objeto de producto_usuario
 * @returns {Error}  default - Unexpected error
 */
app.get('/producto_usuario/:id', verificaToken, function(req, res) {
    let id = req.params.id;
    let query = `SELECT * FROM public.producto_usuario WHERE id_producto_usuario=${id}`;
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
 * filtra elementos de producto_usuario de acuerdo a los campos suministrados
 * @route POST /producto_usuario/filter
 * @group PU manejo conjunto de relacion entre producto y usuario
 * @param {object} body el objeto.
 * @returns {object} 200 - un objeto de producto_usuario
 * @returns {Error}  default - Unexpected error
 */
app.post('/producto_usuario/filter', verificaToken, function(req, res) {
    let { id_bodega_producto, id_usuario, notificacion, updated_at } = req.body;
    notificacion = notificacion == null ? '%' + '%' : '%' + notificacion + '%';
    let query = 'SELECT a.id_producto_usuario, a.id_bodega_producto, a.id_usuario, c.nombre, c.correo, a.notificacion, a.updated_at FROM producto_usuario as a, usuario as c where ';
    query += 'a.id_usuario=c.id_usuario and ';
    query += '(cast($1 as bigint) is null or a.id_bodega_producto=$1) and ';
    query += '(cast($2 as bigint) is null or a.id_usuario=$2) and ';
    query += '(REPLACE( REPLACE( REPLACE( REPLACE( REPLACE ( lower(a.notificacion),\'á\',\'a\'), \'é\',\'e\'),\'í\',\'i\'),\'ó\',\'o\'),\'ú\',\'u\') like REPLACE( REPLACE( REPLACE( REPLACE( REPLACE ( lower(cast($3 as text)),\'á\',\'a\'), \'é\',\'e\'),\'í\',\'i\'),\'ó\',\'o\'),\'ú\',\'u\')) and ';
    query += '(cast($4 as timestamp) is null or a.updated_at>=$4)';

    pool.query(query, [id_bodega_producto, id_usuario, notificacion, updated_at], (error, results) => {
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
 * crea un solo elemento de producto_usuario
 * @route POST /producto_usuario
 * @group PU manejo conjunto de relacion entre producto y usuario
 * @param {object} body el objeto.
 * @returns {object} 200 - un objeto de producto_usuario
 * @returns {Error}  default - Unexpected error
 */
app.post('/producto_usuario', verificaToken, function(req, res) {
    const { id_bodega_producto, id_usuario, notificacion } = req.body;
    let updated_at = moment().tz('America/Bogota').format();

    let query = 'INSERT INTO public.producto_usuario(id_bodega_producto, id_usuario, notificacion, updated_at) VALUES ($1, $2, $3, $4) RETURNING *;';
    pool.query(query, [id_bodega_producto, id_usuario, notificacion, updated_at], (error, results) => {
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
 * actualiza un solo elemento de producto_usuario
 * @route PUT /producto_usuario
 * @group PU manejo conjunto de relacion entre producto y usuario
 * @param {object} body el objeto.
 * @returns {object} 200 - un objeto de producto_usuario
 * @returns {Error}  default - Unexpected error
 */
app.put('/producto_usuario', verificaToken, function(req, res) {
    const { id_producto_usuario, id_bodega_producto, id_usuario, notificacion } = req.body;
    let updated_at = moment().tz('America/Bogota').format();
    let query = `UPDATE public.producto_usuario SET id_bodega_producto=$1, id_usuario=$2, notificacion=$3, updated_at=$4 WHERE id_producto_usuario=$5 RETURNING *;`;
    pool.query(query, [id_bodega_producto, id_usuario, notificacion, updated_at, id_producto_usuario], (error, results) => {
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
 * elimina un solo elemento de producto_usuario
 * @route DELETE /producto_usuario/:id
 * @group PU manejo conjunto de relacion entre producto y usuario
 * @param {int} id.path el id con el que se trae el objeto.
 * @returns {object} 200 - un objeto de producto_usuario
 * @returns {Error}  default - Unexpected error
 */
app.delete('/producto_usuario/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let query = `DELETE FROM public.producto_usuario WHERE id_producto_usuario=${id};`;
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