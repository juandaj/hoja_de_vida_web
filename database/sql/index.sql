-- INDEX EN TABLA PRODUCTO
CREATE INDEX IF NOT EXISTS idx_codigo ON producto (codigo);
CREATE INDEX IF NOT EXISTS idx_producto ON producto (producto);
CREATE INDEX IF NOT EXISTS idx_descripcion ON producto (descripcion);

-- INDEX EN TABLA BODEGA
CREATE INDEX IF NOT EXISTS idx_bodega ON bodega (bodega);
CREATE INDEX IF NOT EXISTS idx_descripcionbode ON bodega (descripcion);

-- INDEX EN TABLA USUARIO
CREATE INDEX IF NOT EXISTS idx_nombre ON usuario (nombre);
CREATE INDEX IF NOT EXISTS idx_correo ON usuario (correo);

-- INDEX EN TABLA TRANSACCIONES
CREATE INDEX IF NOT EXISTS idx_idtipotrans ON transaccion_inv (id_tipo_transaccion);
CREATE INDEX IF NOT EXISTS idx_idbodega ON transaccion_inv (id_bodega);
CREATE INDEX IF NOT EXISTS idx_idcentrocostos ON transaccion_inv (id_centro_costos);
CREATE INDEX IF NOT EXISTS idx_idproducto ON transaccion_inv (id_producto);