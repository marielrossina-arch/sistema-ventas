// ================== ESTADO ==================
let categoriaCache = [];
let detalleCache = []; // filas de detalle_venta

// ================== UTILIDADES ==================
function totalCategoria(idCategoria) {
  return detalleCache
    .filter((d) => Number(d.id_categoria) == Number(idCategoria))
    .reduce((suma, d) => suma + Number(d.subtotal), 0);
}

function nombreCategoria(idCategoria) {
  const c = categoriaCache.find(
    (c) => Number(c.id_categoria) === Number(idCategoria),
  );
  return c ? c.nombre : "—";
}

async function obtenerIdUsuario() {
  const {
    data: { user },
  } = await sup.auth.getUser();
  if (!user) return null;

  const { data, error } = await sup
    .from("usuario")
    .select("id_usuario")
    .eq("correo_electronico", user.email)
    .maybeSingle();

  if (error) {
    console.error("Error al buscar usuario:", error);
    return null;
  }
  return data ? data.id_usuario : null;
}

// ================== PINTAR ==================
function llenarSelect() {
  const select = document.querySelector("#campo-categoria");
  select.innerHTML =
    '<option value="">Elige una categoría</option>' +
    categoriaCache
      .map((c) => `<option value="${c.id_categoria}">${c.nombre}</option>`)
      .join("");
}

function pintarTablaVentas() {
  const tbody = document.querySelector("#cuerpo-ventas");
  if (detalleCache.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="3">Todavía no hay ventas registradas.</td></tr>';
    return;
  }
  tbody.innerHTML = detalleCache
    .map(
      (d) => `
      <tr>
        <td>${nombreCategoria(d.id_categoria)}</td>
        <td>$${d.subtotal}</td>
        <td>$${totalCategoria(d.id_categoria)}</td>
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
        <td>${c.descripcion || ""}</td>
        <td>$${totalCategoria(c.id_categoria)}</td>
        <td>
          <button class="btn-editar" data-id="${c.id_categoria}">Editar</button>
          <button class="btn-eliminar" data-id="${c.id_categoria}">Eliminar</button>
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
        <div class="tarjeta-info">
          <h3>${c.nombre}</h3>
          <p>${c.descripcion || ""}</p>
        </div>
      </article>`,
    )
    .join("");
}

// ================== CARGAR DATOS ==================
async function cargarTodo() {
  const [cat, det] = await Promise.all([
    sup.from("categoria").select("*").order("id_categoria"),
    sup
      .from("detalle_venta")
      .select("*")
      .order("created_at", { ascending: false }),
  ]);

  if (cat.error || det.error) {
    console.error("Error:", cat.error || det.error);
    return;
  }

  categoriaCache = cat.data;
  detalleCache = det.data;

  llenarSelect();
  pintarTablaVentas();
  pintarTablaCategorias();
  pintarGaleria();
}

// ================== PESTAÑAS ==================
function activarPestana(nombre) {
  document.querySelectorAll(".pestana").forEach((boton) => {
    const activa = boton.dataset.tab === nombre;
    boton.classList.toggle("activa", activa);
    boton.setAttribute("aria-selected", activa);
  });

  document.querySelectorAll(".panel-pestana").forEach((panel) => {
    panel.hidden = panel.id !== "tab-" + nombre;
  });
}

document.querySelector("#menu-pestanas").addEventListener("click", (event) => {
  const boton = event.target.closest(".pestana");
  if (boton) activarPestana(boton.dataset.tab);
});

// ================== VENTAS ==================
document
  .querySelector("#form-venta")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const id_categoria = Number(
      document.querySelector("#campo-categoria").value,
    );
    const subtotal = Number(document.querySelector("#campo-precio").value);
    const mensaje = document.querySelector("#mensaje-venta");

    if (!id_categoria) {
      mensaje.textContent = "Elige una categoría.";
      return;
    }
    if (!(subtotal > 0)) {
      mensaje.textContent = "Ingresa un monto válido.";
      return;
    }

    const id_usuario = await obtenerIdUsuario();

    // 1) Cabecera de la venta
    const { data: venta, error: errVenta } = await sup
      .from("ventas")
      .insert({ total: subtotal, id_usuario })
      .select()
      .single();

    if (errVenta) {
      console.error("Error al insertar venta:", errVenta);
      mensaje.textContent = "Error al registrar la venta.";
      return;
    }

    // 2) Línea de detalle
    const { error: errDetalle } = await sup
      .from("detalle_venta")
      .insert({ id_venta: venta.id_venta, id_categoria, subtotal });

    if (errDetalle) {
      console.error("Error al insertar detalle:", errDetalle);
      // deshacer la cabecera para no dejar una venta vacía
      await sup.from("ventas").delete().eq("id_venta", venta.id_venta);
      mensaje.textContent = "Error al registrar la venta.";
      return;
    }

    mensaje.textContent = "Venta registrada ✔";
    event.target.reset();
    await cargarTodo();
  });

// ================== EDITAR / ELIMINAR CATEGORÍAS ==================
document
  .querySelector("#cuerpo-categorias")
  .addEventListener("click", async (event) => {
    const id = Number(event.target.dataset.id);
    if (!id) return;

    if (event.target.classList.contains("btn-editar")) {
      const c = categoriaCache.find((c) => c.id_categoria === id);
      document.querySelector("#editar-id").value = c.id_categoria;
      document.querySelector("#editar-nombre").value = c.nombre;
      document.querySelector("#editar-descripcion").value = c.descripcion || "";
      document.querySelector("#panel-edicion").style.display = "block";
      return;
    }

    if (event.target.classList.contains("btn-eliminar")) {
      const confirmado = window.confirm(
        "¿Estás seguro de eliminar esta categoría?",
      );
      if (!confirmado) return;

      const { error } = await sup
        .from("categoria")
        .delete()
        .eq("id_categoria", id);

      if (error) {
        console.error("Error al eliminar categoría:", error);
        if (error.code === "23503") {
          window.alert(
            "No se puede eliminar: la categoría tiene ventas registradas.",
          );
        }
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
    const descripcion = document.querySelector("#editar-descripcion").value;

    const { error } = await sup
      .from("categoria")
      .update({ nombre, descripcion })
      .eq("id_categoria", id);

    if (error) {
      console.error("Error al actualizar categoría:", error);
      return;
    }

    document.querySelector("#panel-edicion").style.display = "none";
    await cargarTodo();
  });

// ================== AUTENTICACIÓN ==================
async function esAdmin() {
  const { data, error } = await sup
    .from("admins")
    .select("user_id")
    .maybeSingle();
  return !error && !!data;
}

function mostrarApp() {
  document.querySelector("#seccion-login").style.display = "none";
  document.querySelector("#seccion-app").style.display = "block";
  activarPestana("ventas"); // siempre abre en la primera pestaña
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
        "Error: " + error.message;
      return;
    }
    if (!(await esAdmin())) {
      await sup.auth.signOut();
      document.querySelector("#mensaje-login").textContent =
        "Esta cuenta no tiene permisos de administrador.";
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
  if (session && (await esAdmin())) {
    mostrarApp();
  } else {
    mostrarLogin();
  }
}
iniciar();
