window.CHAR={
 name:"Yevelda",
 eyebrow:"La Sin-Sangre · Niebla y Oso",
 who:"Orca (semiorca) · Bárbara 1 · Soldado · Caótica Buena",
 idFields:[["Clase","Bárbara 1"],["Senda","⏳ a nivel 3"],["Nivel","1"],["Especie","Orca · Mediano"],["Trasfondo","Soldado"],["Alineamiento","Caótica Buena"]],
 footer:"Yevelda · Bárbara 1 · D&D 2024 · Hoja-artefacto. Reglas verificadas en el Manual del Jugador en Notion. Su identidad semiorca es narrativa: en 2024 juega con los rasgos de la especie Orco.",
 prof:2, hpMax:15, speed:30, levelLabel:"Bárbara 1",
 abilities:[["fue","Fuerza",18],["des","Destreza",14],["con","Constitución",16],["int","Inteligencia",11],["sab","Sabiduría",10],["car","Carisma",13]],
 saveProf:["fue","con"],
 skills:[["Atletismo","fue"],["Acrobacias","des"],["Juego de Manos","des"],["Sigilo","des"],["C. Arcano","int"],["Historia","int"],["Investigación","int"],["Naturaleza","int"],["Religión","int"],["Perspicacia","sab"],["Percepción","sab"],["Medicina","sab"],["Supervivencia","sab"],["T. con Animales","sab"],["Engaño","car"],["Intimidación","car"],["Interpretación","car"],["Persuasión","car"]],
 skillProf:["Atletismo","Intimidación","Supervivencia","T. con Animales"],
 expertise:[],
 archery:false, defenseStyle:false,
 unarmored:{label:"Defensa sin armadura (10 + Des + Con)",add:["con"]},
 casting:null,
 spellsTitle:"Furia y rasgos activables",
 spellsLabel:"sin conjuros",
 spellsNote:"Activa la Furia desde aquí: la hoja marca sus efectos en Combate mientras dure. Descarga de adrenalina da PG temporales al activarla.",
 slots:[],
 resources:[
  {id:"rage",n:"Furia",short:"Furia",sub:"2 usos a Bárbara 1 · recuperas 1 en descanso corto y todos en descanso largo",max:2,reset:"short",shortRecover:1},
  {id:"adren",n:"Descarga de adrenalina",short:"Descarga de adrenalina",sub:"Orco · 2 usos (= competencia) · todos vuelven en descanso corto o largo",max:2,reset:"short",shortRecover:2},
  {id:"endure",n:"Aguante incansable",short:"Aguante incansable",sub:"Orco · si caes a 0 PG sin morir, te quedas con 1 · descanso largo",max:1,reset:"long"}
 ],
 hitDice:[{id:"d12",die:12,max:1,label:"d12 · Bárbara"}],
 toggles:[],
 extraDamage:[
  {n:"Daño por furia",dice:"+2",effect:"rage",onNote:"Furia activa: +2 a cada ataque con Fuerza que cause daño",cond:"solo con la Furia activa · ataques que usen Fuerza (no el arco)"},
  {n:"Atacante salvaje",dice:"relanza el dado del arma",cond:"1×/turno · al acertar con un arma, tiras dos veces los dados de daño del arma y usas el resultado que prefieras"},
  {n:"Ataque extra con arma ligera",dice:"1d6 sin +4",cond:"acción adicional tras atacar con un hacha de mano: otro ataque con la otra hacha de mano, sin sumar Fuerza al daño (sí el +2 de Furia)"}
 ],
 masterySlots:2,
 masteryText:{
  "Hender (Cleave)":"al acertar un ataque cuerpo a cuerpo, otra tirada de ataque con la misma arma contra una segunda criatura a 1,5 m (5 ft) de la primera y a tu alcance; si acierta, sufre el daño del arma sin tu modificador (1d12, +2 en Furia). 1×/turno",
  "Molestar (Vex)":"al acertar y causar daño, ventaja en tu siguiente tirada de ataque contra esa criatura antes del final de tu siguiente turno",
  "Ralentizar (Slow)":"al acertar y causar daño, −3 m (10 ft) de velocidad hasta el principio de tu siguiente turno (no acumula más de 3 m entre varias armas)",
  "Debilitar (Sap)":"al acertar, el objetivo tiene desventaja en su próxima tirada de ataque antes del principio de tu siguiente turno"
 },
 selfChips:[["rage","Furia: resistencia a daño contundente, cortante y perforante · ventaja en pruebas y salvaciones de Fuerza · sin conjuros ni concentración"],["adren","Descarga de adrenalina: PG temporales ganados"]],
 condNotes:{incapacitado:"Termina la Furia de inmediato."},
 shortRestMsg:"Descanso corto: recuperas 1 uso de Furia y los 2 de Descarga de adrenalina; puedes gastar el dado de golpe.",
 containers:["Sin asignar","Cinturón","Espalda","Mochila","Petate"],
 containerNotes:{"Cinturón":"a mano · las hachas gemelas","Espalda":"arco y aljaba","Mochila":"hay que sacarlo · campamento"},
 classOrder:["Bárbaro"],
 classLevels:{"Bárbaro":1,"Personaje":1},
 spells:[
  {"id":"rage","lvl":0,"n":"Furia","en":"Rage","tag":"acción adicional","fixed":"Bárbara · rasgo de clase","noSlot":true,"src":["rage"],"tg":["self"],"dur":"hasta 10 min (se prolonga cada turno)","meta":"Rasgo de clase · Acción adicional · sin armadura pesada · hasta 10 minutos","d":"Mientras dure: resistencia al daño contundente, cortante y perforante; +2 al daño en ataques que usen Fuerza y causen daño; ventaja en pruebas y salvaciones de Fuerza; no puedes concentrarte ni lanzar conjuros. Dura hasta el final de tu siguiente turno y se prolonga un asalto si atacas a un enemigo, le obligas a salvar o usas la acción adicional para prolongarla. Termina si quedas Incapacitada o te pones armadura pesada."},
  {"id":"adren","lvl":0,"n":"Descarga de adrenalina","en":"Adrenaline Rush","tag":"Correr + 2 PG temp","fixed":"Orco · rasgo de especie","noSlot":true,"src":["adren"],"tg":["self"],"meta":"Rasgo de especie · Acción adicional","d":"Llevas a cabo la acción de Correr como acción adicional y ganas 2 PG temporales (igual a tu bonificador por competencia). Comparte la acción adicional con activar o prolongar la Furia.","selfTemp":2,"inst":"Te mueves tu velocidad otra vez."}
 ],
 feats:[
  {o:"Bárbaro",c:"Bárbaro",l:1,lt:"Bár 1",use:"2 / desc. (1 corto)",n:"Furia",en:"Rage",src:"PHB 2024",d:["Acción adicional, sin armadura pesada. Resistencia a daño contundente, cortante y perforante; +2 al daño en ataques con Fuerza; ventaja en pruebas y salvaciones de Fuerza; sin conjuros ni concentración.","Dura hasta el final de tu siguiente turno; se prolonga un asalto si atacas a un enemigo, le obligas a hacer una salvación o usas la acción adicional. Máximo 10 minutos. Termina si quedas Incapacitada o te pones armadura pesada.","2 usos; recuperas 1 tras un descanso corto y todos tras un descanso largo. A Bárbara 3 pasan a 3 usos."]},
  {o:"Bárbaro",c:"Bárbaro",l:1,lt:"Bár 1",use:"Pasivo",n:"Defensa sin armadura",en:"Unarmored Defense",src:"PHB 2024",d:["Sin armadura, tu CA base es 10 + Destreza + Constitución = 15. Lo conservas aunque lleves escudo (llegaría a 17)."]},
  {o:"Bárbaro",c:"Bárbaro",l:1,lt:"Bár 1",use:"Pasivo",n:"Maestría con armas",en:"Weapon Mastery",src:"PHB 2024",d:["Usas las propiedades de maestría de 2 tipos de armas cuerpo a cuerpo sencillas o marciales. Tras un descanso largo puedes cambiar una de las dos elecciones.","Hoy: hacha a dos manos (Hender) y hacha de mano (Molestar). Alternativas: jabalina (Ralentizar) y lanza (Debilitar). El arco corto no entra: la elección es solo de armas cuerpo a cuerpo."]},
  {o:"Orco",c:"Personaje",l:1,lt:"Especie",use:"Pasivo",n:"Visión en la oscuridad",en:"Darkvision",src:"PHB 2024",d:["Ves en la oscuridad hasta 36 m (120 ft): la luz tenue te parece brillante y la oscuridad, luz tenue en grises."]},
  {o:"Orco",c:"Personaje",l:1,lt:"Especie",use:"2 / desc. corto o largo",n:"Descarga de adrenalina",en:"Adrenaline Rush",src:"PHB 2024",d:["Puedes Correr como acción adicional; al hacerlo ganas PG temporales iguales a tu bonificador por competencia (2).","Usos iguales a tu bonificador por competencia (2); recuperas todos tras un descanso corto o largo."]},
  {o:"Orco",c:"Personaje",l:1,lt:"Especie",use:"1 / desc. largo",n:"Aguante incansable",en:"Relentless Endurance",src:"PHB 2024",d:["Cuando tus PG se reducen a 0 pero no mueres de inmediato, puedes quedarte con 1 PG. Una vez por descanso largo."]},
  {o:"Orco",c:"Personaje",l:1,lt:"Especie",use:"Pasivo",n:"Tipo y tamaño",en:"Creature Type",src:"PHB 2024",d:["Humanoide Mediano. Velocidad 9 m (30 ft).","Semiorca por narrativa (madre orca, padre humano); el PHB 2024 no tiene «herencia mixta», así que mecánicamente es Orca."]},
  {o:"Soldado",c:"Personaje",l:1,lt:"Trasfondo",use:"1×/turno",n:"Atacante salvaje",en:"Savage Attacker",src:"PHB 2024 · dote de origen",d:["Una vez por turno, al acertar a un objetivo con un arma, tiras dos veces los dados de daño del arma y usas el resultado que prefieras."]},
  {o:"Soldado",c:"Personaje",l:1,lt:"Trasfondo",use:"Pasivo",n:"Trasfondo Soldado",en:"Soldier",src:"PHB 2024",d:["+2 Fuerza, +1 Constitución (aplicados sobre 16/14/15/11/10/13). Habilidades: Atletismo e Intimidación. Herramienta: juego (naipes).","Equipo opción A: lanza, arco corto, 20 flechas, aljaba, naipes, útiles de sanador, ropas de viaje y 14 po."]}
 ],
 featGroups:[["Bárbaro","Bárbara","Nivel {Bárbaro}","ruby"],["Orco","Orca","Especie · PHB 2024","jade"],["Soldado","Soldado","Trasfondo y dote de origen","sand"]],
 levelUp:{
  classes:{"Bárbaro":{hd:"d12",die:12,fixed:7}},
  defs:{"Bárbaro":{2:{gains:["Ataque temerario: al hacer la primera tirada de ataque del turno, ventaja en los ataques con Fuerza hasta el inicio de tu siguiente turno, pero los ataques contra ti también tienen ventaja.","Sentir el peligro: ventaja en salvaciones de Destreza salvo que estés Incapacitada.","Furia sigue en 2 usos y +2 de daño; maestría en 2 armas."]}}},
  pending:[],
  note:"Fuente: PHB 2024, capítulo 3 (Bárbaro) en Notion. PG al subir: 1d12 + 3 (o 7 + 3 = 10 fijo); la mesa tira el dado."
 },
 profs:[
  {t:"Salvaciones",ic:"shield",items:[["Fuerza","Bárbara"],["Constitución","Bárbara"]]},
  {t:"Habilidades",ic:"star",items:[["Atletismo","Soldado"],["Intimidación","Soldado"],["Supervivencia","Bárbara"],["T. con Animales","Bárbara"]]},
  {t:"Armaduras",ic:"armor",items:[["Ligeras y medias","Bárbara"],["Escudos","Bárbara"]]},
  {t:"Armas",ic:"sword",items:[["Sencillas y marciales","Bárbara"]]},
  {t:"Herramientas",ic:"tool",items:[["Juego (naipes)","Soldado"]]},
  {t:"Idiomas",ic:"talk",items:[["Común",""],["Orco",""],["Goblin",""]],note:"Cap. 2: Común + 2 de la tabla estándar. Orco y Goblin son estándar: cuadra."}
 ],
 story:{
  title:"Crónica de la Sin-Sangre",
  portraitAlt:"Ilustración de Yevelda",
  sections:[
   {h:"Los rastreadores que se rastrearon",p:["Vashka era exploradora de una horda de guerra orca: la que iba delante, leyendo el terreno. Tomas era un guardabosques humano que protegía las tierras salvajes por las que la horda cruzaba. Se encontraron como se encuentran dos rastreadores: cada uno siguiendo al otro sin saberlo, en círculos, durante semanas. Cuando por fin se emboscaron mutuamente en el mismo instante, ninguno atacó; se quedaron mirando, hacha y arco a medio alzar, y algo parecido a la risa lo arruinó todo. Se vieron durante dos estaciones, cada vez que la horda acampaba cerca de sus bosques. Después la horda marchó, como siempre marcha. Yevelda nació en el campamento, orca a los ojos de todos. Vashka nunca dijo el nombre del padre."]},
   {h:"Dos escuelas",p:["En el campamento la entrenaron para la guerra, y era un prodigio: más fuerte que orcos adultos a los catorce. Pero cada vez que la horda acampaba en tierras que Tomas rondaba, Yevelda se escabullía, y él la esperaba. De él aprendió lo que ningún capitán enseñaba: leer huellas, moverse por lo salvaje, curar animales, hablarles con el cuerpo antes que con la voz. Tomas le enseñó todo lo que sabía en noches robadas, sin poder decirle nunca, en voz alta, por qué le enseñaba como un padre.","En el campamento, lo aprendido con Tomas la volvió la cuidadora no oficial de los lobos de guerra: los alimentaba, los curaba, les ponía nombres secretos. Los lobos no veían a la semiorca enorme que asustaba a los reclutas nuevos. Los lobos la veían a ella."]},
   {h:"El rito y el exilio",p:["A los dieciséis llegó su rito de sangre: matar su primera presa ante la horda entera. Le trajeron al lobo más débil de la camada que ella misma había criado. Yevelda levantó el hacha… y la clavó en el suelo. Soltó al lobo hacia el bosque y esperó el castigo de pie. Desde ese día algo quedó sellado: puede pelear, romper y aterrar, pero su mano se niega a dar el golpe final. En los años de batalla que vinieron, rompió escudos, huesos y voluntades; el golpe final siempre lo dio otro.","La horda la marcó como sin-sangre y la expulsó con lo puesto. La noche antes, Vashka le dejó junto al petate, en silencio, raciones para dos semanas y sus propias jabalinas: las mismas cuatro que Yevelda lleva hoy. Yevelda buscó los bosques de Tomas y encontró el puesto de guardabosques quemado, viejo de meses. Ni cuerpo, ni rastro. El mejor rastreador que conoció no deja huellas: eso se dice ella para poder dormir."]},
   {h:"El oso de ojos de niebla",p:["Su primer invierno sola, en las montañas, se cruzó con un oso enorme que arrasaba todo a su paso, enfermo de algo que no era rabia, con algo blanco y frío en la mirada, como niebla. Yevelda bajó el hacha, plantó el cuerpo y le habló. Tardó horas. El oso cargó dos veces y dos veces ella aguantó sin responder. Al final, el animal se derrumbó a su lado, y Yevelda pasó tres días acompañándolo mientras la enfermedad de niebla lo apagaba. Murió sin miedo, con la cabeza en su regazo.","Esa noche entendió que puede llegar adonde nadie más llega: las bestias más rotas y furiosas la reconocen, porque ella también es una criatura enorme y temible con algo suave por dentro. Con la piel del oso se hizo su ropa de viaje: no un trofeo de caza, sino una mortaja que camina.","Bajando de esas montañas, la misma niebla fría de los ojos del oso se cerró a su alrededor tres días, y al abrirse, las estrellas eran otras. En estas tierras grises, una semiorca de dos metros y medio vestida de oso recibe puertas cerradas y niños que corren. Ella sonríe igual. Casi siempre funciona mal."]},
   {h:"Apariencia y carácter",p:["21 años, 2,5 m, 87 kg. Ojos pardos, piel morena, pelo negro. Una guerrera brutalmente fuerte y alguien profundamente amable que termina asustando por su apariencia. El trato con los animales es la parte que más ama de sí misma: los animales no juzgan su tamaño ni sus colmillos; sienten la intención. Juega naipes en cada taberna que no la echa; es «imbatible». La verdad: en la horda la dejaban ganar, primero por miedo, con los años por cariño.","Su gatillo: no soporta que maltraten a un animal. Su Furia no es rabia de guerra, es ferocidad protectora. Su amabilidad y su brutalidad son la misma cosa apuntando a lados distintos."],quotes:["Ella sonríe igual. Casi siempre funciona mal."]},
   {h:"Motivaciones",p:["Tres cosas, aunque solo admite dos: entender qué es la niebla que enfermó al oso y ahora la rodea; encontrar un lugar donde alguien la mire dos veces, la segunda de verdad; y (esta no la admite) hallar el rastro de Tomas, o al menos un bosque que se parezca a los suyos."]}
  ],
  people:[["Vashka","Madre. Exploradora de la horda; le dejó sus cuatro jabalinas la noche del exilio, sin decir palabra.","En la horda"],["Tomas","Padre, guardabosques humano. Le enseñó a rastrear, curar y hablar con las bestias. Su puesto apareció quemado.","Desaparecido"],["El oso de ojos de niebla","Murió en su regazo; su piel es ahora su ropa de viaje.","Muerto"]],
  mysteries:["¿Qué fue de Tomas? Su puesto quemado, sin cuerpo ni rastro.","¿Qué era la enfermedad de niebla del oso, y qué quiere de ella la niebla que la trajo a estas tierras?","¿Le dirá alguien, alguna vez, la verdad sobre los naipes?","¿Bajo qué cielo la dejaron las nieblas? Nadie le ha dicho aún el nombre de estas tierras."],
  closing:"Ella sonríe igual. Casi siempre funciona mal."
 },
 refs:""
};
