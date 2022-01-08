const pool = require('../config/config').pool;
const express = require('express');
const moment = require('moment-timezone');
const { verificaToken } = require('../middleware/general');

const app = express();

/**
 * trae todos los elementos de categoria
 * @route GET /categoria
 * @group CATEGORIA manejo de tipos de productos
 * @returns {object} 200 - un arreglo de categoria
 * @returns {Error}  default - Unexpected error
 */
app.get('/categoria', verificaToken, function(req, res) {
    let query = 'SELECT * FROM public.categoria order by id_categoria;';
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
 * trae un solo elemento de categoria
 * @route GET /categoria/:id
 * @group CATEGORIA manejo de tipos de productos
 * @param {int} id.path el id con el que se trae el objeto.
 * @returns {object} 200 - un objeto de categoria
 * @returns {Error}  default - Unexpected error
 */
app.get('/categoria/:id', verificaToken, function(req, res) {
    let id = req.params.id;
    let query = `SELECT * FROM public.categoria WHERE id_categoria=${id}`;
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
 * filtra elementos de categoria de acuerdo a los campos suministrados
 * @route POST /categoria/filter
 * @group CATEGORIA manejo de tipos de productos
 * @param {object} body el objeto.
 * @returns {object} 200 - un objeto de categoria
 * @returns {Error}  default - Unexpected error
 */
app.post('/categoria/filter', verificaToken, function(req, res) {
    let { categoria, descripcion, updated_at } = req.body;

    categoria = categoria == null ? '%' + '%' : '%' + categoria + '%';
    descripcion = descripcion == null ? '%' + '%' : '%' + descripcion + '%';

    let query = 'SELECT * FROM public.categoria where ';
    query += '(REPLACE( REPLACE( REPLACE( REPLACE( REPLACE ( lower(categoria),\'á\',\'a\'), \'é\',\'e\'),\'í\',\'i\'),\'ó\',\'o\'),\'ú\',\'u\') like REPLACE( REPLACE( REPLACE( REPLACE( REPLACE ( lower(cast($1 as text)),\'á\',\'a\'), \'é\',\'e\'),\'í\',\'i\'),\'ó\',\'o\'),\'ú\',\'u\')) and ';
    query += '(REPLACE( REPLACE( REPLACE( REPLACE( REPLACE ( lower(descripcion),\'á\',\'a\'), \'é\',\'e\'),\'í\',\'i\'),\'ó\',\'o\'),\'ú\',\'u\') like REPLACE( REPLACE( REPLACE( REPLACE( REPLACE ( lower(cast($2 as text)),\'á\',\'a\'), \'é\',\'e\'),\'í\',\'i\'),\'ó\',\'o\'),\'ú\',\'u\')) and ';
    query += '(cast($3 as timestamp) is null or updated_at>=$3) order by categoria';

    pool.query(query, [categoria, descripcion, updated_at], (error, results) => {
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
 * crea un solo elemento de categoria
 * @route POST /categoria
 * @group CATEGORIA manejo de tipos de productos
 * @param {object} body el objeto.
 * @returns {object} 200 - un objeto de categoria
 * @returns {Error}  default - Unexpected error
 */
app.post('/categoria', verificaToken, function(req, res) {
    const { categoria, descripcion } = req.body;
    let updated_at = moment().tz('America/Bogota').format();
    let query = 'INSERT INTO public.categoria(categoria, descripcion, updated_at) VALUES ($1, $2, $3) RETURNING *;';
    pool.query(query, [categoria, descripcion, updated_at], (error, results) => {
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
 * actualiza un solo elemento de categoria
 * @route PUT /categoria
 * @group CATEGORIA manejo de tipos de productos
 * @param {object} body el objeto.
 * @returns {object} 200 - un objeto de categoria
 * @returns {Error}  default - Unexpected error
 */
app.put('/categoria', verificaToken, function(req, res) {
    const { id_categoria, categoria, descripcion } = req.body;
    let updated_at = moment().tz('America/Bogota').format();
    let query = `UPDATE public.categoria SET categoria=$1, descripcion=$2, updated_at=$3 WHERE id_categoria=$4 RETURNING *;`;
    pool.query(query, [categoria, descripcion, updated_at, id_categoria], (error, results) => {
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
 * elimina un solo elemento de categoria
 * @route DELETE /categoria/:id
 * @group CATEGORIA manejo de tipos de productos
 * @param {int} id.path el id con el que se trae el objeto.
 * @returns {object} 200 - un objeto de categoria
 * @returns {Error}  default - Unexpected error
 */
app.delete('/categoria/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let query = `DELETE FROM public.categoria WHERE id_categoria=${id};`;
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