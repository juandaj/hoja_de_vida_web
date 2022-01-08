const pool = require('../config/config').pool;
const express = require('express');
const moment = require('moment-timezone');
const { verificaToken } = require('../middleware/general');

const app = express();


/**
 * trae todos los elementos de tipo_transaccion
 * @route GET /tipo_transaccion
 * @group tipo_transaccion manejo de tipo_transaccions
 * @returns {object} 200 - un arreglo de tipo_transaccion
 * @returns {Error}  default - Unexpected error
 */
app.get('/tipo_transaccion', verificaToken, function(req, res) {
    let query = 'SELECT * FROM public.tipo_transaccion order by id_tipo_transaccion;';
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
 * trae las TRASLADOS con coincidencias de texto de la tabla de tipo_transaccion
 * @route GET /tipo_transaccion/
 * @group tipo_transaccion manejo de tipo_transaccions
 * @param {int} id.path el id con el que se trae el objeto.
 * @returns {object} 200 - un objeto de tipo_transaccion
 * @returns {Error}  default - Unexpected error
 */
 app.get('/tipo_transaccion/traslados', verificaToken, function(req, res) {
    
    let query = `SELECT * FROM public.tipo_transaccion WHERE transaccion = 15;`;
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
 * trae los INGRESOS con coincidencias de texto de la tabla de tipo_transaccion
 * @route GET /tipo_transaccion/:id
 * @group tipo_transaccion manejo de tipo_transaccions
 * @param {int} id.path el id con el que se trae el objeto.
 * @returns {object} 200 - un objeto de tipo_transaccion
 * @returns {Error}  default - Unexpected error
 */
 app.get('/tipo_transaccion/get_entradas', verificaToken, function(req, res) {
    let id = req.params.id;
    let query = `SELECT * FROM public.tipo_transaccion WHERE transaccion = 16 OR transaccion = 11 OR transaccion = 10;`;
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
 * trae las SALIDAS con coincidencias de texto de la tabla de tipo_transaccion
 * @route GET /tipo_transaccion/:id
 * @group tipo_transaccion manejo de tipo_transaccions
 * @param {int} id.path el id con el que se trae el objeto.
 * @returns {object} 200 - un objeto de tipo_transaccion
 * @returns {Error}  default - Unexpected error
 */
 app.get('/tipo_transaccion/get_salidas', verificaToken, function(req, res) {
    let id = req.params.id;
    let query = `SELECT * FROM public.tipo_transaccion WHERE transaccion = 17 OR transaccion = 12;`;
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
 * trae un solo elemento de tipo_transaccion
 * @route GET /tipo_transaccion/:id
 * @group tipo_transaccion manejo de tipo_transaccions
 * @param {int} id.path el id con el que se trae el objeto.
 * @returns {object} 200 - un objeto de tipo_transaccion
 * @returns {Error}  default - Unexpected error
 */
app.get('/tipo_transaccion/:id', verificaToken, function(req, res) {
    let id = req.params.id;
    let query = `SELECT * FROM public.tipo_transaccion WHERE id_tipo_transaccion=${id}`;
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
 * filtra elementos de tipo_transaccion de acuerdo a los campos suministrados
 * @route POST /tipo_transaccion/filter
 * @group tipo_transaccion manejo de tipo_transaccions
 * @param {object} body el objeto.
 * @returns {object} 200 - un objeto de tipo_transaccion
 * @returns {Error}  default - Unexpected error
 */
app.post('/tipo_transaccion/filter', verificaToken, function(req, res) {
    let { tipo_transaccion, descripcion, updated_at } = req.body;

	tipo_transaccion = tipo_transaccion == null ? '%' + '%' : '%' + tipo_transaccion + '%';
    descripcion = descripcion == null ? '%' + '%' : '%' + descripcion + '%';

	let query = 'SELECT * FROM public.tipo_transaccion where ';
	query += '(REPLACE( REPLACE( REPLACE( REPLACE( REPLACE ( lower(tipo_transaccion),\'á\',\'a\'), \'é\',\'e\'),\'í\',\'i\'),\'ó\',\'o\'),\'ú\',\'u\') like REPLACE( REPLACE( REPLACE( REPLACE( REPLACE ( lower(cast($1 as text)),\'á\',\'a\'), \'é\',\'e\'),\'í\',\'i\'),\'ó\',\'o\'),\'ú\',\'u\')) and ';
    query += '(REPLACE( REPLACE( REPLACE( REPLACE( REPLACE ( lower(descripcion),\'á\',\'a\'), \'é\',\'e\'),\'í\',\'i\'),\'ó\',\'o\'),\'ú\',\'u\') like REPLACE( REPLACE( REPLACE( REPLACE( REPLACE ( lower(cast($2 as text)),\'á\',\'a\'), \'é\',\'e\'),\'í\',\'i\'),\'ó\',\'o\'),\'ú\',\'u\')) and ';
    query += '(cast($3 as timestamp) is null or updated_at>=$3) order by tipo_transaccion';

    pool.query(query, [tipo_transaccion, descripcion, updated_at], (error, results) => {
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
 * crea un solo elemento de tipo_transaccion
 * @route POST /tipo_transaccion
 * @group tipo_transaccion manejo de tipo_transaccions
 * @param {object} body el objeto.
 * @returns {object} 200 - un objeto de tipo_transaccion
 * @returns {Error}  default - Unexpected error
 */
app.post('/tipo_transaccion', verificaToken, function(req, res) {
    const { transaccion, codigo_concepto } = req.body;
    let updated_at = moment().tz('America/Bogota').format();
    let query = 'INSERT INTO public.tipo_transaccion(transaccion, codigo_concepto, updated_at) VALUES ($1, $2, $3) RETURNING *;';
    pool.query(query, [transaccion, codigo_concepto, updated_at], (error, results) => {
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
 * actualiza un solo elemento de tipo_transaccion
 * @route PUT /tipo_transaccion
 * @group tipo_transaccion manejo de tipo_transaccions
 * @param {object} body el objeto.
 * @returns {object} 200 - un objeto de tipo_transaccion
 * @returns {Error}  default - Unexpected error
 */
app.put('/tipo_transaccion', verificaToken, function(req, res) {
    const { id_tipo_transaccion, transaccion, codigo_concepto } = req.body;
    let updated_at = moment().tz('America/Bogota').format();
    let query = `UPDATE public.tipo_transaccion SET transaccion=$1, codigo_concepto=$2, updated_at=$3 WHERE id_tipo_transaccion=$4 RETURNING *;`;
    pool.query(query, [transaccion, codigo_concepto, updated_at, id_tipo_transaccion], (error, results) => {
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
 * elimina un solo elemento de tipo_transaccion
 * @route DELETE /tipo_transaccion/:id
 * @group tipo_transaccion manejo de tipo_transaccions
 * @param {int} id.path el id con el que se trae el objeto.
 * @returns {object} 200 - un objeto de tipo_transaccion
 * @returns {Error}  default - Unexpected error
 */
app.delete('/tipo_transaccion/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let query = `DELETE FROM public.tipo_transaccion WHERE id_tipo_transaccion=${id};`;
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