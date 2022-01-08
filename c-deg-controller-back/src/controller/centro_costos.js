const pool = require('../config/config').pool;
const express = require('express');
const moment = require('moment-timezone');
const { verificaToken } = require('../middleware/general');

const app = express();

/**
 * trae todos los elementos de centro_costos
 * @route GET /centro_costos
 * @group centro_costos manejo de centro_costoss
 * @returns {object} 200 - un arreglo de centro_costos
 * @returns {Error}  default - Unexpected error
 */
app.get('/centro_costos', verificaToken, function(req, res) {
    let query = 'SELECT * FROM public.centro_costos order by id_centro_costos;';
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
 * trae un solo elemento de centro_costos
 * @route GET /centro_costos/:id
 * @group centro_costos manejo de centro_costoss
 * @param {int} id.path el id con el que se trae el objeto.
 * @returns {object} 200 - un objeto de centro_costos
 * @returns {Error}  default - Unexpected error
 */
app.get('/centro_costos/:id', verificaToken, function(req, res) {
    let id = req.params.id;
    let query = `SELECT * FROM public.centro_costos WHERE id_centro_costos=${id}`;
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
 * filtra elementos de centro_costos de acuerdo a los campos suministrados
 * @route POST /centro_costos/filter
 * @group centro_costos manejo de centro_costoss
 * @param {object} body el objeto.
 * @returns {object} 200 - un objeto de centro_costos
 * @returns {Error}  default - Unexpected error
 */
app.post('/centro_costos/filter', verificaToken, function(req, res) {
    let { centro_costos, descripcion, updated_at } = req.body;

	centro_costos = centro_costos == null ? '%' + '%' : '%' + centro_costos + '%';
    descripcion = descripcion == null ? '%' + '%' : '%' + descripcion + '%';

	let query = 'SELECT * FROM public.centro_costos where ';
	query += '(REPLACE( REPLACE( REPLACE( REPLACE( REPLACE ( lower(centro_costos),\'á\',\'a\'), \'é\',\'e\'),\'í\',\'i\'),\'ó\',\'o\'),\'ú\',\'u\') like REPLACE( REPLACE( REPLACE( REPLACE( REPLACE ( lower(cast($1 as text)),\'á\',\'a\'), \'é\',\'e\'),\'í\',\'i\'),\'ó\',\'o\'),\'ú\',\'u\')) and ';
    query += '(REPLACE( REPLACE( REPLACE( REPLACE( REPLACE ( lower(descripcion),\'á\',\'a\'), \'é\',\'e\'),\'í\',\'i\'),\'ó\',\'o\'),\'ú\',\'u\') like REPLACE( REPLACE( REPLACE( REPLACE( REPLACE ( lower(cast($2 as text)),\'á\',\'a\'), \'é\',\'e\'),\'í\',\'i\'),\'ó\',\'o\'),\'ú\',\'u\')) and ';
    query += '(cast($3 as timestamp) is null or updated_at>=$3) order by centro_costos';

    pool.query(query, [centro_costos, descripcion, updated_at], (error, results) => {
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
 * crea un solo elemento de centro_costos
 * @route POST /centro_costos
 * @group centro_costos manejo de centro_costoss
 * @param {object} body el objeto.
 * @returns {object} 200 - un objeto de centro_costos
 * @returns {Error}  default - Unexpected error
 */
app.post('/centro_costos', verificaToken, function(req, res) {
    const { ccostos, nombre_ccostos } = req.body;
    let updated_at = moment().tz('America/Bogota').format();
    let query = 'INSERT INTO public.centro_costos(ccostos, nombre_ccostos, updated_at) VALUES ($1, $2, $3) RETURNING *;';
    pool.query(query, [ccostos, nombre_ccostos, updated_at], (error, results) => {
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
 * actualiza un solo elemento de centro_costos
 * @route PUT /centro_costos
 * @group centro_costos manejo de centro_costoss
 * @param {object} body el objeto.
 * @returns {object} 200 - un objeto de centro_costos
 * @returns {Error}  default - Unexpected error
 */
app.put('/centro_costos', verificaToken, function(req, res) {
    const { id_centro_costos, ccostos, nombre_ccostos } = req.body;
    let updated_at = moment().tz('America/Bogota').format();
    let query = `UPDATE public.centro_costos SET ccostos=$1, nombre_ccostos=$2, updated_at=$3 WHERE id_centro_costos=$4 RETURNING *;`;
    pool.query(query, [ccostos, nombre_ccostos, updated_at, id_centro_costos], (error, results) => {
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
 * elimina un solo elemento de centro_costos
 * @route DELETE /centro_costos/:id
 * @group centro_costos manejo de centro_costoss
 * @param {int} id.path el id con el que se trae el objeto.
 * @returns {object} 200 - un objeto de centro_costos
 * @returns {Error}  default - Unexpected error
 */
app.delete('/centro_costos/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let query = `DELETE FROM public.centro_costos WHERE id_centro_costos=${id};`;
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
