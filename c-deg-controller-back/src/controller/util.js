const pool = require('../config/config').pool;
const express = require('express');
const moment = require('moment-timezone');
const { verificaToken } = require('../middleware/general');
const { gBodega, gCategoria, gProducto, gRol, gRuta, gUsuario, rProducto, rUsuario, gBP, gRR, gPU } = require('../util/generador');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const configMensaje = require('../config/configmensaje');

const app = express();

/**
 * generador automatico de datos en las tablas principales
 * @route GET /util/principal/:c/:p
 * @group UTIL manejo de funciones especiales
 * @param {int} c.path cantidad de registros.
 * @param {int} p.path tamaño de palabra.
 * @returns {object} 200 - un arreglo de categoria
 * @returns {Error}  default - Unexpected error
 */
app.get('/util/principal/:c/:p', verificaToken, function(req, res) {
    let c = req.params.c;
    let p = req.params.p;

    gBodega(c, p);
    gCategoria(c, p);
    gProducto(c, p);
    gRol(c, p);
    gRuta(c, p);
    gUsuario(c, p);

    res.json({
        ok: true,
        message: 'Creados'
    });
});

/**
 * generador automatico de datos en las tablas de ralacion
 * @route GET /util/relacion/:c/:p/:a
 * @group UTIL manejo de funciones especiales
 * @param {int} c.path cantidad de registros.
 * @param {int} p.path tamaño de palabra.
 * @param {int} a.path cantidad de registros creados en las tablas principales.
 * @returns {object} 200 - un arreglo de categoria
 * @returns {Error}  default - Unexpected error
 */
app.get('/util/relacion/:c/:p/:a', verificaToken, function(req, res) {
    let c = req.params.c;
    let p = req.params.p;
    let a = req.params.a;
    rProducto(a);
    rUsuario(a);
    gBP(c, p, a);
    gRR(c, p, a);
    gPU(c, p, a);

    res.json({
        ok: true,
        message: 'Creados'
    });
});

/**
 * Verifica si el token es valido y retorna el usuario asociado
 * @route GET /token/verify
 * @group UTIL manejo de funciones especiales
 * @returns {object} 200 - un usuario decodificado
 * @returns {Error}  default - Unexpected error
 */
app.get('/token/verify', (req, res) => {

    let token = req.get('token');
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.json({
                ok: false,
                message: 'token invalido',
                err
            });
        }
        res.json({
            ok: true,
            message: 'token valido',
            usuario: decoded['usuario']
        });
    });
});

/**
 * Cargar un archiv
 * @route PUT /upload/:id
 * @group UTIL manejo de funciones especiales
 * @param {int} id.path el id al que se asignara el archivo.
 * @returns {object} 200 - un arreglo de usuario
 * @returns {Error}  default - Unexpected error
 */
app.put('/upload/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se ha seleccionado ningún archivo'
                }
            });
    }

    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];

    // Extensiones permitidas
    let extensionesValidas = ['pdf', 'PDF', 'docx', 'DOCX', 'xlsx', 'XLSX'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extensionesValidas.join(', '),
                ext: extension
            }
        })
    }

    let query = `SELECT * FROM public.producto WHERE id_producto=${id}`;

    pool.query(query, (error, results) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                error
            });
        }
        if (results.rowCount > 0) {
            let registro = results.rows[0];
            let nombreArchivo = `${ id }-${ new Date().getMilliseconds()  }.${ extension }`;
            borraArchivo(registro.datasheet);
            let pathFile = path.resolve(__dirname, `../uploads`);
            if (!fs.existsSync(pathFile)) {
                fs.mkdirSync(pathFile);
            }

            archivo.mv(`src/uploads/${ nombreArchivo }`, (err) => {

                if (err)
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                let updated_at = moment().tz('America/Bogota').format();
                query = `UPDATE public.producto SET datasheet = $1, updated_at = $2 WHERE id_producto = $3 RETURNING *`;

                pool.query(query, [nombreArchivo, updated_at, id], (error, results) => {
                    if (error) {
                        borraArchivo(nombreArchivo)
                        return res.status(400).json({
                            ok: false,
                            error
                        });
                    }
                    results.rows[0].updated_at = moment(results.rows[0].updated_at).tz('America/Bogota').format();
                    res.json(results.rows[0]);
                });

            });
        } else {
            return res.status(400).json({
                ok: false,
                message: 'El id no existe'
            });
        }
    });


});

/**
 * traer un archivo
 * @route GET /file/:f
 * @group UTIL manejo de funciones especiales
 * @param {string} f.path el nombre de archivo que se va a extraer.
 * @returns {object} 200 - un arreglo de usuario
 * @returns {Error}  default - Unexpected error
 */
app.get('/file/:f', (req, res) => {

    let f = req.params.f;

    let pathImagen = path.resolve(__dirname, `../uploads/${ f }`);

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');
        res.sendFile(noImagePath);
    }

});

borraArchivo = (nombreFile) => {

    let pathFile = path.resolve(__dirname, `../uploads/${ nombreFile }`);
    if (fs.existsSync(pathFile)) {
        fs.unlinkSync(pathFile);
    }

}

/**
 * Enviar un correo para cambio de contraseña
 * @route GET /message
 * @group UTIL manejo de funciones especiales
 * @returns {object} 200 - confirmacion del mensaje
 * @returns {Error}  default - Unexpected error
 */
app.post('/message', (req, res) => {
    configMensaje(req.body, res);
});


module.exports = app;
