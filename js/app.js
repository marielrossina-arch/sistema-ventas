async function iniciar() {
const { data, error } = await sup.from("Categoria").select();
if (error) {
console.error("Error al leer Categoria:", error);
return;
}
console.log("Categoria encontrados:", data);
}
iniciar();