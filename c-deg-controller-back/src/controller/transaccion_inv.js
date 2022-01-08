const pool = require('../config/config').pool;
const express = require('express');
const moment = require('moment-timezone');
const { verificaToken } = require('../middleware/general');

const app = express();

const dateFormat = require("dateformat");



/**
 * trae todos los elementos de transaccion_inv
 * @route GET /transaccion_inv
 * @group transaccion_inv manejo de transaccion_inv
 * @returns {object} 200 - un arreglo de transaccion_inv
 * @returns {Error}  default - Unexpected error
 */
app.get('/transaccion_inv', verificaToken, function(req, res) {
    let query = 'SELECT * FROM public.transaccion_inv order by id_transaccion_inv;';
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
 * trae un solo elemento de transaccion_inv
 * @route GET /transaccion_inv/:id
 * @group transaccion_inv manejo de transaccion_invs
 * @param {int} id.path el id con el que se trae el objeto.
 * @returns {object} 200 - un objeto de transaccion_inv
 * @returns {Error}  default - Unexpected error
 */
app.get('/transaccion_inv/:id', verificaToken, function(req, res) {
    let id = req.params.id;
    let query = `SELECT * FROM public.transaccion_inv WHERE id_transaccion_inv=${id}`;
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
 * filtra elementos de transaccion_inv de acuerdo a los campos suministrados
 * @route POST /transaccion_inv/filter
 * @group transaccion_inv manejo de transaccion_invs
 * @param {object} body el objeto.
 * @returns {object} 200 - un objeto de transaccion_inv
 * @returns {Error}  default - Unexpected error
 */
app.post('/transaccion_inv/filter', verificaToken, function(req, res) {
    let {fecha, cliente, cantidad, referencia_destino, total_descuento, iva, id_bodega_destino, id_producto, id_bodega_producto, id_bodega, id_tipo_transaccion, id_concepto_pago, id_centro_costos, documento_destino, updated_at } = req.body;
    let query = 'SELECT a.id_transaccion_inv, a.fecha, a.cliente, a.cantidad, a.referencia_destino, a.total_descuento, a.iva, a.id_bodega_destino, d.id_producto, e.id_bodega_producto, f.id_bodega, g.id_tipo_transaccion, b.id_concepto_pago, c.id_centro_costos, a.documento_destino, a.numero_documento, a.updated_at FROM transaccion_inv as a, concepto_pago as b, centro_costos as c, producto as d, bodega_producto as e, bodega as f, tipo_transaccion as g where ';
    query += 'a.id_concepto_pago=b.id_concepto_pago and a.id_centro_costos=c.id_centro_costos and a.id_producto=d.id_producto and a.id_bodega_producto=e.id_bodega_producto and a.id_bodega=f.id_bodega and a.id_tipo_transaccion=g.id_tipo_transaccion and ';
    query += '(cast($1 as date) is null or a.fecha>=$1) and';
    query += '(cast($2 as varchar) is null or a.cliente=$2) and ';
    query += '(cast($3 as bigint) is null or a.cantidad=$3) and ';
    query += '(cast($4 as varchar) is null or a.referencia_destino=$4) and ';
    query += '(cast($5 as varchar) is null or a.total_descuento>=$5) and ';
    query += '(cast($6 as varchar) is null or a.iva>=$6) and ';
    query += '(cast($7 as int) is null or a.id_bodega_destino=$7) and ';
    query += '(cast($8 as bigint) is null or a.id_producto=$8) and ';
    query += '(cast($9 as bigint) is null or a.id_bodega_producto=$9) and ';
    query += '(cast($10 as bigint) is null or a.id_bodega=$10) and ';
    query += '(cast($11 as bigint) is null or a.id_tipo_transaccion=$11) and ';
    query += '(cast($12 as bigint) is null or a.id_concepto_pago=$12) and ';
    query += '(cast($13 as bigint) is null or a.id_centro_costos=$13) and';
    query += '(cast($14 as varchar) is null or a.documento_destino=$14) and';
    query += '(cast($15 as timestamp) is null or a.updated_at>=$15)';
    pool.query(query, [fecha, cliente, cantidad, referencia_destino, total_descuento, iva, id_bodega_destino, id_producto, id_bodega_producto, id_bodega, id_tipo_transaccion, id_concepto_pago, id_centro_costos, documento_destino, updated_at], (error, results) => {
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
 * crea un solo elemento de transaccion_inv
 * @route POST /transaccion_inv
 * @group transaccion_inv manejo de transaccion_invs
 * @param {object} body el objeto.
 * @returns {object} 200 - un objeto de transaccion_inv
 * @returns {Error}  default - Unexpected error
 */
app.post('/transaccion_inv', verificaToken, function(req, res) {

    //const now = new Date();
    //const now = new Date(req.body.fecha);
    var aux = req.body.fecha.toString();
    
    var dateParts = aux.split("-");
    var dateManual = `${dateParts[1]}${dateParts[2]}${dateParts[0].substring(2,4)}`;
    console.log("conversion manual", dateParts, dateManual);
    const now = dateManual


    console.log("now",now);
    var fecha_actual  = now; //dateFormat(now, "mmddyy").toString();
    console.log("fecha actual",fecha_actual);

    let query1 = `SELECT * FROM public.transaccion_inv WHERE Fecha='${aux}' ORDER BY id_transaccion_inv DESC LIMIT 1`;
    console.log(query1);
    pool.query(query1, (error, results) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                error
            });
        }
        console.log("result",results.rows.length);
        var CantidadRegistro = results.rows.length;
        //console.log('Fecha ultimo registro', dateFormat(results.rows[0].fecha, "mmddyy").toString())
        if (CantidadRegistro == 0)
        {
            var documento_destino = fecha_actual + '000';
            var numero_documento = fecha_actual + '000';
        }
        else
        {
            var FechaDeUltimoRegistro =  dateFormat(results.rows[0].fecha, "mmddyy").toString();
            //console.log(results.rows)
            console.log( 'fecha',FechaDeUltimoRegistro, fecha_actual)
            if( FechaDeUltimoRegistro == fecha_actual)
            {
                console.log( 'fecha',FechaDeUltimoRegistro, fecha_actual)
                var consecutivo = parseInt(results.rows[0].documento_destino.substring(6,9))
                var nuevo_consecutivo = 0;
                nuevo_consecutivo = consecutivo + 1;
                var tamaño_consecutivo = nuevo_consecutivo.toString().length;
                console.log("consecutivo",consecutivo,"nuevo cons", nuevo_consecutivo)
                if(tamaño_consecutivo == 1){
                    var documento_destino = fecha_actual + '00' + nuevo_consecutivo.toString();
                    var numero_documento = documento_destino;
                }
                else if(tamaño_consecutivo == 2)
                {
                    var documento_destino = fecha_actual + '0' + nuevo_consecutivo.toString();
                    var numero_documento = documento_destino;
                }
                else if(tamaño_consecutivo == 3)
                {
                    var documento_destino = fecha_actual + nuevo_consecutivo.toString();
                    var numero_documento = documento_destino;
                }
            }
            else
            {
                console.log("else");
                var documento_destino = fecha_actual + '000';
                var numero_documento = fecha_actual + '000';
            }
            
        }
        //console.log(documento_destino, numero_documento)


        //const {  fecha, cliente, cantidad, documento_destino, numero_documento, referencia_destino, total_descuento, iva, id_bodega_destino, id_producto, id_bodega_producto, id_bodega, id_tipo_transaccion, id_concepto_pago, id_centro_costos } = req.body;
        const {  fecha, cliente, cantidad, referencia_destino, total_descuento, iva, id_bodega_destino, id_producto, id_bodega_producto, id_bodega, id_tipo_transaccion, id_concepto_pago, id_centro_costos } = req.body;
        let updated_at = moment().tz('America/Bogota').format();
        let query = 'INSERT INTO public.transaccion_inv( fecha, cliente, cantidad, updated_at, documento_destino, numero_documento, referencia_destino, total_descuento, iva, id_bodega_destino, id_producto, id_bodega_producto, id_bodega, id_tipo_transaccion, id_concepto_pago, id_centro_costos) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *;';
        pool.query(query, [ fecha, cliente, cantidad, updated_at, documento_destino, numero_documento, referencia_destino, total_descuento, iva, id_bodega_destino, id_producto, id_bodega_producto, id_bodega, id_tipo_transaccion, id_concepto_pago, id_centro_costos], (error, results) => {
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

});

/**
 * actualiza un solo elemento de transaccion_inv
 * @route PUT /transaccion_inv
 * @group transaccion_inv manejo de transaccion_invs
 * @param {object} body el objeto.
 * @returns {object} 200 - un objeto de transaccion_inv
 * @returns {Error}  default - Unexpected error
 */
app.put('/transaccion_inv', verificaToken, function(req, res) {
    const { consecutivo, cliente, cantidad, documento_destino, numero_documento, referencia_destino, total_descuento, iva, id_bodega_destino, id_producto, id_bodega_producto, id_bodega, id_tipo_transaccion, id_concepto_pago, id_centro_costos, id_transaccion_inv} = req.body;
    let updated_at = moment().tz('America/Bogota').format();
    let query = `UPDATE public.transaccion_inv SET consecutivo = $1, cliente= $2, cantidad= $3, updated_at= $4, documento_destino= $5, numero_documento= $6, referencia_destino= $7, total_descuento= $8, iva= $9, id_bodega_destino= $10, id_producto= $11, id_bodega_producto= $12, id_bodega= $13, id_tipo_transaccion= $14, id_concepto_pago= $15, id_centro_costos= $16 WHERE id_transaccion_inv=$17 RETURNING *;`;
    pool.query(query, [ consecutivo, cliente, cantidad, updated_at, documento_destino, numero_documento, referencia_destino, total_descuento, iva, id_bodega_destino, id_producto, id_bodega_producto, id_bodega, id_tipo_transaccion, id_concepto_pago, id_centro_costos, id_transaccion_inv], (error, results) => {
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
 * elimina un solo elemento de transaccion_inv
 * @route DELETE /transaccion_inv/:id
 * @group transaccion_inv manejo de transaccion_invs
 * @param {int} id.path el id con el que se trae el objeto.
 * @returns {object} 200 - un objeto de transaccion_inv
 * @returns {Error}  default - Unexpected error
 */
app.delete('/transaccion_inv/:id', verificaToken, function(req, res) {
    let id = req.params.id;
    
    let query = `DELETE FROM public.transaccion_inv WHERE id_transaccion_inv=${id};`;
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
