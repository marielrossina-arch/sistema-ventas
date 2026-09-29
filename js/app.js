// async function iniciar() {
// const { data, error } = await sup.from("Categoria").select();
// if (error) {
// console.error("Error al leer Categoria:", error);
// return;
// }
// console.log("Categoria encontrados:", data);
// }
// iniciar();

// const cuerpoTabla = document.querySelector("#cuerpo-categorias");


async function iniciar() {
    const cuerpoTabla = document.querySelector("#cuerpo-ventas");
    cuerpoTabla.innerHTML = '<tr><td colspan="3">Cargando ventas...</td></tr>';
    
    const { data, error } = await sup.from("ventas").select();
if (error) {
console.error("Error al leer ventas:", error);
return;
}

if (data.length === 0) {
    cuerpoTabla.innerHTML = '<tr><td colspan="3">Todavia no hay ventas registrados.</td></tr>';
    return;
}
const filas = data.map((ventas) => ``
<tr>
    <td>${ventas.nombre}</td>
    <td>${ventas.precio}</td>
    <td>${ventas.existencia}</td>
</tr>
`).join("");
}

iniciar();