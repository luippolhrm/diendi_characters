# QA de la Mesa

Banco de pruebas con Playwright y una base de datos simulada (`mock.js`) que imita al artefacto, incluida la latencia de guardado.

1. Generar `store.json` desde los `seed.json` de cada personaje y `respaldo-bd/` (ver comando en el historial del commit) y dejarlo junto a los scripts.
2. Correr desde esta carpeta, después de `python3 -I build.py`:
   - `fuzz.py <personajes> <n>`: clics al azar; detecta errores de JS, NaN/undefined en pantalla, recursos fuera de rango y desfase entre pantalla y guardado.
   - `race.py`: clics rápidos con latencia alta; no debe perder cambios.
   - `cast2.py <personajes>`: lanza cada conjuro/técnica y muestra qué gasta y qué efecto deja.
   - `rest.py`: descansos corto y largo.
   - `fx.py`: efectos activos que deben reflejarse en CA y ataques.
