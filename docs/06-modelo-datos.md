# Guia 6 - Modelo de datos y la sección

## Entidades

- productos: lo que se vende (aparece ne CU-02, Cu-02, CU-03)
- clientes: quién compra, cuando aplica (mencionado en la entrevista, Guía 2).
- usuarios: queién registra cada venta (actor principal de CU-01)
- ventas: cada transacción registrada (CU-01)
- detalle_venta: aué productos y cantidades incluyó cada venta (relación N:N).

## Atributos

### productos

- id: identificador (clave primaria).
- nombre: texto
- precio: número decimal
- existencia: número entero

## clientes

- id: identificador (clave primaria)
- nombre: texto
- contacto: texto (opcional)

### usuarios

- id: identficiador (clave primaria)
- nombre: textos
- rol: texto (vendedor / administrador)

### ventas

- id: identificador (clave primaria)
- fecha: fecha / hora
- id_usuario: clave foranea -> usuario
- id\_ cliente: clave foranea -> clientes (opcional)
- total: número decimal

### detalle_venta

- id: identificador (clave primaria)
- id_venta: clave foránea -> ventas
- id\_ producto: clave foránea -> productos
- cantidad: número entero
- precio_unitario: número decimal

## Relaciones

- ventas.id_usuario -> usuarios.id (un usuario tiene muchas ventas)
- ventas.id_cliente -> clientes.id (un cliente tiene muchas ventas, opcional)
- detalle_venta.id_venta -> ventas.id (una ventas tiene muchas líneas de detalle)
- detalle_venta.id_producto -> producto.id (un producto aparece n muchas lineas de detalle)

## si don Ernesto pidiera, más adelante, saber qué productos compra más cada cliente ¿el modelo actual ya lo permite o haría falta algún cambio?

- Haría falta un cambio, crear una nueva relación entre cliente -> compra -> detalle_de_producto -> listado

### Mi Propio Caso de Uso guia 5

## CU-01 Registrar una venta

- Historia relacionada: HU-01
- Actor Principal: Administrador ( Don LUis Fernando)
- Precondición: existen productos registrados en el sistema.

### Fllujo Principal

> > 1.  El administrador abre la pantalla de registrar venta.
> > 2.  El administrador busca y selecciona uno o más productos.
> > 3.  El administrador indica la cantidad de cada producto.
> > 4.  El sistema calcula el total a cobrar.
> > 5.  El administrador confirma la venta.
> > 6.  El sistema guarda la venta .
> >
> > ### Flujos alternativos
> >
> > - 4a. El Sistema calcula el total a cobrar y registra fecha y hora.
> > - 6a. Si el vendedor cancela antes de confirmar, no se guarda ningún cambio.

- 7a. Producto personalizado, el cliente envía su diseño.
  > > ### Postcondición
  > >
  > > La venta queda regisrada y la lista de los productos vendidos se actualiza.

## mI PROPIO CASO DE USO GUIA 6 Artesano 3D

## Entidades

- ventas (pedido): cada transacción registrada (CU-01)
- categoria: que
- detalle_venta (detalle_pedido): un pedido incluya multiples productos o servicios (relación N:N).

## Atributos

## usuarios

- administrador (por el momento)
- email
- rol

## categoria que piden los clientes

- id_categoria: pk
- nombre: texto (joyeria, decoracion, personalizado, arquitectura)

### ventas (acumular datos de ventas en whatsapp)

- id_venta: identificador (clave primaria)
- id_usuario fk
- fecha_pedido: fecha / hora
- total: numerico

### detalle_venta

- id_detalle: identificador (clave primaria)
- id_venta: clave foránea -> ventas
- id_categoria: clavew foranea -> categoria
  - sub_total: numerico

## Relaciones

- ventas : id_cliente compra id_filamento
- ventas : id\_ cliente compra id_categoria
- detalle_venta : id_categoria se vende id_filamento
- detalle_venta : id_venta sub_total

### usuarios

- id_usuario: identficiador (clave primaria)
- nombre: textos
- rol: texto (vendedor / administrador)
- id_venta: fk
- id_cliente: fk

Note on your untracked files:
Earlier, you had an untracked file in diagramas/guia-5-casos-de-uso.png. If you want to include that file in your repository as well, run these commands before pushing:

PowerShell
git add .
git commit -m "Agrega diagrama de casos de uso"
git push -u origin main
