const pool = require('../config/config').pool;
const moment = require('moment-timezone');

let generarPalabras = (cantidad) => {
    let letras = 'abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let frase = '';
    for (let i = 0; i < cantidad; i++) {
        frase += letras[Math.floor(Math.random() * letras.length)];
    }
    return frase;
};

let getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

let gBodega = (c, p) => {
    let frase;
    let query = 'INSERT INTO public.bodega(bodega, descripcion, updated_at) VALUES ($1, $2, $3) RETURNING *;';
    for (let i = 0; i < c; i++) {
        frase = generarPalabras(p);
        let updated_at = moment().tz('America/Bogota').format();
		let numerox = getRandomInt(1, 20);

        pool.query(query, [frase, frase, updated_at], (error, results) => {
            if (error) {
                throw error;
            }
            console.log(results.rows[0]);
        });
    }
};

let gCategoria = (c, p) => {
    let frase;
    let query = 'INSERT INTO public.categoria(categoria, descripcion, updated_at) VALUES ($1, $2, $3) RETURNING *;';
    for (let i = 0; i < c; i++) {
        frase = generarPalabras(p);
        let updated_at = moment().tz('America/Bogota').format();

        pool.query(query, [frase, frase, updated_at], (error, results) => {
            if (error) {
                throw error;
            }
            console.log(results.rows[0]);
        });
    }
};

let gProducto = (c, p) => {
    let frase;
    let number;
    let query = 'INSERT INTO public.producto(codigo, producto, descripcion, preciov, datasheet, updated_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;';
    for (let i = 0; i < c; i++) {
        frase = generarPalabras(p);
        number = getRandomInt(100, 500);
        let updated_at = moment().tz('America/Bogota').format();

        pool.query(query, [frase, frase, frase, number, frase, updated_at], (error, results) => {
            if (error) {
                throw error;
            }
            console.log(results.rows[0]);
        });
    }
};

let gRol = (c, p) => {
    let frase;
    let query = 'INSERT INTO public.rol(rol, descripcion, updated_at) VALUES ($1, $2, $3) RETURNING *;';
    for (let i = 0; i < c; i++) {
        frase = generarPalabras(p);
        let updated_at = moment().tz('America/Bogota').format();

        pool.query(query, [frase, frase, updated_at], (error, results) => {
            if (error) {
                throw error;
            }
            console.log(results.rows[0]);
        });
    }
};

let gRuta = (c, p) => {
    let frase;
    let query = 'INSERT INTO public.ruta(ruta, descripcion) VALUES ($1, $2) RETURNING *;';
    for (let i = 0; i < c; i++) {
        frase = generarPalabras(p);

        pool.query(query, [frase, frase], (error, results) => {
            if (error) {
                throw error;
            }
            console.log(results.rows[0]);
        });
    }
};

let gUsuario = (c, p) => {
    let frase;
    let query = 'INSERT INTO public.usuario(nombre, correo, contrasena, updated_at) VALUES ($1, $2, $3, $4) RETURNING *;';
    for (let i = 0; i < c; i++) {
        frase = generarPalabras(p);
        let updated_at = moment().tz('America/Bogota').format();

        pool.query(query, [frase, frase, frase, updated_at], (error, results) => {
            if (error) {
                throw error;
            }
            console.log(results.rows[0]);
        });
    }
};

let rProducto = (a) => {
    let numero;
    let query = `UPDATE public.producto SET updated_at=$1, id_categoria=$2 WHERE id_producto=$3 RETURNING *;`;
    for (let i = 1; i <= a; i++) {
        numero = getRandomInt(1, a);
        let updated_at = moment().tz('America/Bogota').format();

        pool.query(query, [updated_at, numero, i], (error, results) => {
            if (error) {
                throw error;
            }
            console.log(results.rows[0]);
        });
    }
};

let rUsuario = (a) => {
    let numero1;
    let numero2;
    let query = `UPDATE public.usuario SET updated_at=$1, id_rol=$2, id_bodega=$3 WHERE id_usuario=$4 RETURNING *;`;
    for (let i = 1; i <= a; i++) {
        numero1 = getRandomInt(1, a);
        numero2 = getRandomInt(1, a);
        let updated_at = moment().tz('America/Bogota').format();

        pool.query(query, [updated_at, numero1, numero2, i], (error, results) => {
            if (error) {
                throw error;
            }
            console.log(results.rows[0]);
        });
    }
};

let gBP = (c, p, a) => {
    let query = 'INSERT INTO public.bodega_producto(id_producto, id_bodega, cantidad, estado, sector, ubicacion, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;';
    let query1 = 'SELECT COUNT(*) FROM bodega_producto as a WHERE a.id_producto=$1 and a.id_bodega=$2;';
    for (let i = 1; i <= c; i++) {
        let numero1 = getRandomInt(1, a);
        let numero2 = getRandomInt(1, a);
        let numero3 = getRandomInt(1, 500);
        let estado = getRandomInt(0, 1) ? true : false;
        let frase = generarPalabras(p);
        let updated_at = moment().tz('America/Bogota').format();
		let numerox = getRandomInt(1, 20);
		let frase2 = generarPalabras(1);

        pool.query(query1, [numero1, numero2], (error1, results1) => {
            if (error1) {
                throw error1;
            }
            if (results1.rows[0].count < 2) {
                pool.query(query, [numero1, numero2, numero3, estado, numerox, frase2, updated_at], (error, results) => {
                    if (error) {
                        throw error;
                    }
                    console.log(results.rows[0]);
                });
            } else {
                console.log('Repetido');
            }

        });

    }
};

let gRR = (c, p, a) => {
    let query = 'INSERT INTO public.rol_ruta(id_rol, id_ruta, updated_at) VALUES ($1, $2, $3) RETURNING *;';
    let query1 = 'SELECT COUNT(*) FROM rol_ruta as a WHERE a.id_rol=$1 and a.id_ruta=$2;';
    for (let i = 1; i <= c; i++) {
        let numero1 = getRandomInt(1, a);
        let numero2 = getRandomInt(1, a);
        let updated_at = moment().tz('America/Bogota').format();

        pool.query(query1, [numero1, numero2], (error1, results1) => {
            if (error1) {
                throw error1;
            }
            if (results1.rows[0].count == 0) {
                pool.query(query, [numero1, numero2, updated_at], (error, results) => {
                    if (error) {
                        throw error;
                    }
                    console.log(results.rows[0]);
                });
            } else {
                console.log('Repetido');
            }

        });

    }
};

let gPU = (c, p, a) => {
    let query = 'INSERT INTO public.producto_usuario(id_producto, id_usuario, notificacion, updated_at) VALUES ($1, $2, $3, $4) RETURNING *;';
    for (let i = 1; i <= c; i++) {
        let numero1 = getRandomInt(1, a);
        let numero2 = getRandomInt(1, a);
        let frase = generarPalabras(p);
        let updated_at = moment().tz('America/Bogota').format();


        pool.query(query, [numero1, numero2, frase, updated_at], (error, results) => {
            if (error) {
                throw error;
            }
            console.log(results.rows[0]);
        });


    }
};

module.exports = {
    gBodega,
    gCategoria,
    gProducto,
    gRol,
    gRuta,
    gUsuario,
    rProducto,
    rUsuario,
    gBP,
    gRR,
    gPU
};
