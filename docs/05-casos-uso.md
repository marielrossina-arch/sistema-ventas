# Guía - Casos de uso y copa este primer caso de uso, ya completo, como referencia: 
## CU-01 Registrar una venta
- Historia relacionada: HU-01
- Actor Principal: Vendedor (Marta, Luis o Don Ernesto)
- Precondición: existen productos registrados en el sistema. 

### Fllujo Principal
1. El vendedor abre la pantalla de registrar venta.
2. El vendedor busca y selecciona uno o más productos. 
3. El vendedor indica la cantidad de cada producto. 
4. El sistema calcula el total a cobrar. 
5. El vendedor confirma la venta. 
6. El sistema guarda la venta y actualiza la existencia disponible. 

### Flujos alternativos 
- 3a. Si la cantidad pedida supera la existencia disponible, 
el sistema avisa y no permite continuar con esa coantidad. 
- 5a. Si el vendedor cancela antes de confirmar, no se guarda ningún cambio. 

### Postcondición
La venta queda regisrada y la exitencia de los productos vendidos se actualiza. 


### Mi Propio Caso de Uso

## CU-01 Registrar una venta
- Historia relacionada: HU-01
- Actor Principal: Administrador ( Don LUis Fernando)
- Precondición: existen productos registrados en el sistema. 

 ### Fllujo Principal
>> 1. El administrador abre la pantalla de registrar venta.
>> 2. El administrador busca y selecciona uno o más productos. 
>> 3. El administrador indica la cantidad de cada producto. 
>> 4. El sistema calcula el total a cobrar. 
>> 5. El administrador confirma la venta. 
>> 6. El sistema guarda la venta .
>> 
>> ### Flujos alternativos 
>> - 4a. El Sistema calcula el total a cobrar y registra fecha y hora. 
>> - 6a. Si el vendedor cancela antes de confirmar, no se guarda ningún cambio. 
- 7a. Producto personalizado, el cliente envía su diseño. 
>> 
>> ### Postcondición
>> La venta queda regisrada y la lista de los productos vendidos se actualiza.
