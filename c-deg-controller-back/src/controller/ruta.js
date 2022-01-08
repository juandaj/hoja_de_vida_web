const pool = require('../config/config').pool;
const express = require('express');
const { verificaToken } = require('../middleware/general');

const app = express();

/**
 * trae todos los elementos de ruta
 * @route GET /ruta
 * @group RUTA manejo de rutas
 * @returns {object} 200 - un arreglo de ruta
 * @returns {Error}  default - Unexpected error
 */
app.get('/ruta', verificaToken, function(req, res) {
    let query = 'SELECT * FROM public.ruta order by id_ruta;';
    pool.query(query, (error, results) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                error
            });
        }
        res.json(results.rows);
    });

});


/**
 * trae un solo elemento de ruta
 * @route GET /ruta/:id
 * @group RUTA manejo de rutas
 * @param {int} id.path el id con el que se trae el objeto.
 * @returns {object} 200 - un objeto de ruta
 * @returns {Error}  default - Unexpected error
 */
app.get('/ruta/:id', verificaToken, function(req, res) {
    let id = req.params.id;
    let query = `SELECT * FROM public.ruta WHERE id_ruta=${id}`;
    pool.query(query, (error, results) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                error
            });
        }

        res.json(results.rows[0]);
    });

});

/**
 * filtra elementos de ruta de acuerdo a los campos suministrados
 * @route POST /ruta/filter
 * @group RUTA manejo de rutas
 * @param {object} body el objeto.
 * @returns {object} 200 - un objeto de ruta
 * @returns {Error}  default - Unexpected error
 */
app.post('/ruta/filter', verificaToken, function(req, res) {
    let { ruta, descripcion } = req.body;

    ruta = ruta == null ? '%' + '%' : '%' + ruta + '%';
    descripcion = descripcion == null ? '%' + '%' : '%' + descripcion + '%';

    let query = 'SELECT * FROM public.ruta where ';
    query += '(REPLACE( REPLACE( REPLACE( REPLACE( REPLACE ( lower(ruta),\'á\',\'a\'), \'é\',\'e\'),\'í\',\'i\'),\'ó\',\'o\'),\'ú\',\'u\') like REPLACE( REPLACE( REPLACE( REPLACE( REPLACE ( lower(cast($1 as text)),\'á\',\'a\'), \'é\',\'e\'),\'í\',\'i\'),\'ó\',\'o\'),\'ú\',\'u\')) and ';
    query += '(REPLACE( REPLACE( REPLACE( REPLACE( REPLACE ( lower(descripcion),\'á\',\'a\'), \'é\',\'e\'),\'í\',\'i\'),\'ó\',\'o\'),\'ú\',\'u\') like REPLACE( REPLACE( REPLACE( REPLACE( REPLACE ( lower(cast($2 as text)),\'á\',\'a\'), \'é\',\'e\'),\'í\',\'i\'),\'ó\',\'o\'),\'ú\',\'u\')) and ';
    query += 'order by ruta';

    pool.query(query, [ruta, descripcion], (error, results) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                error
            });
        }

        res.json(results.rows);
    });

});


/**
 * crea un solo elemento de ruta
 * @route POST /ruta
 * @group RUTA manejo de rutas
 * @param {object} body el objeto.
 * @returns {object} 200 - un objeto de ruta
 * @returns {Error}  default - Unexpected error
 */
app.post('/ruta', verificaToken, function(req, res) {
    const { ruta, descripcion } = req.body;
    let query = 'INSERT INTO public.ruta(ruta, descripcion) VALUES ($1, $2) RETURNING *;';
    pool.query(query, [ruta, descripcion], (error, results) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                error
            });
        }

        res.json(results.rows[0]);
    });

});

/**
 * actualiza un solo elemento de ruta
 * @route PUT /ruta
 * @group RUTA manejo de rutas
 * @param {object} body el objeto.
 * @returns {object} 200 - un objeto de ruta
 * @returns {Error}  default - Unexpected error
 */
app.put('/ruta', verificaToken, function(req, res) {
    const { id_ruta, ruta, descripcion } = req.body;
    let query = `UPDATE public.ruta SET ruta=$1, descripcion=$2 WHERE id_ruta=$3 RETURNING *;`;
    pool.query(query, [ruta, descripcion, id_ruta], (error, results) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                error
            });
        }

        res.json(results.rows[0]);
    });

});

/**
 * elimina un solo elemento de ruta
 * @route DELETE /ruta/:id
 * @group RUTA manejo de rutas
 * @param {int} id.path el id con el que se trae el objeto.
 * @returns {object} 200 - un objeto de ruta
 * @returns {Error}  default - Unexpected error
 */
app.delete('/ruta/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let query = `DELETE FROM public.ruta WHERE id_ruta=${id};`;
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