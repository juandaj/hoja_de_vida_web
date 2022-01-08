require('./src/config/config');
const express = require('express');
const fs = require('fs');
var http = require('http');
const https = require('https')
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

const app = express();

var privateKey = fs.readFileSync('./ssl/server.key', 'utf8');
var certificate = fs.readFileSync('./ssl/server.crt', 'utf8');

var credentials = { key: privateKey, cert: certificate };
// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'token, Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(fileUpload());

//categoria
app.use(require('./src/controller/categoria'));

//producto
app.use(require('./src/controller/producto'));

//bodega
app.use(require('./src/controller/bodega'));

//rol
app.use(require('./src/controller/rol'));

//ruta
app.use(require('./src/controller/ruta'));

//usuario
app.use(require('./src/controller/usuario'));

//bodega_producto
app.use(require('./src/controller/bodega_producto'));

//producto_usuario
app.use(require('./src/controller/producto_usuario'));

//rol_ruta
app.use(require('./src/controller/rol_ruta'));

//util
app.use(require('./src/controller/util'));

//transaccion_inv
app.use(require('./src/controller/transaccion_inv'));

//tipo_transaccion
app.use(require('./src/controller/tipo_transaccion'));

//concepto_de_pago
app.use(require('./src/controller/concepto_pago'));

//centro_costos
app.use(require('./src/controller/centro_costos'));

const expressSwagger = require('express-swagger-generator')(app);
let options = {
    swaggerDefinition: {
        info: {
            description: 'Documentacion c-deg-controller',
            title: 'C-DEG-CCONTROLLER',
            version: '1.0.0',
        },
        host: '0.0.0.0:4000',
		insecure: true,
		rejectUnauthorized: false,
        basePath: '/',
        produces: [
            "application/json"
        ],
        schemes: ['http'],
        securityDefinitions: {
            JWT: {
                type: 'apiKey',
                in: 'header',
                name: 'Authorization',
                description: "",
            }
        }
    },
    basedir: __dirname, //app absolute path
    files: ['./src/controller/*.js'] //Path to the API handle folder
};


expressSwagger(options);
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);
httpServer.listen(process.env.PORT, () => {
    console.log(`escuchando http en puerto ${process.env.PORT}`);
});
httpsServer.listen(process.env.PORTS, () => {	
    console.log(`escuchando https en puerto ${process.env.PORTS}`);
});


/*app.listen(process.env.PORT, () => {
    console.log(`escuchando puerto ${process.env.PORT}`);
});*/
