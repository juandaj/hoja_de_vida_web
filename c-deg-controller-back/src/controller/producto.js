const pool = require('../config/config').pool;
const express = require('express');
const moment = require('moment-timezone');
const { verificaToken } = require('../middleware/general');

const app = express();

/**
 * trae todos los elementos de producto
 * @route GET /producto
 * @group PRODUCTO manejo de productos
 * @returns {object} 200 - un arreglo de producto
 * @returns {Error}  default - Unexpected error
 */
app.get('/producto', function(req, res) {
    let query = 'SELECT * FROM public.producto order by producto;';
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

app.get('/producto/hello', function(req, res) {
    res.json("hola juan");
});


/**
 * trae un solo elemento de producto
 * @route GET /producto/:id
 * @group PRODUCTO manejo de productos
 * @param {int} id.path el id con el que se trae el objeto.
 * @returns {object} 200 - un objeto de producto
 * @returns {Error}  default - Unexpected error
 */
app.get('/producto/:id', function(req, res) {
    let id = req.params.id;
    let query = `SELECT * FROM public.producto WHERE id_producto=${id}`;
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
 * filtra elementos de producto de acuerdo a los campos suministrados.
 * @route POST /producto/filter
 * @group PRODUCTO manejo de productos
 * @param {object} body el objeto.
 * @returns {object} 200 - un objeto de producto
 * @returns {Error}  default - Unexpected error
 */
app.post('/producto/filter', function(req, res) {
    let { codigo, producto, descripcion, updated_at, id_categoria } = req.body;

    producto = producto == null ? '%' + '%' : '%' + producto + '%';
    descripcion = descripcion == null ? '%' + '%' : '%' + descripcion + '%';

    let query = 'SELECT * FROM public.producto where (cast($1 as text) is null or codigo=$1) and ';
    query += '(REPLACE( REPLACE( REPLACE( REPLACE( REPLACE ( lower(producto),\'á\',\'a\'), \'é\',\'e\'),\'í\',\'i\'),\'ó\',\'o\'),\'ú\',\'u\') like REPLACE( REPLACE( REPLACE( REPLACE( REPLACE ( lower(cast($2 as text)),\'á\',\'a\'), \'é\',\'e\'),\'í\',\'i\'),\'ó\',\'o\'),\'ú\',\'u\')) and ';
    query += '(REPLACE( REPLACE( REPLACE( REPLACE( REPLACE ( lower(descripcion),\'á\',\'a\'), \'é\',\'e\'),\'í\',\'i\'),\'ó\',\'o\'),\'ú\',\'u\') like REPLACE( REPLACE( REPLACE( REPLACE( REPLACE ( lower(cast($3 as text)),\'á\',\'a\'), \'é\',\'e\'),\'í\',\'i\'),\'ó\',\'o\'),\'ú\',\'u\')) and ';
    query += '(cast($4 as timestamp) is null or updated_at>=$4) and ';
    query += '(cast($5 as integer) is null or id_categoria=$5) order by producto';

    pool.query(query, [codigo, producto, descripcion, updated_at, id_categoria], (error, results) => {
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
 * crea un solo elemento de producto
 * @route POST /producto
 * @group PRODUCTO manejo de productos
 * @param {object} body el objeto.
 * @returns {object} 200 - un objeto de producto
 * @returns {Error}  default - Unexpected error
 */
app.post('/producto', verificaToken, function(req, res) {
    const { codigo, producto, descripcion, preciov, precioc, datasheet, id_categoria } = req.body;
    let updated_at = moment().tz('America/Bogota').format();
    let query = 'INSERT INTO public.producto(codigo, producto, descripcion, preciov, precioc, datasheet, updated_at, id_categoria) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;';
    pool.query(query, [codigo, producto, descripcion, preciov, precioc, datasheet, updated_at, id_categoria], (error, results) => {
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
 * actualiza un solo elemento de producto
 * @route PUT /producto
 * @group PRODUCTO manejo de productos
 * @param {object} body el objeto.
 * @returns {object} 200 - un objeto de producto
 * @returns {Error}  default - Unexpected error
 */
app.put('/producto', verificaToken, function(req, res) {
    const { id_producto, codigo, producto, descripcion, preciov, precioc, datasheet, id_categoria } = req.body;
    let updated_at = moment().tz('America/Bogota').format();
    let query = `UPDATE public.producto SET codigo=$1, producto=$2, descripcion=$3, preciov=$4, precioc=$5, datasheet=$6, updated_at=$7, id_categoria=$8 WHERE id_producto=$9 RETURNING *;`;
    pool.query(query, [codigo, producto, descripcion, preciov, precioc, datasheet, updated_at, id_categoria, id_producto], (error, results) => {
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
 * elimina un solo elemento de producto
 * @route DELETE /producto/:id
 * @group PRODUCTO manejo de productos
 * @param {int} id.path el id con el que se trae el objeto.
 * @returns {object} 200 - un objeto de producto
 * @returns {Error}  default - Unexpected error
 */
app.delete('/producto/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let query = `DELETE FROM public.producto WHERE id_producto=${id};`;
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