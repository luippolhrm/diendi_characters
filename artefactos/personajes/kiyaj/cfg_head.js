window.CHAR={
 name:"Ki'yaj",
 eyebrow:"Juramento de la Voluntad Inquebrantable",
 who:"Githyanki (Mediano) · Paladín 4 · Juramento de la Conquista · Soldado · Legal Neutral",
 idFields:[["Clase","Paladín 4"],["Juramento","Conquista"],["Nivel","4"],["Especie","Githyanki · Mediano"],["Trasfondo","Soldado"],["Alineamiento","Legal Neutral"]],
 footer:"Ki'yaj · Paladín 4 · D&D 2024 · Hoja-artefacto. Reglas verificadas en el Manual del Jugador en Notion; Juramento de la Conquista (Xanathar) y Githyanki (MotM) adaptados a 2024 y validados por el GM.",
 prof:2, hpMax:33, speed:30, levelLabel:"Paladín 4",
 abilities:[["fue","Fuerza",18],["des","Destreza",10],["con","Constitución",14],["int","Inteligencia",11],["sab","Sabiduría",14],["car","Carisma",18]],
 saveProf:["sab","car"],
 skills:[["Atletismo","fue"],["Acrobacias","des"],["Juego de Manos","des"],["Sigilo","des"],["C. Arcano","int"],["Historia","int"],["Investigación","int"],["Naturaleza","int"],["Religión","int"],["Perspicacia","sab"],["Percepción","sab"],["Medicina","sab"],["Supervivencia","sab"],["T. con Animales","sab"],["Engaño","car"],["Intimidación","car"],["Interpretación","car"],["Persuasión","car"]],
 skillProf:["Atletismo","Intimidación","Perspicacia","Persuasión"],
 expertise:[],
 archery:false, defenseStyle:true,
 casting:{ab:"car",dc:14,atk:6},
 grimoire:{cls:"Paladín",title:"Grimorio del paladín",always:["smite","agathys","command"],alwaysLabel:"Siempre preparados · Castigo de paladín y Juramento de la Conquista",prepDefault:["bless","cure","wrathful","sof","duel"],prepTable:[2,3,4,5,6,6,7,7,9,9,10,10,11,11,12,12,14,14,15,15],maxLvlTable:[1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5],rule:"Paladín: preparas tantos conjuros como marca tu nivel (de niveles para los que tengas espacios). Castigo divino y los conjuros de juramento van aparte, siempre preparados. Tras un descanso largo puedes cambiar uno. Fuente: PHB 2024, Paladín → Lanzamiento de conjuros."},
 slots:[{lvl:1,max:3}],
 resources:[
  {id:"loh",pool:true,n:"Imponer las manos",short:"Imponer las manos",sub:"Reserva de 5 × nivel de paladín · acción adicional: tocas y curas · 5 puntos quitan Envenenado · descanso largo",max:20,reset:"long",spendMsg:"Anota la curación con Curar si es a ti."},
  {id:"smiteFree",n:"Castigo divino gratis",short:"Castigo de paladín",sub:"Castigo de paladín · 1 vez sin espacio · descanso largo",max:1,reset:"long"},
  {id:"cd",n:"Canalizar divinidad",short:"Canalizar divinidad",sub:"2 usos · recuperas 1 en descanso corto y todos en descanso largo · CD 14",max:2,reset:"short",shortRecover:1},
  {id:"jumpTrait",n:"Salto psiónico",short:"Psiónica githyanki",sub:"Psiónica githyanki · Salto 1 vez gratis · descanso largo",max:1,reset:"long"}
 ],
 hitDice:[{id:"d10",die:10,max:4,label:"d10 · Paladín"}],
 toggles:[
  {id:"astralSkill",select:true,skill:true,n:"Conocimiento astral · habilidad",sub:"Githyanki (MotM) · competencia temporal hasta el próximo descanso largo · se marca ◐ en Atributos",options:[["Atletismo"],["Acrobacias"],["Juego de Manos"],["Sigilo"],["C. Arcano"],["Historia"],["Investigación"],["Naturaleza"],["Religión"],["Medicina"],["Percepción"],["Supervivencia"],["T. con Animales"],["Engaño"],["Interpretación"]].map(([n])=>({id:n,n}))},
  {id:"astralTool",select:true,n:"Conocimiento astral · arma o herramienta",sub:"Githyanki (MotM) · competencia temporal hasta el próximo descanso largo",options:["Herramientas de herrero","Herramientas de carpintero","Herramientas de ladrón","Herramientas de alquimista","Útiles de calígrafo","Herramientas de cartógrafo","Herramientas de cocinero","Útiles de disfraz","Herramientas de joyero","Útiles de envenenador","Herramientas de navegante","Instrumento musical","Juego de cartas","Kit de herborista","Un tipo de arma"].map(n=>({id:n,n}))}
 ],
 extraDamage:[
  {n:"Atacante salvaje",dice:"relanza el dado del arma",cond:"1×/turno · al acertar con un arma, tiras dos veces los dados del arma y usas el resultado que quieras · regla de mesa: no relanza los dados de Castigo"}
 ],
 masterySlots:2,
 masteryText:{"Debilitar (Sap)":"el objetivo tiene desventaja en su próximo ataque antes de tu siguiente turno","Ralentizar (Slow)":"−3 m (10 ft) de velocidad al objetivo hasta el inicio de tu siguiente turno"},
 selfAC:[["sof",2,"Escudo de fe"]],
 selfChips:[["agathys","Armadura de Agathys: 5 de frío a quien te acierte cuerpo a cuerpo mientras te queden PG temporales"],["heroism","Heroísmo: inmune a Asustado · +4 PG temp. al inicio de cada turno"]],
 condNotes:{},
 shortRestMsg:"Descanso corto: recuperas 1 uso de Canalizar divinidad y puedes gastar dados de golpe.",
 containers:["Sin asignar","Mochila","Bolsa de cinturón","Montura","Guardado"],
 containerNotes:{"Mochila":"hay que sacarlo","Bolsa de cinturón":"a mano · las monedas están en Oro","Montura":"en las alforjas","Guardado":"no lo cargo"},
 classOrder:["Paladín"],
 classLevels:{"Paladín":4,"Personaje":4},
 feats:[
  {o:"Paladín",c:"Paladín",l:1,lt:"Pal 1",use:"Acción adicional",n:"Imponer las manos",en:"Lay on Hands",src:"PHB 2024",d:["Reserva de curación de 5 × tu nivel de paladín (20 a nivel 4); se recarga con un descanso largo.","Como acción adicional, tocas a una criatura (puedes ser tú) y le devuelves los PG que quieras de la reserva.","Puedes gastar 5 puntos de la reserva para quitarle el estado Envenenado; esos puntos no curan."]},
  {o:"Paladín",c:"Paladín",l:1,lt:"Pal 1",use:"Car · CD 14",n:"Lanzamiento de conjuros",en:"Spellcasting",src:"PHB 2024",d:["Aptitud mágica: Carisma (CD 14, ataque +6). Canalizador: símbolo sagrado.","A Paladín 4: 5 conjuros preparados de nivel 1 y 3 espacios de nivel 1; los espacios vuelven con un descanso largo.","Los conjuros que otro rasgo te da siempre preparados no cuentan en ese total. Tras un descanso largo puedes cambiar 1 conjuro preparado por otro de paladín."]},
  {o:"Paladín",c:"Paladín",l:1,lt:"Pal 1",use:"Pasivo",n:"Maestría con armas",en:"Weapon Mastery",src:"PHB 2024",d:["Usas las propiedades de maestría de 2 tipos de armas con las que tengas competencia.","Tras un descanso largo puedes cambiar los tipos elegidos. Hoy: espada larga (Debilitar) y jabalina (Ralentizar)."]},
  {o:"Paladín",c:"Paladín",l:2,lt:"Pal 2",use:"1 gratis / desc. largo",n:"Castigo de paladín",en:"Paladin's Smite",src:"PHB 2024",d:["Siempre tienes Castigo divino preparado, sin contar en tus 5.","Puedes lanzarlo una vez sin gastar espacio de conjuro; se recupera tras un descanso largo."]},
  {o:"Paladín",c:"Paladín",l:2,lt:"Pal 2",use:"Pasivo",n:"Estilo de combate: Defensa",en:"Fighting Style: Defense",src:"PHB 2024 · dote",d:["+1 a la CA mientras lleves armadura. La hoja lo suma cuando tienes armadura equipada."]},
  {o:"Paladín",c:"Paladín",l:3,lt:"Pal 3",use:"2 usos",n:"Canalizar divinidad",en:"Channel Divinity",src:"PHB 2024",d:["2 usos. Recuperas 1 tras un descanso corto y todos tras un descanso largo (3 usos a nivel 11).","Si un efecto pide salvación, la CD es la de tus conjuros (14).","Sentidos divinos (acción adicional): durante 10 minutos, o hasta quedar Incapacitado, conoces la ubicación y el tipo de celestiales, infernales y muertos vivientes a 18 m (60 ft), y detectas lugares u objetos consagrados o profanados."]},
  {o:"Paladín",c:"Paladín",l:4,lt:"Pal 4",use:"Pasivo",n:"Mejora de característica",en:"Ability Score Improvement",src:"PHB 2024",d:["Elegiste +2 Carisma (16 → 18): CD de conjuros y de Canalizar divinidad pasa de 13 a 14. Se repite en los niveles 8, 12 y 16."]},
  {o:"Conquista",c:"Paladín",l:3,lt:"Pal 3",use:"Pasivo",n:"Conjuros de juramento",en:"Oath Spells",src:"Xanathar · adaptado a 2024 · GM",d:["Siempre preparados, sin ocupar cupo: Armadura de Agathys y Orden imperiosa (nivel 3). A nivel 5: Inmovilizar persona y Reflejo espiritual."]},
  {o:"Conquista",c:"Paladín",l:3,lt:"Pal 3",use:"Canalizar divinidad",n:"Presencia conquistadora",en:"Conquering Presence",src:"Xanathar · adaptado a 2024 · GM",d:["Opción de Canalizar divinidad. Acción de magia: cada criatura que elijas y veas a 9 m (30 ft) hace salvación de Sabiduría (CD 14) o queda Asustada 1 minuto; repite la salvación al final de sus turnos."]},
  {o:"Conquista",c:"Paladín",l:3,lt:"Pal 3",use:"Canalizar divinidad",n:"Golpe guiado",en:"Guided Strike",src:"Xanathar · adaptado a 2024 · GM",d:["Opción de Canalizar divinidad. Al hacer una tirada de ataque, tras ver el dado y antes de saber si acierta, sumas +10."]},
  {o:"Githyanki",c:"Personaje",l:1,lt:"Especie",use:"Pasivo",n:"Resiliencia psíquica",en:"Psychic Resilience",src:"MotM p. 18 · GM",d:["Resistencia al daño psíquico: sufres la mitad."]},
  {o:"Githyanki",c:"Personaje",l:1,lt:"Especie",use:"Car · sin componentes",n:"Psiónica githyanki",en:"Githyanki Psionics",src:"MotM p. 18 · GM",d:["Conoces Mano de mago (la mano es invisible) y lo lanzas a voluntad.","Puedes lanzar Salto una vez por descanso largo sin espacio de conjuro; también con tus espacios de paladín.","Carisma es la aptitud mágica de estos conjuros y no necesitan componentes."]},
  {o:"Githyanki",c:"Personaje",l:1,lt:"Especie",use:"Desc. largo",n:"Conocimiento astral",en:"Astral Knowledge",src:"MotM p. 18 · GM",d:["Al terminar un descanso largo eliges una habilidad y un arma o herramienta: tienes competencia con ellas hasta tu próximo descanso largo.","Se eligen en Recursos (Conocimiento astral); la habilidad se marca ◐ en Atributos."]},
  {o:"Githyanki",c:"Personaje",l:1,lt:"Especie",use:"Pasivo",n:"Tipo y movimiento",en:"Creature Type",src:"MotM p. 18 · GM",d:["Humanoide Mediano. Velocidad 9 m (30 ft)."]},
  {o:"Soldado",c:"Personaje",l:1,lt:"Trasfondo",use:"1×/turno",n:"Atacante salvaje",en:"Savage Attacker",src:"PHB 2024 · dote de origen",d:["Una vez por turno, al acertar con un arma, tiras dos veces los dados de daño del arma y usas el resultado que prefieras.","Regla de mesa: solo relanza el dado del arma, no los de Castigo."]},
  {o:"Soldado",c:"Personaje",l:1,lt:"Trasfondo",use:"Pasivo",n:"Trasfondo Soldado",en:"Soldier",src:"PHB 2024",d:["Habilidades: Atletismo e Intimidación. Herramienta: juego de dados. Equipo: opción B (50 po)."]}
 ],
 featGroups:[["Paladín","Paladín","Nivel {Paladín}","sand"],["Conquista","Juramento de la Conquista","Xanathar's Guide · adaptado a 2024 · validado por el GM","ruby"],["Githyanki","Githyanki","Especie · Monsters of the Multiverse · validado por el GM","sky"],["Soldado","Soldado","Trasfondo","jade"]],
 levelUp:{
  classes:{"Paladín":{hd:"d10",die:10,fixed:6}},
  defs:{"Paladín":{5:{gains:["Ataque adicional: dos ataques con la acción de atacar.","Corcel fiel: siempre tienes Encontrar corcel preparado y puedes lanzarlo una vez gratis por descanso largo.","Conjuros: 6 preparados; espacios 4 de nivel 1 y 2 de nivel 2 (se abren los conjuros de nivel 2).","Imponer las manos sube a 25 puntos. Competencia pasa a +3.","Conjuros de juramento de la Conquista (nivel 5): Inmovilizar persona y Reflejo espiritual (Xanathar, validado GM)."]}}},
  pending:[],
  note:"Fuente: PHB 2024, capítulo 3 (Paladín) en Notion. Juramento de la Conquista desde Xanathar's Guide, adaptado a 2024 y validado por el GM."
 },
 profs:[
  {t:"Salvaciones",ic:"shield",items:[["Sabiduría","Paladín"],["Carisma","Paladín"]]},
  {t:"Habilidades",ic:"star",items:[["Atletismo","Soldado"],["Intimidación","Soldado"],["Perspicacia","Paladín"],["Persuasión","Paladín"],["Habilidad temporal ◐","Conocimiento astral · se elige en Recursos"]]},
  {t:"Armaduras",ic:"armor",items:[["Ligeras, medias y pesadas","Paladín"],["Escudos","Paladín"]]},
  {t:"Armas",ic:"sword",items:[["Sencillas y marciales","Paladín"]]},
  {t:"Herramientas",ic:"tool",items:[["Juego de dados","Soldado"],["Herramienta temporal ◐","Conocimiento astral · se elige en Recursos"]]},
  {t:"Idiomas",ic:"talk",items:[["Común",""],["Gith",""],["Dracónico",""]],note:"Según la hoja de GitHub. 🟡 Pendiente de verificar contra el cap. 2 (Común + 2) y el rasgo githyanki."}
 ],
 story:{
  title:"Crónica de la Voluntad Inquebrantable",
  portraitAlt:"Ilustración de Ki'yaj",
  sections:[
   {h:"",p:["Criado entre los githyanki como se forja una espada, Ki'yaj aprendió que la compasión era una grieta y la duda una enfermedad. No se le enseñó a preguntar por qué luchar: se le enseñó a vencer.","En una misión al Plano Material para recuperar una reliquia de mando, sus comandantes exigieron una demostración de miedo contra civiles. Ki'yaj obedeció al principio, hasta que vio que aquello era desperdicio y brutalidad sin propósito. Ese día formuló su primer pensamiento propio: un verdadero conquistador no destruye, toma control.","Desde entonces sigue una ley más antigua que cualquier comandante: la voluntad fuerte debe gobernar a la violencia. Viaja para demostrar que su voluntad supera la doctrina que lo formó, buscando tiranos, cultos y aberraciones que merezcan ser quebrados, con un odio especial por los illithids."]},
   {h:"Apariencia y carácter",p:["Githyanki de porte marcial, armadura de placas marcada por batallas astrales y escudo de acero de campaña. Habla poco y ordena mucho; mide a cada persona por la firmeza de su voluntad."],quotes:["El caos se arrodilla. El miedo obedece. Mi voluntad permanece."]}
  ],
  mysteries:["¿Qué fue de la reliquia de mando?","¿Lo consideran un desertor entre los githyanki?","¿Qué forma tomará su ley propia?","¿Puede alguien criado para someter volverse un líder digno de ser seguido?"],
  closing:"El caos se arrodilla. El miedo obedece. Mi voluntad permanece."
 },
 refs:"",
