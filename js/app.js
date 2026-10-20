// ================== ESTADO ==================
let categoriaCache = [];
let ventasCache = [];

// ================== UTILIDADES ==================
function totalCategoria(idCategoria) {
  return ventasCache
    .filter((v) => Number(v.categoria) === Number(idCategoria))
    .reduce((suma, v) => suma + Number(v.precio), 0);
}

function nombreCategoria(idCategoria) {
  const c = categoriaCache.find((c) => Number(c.id) === Number(idCategoria));
  return c ? c.nombre : "—";
}

// ================== PINTAR ==================
function llenarSelect() {
  const select = document.querySelector("#campo-categoria");
  select.innerHTML =
    '<option value="">Elige una categoría</option>' +
    categoriaCache
      .map((c) => `<option value="${c.id}">${c.nombre}</option>`)
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
        <td>$${v.precio}</td>
        <td>$${totalCategoria(v.categoria)}</td>
      </tr>`,
    )
    .join("");
}

function pintarTablaCategorias() {
  const tbody = document.querySelector("#cuerpo-categorias");
  if (categoriaCache.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="4">Todavía no hay categorías registradas.</td></tr>';
    return;
  }
  tbody.innerHTML = categoriaCache
    .map(
      (c) => `
      <tr>
        <td>${c.nombre}</td>
        <td>$${c.precio}</td>
        <td>$${totalCategoria(c.id)}</td>
        <td>
          <button class="btn-editar" data-id="${c.id}">Editar</button>
          <button class="btn-eliminar" data-id="${c.id}">Eliminar</button>
        </td>
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
        <img src="${c.images_url || "placeholder.jpg"}" alt="${c.nombre}">
        <div class="tarjeta-info">
          <h3>${c.nombre}</h3>
          <p class="precio">$${c.precio}</p>
        </div>
      </article>`,
    )
    .join("");
}

// ================== CARGAR DATOS ==================
async function cargarTodo() {
  const [cat, ven] = await Promise.all([
    sup.from("Categoria").select("*").order("id"),
    sup.from("ventas").select("*"),
  ]);

  console.log("Categorias:", cat);
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

// ================== VENTAS ==================
// Al elegir categoría, se autocompleta el precio
document.querySelector("#campo-categoria").addEventListener("change", (e) => {
  const c = categoriaCache.find((c) => Number(c.id) === Number(e.target.value));
  if (c) document.querySelector("#campo-precio").value = c.precio;
});

// Registrar venta
document
  .querySelector("#form-venta")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const categoria = Number(document.querySelector("#campo-categoria").value);
    const precio = Number(document.querySelector("#campo-precio").value);
    const mensaje = document.querySelector("#mensaje-venta");

    if (!categoria) {
      mensaje.textContent = "Elige una categoría.";
      return;
    }

    const { error } = await sup.from("ventas").insert({ categoria, precio });

    if (error) {
      console.error("Error al insertar venta:", error);
      mensaje.textContent = "Error al registrar la venta.";
      return;
    }

    mensaje.textContent = "Venta registrada ✔";
    await cargarTodo();
  });

// ================== EDITAR / ELIMINAR CATEGORÍAS ==================
document
  .querySelector("#cuerpo-categorias")
  .addEventListener("click", async (event) => {
    const id = Number(event.target.dataset.id);
    if (!id) return;

    if (event.target.classList.contains("btn-editar")) {
      const c = categoriaCache.find((c) => c.id === id);
      document.querySelector("#editar-id").value = c.id;
      document.querySelector("#editar-nombre").value = c.nombre;
      document.querySelector("#editar-precio").value = c.precio;
      document.querySelector("#panel-edicion").style.display = "block";
      return;
    }

    if (event.target.classList.contains("btn-eliminar")) {
      const confirmado = window.confirm(
        "¿Estás seguro de eliminar esta categoría?",
      );
      if (!confirmado) return;

      const { error } = await sup.from("Categoria").delete().eq("id", id);
      if (error) {
        console.error("Error al eliminar categoría:", error);
        return;
      }
      await cargarTodo();
    }
  });

document
  .querySelector("#form-editar-categoria")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const id = Number(document.querySelector("#editar-id").value);
    const nombre = document.querySelector("#editar-nombre").value;
    const precio = Number(document.querySelector("#editar-precio").value);

    const { error } = await sup
      .from("Categoria")
      .update({ nombre, precio })
      .eq("id", id);

    if (error) {
      console.error("Error al actualizar categoría:", error);
      return;
    }

    document.querySelector("#panel-edicion").style.display = "none";
    await cargarTodo();
  });

// ================== AUTENTICACIÓN ==================
function mostrarApp() {
  document.querySelector("#seccion-login").style.display = "none";
  document.querySelector("#seccion-app").style.display = "block";
  cargarTodo();
}

function mostrarLogin() {
  document.querySelector("#seccion-login").style.display = "block";
  document.querySelector("#seccion-app").style.display = "none";
}

document
  .querySelector("#form-login")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.querySelector("#login-email").value;
    const password = document.querySelector("#login-password").value;

    const { error } = await sup.auth.signInWithPassword({ email, password });
    if (error) {
      console.error("Error al iniciar sesión:", error);
      document.querySelector("#mensaje-login").textContent =
        "Correo o contraseña incorrectos.";
      return;
    }

    document.querySelector("#mensaje-login").textContent = "";
    mostrarApp();
  });

document
  .querySelector("#btn-cerrar-sesion")
  .addEventListener("click", async () => {
    await sup.auth.signOut();
    mostrarLogin();
  });

// ================== INICIO ==================
async function iniciar() {
  const {
    data: { session },
  } = await sup.auth.getSession();

  if (session) {
    mostrarApp();
  } else {
    mostrarLogin();
  }
}

iniciar();
