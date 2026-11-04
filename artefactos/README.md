# Artefactos · Mesa de Lucho

Código fuente de las hojas de personaje interactivas que viven como **artefacto de Claude** (la "Mesa de Lucho"). Desde el 02-11-2026 la Mesa es la fuente de verdad de los personajes migrados; las hojas HTML de `lucho/` quedan como registro histórico.

- Mesa (artefacto vivo): `https://claude.ai/artifact/8T1nzVfS8SQuVbe7WqoBJ6` · Usoryn en `#/usoryn`, Ki'yaj en `#/kiyaj`.
- Artefactos antiguos (archivados, con aviso y datos de respaldo): Usoryn `4yWA1PbBgiLv4P2zs8Qujs`, Ki'yaj `UcjMbfRY5smhrA4iQptVd5`.

## Estructura

| Carpeta | Qué es | Estable / vivo |
|---|---|---|
| `motor/` | Motor compartido por todas las hojas: `engine.js` (lógica), `body.html` (las 4 páginas), `base.css` + `sheet.css` (estilo familia de la mesa). | Estable: se toca solo para funciones nuevas. |
| `personajes/<id>/` | Configuración de cada personaje: `cfg.js` (`window.CHAR`), `tree.js` (árbol de progresión), `theme.css` (paleta propia, opcional), JSON de conjuros/clase transcritos desde Notion. | Vivo: cambia con cada decisión del personaje. |
| `mesa/portada.html` | Portada de la Mesa (índice de personajes + reglas rápidas con marca Luis Ramos). Las reglas son copia de `../reglas.html`. | Vivo. |
| `mesa/mesa.html` | **Salida generada**: el archivo que se publica como artefacto. No editar a mano. | Generado. |
| `mesa/archivadas/` | Portadas de aviso de los artefactos antiguos. | Estable. |
| `respaldo-bd/` | Instantánea de la base de datos de cada artefacto (equipo, oro, estado) al momento de migrar a la Mesa. | Histórico. |
| `build.py` | Arma `mesa/mesa.html` a partir de todo lo anterior. | Estable. |

## Cómo se publica un cambio

1. Editar `motor/`, `personajes/<id>/` o `mesa/portada.html`.
2. `python3 -I build.py` → regenera `mesa/mesa.html`.
3. Verificar sintaxis (`node --check` sobre el `<script>`) y, si cambió el diseño, revisar en 390 px y 1100 px.
4. Publicar `mesa/mesa.html` al artefacto de la Mesa (misma URL) con capacidades `db` y `assets` ya declaradas.

Los datos de juego (PG, equipo, oro, conjuros preparados, elección de subclase) **no están en estos archivos**: viven en la base de datos del artefacto, en `c/<id>/sheet`, `c/<id>/items`, `c/<id>/gold`. Republicar la página no los toca.

## Cómo se agrega un personaje a la Mesa

1. Crear `personajes/<id>/cfg.js` con `window.CHAR = {...}` (usar `usoryn/cfg.js` o `kiyaj/cfg.js` de modelo) y `tree.js` con `window.CHAR.tree = {...}`.
2. Transcribir desde Notion lo que la hoja necesita (lista de conjuros de la clase, tabla de rasgos, subclases) a JSON y volcarlo en `cfg.js`/`tree.js`. Nunca de memoria.
3. Registrar el personaje en `build.py` (diccionario `chars`) y agregar su carta en `mesa/portada.html` (enlace `#/<id>`).
4. Cargar su estado inicial, equipo y oro en la base de datos bajo `c/<id>/…`.
5. `build.py` → publicar.

## Campos principales de `window.CHAR` (resumen)

Identidad: `name`, `eyebrow`, `idFields`, `footer`, `classOrder`, `classLevels` (incluye `Personaje`), `prof`, `hpMax`, `speed`.
Atributos: `abilities`, `saveProf`, `skills`, `skillProf`, `expertise`.
Combate: `archery`, `defenseStyle`, `extraDamage`, `masterySlots`, `masteryText`, `selfAC`, `selfChips`, `speedFx`, `condNotes`.
Recursos: `resources` (pips o `pool:true`), `hitDice`, `toggles` (botones o `select:true`; `skill:true` da competencia temporal), `slots`, `multiSlots`.
Conjuros: `casting`, `spells` (fichas; `fixed:"Grupo"` para los que no pasan por el grimorio, `noSlot:true` para Canalizar divinidad), `grimoire` (`always`, `prepDefault`, `prepTable`, `maxLvlTable`, `rule`).
Rasgos: `feats`, `featGroups`, `profs`, `langs`.
Progresión: `levelUp` (`classes`, `defs`, `pending`, `note`), `tree` (`cols[].levels`, `cols[].sub.opts`).
Narrativa: `story` (`sections`, `people`, `mysteries`, `closing`), `craft` (recetario, opcional).

Las opciones concretas (subclases disponibles, conjuros, idiomas) se verifican siempre en el Manual del Jugador 2024 en Notion antes de cargarlas; este README no es fuente de reglas.
