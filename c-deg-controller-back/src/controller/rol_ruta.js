const pool = require('../config/config').pool;
const express = require('express');
const moment = require('moment-timezone');
const { verificaToken } = require('../middleware/general');

const app = express();

/**
 * trae todos los elementos de rol_ruta
 * @route GET /rol_ruta
 * @group RR manejo conjunto de relacion entre rol y ruta
 * @returns {object} 200 - un arreglo de rol_ruta
 * @returns {Error}  default - Unexpected error
 */
app.get('/rol_ruta', verificaToken, function(req, res) {
    let query = 'SELECT * FROM public.rol_ruta order by id_rol_ruta;';
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
 * trae un solo elemento de rol_ruta
 * @route GET /rol_ruta/:id
 * @group RR manejo conjunto de relacion entre rol y ruta
 * @param {int} id.path el id con el que se trae el objeto.
 * @returns {object} 200 - un objeto de rol_ruta
 * @returns {Error}  default - Unexpected error
 */
app.get('/rol_ruta/:id', verificaToken, function(req, res) {
    let id = req.params.id;
    let query = `SELECT * FROM public.rol_ruta WHERE id_rol_ruta=${id}`;
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
 * filtra elementos de rol_ruta de acuerdo a los campos suministrados
 * @route POST /rol_ruta/filter
 * @group RR manejo conjunto de relacion entre rol y ruta
 * @param {object} body el objeto.
 * @returns {object} 200 - un objeto de rol_ruta
 * @returns {Error}  default - Unexpected error
 */
app.post('/rol_ruta/filter', verificaToken, function(req, res) {
    let { id_rol, id_ruta, updated_at } = req.body;
    let query = 'SELECT a.id_rol_ruta,a.id_ruta, c.ruta, a.id_rol, b.rol, a.updated_at FROM rol_ruta as a, rol as b, ruta as c where ';
    query += 'a.id_ruta=c.id_ruta and a.id_rol=b.id_rol and ';
    query += '(cast($1 as integer) is null or a.id_rol=$1) and ';
    query += '(cast($2 as bigint) is null or a.id_ruta=$2) and ';
    query += '(cast($3 as timestamp) is null or a.updated_at>=$3)';

    pool.query(query, [id_rol, id_ruta, updated_at], (error, results) => {
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
 * crea un solo elemento de rol_ruta
 * @route POST /rol_ruta
 * @group RR manejo conjunto de relacion entre rol y ruta
 * @param {object} body el objeto.
 * @returns {object} 200 - un objeto de rol_ruta
 * @returns {Error}  default - Unexpected error
 */
app.post('/rol_ruta', verificaToken, function(req, res) {
    const { id_rol, id_ruta } = req.body;
    let updated_at = moment().tz('America/Bogota').format();

    let query1 = 'SELECT COUNT(*) FROM rol_ruta as a WHERE a.id_rol=$1 and a.id_ruta=$2;';

    pool.query(query1, [id_rol, id_ruta], (error1, results1) => {
        if (error1) {
            return res.status(400).json({
                ok: false,
                error1
            });
        }
        if (results1.rows[0].count == 0) {
            let query = 'INSERT INTO public.rol_ruta(id_rol, id_ruta, updated_at) VALUES ($1, $2, $3) RETURNING *;';
            pool.query(query, [id_rol, id_ruta, updated_at], (error, results) => {
                if (error) {
                    return res.status(400).json({
                        ok: false,
                        error
                    });
                }
                results.rows[0].updated_at = moment(results.rows[0].updated_at).tz('America/Bogota').format();
                res.json(results.rows[0]);
            });
        } else {
            return res.status(400).json({
                ok: false,
                message: 'Elemento ya existe'
            });
        }
    });
});

/**
 * actualiza un solo elemento de rol_ruta
 * @route PUT /rol_ruta
 * @group RR manejo conjunto de relacion entre rol y ruta
 * @param {object} body el objeto.
 * @returns {object} 200 - un objeto de rol_ruta
 * @returns {Error}  default - Unexpected error
 */
app.put('/rol_ruta', verificaToken, function(req, res) {
    const { id_rol_ruta, id_rol, id_ruta } = req.body;
    let updated_at = moment().tz('America/Bogota').format();
    let query = `UPDATE public.rol_ruta SET id_rol=$1, id_ruta=$2, updated_at=$3 WHERE id_rol_ruta=$4 RETURNING *;`;
    pool.query(query, [id_rol, id_ruta, updated_at, id_rol_ruta], (error, results) => {
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
 * elimina un solo elemento de rol_ruta
 * @route DELETE /rol_ruta/:id
 * @group RR manejo conjunto de relacion entre rol y ruta
 * @param {int} id.path el id con el que se trae el objeto.
 * @returns {object} 200 - un objeto de rol_ruta
 * @returns {Error}  default - Unexpected error
 */
app.delete('/rol_ruta/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let query = `DELETE FROM public.rol_ruta WHERE id_rol_ruta=${id};`;
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