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

  const { data, error } = await sup.from("ventas").select("*");

  if (error) {
    console.error("Error al leer ventas:", error);
    cuerpoTabla.innerHTML =
      '<tr><td colspan="3">Error al cargar las ventas.</td></tr>';
    return;
  }

  if (data.length === 0) {
    cuerpoTabla.innerHTML =
      '<tr><td colspan="3">Todavía no hay ventas registradas.</td></tr>';
    return;
  }

  cuerpoTabla.innerHTML = data
    .map(
      (venta) => `
        <tr>
          <td>${venta.categoria}</td>
          <td>${venta.precio_item}</td>
          <td>${venta.id_venta}</td>
        </tr>
      `)
    .join("");

  llenarSelectVentas(data);
}

iniciar();

document
  .querySelector("#form-venta")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const categoria = Number(document.querySelector("#campo-categoria").value);
    const precio_item = Number(document.querySelector("#campo-precio_item").value);
    const id_venta = Number(document.querySelector("#campo-id_venta").value);

    const { data: venta, error: errorVenta } = await sup
      .from("ventas")
      .insert({ categoria: categoria, precio_item: precio_item + precio_item  })
      .select()
      .single();

      if (errorVenta) {
        console.error("Error al insertar venta:", errorVenta);
        return;
      }

    const {error: errorDetalle} = await sup
.from("detalle_venta")
.insert({
  id_venta: venta.id,
  id_categoria: categoria,
  precio_item: precio_item + precio_item,
  if (errorDetalle) {
    console.error("Error al insertar detalle:", errorDetalle);
    return;
  }

  

});

  

  function pintarGaleria(categoria) {
  const galeria = document.querySelector("#galeria");
  galeria.innerHTML = categoria
    .map(
      (categoria) => `
        <article class="tarjeta">
          <img
            src="${categoria.images_url || "placeholder.jpg"}"
            alt="${categoria.nombre}"
          >
          <div class="tarjeta-info">
            <h3>${categoria.nombre}</h3>
            <p class="precio">$${categoria.precio_item}</p>
          </div>
        </article>
      `
    )
    .join("");
}
pintarGaleria(data); 


