# Fichas de Personaje — D&D 2024

Sitio personal de Lucho para su mesa de D&D 2024, publicado con **GitHub Pages**. Portada con las fichas de sus personajes y una página de referencia rápida de reglas.

---

## 📂 Estructura del repositorio

```
index.html          ← La portada. Enlaza a cada personaje y a las reglas rápidas.
reglas.html          ← Consulta rápida de reglas PHB 2024 (estados, combate, conjuros, equipo…)
lucho/                ← Carpeta con un archivo .html por personaje
  usoryn.html
  darvin.html
  auriana.html
  kiyaj.html
  yevelda.html
README.md            ← Este archivo
```

Todas las fichas viven en `lucho/`, un archivo por personaje.

`reglas.html` vive en la raíz, junto a `index.html` — **no** dentro de `lucho/`, porque todas las fichas la enlazan como `../reglas.html`.

---

## ➕ Cómo subir un personaje nuevo

1. Entra al repositorio en GitHub.
2. Abre la carpeta `lucho/`.
3. Clic en **"Add file" → "Upload files"**.
4. Arrastra tu archivo `.html`. Usa un nombre simple en minúsculas, sin espacios ni tildes:
   - ✅ `kaelen.html`, `mi-personaje.html`
   - ❌ `Mi Personaje.html`, `kaelén.html`
5. Abajo, clic en **"Commit changes"** para guardar.

---

## 🔗 Cómo enlazar tu personaje en la portada

La portada (`index.html`) muestra a los personajes como una grilla de tarjetas, no como una lista por jugador. Cada tarjeta es un enlace `<a>` con un medallón de color, el nombre y una línea de especie/clase — no hay estados de "pendiente" ni nombre de campaña: una ficha solo se agrega a la portada cuando ya está lista.

1. Abre `index.html` en GitHub y clic en el lápiz (✏️ "Edit").
2. Busca el bloque `<div class="chars">` bajo "Elige tu personaje".
3. Copia una tarjeta existente completa y pégala debajo, cambiando los datos:

```html
<a class="char kaelen" href="lucho/kaelen.html">
  <span class="medal">K</span>
  <span class="info">
    <span class="cn">Kaelen</span>
    <span class="meta"><b>Elfo</b> · Mago 8</span>
  </span>
  <span class="arrow">&rarr;</span>
</a>
```

- `class="char kaelen"` y `href` → la clase debe ser un identificador único (nombre del personaje, en minúsculas) y coincidir con la ruta real del archivo.
- `<span class="medal">K</span>` → la inicial del personaje.
- `cn` → nombre del personaje.
- `meta` → especie · clase y nivel (formato libre, corto).

4. La tarjeta necesita además un color propio para el medallón. Dentro de `<style>`, busca el bloque `:root{...}` y agrega una línea con tu color junto a las demás (por ejemplo `--kaelen:#4A6FA5;`), y en el bloque de reglas `.char.NOMBRE .medal{background:var(--NOMBRE)}` agrega la tuya: `.char.kaelen .medal{background:var(--kaelen)}`.
   - Si esto no te hace sentido o preferís no tocar el CSS a mano, pídele a Lucho (o a Claude) que te arme el snippet completo — es un cambio de dos líneas, pero hay que acertarle a la sintaxis.
5. Clic en **"Commit changes"**.

---

## 📖 Reglas rápidas (`reglas.html`)

Página de consulta de mesa con las reglas del PHB 2024: estados, acciones, descansos, combate, daño y curación, exploración, conjuros y equipo (propiedades y maestrías de armas, armaduras, sintonización). Cada término tiene su propia ancla (`reglas.html#derribado`, `reglas.html#concentracion`, etc.).

Las fichas de personaje enlazan a esos términos en vez de repetir la definición completa — por ejemplo, en vez de explicar qué es el estado Derribado dentro de la ficha de cada personaje, el nombre "Derribado" es un link a `../reglas.html#derribado`. Si tu ficha nueva menciona un estado, una acción o una regla que ya está en `reglas.html`, enlázala igual en vez de reexplicarla — así el sitio no repite el mismo texto en cinco lugares distintos.

Si el término que necesitas no existe todavía en `reglas.html`, agrégalo primero (o pídeselo a Claude) antes de enlazarlo.

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

Las reglas rápidas:
`https://<usuario>.github.io/<repositorio>/reglas.html`

**En el móvil:** abre la URL y usa "Añadir a pantalla de inicio" para tenerla como ícono de app.

---

## 📝 Notas

- Las fichas son archivos HTML autónomos: no dependen de nada externo salvo las fuentes (que cargan solas con internet).
- Mantén los nombres de archivo y carpeta en minúsculas y sin tildes para evitar problemas de enlaces.
- Cada ficha se agrega a la portada solo cuando está terminada — no hay tarjetas de "personaje pendiente" en este sitio.
