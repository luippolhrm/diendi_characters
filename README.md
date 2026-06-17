# Fichas de Personaje — Campaña D&D 2024

Portada con las fichas de personaje de la mesa, organizadas por jugador.
Sitio publicado con **GitHub Pages**.

---

## 📂 Estructura del repositorio

```
index.html          ← La portada. Lista a los jugadores y sus personajes.
lucho/              ← Carpeta de cada jugador (una por persona)
  usoryn.html
  darvin.html
  auriana.html
checho/
  <tu-personaje>.html
README.md           ← Este archivo
```

Cada jugador tiene **su propia carpeta** (en minúsculas, sin espacios ni tildes).
Dentro van las fichas, una por personaje, en formato `.html`.

---

## ➕ Cómo subir un personaje nuevo

1. Entra al repositorio en GitHub.
2. Abre **tu carpeta** (por ejemplo `checho/`). Si aún no existe, la creas en el paso 4 escribiendo `checho/` antes del nombre del archivo.
3. Clic en **"Add file" → "Upload files"**.
4. Arrastra tu archivo `.html`. Usa un nombre simple en minúsculas, sin espacios ni tildes:
   - ✅ `kaelen.html`, `mi-personaje.html`
   - ❌ `Mi Personaje.html`, `kaelén.html`
5. Abajo, clic en **"Commit changes"** para guardar.

> Si subes el archivo dentro de una carpeta que no existe todavía, GitHub la crea sola. Para eso, al subir, escribe el nombre de la carpeta y una barra antes del archivo en el campo de destino: `checho/kaelen.html`.

---

## 🔗 Cómo enlazar tu personaje en la portada

Para que tu personaje aparezca en la página de inicio, hay que añadir una tarjeta en `index.html`.

1. Abre `index.html` en GitHub y clic en el lápiz (✏️ "Edit").
2. Busca la sección de tu jugador (un bloque que empieza con `<!-- JUGADOR: Checho -->`).
3. Copia una tarjeta de personaje existente y pégala dentro, cambiando los datos:

```html
<a class="char" href="checho/kaelen.html">
  <span class="char-status ready">Ficha lista</span>
  <div class="char-name">Kaelen</div>
  <div class="char-sub">Elfo · Mago nivel 8</div>
  <div class="go">Abrir ficha →</div>
</a>
```

- `href` → la ruta a tu archivo (`carpeta/archivo.html`).
- `char-name` → nombre del personaje.
- `char-sub` → especie · clase y nivel.
- `char-status` → usa `ready` ("Ficha lista") o `pending` ("Ficha pendiente").

4. Clic en **"Commit changes"**.
5. Espera 1-2 minutos y recarga la portada: tu personaje ya aparece.

---

## ✏️ Cómo actualizar una ficha existente

1. Entra a la carpeta del jugador y abre el archivo.
2. **"Upload files"** y sube la versión nueva con el **mismo nombre** (la reemplaza).
3. **"Commit changes"**. En 1-2 minutos la web refleja el cambio.

---

## 🌐 La URL del sitio

La portada vive en la raíz del sitio:
`https://<usuario>.github.io/<repositorio>/`

Cada ficha es accesible directamente por su ruta:
`https://<usuario>.github.io/<repositorio>/lucho/usoryn.html`

**En el móvil:** abre la URL y usa "Añadir a pantalla de inicio" para tenerla como ícono de app.

---

## 📝 Notas

- Las fichas son archivos HTML autónomos: no dependen de nada externo salvo las fuentes (que cargan solas con internet).
- Mantén los nombres de archivo y carpeta en minúsculas y sin tildes para evitar problemas de enlaces.
- Si una ficha aún no existe, deja su tarjeta con estado `pending` y sin `href` (o apuntando a `#`).
