window.CHAR.tree={
 maxTotal:20,
 note:"Fuentes: PHB 2024, capítulo 3 (Pícaro y Explorador) y Eberron: Forge of the Artificer, capítulo 1 (Artífice), en Notion. Los espacios de cada nodo son los de esa clase sola; con Explorador y Artífice juntos, la hoja calcula los espacios reales con la tabla de lanzador multiclase (mitad de cada uno, redondeando hacia arriba).",
 cols:[
  {cls:"Pícaro",tone:"sky",max:20,sub:{at:3,label:"Subclase de Pícaro",chosen:null,opts:[
    {id:"asesino",n:"Asesino",en:"Assassin",lv:{3:[["Asesinar","Ventaja en el primer asalto contra quien aún no actuó; si el Ataque furtivo acierta ahí, suma daño igual a tu nivel de Pícaro. Ventaja en iniciativa."],["Herramientas de asesino","Útiles de envenenador y para disfrazarse, con competencia."]],9:[["Pericia en infiltrarse","Imitas habla o caligrafía tras 1 hora de estudio. Puntería certera ya no deja tu velocidad en 0."]],13:[["Envenenar armas","El Veneno de Golpe astuto suma 2d6 de veneno que ignora resistencia."]]}},
    {id:"embaucador",n:"Embaucador arcano",en:"Arcane Trickster",lv:{3:[["Lanzamiento de conjuros","Aprendes conjuros de la lista de mago, usando Inteligencia. Trucos: 3 — Mano de mago (Mage Hand) fijo + 2 que eliges de la lista de mago (cambias uno al subir nivel de Pícaro; un 4.º a Pícaro 10). Conjuros preparados: 3 de nivel 1 de la lista de mago. Espacios: la subclase trae su propia tabla (2 de nivel 1 a Pícaro 3), pero como ya lanzas conjuros de Explorador se suman en la tabla de lanzador multiclase: el Pícaro cuenta un tercio de sus niveles, redondeando hacia abajo (Pícaro 3 → 1). Fuente: PHB 2024, cap. 2."],["Destreza con mano de mago","Mano de Mago como acción adicional e invisible; puede hacer Juego de Manos."]],9:[["Emboscada mágica","Si estás invisible al lanzar un conjuro, el objetivo tiene desventaja en su salvación ese turno."]],13:[["Embaucador versátil","El Tropiezo de Golpe astuto también afecta a otra criatura junto a tu mano espectral."]]}},
    {id:"ladron",n:"Ladrón",en:"Thief",lv:{3:[["Balconero","Velocidad trepando igual a tu velocidad; saltas usando Destreza."],["Manos rápidas","Como acción adicional: Juego de Manos, usar herramientas de ladrón, o usar un objeto (acción de utilizar o de magia)."]],9:[["Sigilo supremo","Nuevo Golpe astuto (1d6): si estás invisible por esconderte, el ataque no lo rompe si terminas tras cobertura tres cuartos o completa."]],13:[["Usar objetos mágicos","Sintonizas hasta 4 objetos; usas pergaminos con Inteligencia; 1d6 = 6 no gasta cargas."]]}},
    {id:"rebanaalmas",n:"Rebanaalmas",en:"Soulknife",lv:{3:[["Cuchillas psíquicas","Cuchilla de energía al atacar: 1d6 psíquico, sutil, arrojadiza 18/36 m, maestría Molestar gratis; segunda cuchilla 1d4 como acción adicional."],["Poder psiónico","4 dados psiónicos d6: Don psirreforzado (sumar a una prueba fallida) y Susurros psíquicos (telepatía)."]],9:[["Cuchillas del alma","Golpes teledirigidos (sumar un dado a un ataque fallido) y Teletransporte psíquico."]],13:[["Velo psíquico","Invisible 1 hora como acción de magia, hasta que hagas daño o fuerces una salvación."]]}}
  ]},
  levels:{
   1:{f:[["Ataque furtivo","1×/turno, +1d6 con arma sutil o a distancia si tienes ventaja, o un aliado a 1,5 m del objetivo y sin desventaja."],["Jerga de ladrones","Conoces la jerga y otro idioma."],["Maestría con armas","Maestría de 2 tipos de armas; cambia en descanso largo."],["Pericia","Doble competencia en 2 habilidades."]],sa:"1d6"},
   2:{f:[["Acción astuta","Correr, destrabarte o esconderte como acción adicional."]],sa:"1d6"},
   3:{f:[["Puntería certera","Acción adicional: ventaja en tu siguiente ataque si no te moviste; tu velocidad queda en 0 hasta el fin del turno."],["Subclase","Eliges Asesino, Embaucador arcano, Ladrón o Rebanaalmas."]],sa:"2d6",branch:1},
   4:{f:[["Mejora de característica","Dote Mejora de característica u otra dote."]],sa:"2d6",asi:1},
   5:{f:[["Esquiva asombrosa","Reacción: mitad del daño de un ataque que te acierte y puedas ver."],["Golpe astuto","Renuncias dados de furtivo por efectos: Retirada, Tropiezo o Veneno (1d6 cada uno). CD 8 + Des + competencia."]],sa:"3d6"},
   6:{f:[["Pericia","Pericia en 2 habilidades más."]],sa:"3d6"},
   7:{f:[["Evasión","En salvaciones de Destreza por mitad: 0 si superas, mitad si fallas."],["Talentos fiables","En pruebas con competencia, un 9 o menos en el d20 cuenta como 10."]],sa:"4d6"},
   8:{f:[["Mejora de característica","Dote Mejora de característica u otra dote."]],sa:"4d6",asi:1},
   9:{f:[["Rasgo de subclase",""]],sa:"5d6",subl:9},
   10:{f:[["Mejora de característica","Dote Mejora de característica u otra dote."]],sa:"5d6",asi:1},
   11:{f:[["Golpe astuto mejorado","Hasta dos efectos de Golpe astuto por golpe."]],sa:"6d6"},
   12:{f:[["Mejora de característica","Dote Mejora de característica u otra dote."]],sa:"6d6",asi:1},
   13:{f:[["Rasgo de subclase",""]],sa:"7d6",subl:13},
   14:{f:[["Golpes taimados","Nuevos Golpe astuto: Confundir (2d6), Noquear (6d6), Ofuscar (3d6)."]],sa:"7d6"},
   15:{f:[["Mente escurridiza","Competencia en salvaciones de Sabiduría y Carisma."]],sa:"8d6"}
  }},
  {cls:"Explorador",tone:"jade",max:20,sub:{at:3,label:"Cazador",chosen:"cazador"},
  levels:{
   1:{f:[["Lanzamiento de conjuros","Conjuros de Explorador con Sabiduría."],["Enemigo predilecto","Marca del Cazador siempre preparada y gratis varias veces."],["Maestría con armas","Maestría de 2 tipos de armas."]],fe:2,sl:[2]},
   2:{f:[["Estilo de combate","Dote de estilo de combate (tienes Tiro con arco)."],["Explorador hábil","2 idiomas y pericia en 1 habilidad."]],fe:2,sl:[2]},
   3:{f:[["Cazador: El cazador y la presa","Azote de colosos o Destructor de hordas; cambia en descanso."],["Cazador: Sabiduría del cazador","Conoces inmunidades, resistencias y vulnerabilidades de tu presa marcada."]],fe:2,sl:[3]},
   4:{f:[["Mejora de característica","Tomaste +2 Destreza."]],fe:2,sl:[3],asi:1},
   5:{f:[["Ataque adicional","Dos ataques con la acción de atacar."]],fe:3,sl:[4,2]},
   6:{f:[["Errante","+3 m de velocidad sin armadura pesada; nadar y trepar igual a tu velocidad."]],fe:3,sl:[4,2]},
   7:{f:[["Cazador: Tácticas defensivas","Eliges: Defensa contra ataques múltiples o Escapar de la horda; cambia en descanso."]],fe:3,sl:[4,3],choice:1},
   8:{f:[["Mejora de característica","Dote Mejora de característica u otra dote."]],fe:3,sl:[4,3],asi:1},
   9:{f:[["Pericia","Pericia en 2 habilidades más."]],fe:4,sl:[4,3,2]},
   10:{f:[["Infatigable","Acción de magia: 1d8 + Sab PG temporales (Sab veces por descanso largo). El descanso corto reduce 1 de cansancio."]],fe:4,sl:[4,3,2]},
   11:{f:[["Cazador: El cazador experto y la presa","1×/turno, el daño de la Marca también a otra criatura a 9 m."]],fe:4,sl:[4,3,3]},
   12:{f:[["Mejora de característica","Dote Mejora de característica u otra dote."]],fe:4,sl:[4,3,3],asi:1},
   13:{f:[["Cazador persistente","El daño no rompe tu concentración en la Marca del Cazador."]],fe:5,sl:[4,3,3,1]},
   14:{f:[["Velo de la naturaleza","Acción adicional: invisible hasta el fin de tu siguiente turno (Sab veces por descanso largo)."]],fe:5,sl:[4,3,3,1]},
   15:{f:[["Cazador: Defensa de cazador experto","Reacción: resistencia a ese daño y al mismo tipo hasta el fin del turno."]],fe:5,sl:[4,3,3,2]},
   16:{f:[["Mejora de característica","Dote Mejora de característica u otra dote."]],fe:5,sl:[4,3,3,2],asi:1},
   17:{f:[["Cazador preciso","Ventaja en ataques contra la criatura con tu Marca."]],fe:6,sl:[4,3,3,3,1]},
   18:{f:[["Sentidos salvajes","Visión ciega 9 m."]],fe:6,sl:[4,3,3,3,1]},
   19:{f:[["Don épico","Dote de don épico u otra dote."]],fe:6,sl:[4,3,3,3,2]}
  }},
  {cls:"Artífice",tone:"sand",max:20,sub:{at:3,label:"Subclase de Artífice",chosen:null,opts:[
    {id:"alquimista",tag:"Fabrica elixires y pociones mágicas.",n:"Alquimista",en:"Alchemist",lv:{3:[["Herramientas del oficio","Suministros de alquimista y útiles de herborista; pociones en la mitad de tiempo."],["Conjuros de subclase","Siempre preparados, no cuentan en tu total: Palabra de curación y Rayo de enfermedad (nv 3); Esfera flamígera y Flecha ácida de Melf (nv 5); Forma gaseosa y Palabra de curación en masa (nv 9); Guarda contra la muerte y Esfera vitriólica (nv 13); Nube aniquiladora y Alzar a los muertos (nv 17)."],["Elixir experimental","2 elixires por descanso largo (tirada 1d6: curación, celeridad, resiliencia, audacia, vuelo); más con un espacio de conjuro."]],5:[["Sabio alquímico","+Int a una tirada de curación o de daño de ácido, fuego o veneno de tus conjuros."]],9:[["Reactivos restauradores","Restablecimiento menor gratis, Int veces por descanso largo."]],15:[["Maestría química","+2d8 fuerza a conjuros de ácido/fuego/veneno; resistencia a ácido y veneno e inmunidad al estado envenenado; Caldero burbujeante de Tasha gratis."]]}},
    {id:"armero",tag:"Fabrica una armadura mágica que potencia tus capacidades.",n:"Armero",en:"Armorer",lv:{3:[["Herramientas del oficio","Armaduras pesadas y herramientas de herrero."],["Conjuros de subclase","Siempre preparados, no cuentan en tu total: Proyectil mágico y Onda atronadora (nv 3); Imagen múltiple y Romper (nv 5); Patrón hipnótico y Relámpago (nv 9); Escudo de fuego e Invisibilidad mejorada (nv 13); Atravesar muros y Muro de fuerza (nv 17)."],["Armadura arcana y Modelo","Tu armadura es canalizador y se pone como acción de utilizar. Modelos: Acorazado (demoledor 1d10), Guardián (pulso 1d8, PG temp.) o Infiltrador (lanzador 1d6, +1,5 m, ventaja en Sigilo). Atacas con Int."]],5:[["Ataque adicional","Dos ataques con la acción de atacar."]],9:[["Armero mejorado","Plan y objeto extra de categoría Armadura; +1 con el arma del modelo."]],15:[["Armadura perfeccionada","Mejoras por modelo: 2d6, atracción a 7,5 m o vuelo."]]}},
    {id:"artillero",tag:"Despliega poder destructivo desde lejos.",n:"Artillero",en:"Artillerist",lv:{3:[["Herramientas del oficio","Armas marciales a distancia y herramientas de ebanista."],["Conjuros de subclase","Siempre preparados, no cuentan en tu total: Escudo y Onda atronadora (nv 3); Rayo abrasador y Romper (nv 5); Bola de fuego y Muro de viento (nv 9); Tormenta de hielo y Muro de fuego (nv 13); Cono de frío y Muro de fuerza (nv 17)."],["Cañón sobrenatural","Cañón Pequeño/Diminuto (CA 18, PG 5×nivel): lanzallamas 2d8, balista de fuerza 2d8 o protector (1d8+Int temp.). 1 por descanso largo o con espacio."]],5:[["Arma de fuego arcana","+1d8 a una tirada de daño de tus conjuros lanzados por el arma."]],9:[["Cañón explosivo","Detonar 3d10 de fuerza; +1d8 al daño del cañón."]],15:[["Posición fortificada","Dos cañones; cobertura media a 3 m."]]}},
    {id:"herrero",tag:"Comanda un guardián constructo.",n:"Herrero de batalla",en:"Battle Smith",lv:{3:[["Listo para la batalla","Armas marciales; atacas con Int usando armas mágicas; un arma sirve de canalizador."],["Conjuros de subclase","Siempre preparados, no cuentan en tu total: Heroísmo y Escudo (nv 3); Castigo brillante y Vínculo protector (nv 5); Aura de vitalidad y Conjurar descarga de proyectiles (nv 9); Aura de pureza y Escudo de fuego (nv 13); Castigo desterrador y Curar heridas en masa (nv 17)."],["Defensor de acero","Compañero constructo (CA 12+Int, PG 5+5×nivel) que ataca por orden tuya (1d8+2+Int fuerza), repara y desvía ataques."]],5:[["Ataque adicional","Dos ataques; puedes cambiar uno por la orden al defensor."]],9:[["Sacudida arcana","Al acertar tú o el defensor: +2d6 fuerza o cura 2d6, Int veces por descanso largo."]],15:[["Defensor mejorado","Sacudida 4d6; Desviar ataque hace 1d4+Int de fuerza."]]}},
    {id:"cartografo",tag:"Traza rutas ventajosas en medio del caos.",n:"Cartógrafo",en:"Cartographer",lv:{3:[["Herramientas del oficio","Suministros de calígrafo y herramientas de cartógrafo; pergaminos en la mitad de tiempo."],["Conjuros de subclase","Siempre preparados, no cuentan en tu total: Fuego feérico, Saeta guía y Palabra de curación (nv 3); Localizar objeto y Punzada mental (nv 5); Invocar relámpagos y Clarividencia (nv 9); Destierro y Localizar criatura (nv 13); Escudriñar y Círculo de teletransportación (nv 17)."],["Atlas del aventurero y Magia cartográfica","Mapas mágicos para 1+Int criaturas (+1d4 iniciativa, apuntar sin verse); Fuego feérico gratis Int veces; teletransporte corto gastando medio movimiento."]],5:[["Precisión guiada","+Int a una tirada de daño de tus conjuros de cartógrafo o contra objetivos con Fuego feérico; el daño no rompe tu concentración en él."]],9:[["Movimiento ingenioso","Con Destello de genio, tú o un aliado os teletransportáis 9 m."]],15:[["Atlas superior","Refugio seguro al caer a 0 PG; Encontrar el camino gratis."]]}}
  ]},
  levels:{
   1:{f:[["Lanzamiento de conjuros","Conjuros de artífice con Inteligencia, a través de herramientas."],["Magia de manitas","Truco Reparar y crear objetos comunes Int veces por descanso largo."]],sl:[2],art:{plans:0,items:0,cantrips:2,prep:2}},
   2:{f:[["Replicar objeto mágico","4 planes conocidos; creas 2 objetos mágicos temporales por descanso largo (bolsa de contención, gafas nocturnas, varita del mago de guerra…)."]],sl:[2],art:{plans:4,items:2,cantrips:2,prep:3}},
   3:{f:[["Subclase de artífice","Eliges Alquimista, Armero, Artillero, Herrero de batalla o Cartógrafo."]],sl:[3],art:{plans:4,items:2,cantrips:2,prep:4},branch:1},
   4:{f:[["Mejora de característica","Dote Mejora de característica u otra dote."]],sl:[3],art:{plans:4,items:2,cantrips:2,prep:5},asi:1},
   5:{f:[["Rasgo de subclase",""]],sl:[4,2],art:{plans:4,items:2,cantrips:2,prep:6},subl:5},
   6:{f:[["Manitas de objetos mágicos","Cargar, drenar o transmutar tus objetos replicados; planes de nivel 6+ (armadura +1, botas élficas, varita de proyectiles mágicos…)."]],sl:[4,2],art:{plans:5,items:3,cantrips:2,prep:6}},
   7:{f:[["Destello de genio","Reacción: +Int a una prueba o salvación fallida a 9 m, Int veces por descanso largo."]],sl:[4,3],art:{plans:5,items:3,cantrips:2,prep:7}},
   8:{f:[["Mejora de característica","Dote Mejora de característica u otra dote."]],sl:[4,3],art:{plans:5,items:3,cantrips:2,prep:7},asi:1},
   9:{f:[["Rasgo de subclase",""]],sl:[4,3,2],art:{plans:5,items:3,cantrips:2,prep:9},subl:9},
   10:{f:[["Adepto de objetos mágicos","Sintonizas hasta 4 objetos; planes de nivel 10+; 3 trucos."]],sl:[4,3,2],art:{plans:6,items:4,cantrips:3,prep:9}},
   11:{f:[["Objeto almacenaconjuros","Guardas un conjuro de nivel 1 a 3 en un objeto; cualquiera lo lanza 2×Int veces."]],sl:[4,3,3],art:{plans:6,items:4,cantrips:3,prep:10}},
   12:{f:[["Mejora de característica","Dote Mejora de característica u otra dote."]],sl:[4,3,3],art:{plans:6,items:4,cantrips:3,prep:10},asi:1},
   13:{f:[["Sin rasgo nuevo de clase","Solo cambian los espacios de conjuro (primer espacio de nivel 4) y los conjuros preparados."]],sl:[4,3,3,1],art:{plans:6,items:4,cantrips:3,prep:11}},
   14:{f:[["Artificio avanzado","Sintonizas 5 objetos; recuperas un Destello de genio en descanso corto; planes de nivel 14+; 4 trucos."]],sl:[4,3,3,1],art:{plans:7,items:5,cantrips:4,prep:11}},
   15:{f:[["Rasgo de subclase",""]],sl:[4,3,3,2],art:{plans:7,items:5,cantrips:4,prep:12},subl:15},
   16:{f:[["Mejora de característica","Dote Mejora de característica u otra dote."]],sl:[4,3,3,2],art:{plans:7,items:5,cantrips:4,prep:12},asi:1},
   17:{f:[["Sin rasgo nuevo de clase","Solo cambian los espacios de conjuro (primer espacio de nivel 5) y los conjuros preparados."]],sl:[4,3,3,3,1],art:{plans:7,items:5,cantrips:4,prep:14}},
   18:{f:[["Maestro de objetos mágicos","Sintonizas hasta 6 objetos."]],sl:[4,3,3,3,1],art:{plans:8,items:6,cantrips:4,prep:14}},
   19:{f:[["Don épico","Dote de don épico u otra dote."]],sl:[4,3,3,3,2],art:{plans:8,items:6,cantrips:4,prep:15}}
  }}
 ]
};
