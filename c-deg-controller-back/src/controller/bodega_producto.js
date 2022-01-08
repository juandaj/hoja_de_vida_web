const pool = require('../config/config').pool;
const express = require('express');
const moment = require('moment-timezone');
const { verificaToken } = require('../middleware/general');

const app = express();

/**
 * trae todos los elementos de bodega_producto
 * @route GET /bodega_producto
 * @group BP manejo conjunto de relacion entre productos y bodegas
 * @returns {object} 200 - un arreglo de bodega_producto
 * @returns {Error}  default - Unexpected error
 */
app.get('/bodega_producto', verificaToken, function(req, res) {
    let query = 'SELECT * FROM public.bodega_producto order by id_bodega_producto;';
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
 * Trae todos los elementos de bodega_producto con MINSTOCK
 * @route GET /bodega_producto
 * @group BP manejo conjunto de relacion entre productos y bodegas
 * @param {object} body el objeto.
 * @returns {object} 200 - un arreglo de bodega_producto
 * @returns {Error}  default - Unexpected error
 */
app.get('/bodega_producto/stock/:minstock', verificaToken, function(req, res) {
    let cant = req.params.minstock;
    //console.log('Back prueba', cant)
    let query = `SELECT * FROM bodega_producto as a WHERE a.cantidad =${cant};`;
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
 * trae un solo elemento de bodega_producto
 * @route GET /bodega_producto/:id
 * @group BP manejo conjunto de relacion entre productos y bodegas
 * @param {int} id.path el id con el que se trae el objeto.
 * @returns {object} 200 - un objeto de bodega_producto
 * @returns {Error}  default - Unexpected error
 */
app.get('/bodega_producto/:id', verificaToken, function(req, res) {
    let id = req.params.id;
    let query = `SELECT * FROM public.bodega_producto WHERE id_bodega_producto=${id}`;
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
 * filtra elementos de bodega_producto de acuerdo a los campos suministrados
 * @route POST /bodega_producto/filter
 * @group BP manejo conjunto de relacion entre productos y bodegas
 * @param {object} body el objeto.
 * @returns {object} 200 - un objeto de bodega_producto
 * @returns {Error}  default - Unexpected error
 */
 app.post('/bodega_producto/filter', function(req, res) {
    let { id_producto, id_bodega, cantidad, minstock, estado, sector, ubicacion, updated_at } = req.body;
    let query = 'SELECT a.id_bodega_producto, a.id_producto, c.producto, a.id_bodega, b.bodega, a.cantidad, a.minstock, a.estado, a.sector, a.ubicacion, a.updated_at FROM bodega_producto as a, bodega as b, producto as c where ';
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
 * crea un solo elemento de bodega_producto
 * @route POST /bodega_producto
 * @group BP manejo conjunto de relacion entre productos y bodegas
 * @param {object} body el objeto.
 * @returns {object} 200 - un objeto de bodega_producto
 * @returns {Error}  default - Unexpected error
 */
app.post('/bodega_producto', verificaToken, function(req, res) {
    const { id_producto, id_bodega, cantidad, minstock, estado, sector, ubicacion } = req.body;
    let updated_at = moment().tz('America/Bogota').format();
    let query1 = 'SELECT COUNT(*) FROM bodega_producto as a WHERE a.id_producto=$1 and a.id_bodega=$2 and a.estado=$3;';

    pool.query(query1, [id_producto, id_bodega, estado], (error1, results1) => {
        if (error1) {
            return res.status(400).json({
                ok: false,
                error1
            });
        }
        if (results1.rows[0].count < 1) {
            let query = 'INSERT INTO public.bodega_producto(id_producto, id_bodega, cantidad, minstock, estado, sector, ubicacion, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;';
            pool.query(query, [id_producto, id_bodega, cantidad, minstock, estado, sector, ubicacion, updated_at], (error, results) => {
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
 * filtra elementos de bodega_producto de acuerdo a los campos suministrados
 * @route POST /bodega_producto/filter_especial
 * @group BP manejo conjunto de relacion entre productos y bodegas
 * @param {object} body el objeto.
 * @returns {object} 200 - un objeto de bodega_producto
 * @returns {Error}  default - Unexpected error
 */
 app.post('/bodega_producto/filter_especial', function(req, res) {
    let { id_producto, id_bodega, cantidad, minstock, estado, sector, ubicacion, updated_at } = req.body;
    let query = 'SELECT a.id_bodega_producto, a.id_producto, c.producto, a.id_bodega, b.bodega, a.cantidad, a.minstock, a.estado, a.sector, a.ubicacion, a.updated_at FROM bodega_producto as a, bodega as b, producto as c where ';
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
        console.log(id_bodega,id_producto,estado)
        if((id_bodega !==undefined && id_producto !==undefined && estado !== undefined)){//Para respuestas de una sola salida
            if(estado){//Para estado verdadero
                console.log("estado verdadero",estado);
                res.json(results.rows);                
            }else{
                console.log("estado falso",estado);
                var resultado;
                results.rows.forEach((item) => {
                    if(!item.estado && item != null){
                        console.log("resultado para !item.estado && item != null",item);
                        resultado = item;                                                
                    }                    
                });
                if(resultado){
                    console.log("resultado final",resultado);
                    res.json([resultado]);
                }else{
                    console.log("resultado final vacio");
                    res.json([]);
                }
            }
        }else{
            console.log("resultado final para cualquier otro caso");
            res.json(results.rows);
        }

    });

});


/**
 * actualiza un solo elemento de bodega_producto
 * Permite solo cambiar globalmente de estado de nuevo a usado, si no hay mas productos con nuevo o usado
 * @route PUT /bodega_producto
 * @group BP manejo conjunto de relacion entre productos y bodegas
 * @param {object} body el objeto.
 * @returns {object} 200 - un objeto de bodega_producto
 * @returns {Error}  default - Unexpected error
 */
app.put('/bodega_producto', verificaToken, function(req, res) {//
    const { id_bodega_producto, id_producto, id_bodega, cantidad, minstock, estado, sector, ubicacion } = req.body;
    let updated_at = moment().tz('America/Bogota').format();
    let query1 = 'SELECT COUNT(*) FROM bodega_producto as a WHERE a.id_producto=$1 and a.id_bodega=$2 and a.estado=$3;';
    pool.query(query1, [id_producto, id_bodega, estado], (error1, results1) => {
        if (error1) {
            return res.status(400).json({
                ok: false,
                error1
            });
        }
        if (results1.rows[0].count < 1) {
            let query = `UPDATE public.bodega_producto SET id_producto=$1, id_bodega=$2, cantidad=$3, minstock=$4, estado=$5, sector=$6, ubicacion=$7, updated_at=$8 WHERE id_bodega_producto=$9 RETURNING *;`;
            pool.query(query, [id_producto, id_bodega, cantidad, minstock, estado, sector, ubicacion, updated_at, id_bodega_producto], (error, results) => {
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
            //let query2 = 'SELECT COUNT(*) FROM bodega_producto as a WHERE a.id_producto=$1 and a.id_bodega=$2 and a.estado=$3;';//juan
            let query2 = `SELECT * FROM public.bodega_producto WHERE id_bodega_producto=$1`;
            pool.query(query2, [id_bodega_producto], (error, results) => {
                if (error) {
                    return res.status(400).json({
                        ok: false,
                        error
                    });
                }
                if (results.rows.length != 0) {
                    if (results.rows[0].estado == estado && results.rows[0].id_bodega == id_bodega){
                        let query = `UPDATE public.bodega_producto SET id_producto=$1, id_bodega=$2, cantidad=$3, minstock=$4, estado=$5, sector=$6, ubicacion=$7, updated_at=$8 WHERE id_bodega_producto=$9 RETURNING *;`;
                        pool.query(query, [id_producto, id_bodega, cantidad, minstock, estado, sector, ubicacion, updated_at, id_bodega_producto], (error, results) => {
                            if (error) {
                                return res.status(400).json({
                                    ok: false,
                                    error
                                });
                            }
                            results.rows[0].updated_at = moment(results.rows[0].updated_at).tz('America/Bogota').format();
                            res.json(results.rows[0]);
                        });
                    }else if(results.rows[0].id_bodega !== id_bodega){ //traslados totales con update
                        let query1 = 'SELECT COUNT(*) FROM bodega_producto as a WHERE a.id_producto=$1 and a.id_bodega=$2 and a.estado=$3;';                        
                        pool.query(query1, [id_producto, id_bodega, estado], (error1, results1) => {//busca si ya existe algun resgistro similar
                            if (error1) {
                                return res.status(400).json({
                                    ok: false,
                                    error1
                                });
                            }
                            if (results1.rows[0].count < 1) {//en caso de no existir se actualiza el registro
                                let query = `UPDATE public.bodega_producto SET id_producto=$1, id_bodega=$2, cantidad=$3, minstock=$4, estado=$5, sector=$6, ubicacion=$7, updated_at=$8 WHERE id_bodega_producto=$9 RETURNING *;`;
                                pool.query(query, [id_producto, id_bodega, cantidad, minstock, estado, sector, ubicacion, updated_at, id_bodega_producto], (error, results) => {
                                    if (error) {
                                        return res.status(400).json({
                                            ok: false,
                                            error
                                        });
                                    }
                                    results.rows[0].updated_at = moment(results.rows[0].updated_at).tz('America/Bogota').format();
                                    res.json(results.rows[0]);
                                });
                            }else{//si el registro ya existe, se busca la coincidencia y se devuelve en un error
                                let query1 = 'SELECT * FROM public.bodega_producto WHERE id_producto=$1 and id_bodega=$2 and estado=$3;';
                                pool.query(query1, [id_producto, id_bodega, estado], (error, results) => {
                                    if (error) {
                                        return res.status(400).json({
                                            ok: false,
                                            error
                                        });
                                    }                                    
                                    res.status(400).json({
                                        ok: false,
                                        message: 'Elemento ya existe',
                                        item: results.rows[0],
                                    });
                                });
                            }
                        });

                    }
                    else{//En caso de que un registro de igual estado true o false ya existe, y no se trate de un traslado
                        let query1 = 'SELECT * FROM public.bodega_producto WHERE id_producto=$1 and id_bodega=$2 and estado=$3;';
                        pool.query(query1, [id_producto, id_bodega, estado], (error, results) => {
                            if (error) {
                                return res.status(400).json({
                                    ok: false,
                                    error
                                });
                            }                                    
                            res.status(400).json({
                                ok: false,
                                message: 'Elemento ya existe',
                                item: results.rows[0],
                            });
                        });
                    }
                }
                //res.json(results.rows[0]);
            });

            /*return res.status(400).json({//ultimo en cadena de if
                ok: false,
                message: 'Elemento ya existe'
            });*/
        }
    });

});

/**
 * elimina un solo elemento de bodega_producto
 * @route DELETE /bodega_producto/:id
 * @group BP manejo conjunto de relacion entre productos y bodegas
 * @param {int} id.path el id con el que se trae el objeto.
 * @returns {object} 200 - un objeto de bodega_producto
 * @returns {Error}  default - Unexpected error
 */
app.delete('/bodega_producto/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let query = `DELETE FROM public.bodega_producto WHERE id_bodega_producto=${id};`;
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
