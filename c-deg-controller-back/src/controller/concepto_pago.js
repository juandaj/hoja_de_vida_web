const pool = require('../config/config').pool;
const express = require('express');
const moment = require('moment-timezone');
const { verificaToken } = require('../middleware/general');

const app = express();

/**
 * trae todos los elementos de concepto_pago
 * @route GET /concepto_pago
 * @group concepto_pago manejo tipo concepto de pago
 * @returns {object} 200 - un arreglo de concepto_pago
 * @returns {Error}  default - Unexpected error
 */
app.get('/concepto_pago', verificaToken, function(req, res) {
    let query = 'SELECT * FROM public.concepto_pago order by id_concepto_pago;';
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
 * trae un solo elemento de concepto_pago
 * @route GET /concepto_pago/:id
 * @group BP manejo conjunto de relacion entre productos y bodegas
 * @param {int} id.path el id con el que se trae el objeto.
 * @returns {object} 200 - un objeto de concepto_pago
 * @returns {Error}  default - Unexpected error
 */
app.get('/concepto_pago/:id', verificaToken, function(req, res) {
    let id = req.params.id;
    let query = `SELECT * FROM public.concepto_pago WHERE id_concepto_pago=${id}`;
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
 * filtra elementos de concepto_pago de acuerdo a los campos suministrados
 * @route POST /concepto_pago/filter
 * @group concepto_pago manejo tipo concepto de pago
 * @param {object} body el objeto.
 * @returns {object} 200 - un objeto de concepto_pago
 * @returns {Error}  default - Unexpected error        !!!!!!!!!!!!EDITAR!!!!!!!!!!!!
 */
app.post('/concepto_pago/filter', function(req, res) {
    let { id_producto, id_bodega, cantidad, minstock, estado, sector, ubicacion, updated_at } = req.body;
    let query = 'SELECT a.id_concepto_pago, a.id_producto, c.producto, a.id_bodega, b.bodega, a.cantidad, a.minstock, a.estado, a.sector, a.ubicacion, a.updated_at FROM concepto_pago as a, bodega as b, producto as c where ';
    query += 'a.id_producto=c.id_producto and a.id_bodega=b.id_bodega and ';
    query += '(cast($1 as bigint) is null or a.id_producto=$1) and ';
    query += '(cast($2 as integer) is null or a.id_bodega=$2) and ';
    query += '(cast($3 as int) is null or a.cantidad>=$3) and ';
    query += '(cast($4 as int) is null or a.minstock>=$4) and ';
    query += '(cast($5 as boolean) is null or a.estado>=$5) and ';
    query += '(cast($6 as int) is null or a.sector=$6) and ';
    query += '(cast($7 as text) is null or a.ubicacion=$7) and ';
    query += '(cast($8 as timestamp) is null or a.updated_at>=$8)';

    pool.query(query, [id_producto, id_bodega, cantidad, minstock, estado, sector, ubicacion, updated_at], (error, results) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                error
            });
        }
        results.rows.forEach((item) => {
            item.updated_at = moment(item.updated_at).tz('America/Bogota').format();
        });
        if((id_bodega !==null && id_producto !==null && estado !== null)){//Para respuestas de una sola salida
            if(estado){//Para estado verdadero
                res.json(results.rows);
            }else{
                var resultado;
                results.rows.forEach((item) => {
                    if(!item.estado && item != null){
                        resultado = item;                                                
                    }                    
                });
                if(resultado){
                    res.json([resultado]);
                }else{
                    res.json([]);
                }
            }
        }else{
            res.json(results.rows);
        }

    });

});

/**
 * crea un solo elemento de concepto_pago
 * @route POST /concepto_pago
 * @group concepto_pago manejo tipo concepto de pago
 * @param {object} body el objeto.
 * @returns {object} 200 - un objeto de concepto_pago
 * @returns {Error}  default - Unexpected error
 */
 app.post('/concepto_pago', verificaToken, function(req, res) {
    const { concepto_pago, definicion_cp } = req.body;
    let updated_at = moment().tz('America/Bogota').format();
    let query = 'INSERT INTO public.concepto_pago(concepto_pago, definicion_cp, updated_at) VALUES ($1, $2, $3 ) RETURNING *;';
    pool.query(query, [ concepto_pago, definicion_cp, updated_at], (error, results) => {
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
 * actualiza un solo elemento de concepto_pago
 * Permite solo cambiar globalmente de estado de nuevo a usado, si no hay mas productos con nuevo o usado
 * @route PUT /concepto_pago
 * @group concepto_pago manejo tipo concepto de pago
 * @param {object} body el objeto.
 * @returns {object} 200 - un objeto de concepto_pago
 * @returns {Error}  default - Unexpected error
 */
 app.put('/concepto_pago', verificaToken, function(req, res) {
    const { id_concepto_pago, concepto_pago, definicion_cp } = req.body;
    let updated_at = moment().tz('America/Bogota').format();
    let query = `UPDATE public.concepto_pago SET concepto_pago=$1, definicion_cp=$2, updated_at=$3 WHERE id_concepto_pago=$4 RETURNING *;`;
    pool.query(query, [concepto_pago, definicion_cp, updated_at, id_concepto_pago], (error, results) => {
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
 * elimina un solo elemento de concepto_pago
 * @route DELETE /concepto_pago/:id
 * @group BP manejo conjunto de relacion entre productos y bodegas
 * @param {int} id.path el id con el que se trae el objeto.
 * @returns {object} 200 - un objeto de concepto_pago
 * @returns {Error}  default - Unexpected error
 */
app.delete('/concepto_pago/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let query = `DELETE FROM public.concepto_pago WHERE id_concepto_pago=${id};`;
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
