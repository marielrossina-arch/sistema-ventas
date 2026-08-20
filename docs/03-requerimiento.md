## Requerimientos funcionales
- RF-01 : El sistema debe permitir registrar una venta indicando productos y cantidades.
- RF-02 : El sistema debe permitir consultar la existencia disponible de un producto. 
- RF-03 : El sistema debe permitir registrar nuevos productos con nobre, precio y existencia. 
- RF-04 : El sistema debe permitir consultar el total vendido en un periodo. 
- RF-05 : El sistema debe permitir a Don Ernesto ver un resumen de ventas desde el celular. 
- RF-06 : El sistema debe mostrar cuando un producto tiene existencia baja. 
## Requerimientos no funcionales
- RNF-01 : (Usabilidad): Cualquier vendedor debe poder registrar una venta sin capacitaacióngit push
 extensa. 
- RNF-02 : (Disponibilidad): El sistema debe funcionar en cualquier navegador moderno, sin instalar nada. 
- RNF-03 (Seguridad) : solo Don Ernesto y sus empleados deben poder acceder al sistema. 
- RNF-04 (Compatibilidad) : el sistema debe verse y funcioar bien tanto en computadora como en celular. 
## Restricciones 
- Debe construirse únicamente con HTML, CSS, JavaScript y Supabase.
- Debe usarse el plan gratuito de Supabase (sin presupuesto para servicios  pagos- )
- Debe funcionar en el navegador, sin instalar aplicaciones adicionales. 

## Priorización (MoSCoW)

|Categoria             | Requerimiento / Temas              | 
|----------------------|------------------------------------|
|Debe tener (Must)     |RF-01, RF-02, RF-03, RF-04          |
|Debería tener (Should)| RF-05, RF-06|                      |
|Podría tener (Could)  | -                                  |
|No por ahora (Won´t)  |Manejo de ventas fiadas / a crédito |

## Historias de usuario 
- HU-01: Como vendedor, quiero registrar una venta con productos y cantidades, para no tener que anotarla a mano en el cuadero. 
- HU-02: Como vendedor, quiero consultar la existencia de un producto antes de venderlo, para no ofrecer algo que ya no hay.
- HU-03: Como administrador , quiero registrar productos nuevos con precio y existencia, para mantener actualizado el inventario. 
- HU-04: Como administrador, quiero ver el total vendido en un periodo, para saber cómo va el negocio sin sumar a mano. 
- HU-05: Como administrador, quiero ver un resumen de ventas desde mi celular, para revisarlo, aunque no esté en la ferretería. 

## Criterios de aceptación
### HU-01 
    - Se pueden elegir uno o más productos y sus cantidades.
    - El sistema calcula el total a cobrar automáticamente.
    - La venta queda guardada y se puede consultar después. 
    - La existencia de los productos vendidos se actualiza automáticamente. 
### HU-02
    - Se puede buscar un producto por su nombre. 
    - El sistema muestra la cantidad dsponible del producto. 
    - Si no hay exitencia, el sistema indica que el producto está agotado. 
### HU-03
    Se puede ingresarel nombre, precio y existencia inicial del producto .
    - El nombre del producto es obligatorio. 
    - El precio debe ser un número mayor que cero. 
    - Al guardar, el producto aparece en el inventario. 
### HU-04
    - Se puede seleccionar una fecha inicial y una fecha final. 
    - El sistema muestra las ventas realizadas en ese periiodo. 
    - El sistema calcula automáticamente el total vendido. 
    - El total corresponde a las ventas registradas en las fechas seleccionadas. 
### HU-05 
    - El administrador puede ingresar al sistema desde el navegador de un celular. 
    - El sistema muestra un resumen de las vntas registradas. 
    - La información se adapta correctamente a la pantalla del celular. 
    - Solo un usuario  autorizado puede consultar el resumen. 

## Trazabilidad
- HU-01 -> RF-01
- HU-02 -> RF-02
- HU-03 -> RF-03
- HU-04 -> RF-04
- HU-05 -> RF-05

## Backlog ordenado
1. HU-01  (RF-01 - Debe tener )
2. HU-02  (RF-02 - Debe tener )
3. HU-03  (RF-03 - Debe tener )
4. HU-04  (RF-04 - Debe tener )
5. HU-05  (RF-05 - Debería tener )



### Mi Propia Historia de Caso

## Requerimientos funcionales
- RF-01 : El sistema debe permitir registrar una venta indicando productos y cantidades.
- RF-02 :  El sistema debe permitir registrar nuevos productos con nombre, precio.
- RF-03 :  El sistema debe permitir consultar el total vendido en un periodo.
- RF-04 :  El sistema debe permitir a Don Ernesto ver un resumen de ventas desde el celular.

## Requerimientos no funcionales
- RNF-01 : (Disponibilidad): El sistema debe funcionar en cualquier navegador moderno, sin instalar nada.
- RNF-02 :  (Seguridad) : solo Don Ernesto  deben poder acceder al sistema.
- RNF-03  : (Compatibilidad) : el sistema debe verse y funcioar bien tanto en computadora como en celular.

## Restricciones 
- Debe construirse únicamente con HTML, CSS, JavaScript y Supabase.
- Debe usarse el plan gratuito de Supabase (sin presupuesto para servicios  pagos- )
- Debe funcionar en el navegador, sin instalar aplicaciones adicionales. 

## Priorización (MoSCoW)

|Categoria             | Requerimiento / Temas              | 
|----------------------|------------------------------------|
|Debe tener (Must)     |RF-01, RF-02, RF-03,           |
|Debería tener (Should)|RF-04                      |
|Podría tener (Could)  | -                                  |
|No por ahora (Won´t)  |Manejo de ventas fiadas / a crédito |

## Historias de usuario 
- HU-01: Como vendedor, quiero registrar una venta con productos y cantidades, para no tener que anotarla a mano en el cuadero. 
- HU-02: Como administrador, quiero ver el total vendido en un periodo, para saber cómo va el negocio sin sumar a mano. 
- HU-03:  Como administrador, quiero ver un resumen de ventas desde mi celular, para revisarlo, aunque no esté en la pc. 
 
## Criterios de aceptación
### HU-01 
    - Se pueden elegir uno o más productos y sus cantidades.
    - El sistema calcula el total a cobrar automáticamente.
    - La venta queda guardada y se puede consultar después. 
    - La existencia de los productos vendidos se actualiza automáticamente. 
### HU-02
    - Se puede seleccionar una fecha inicial y una fecha final. 
    - El sistema muestra las ventas realizadas en ese periiodo. 
    - El sistema calcula automáticamente el total vendido. 
    - El total corresponde a las ventas registradas en las fechas seleccionadas. 
### HU-03
     - El administrador puede ingresar al sistema desde el navegador de un celular. 
    - El sistema muestra un resumen de las vntas registradas. 
    - La información se adapta correctamente a la pantalla del celular. 
    - Solo un usuario  autorizado puede consultar el resumen.
     
## Trazabilidad
- HU-01 -> RF-01
- HU-02 -> RF-02
- HU-03 -> RF-03


## Backlog ordenado
1. HU-01  (RF-01 - Debe tener )
2. HU-02  (RF-02 - Debe tener )
3. HU-03  (RF-03 - Debería tener )
