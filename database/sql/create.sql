create table if not exists categoria(
	id_categoria serial primary key,
	categoria text not null,
	descripcion text not null,
	updated_at timestamp default now()
);

create table if not exists producto(
	id_producto bigserial primary key not null,
	codigo text not null unique,
	producto text not null unique,
	descripcion text not null,
	preciov float8,
	precioc float8,
	datasheet text,
	updated_at timestamp default now(),
	id_categoria int references categoria(id_categoria) on delete set null
);

create table if not exists bodega(
	id_bodega serial primary key not null,
	bodega text not null unique,
	descripcion text not null,
	updated_at timestamp default now()
);

create table if not exists rol(
	id_rol serial primary key not null,
	rol text not null unique,
	descripcion text not null,
	can_delete boolean not null default false,
	can_update boolean not null default false,
	can_create boolean not null default false,
	can_delete_user boolean not null default false,
	can_update_user boolean not null default false,
	can_create_user boolean not null default false,
	can_delete_himself boolean not null default false,
	can_assign_rol boolean not null default false,
	can_change_correo boolean not null default false,
	updated_at timestamp default now()
);

create table if not exists ruta(
	id_ruta bigserial primary key not null,
	ruta text not null unique,
	descripcion text
);

create table if not exists usuario(
	id_usuario bigserial primary key not null,
	nombre text not null,
	correo text not null unique,
	contrasena text not null,
	updated_at timestamp default now(),
	id_rol int references rol(id_rol) on delete set null,
	id_bodega int references bodega(id_bodega) on delete set null
);

create table if not exists rol_ruta(
	id_rol_ruta bigserial primary key not null,
	id_rol int references rol(id_rol) on delete cascade,
	id_ruta bigint references ruta(id_ruta) on delete cascade,
	updated_at timestamp default now()
);

create table if not exists bodega_producto(
	id_bodega_producto bigserial primary key not null,
	id_producto bigint references producto(id_producto) on delete cascade,
	id_bodega int references bodega(id_bodega) on delete cascade,
	cantidad int not null default 0,
	minstock int not null default 0,
	estado boolean not null default false,
	sector int not null default 0,
	ubicacion text not null,
	updated_at timestamp default now()
);

create table if not exists producto_usuario(
	id_producto_usuario bigserial primary key not null,
	id_bodega_producto bigint references bodega_producto(id_bodega_producto) on delete cascade,
	id_usuario bigint default 1 references usuario(id_usuario) on delete set default,	
	notificacion text not null,
	updated_at timestamp default now()
);




INSERT INTO public.bodega( id_bodega, bodega, descripcion)
VALUES( 1, 'Guarne1','Bodega sede principal' );

INSERT INTO public.rol(
	rol, descripcion, can_delete, can_update, can_create, can_delete_user, can_update_user, can_create_user, can_delete_himself, can_assign_rol, can_change_correo)
	VALUES ('Administrador', 'Rol encargador de controlar todas la funciones de la app.', true, true, true, true, true, true, true, true, true),('Operario', 'Rol encargador de gestionar información de los productos.', true, true, true, false, false, false, false, false, false),('Cliente', 'Cuenta por la cual los clientes sólo pueden acceder a precios de productos en la app.', false, false, false, false, false, false, false, false, false);


INSERT INTO public.usuario(
	nombre, correo, contrasena, id_rol, id_bodega)
	VALUES ('Undefined', 'Undefined', md5('Undefined0987654321Undefined123456789Undefined'), null, null),('c-deg', 'c-deg@c-deg.com', md5('Cdeg123456'), 1, 1);

INSERT INTO public.categoria( categoria, descripcion)	
VALUES('Administrativo','A'),('Administrativo','B'),('Administrativo','C'),('Agua','A'),('Agua','B'),('Agua','C'),('Biogas','A'),('Biogas','B'),('Biogas','C'),('Digestores','A'),('Digestores','B'),('Digestores','C');


INSERT INTO public.ruta( ruta, descripcion)
VALUES('/post-item','Gestion productos'),('/bodes','Gestion bodegas'),('/add_user','Gestion usuarios'),('/edit_item/:id','Edición productos'),('/bode/:id','Información bodegas'),('/bodega_producto/:idx/:idy','Comentarios');


INSERT INTO public.rol_ruta( id_rol, id_ruta)
VALUES( 1, 1 ),( 1, 2 ),( 1, 3 ),( 1, 4 ),( 1, 5 ),( 1, 6),( 2, 1 ),( 2, 2 ),( 2, 4 ),( 2, 5 ),( 2, 6);




