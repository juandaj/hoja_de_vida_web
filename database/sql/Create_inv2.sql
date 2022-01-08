
create table if not exists tipo_transaccion(
	id_tipo_transaccion bigserial primary key,
	transaccion bigint not null,
    codigo_concepto varchar(5) not null,
    definicion varchar(100) not null,
    updated_at timestamp default now()

);

create table if not exists concepto_pago(
	id_concepto_pago bigserial primary key,
	concepto_pago varchar(5) not null,
    definicion_cp varchar(100) not null,
    updated_at timestamp default now()
);

create table if not exists centro_costos(
	id_centro_costos bigserial primary key,
	ccostos varchar(20) not null,
    nombre_ccostos varchar(100) not null,
    updated_at timestamp default now()
);

create table if not exists transaccion_inv(
	id_transaccion_inv bigserial primary key,
	fecha date,
    cliente varchar(20),
    cantidad bigint,
    documento_destino varchar(20),
    numero_documento varchar(20),
    referencia_destino varchar(50),
    total_descuento varchar (5),
    iva varchar(20),
    id_bodega_destino int,
    updated_at timestamp default now(),

    --FK
    id_producto bigint references producto(id_producto) on delete cascade,
    id_bodega_producto bigint references bodega_producto(id_bodega_producto) on delete cascade,
    id_bodega bigint references bodega(id_bodega) on delete cascade,
    id_tipo_transaccion bigint references tipo_transaccion(id_tipo_transaccion) on delete cascade,
    id_concepto_pago bigint references concepto_pago(id_concepto_pago) on delete cascade,
    id_centro_costos bigint references centro_costos(id_centro_costos) on delete cascade
);

INSERT INTO tipo_transaccion(id_tipo_transaccion, transaccion, codigo_concepto, definicion)	
VALUES
(1, 16, '001', 'OTRAS ENTRADAS'),
(2, 16, '002', 'ENTRADAS PRODUCCION'),
(3, 16, '003', 'ENTRADAS AJUSTES INVENTARIOS'),
(4, 17, '001', 'OTRAS SALIDAS'), 
(5, 17, '002', 'CONSUMOS'), 
(6, 17, '003', 'SALIDA AJUSTE INVENTARIO'),
(7, 10, '001', 'COMPRAS PROVEEDORES NACIONALES'),
(8, 10, '002', 'COMPRAS DEL EXTERIOR'), 
(9, 10, 'DOL', 'COMPRAS DOLARES'), 
(10, 10, 'EUR', 'COMPRAS EUR'),
(11, 11, '001', 'NOTA DEBITO COMPRAS PROVEEDORES'),
(12, 11, '002', 'GASTOS IMPORTACION (+COSTO)'), 
(13, 11, 'DOL', 'GASTOS IMPORTACION DOLARES (+COSTO)'),
(14, 15, '001', 'TRASLADOS ENTRE BODEGAS'),
(15, 12, '1', 'NC COMPRAS PROVEEDORES');




INSERT INTO concepto_pago(id_concepto_pago, concepto_pago, definicion_cp)	
VALUES (1, '001', 'Pagos causados');



INSERT INTO centro_costos(id_centro_costos, ccostos, nombre_ccostos)	
VALUES
(1, '01', 'ADMINISTRACION'),
(2, '0101', 'ADMINISTRACION'),
(3, '010101', 'ADMINISTRACION'),
(4, '02', 'TRATAMIENDO DE LIXIVIADOS'),
(5, '0200', 'TRATAMIENTO DE LIXIVIADOS'),
(6, '020002', 'C-DEG 09'),
(7, '020003', 'C-DEG 10'),
(8, '020004', 'C-DEG 16'),
(9, '020005', 'C-DEG 14'),
(10, '020006', 'C-DEG 17'),
(11, '020007', 'C-DEG 18'),
(12, '020008', 'C-DEG 12'),
(13, '020009', 'C-DEG 10'),
(14, '020010', 'DOÑA JUANA'),
(15, '020011', 'INHABILIDATO 0&M'),
(16, '020012', 'INVESTIGACION TTO AGUA'),
(17, '03', 'NUEVOS NEGOCIOS'),
(18, '0300', 'NUEVOS NEGOCIOS'),
(19, '030001', 'OTROS PROYECTOS'),
(20, '030002', 'OKOBIT-C-DEG'),
(21, '030003', 'DOÑA JUANA'),
(22, '030004', 'NUEVOS PROYECTOS'),
(23, '040001', 'INHABILITADO'),
(24, '040002', 'INHABILITADO'),
(25, '040003', 'INHABILITADO'),
(26, '040004', 'INHABILITADO'),
(27, '040005', 'INHABILITADO'),
(28, '040006', 'INHABILITADO'),
(29, '040007', 'INHABILITADO'),
(30, '040008', 'INHABILITADO'),
(31, '05', 'O$M TRATAMIENTO DE LIXIVIADOS'),
(32, '05OO', 'O$M TRATAMIENTO DE LIXIVIADOS'),
(33, '050001', 'O$M TRATAMIENTO DE LIXIVIADOS'),
(34, '050002', 'SEG SOCIAL FALKO'),
(35, '06', 'VENTAS'),
(36, '0600', 'VENTAS'),
(37, '060001', 'TRATAMIENTO DE LIXIVIADOS'),
(38, '060002', 'BIOGAS'),
(39, '060003', 'TRATAMIENTO DE AGUAS'),
(40, '060004', 'TEAS'),
(41, '07', 'CONSORCIO Y UNIONES TEMPOR'),
(42, '0700', 'CONSORCIO Y UNIONES TEMPOR'),
(43, '070001', 'CONSORCIO LIXIVIADOS');