// ================== ESTADO ==================
let categoriaCache = [];
let detalleCache = []; // filas de detalle_venta

// ================== UTILIDADES ==================
// Evita que un nombre o descripción con HTML se ejecute al pintarlo (XSS)
function escaparHTML(texto) {
  return String(texto ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Muestra montos siempre con 2 decimales (evita $0.30000000000000004)
function formatoMonto(valor) {
  return "$" + Number(valor).toFixed(2);
}

function totalCategoria(idCategoria) {
  return detalleCache
    .filter((d) => Number(d.id_categoria) === Number(idCategoria))
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
      .map(
        (c) =>
          `<option value="${c.id_categoria}">${escaparHTML(c.nombre)}</option>`,
      )
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
        <td>${escaparHTML(nombreCategoria(d.id_categoria))}</td>
        <td>${formatoMonto(d.subtotal)}</td>
        <td>${formatoMonto(totalCategoria(d.id_categoria))}</td>
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
        <td>${escaparHTML(c.nombre)}</td>
        <td>${escaparHTML(c.descripcion)}</td>
        <td>${formatoMonto(totalCategoria(c.id_categoria))}</td>
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
          <h3>${escaparHTML(c.nombre)}</h3>
          <p>${escaparHTML(c.descripcion)}</p>
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
    console.error("Error al cargar datos:", cat.error || det.error);
    document.querySelector("#mensaje-venta").textContent =
      "No se pudieron cargar los datos. Recarga la página.";
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

    // evita registrar la misma venta dos veces por doble clic
    const boton = event.target.querySelector("button[type=submit]");
    boton.disabled = true;
    try {
      const id_usuario = await obtenerIdUsuario();
      if (!id_usuario) {
        mensaje.textContent =
          "Tu cuenta no está registrada en la tabla usuario.";
        return;
      }

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
    } finally {
      boton.disabled = false;
    }
  });

// ================== EDITAR / ELIMINAR CATEGORÍAS ==================
document
  .querySelector("#cuerpo-categorias")
  .addEventListener("click", async (event) => {
    const id = Number(event.target.dataset.id);
    if (!id) return;

    if (event.target.classList.contains("btn-editar")) {
      const c = categoriaCache.find((c) => Number(c.id_categoria) === id);
      if (!c) return;
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
        } else {
          window.alert("No se pudo eliminar la categoría.");
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
    const nombre = document.querySelector("#editar-nombre").value.trim();
    const descripcion = document
      .querySelector("#editar-descripcion")
      .value.trim();

    if (!nombre) {
      window.alert("El nombre de la categoría no puede quedar vacío.");
      return;
    }

    const { error } = await sup
      .from("categoria")
      .update({ nombre, descripcion })
      .eq("id_categoria", id);

    if (error) {
      console.error("Error al actualizar categoría:", error);
      window.alert("No se pudo guardar la categoría.");
      return;
    }

    document.querySelector("#panel-edicion").style.display = "none";
    await cargarTodo();
  });

// ================== AUTENTICACIÓN ==================
// Comprueba que el usuario con sesión tenga rol de administrador
// en la tabla usuario (buscado por su correo).
async function esAdmin() {
  const {
    data: { user },
  } = await sup.auth.getUser();
  if (!user) return false;

  const { data, error } = await sup
    .from("usuario")
    .select("rol")
    .eq("correo_electronico", user.email)
    .maybeSingle();
  if (error) {
    console.error("Error al verificar rol:", error);
    return false;
  }
  return !!data && String(data.rol).trim().toLowerCase() === "administrador";
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
    // limpiar datos en memoria para que no queden a la vista del siguiente usuario
    categoriaCache = [];
    detalleCache = [];
    document.querySelector("#panel-edicion").style.display = "none";
    document.querySelector("#mensaje-venta").textContent = "";
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
    // sesión guardada de una cuenta sin permisos: cerrarla
    if (session) await sup.auth.signOut();
    mostrarLogin();
  }
}
iniciar();
