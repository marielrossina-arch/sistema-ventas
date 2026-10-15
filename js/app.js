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
let categoriaCache = [];
let ventasCache = [];

// Suma de precios vendidos de una categoría
function totalCategoria(idCategoria) {
  return ventasCache
    .filter((v) => Number(v.categoria) === Number(idCategoria))
    .reduce((suma, v) => suma + Number(v.precio_item), 0);
}

function nombreCategoria(idCategoria) {
  const c = categoriaCache.find((c) => Number(c.id) === Number(idCategoria));
  return c ? c.categoria : "—";
}

// ===== AQUÍ SE LLENA EL SELECTOR =====
function llenarSelect() {
  const select = document.querySelector("#campo-categoria");
  select.innerHTML =
    '<option value="">Elige una categoría</option>' +
    categoriaCache
      .map((c) => `<option value="${c.id}">${c.categoria}</option>`)
      .join("");
}

function pintarTablaVentas() {
  const tbody = document.querySelector("#cuerpo-ventas");
  if (ventasCache.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="3">Todavía no hay ventas registradas.</td></tr>';
    return;
  }
  tbody.innerHTML = ventasCache
    .map(
      (v) => `
      <tr>
        <td>${nombreCategoria(v.categoria)}</td>
        <td>$${v.precio_item}</td>
        <td>$${totalCategoria(v.categoria)}</td>
      </tr>`,
    )
    .join("");
}

function pintarTablaCategorias() {
  const tbody = document.querySelector("#cuerpo-categorias");
  if (categoriaCache.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="3">Todavía no hay categorías registradas.</td></tr>';
    return;
  }
  tbody.innerHTML = categoriaCache
    .map(
      (c) => `
      <tr>
        <td>${c.categoria}</td>
        <td>$${c.precio_item}</td>
        <td>$${totalCategoria(c.id)}</td>
      </tr>`,
    )
    .join("");
}

function pintarGaleria() {
  const galeria = document.querySelector("#galeria");
  galeria.innerHTML = categoriaCache
    .map(
      (c) => `
      <article class="tarjeta">
        <img src="${c.imaes_url || "placeholder.jpg"}" alt="${c.categoria}">
        <div class="tarjeta-info">
          <h3>${c.categoria}</h3>
          <p class="precio">$${c.precio_item}</p>
        </div>
      </article>`,
    )
    .join("");
}

async function cargarTodo() {
  const [cat, ven] = await Promise.all([
    sup.from("Categoria").select("*"),
    sup.from("ventas").select("*"),
  ]);

  console.log("Categorias:", cat); // mira esto en la consola
  console.log("Ventas:", ven);

  if (cat.error || ven.error) {
    console.error("Error:", cat.error || ven.error);
    return;
  }

  categoriaCache = cat.data;
  ventasCache = ven.data;

  llenarSelect();
  pintarTablaVentas();
  pintarTablaCategorias();
  pintarGaleria();
}

cargarTodo();

// Al elegir categoría, se autocompleta el precio
document.querySelector("#campo-categoria").addEventListener("change", (e) => {
  const c = categoriaCache.find((c) => Number(c.id) === Number(e.target.value));
  if (c) document.querySelector("#campo-precio_item").value = c.precio_item;
});

// Registrar venta
document
  .querySelector("#form-venta")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const categoria = Number(document.querySelector("#campo-categoria").value);
    const precio_item = Number(
      document.querySelector("#campo-precio_item").value,
    );
    const mensaje = document.querySelector("#mensaje-venta");

    if (!categoria) {
      mensaje.textContent = "Elige una categoría.";
      return;
    }

    const { error } = await sup
      .from("ventas")
      .insert({ categoria, precio_item });

    if (error) {
      console.error("Error al insertar venta:", error);
      mensaje.textContent = "Error al registrar la venta.";
      return;
    }

    mensaje.textContent = "Venta registrada ✔";
    cargarTodo();
  });

if (errorDetalle) {
  console.error("Error al leer detalle:", errorDetalle);
  return;
}

document.querySelector("#mensaje-venta").textContent = "Venta registrada ✔";
document.querySelector("#form-venta").reset();
cargarTodo();
