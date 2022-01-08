const pool = require('../config/config').pool;
const express = require('express');
const moment = require('moment-timezone');
const { verificaToken } = require('../middleware/general');

const app = express();

/**
 * trae todos los elementos de bodega
 * @route GET /bodega
 * @group BODEGA manejo de bodegas
 * @returns {object} 200 - un arreglo de bodega
 * @returns {Error}  default - Unexpected error
 */
app.get('/bodega', verificaToken, function(req, res) {
    let query = 'SELECT * FROM public.bodega order by id_bodega;';
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
 * trae un solo elemento de bodega
 * @route GET /bodega/:id
 * @group BODEGA manejo de bodegas
 * @param {int} id.path el id con el que se trae el objeto.
 * @returns {object} 200 - un objeto de bodega
 * @returns {Error}  default - Unexpected error
 */
app.get('/bodega/:id', verificaToken, function(req, res) {
    let id = req.params.id;
    let query = `SELECT * FROM public.bodega WHERE id_bodega=${id}`;
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
 * filtra elementos de bodega de acuerdo a los campos suministrados
 * @route POST /bodega/filter
 * @group BODEGA manejo de bodegas
 * @param {object} body el objeto.
 * @returns {object} 200 - un objeto de bodega
 * @returns {Error}  default - Unexpected error
 */
app.post('/bodega/filter', verificaToken, function(req, res) {
    let { bodega, descripcion, updated_at } = req.body;

	bodega = bodega == null ? '%' + '%' : '%' + bodega + '%';
    descripcion = descripcion == null ? '%' + '%' : '%' + descripcion + '%';

	let query = 'SELECT * FROM public.bodega where ';
	query += '(REPLACE( REPLACE( REPLACE( REPLACE( REPLACE ( lower(bodega),\'á\',\'a\'), \'é\',\'e\'),\'í\',\'i\'),\'ó\',\'o\'),\'ú\',\'u\') like REPLACE( REPLACE( REPLACE( REPLACE( REPLACE ( lower(cast($1 as text)),\'á\',\'a\'), \'é\',\'e\'),\'í\',\'i\'),\'ó\',\'o\'),\'ú\',\'u\')) and ';
    query += '(REPLACE( REPLACE( REPLACE( REPLACE( REPLACE ( lower(descripcion),\'á\',\'a\'), \'é\',\'e\'),\'í\',\'i\'),\'ó\',\'o\'),\'ú\',\'u\') like REPLACE( REPLACE( REPLACE( REPLACE( REPLACE ( lower(cast($2 as text)),\'á\',\'a\'), \'é\',\'e\'),\'í\',\'i\'),\'ó\',\'o\'),\'ú\',\'u\')) and ';
    query += '(cast($3 as timestamp) is null or updated_at>=$3) order by bodega';

    pool.query(query, [bodega, descripcion, updated_at], (error, results) => {
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
 * crea un solo elemento de bodega
 * @route POST /bodega
 * @group BODEGA manejo de bodegas
 * @param {object} body el objeto.
 * @returns {object} 200 - un objeto de bodega
 * @returns {Error}  default - Unexpected error
 */
app.post('/bodega', verificaToken, function(req, res) {
    const { bodega, descripcion } = req.body;
    let updated_at = moment().tz('America/Bogota').format();
    let query = 'INSERT INTO public.bodega(bodega, descripcion, updated_at) VALUES ($1, $2, $3) RETURNING *;';
    pool.query(query, [bodega, descripcion, updated_at], (error, results) => {
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
 * actualiza un solo elemento de bodega
 * @route PUT /bodega
 * @group BODEGA manejo de bodegas
 * @param {object} body el objeto.
 * @returns {object} 200 - un objeto de bodega
 * @returns {Error}  default - Unexpected error
 */
app.put('/bodega', verificaToken, function(req, res) {
    const { id_bodega, bodega, descripcion } = req.body;
    let updated_at = moment().tz('America/Bogota').format();
    let query = `UPDATE public.bodega SET bodega=$1, descripcion=$2, updated_at=$3 WHERE id_bodega=$4 RETURNING *;`;
    pool.query(query, [bodega, descripcion, updated_at, id_bodega], (error, results) => {
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
 * elimina un solo elemento de bodega
 * @route DELETE /bodega/:id
 * @group BODEGA manejo de bodegas
 * @param {int} id.path el id con el que se trae el objeto.
 * @returns {object} 200 - un objeto de bodega
 * @returns {Error}  default - Unexpected error
 */
app.delete('/bodega/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let query = `DELETE FROM public.bodega WHERE id_bodega=${id};`;
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

/**
 * trae un el codigo de la bodega EJ: Guarne1 --> result =  1
 * @route GET CODIGO/bodega/:id
 * @group BODEGA manejo de bodegas
 * @param {int} id.path el id con el que se trae el objeto.
 * @returns {object} 200 - un objeto de bodega
 * @returns {Error}  default - Unexpected error
 */
app.get('/bodega/code/:id', verificaToken, function(req, res) {
    let id = req.params.id;
    let query = `SELECT SUBSTRING(bodega FROM '[0-9]+') AS codigo_bodega FROM public.bodega WHERE id_bodega = ${id};`; 
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

module.exports = app;
