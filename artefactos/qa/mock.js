// Firestore-like mock for window.claude.use("db"), with async acks like the real service
(function(){
  const STORE=window.__STORE__||{}; const L=[]; // listeners {path,isCol,cb}
  const LAT=window.__LAT__||120;
  window.__WRITES__=[];
  const colOf=p=>p.split('/').slice(0,-1).join('/');
  function docSnap(p,pending){const d=STORE[p];return {exists:d!==undefined,id:p.split('/').pop(),data:()=>d===undefined?undefined:JSON.parse(JSON.stringify(d)),metadata:{hasPendingWrites:!!pending,fromCache:false}};}
  function colSnap(c){const docs=Object.keys(STORE).filter(k=>colOf(k)===c).sort().map(k=>docSnap(k));return {docs,metadata:{hasPendingWrites:false,fromCache:false}};}
  function notify(p,pending){L.forEach(l=>{ if(!l.isCol&&l.path===p) l.cb(docSnap(p,pending)); if(l.isCol&&l.path===colOf(p)) l.cb(colSnap(l.path)); });}
  function write(p,fn){ window.__WRITES__.push(p);
    return new Promise((res,rej)=>{ if(window.__FAIL__){setTimeout(()=>rej({code:"unavailable"}),LAT);return;}
      fn(); notify(p,true); setTimeout(()=>{notify(p,false);res();},LAT); });}
  let auto=0;
  const db={
    doc:p=>({
      onSnapshot:(cb,err)=>{const l={path:p,isCol:false,cb};L.push(l);setTimeout(()=>cb(docSnap(p)),30);return ()=>{const i=L.indexOf(l);if(i>=0)L.splice(i,1);};},
      set:d=>write(p,()=>{STORE[p]=JSON.parse(JSON.stringify(d));}),
      update:d=>write(p,()=>{STORE[p]=Object.assign({},STORE[p]||{},JSON.parse(JSON.stringify(d)));}),
      delete:()=>write(p,()=>{delete STORE[p];}),
      get:()=>Promise.resolve(docSnap(p))
    }),
    collection:c=>({
      onSnapshot:(cb,err)=>{const l={path:c,isCol:true,cb};L.push(l);setTimeout(()=>cb(colSnap(c)),30);return ()=>{const i=L.indexOf(l);if(i>=0)L.splice(i,1);};},
      add:d=>{const id="auto"+(++auto);return write(c+"/"+id,()=>{STORE[c+"/"+id]=JSON.parse(JSON.stringify(d));}).then(()=>({id}));}
    })
  };
  window.claude={use:async k=>k==="db"?db:(k==="assets"?{upload:async()=>({id:"x"}),url:()=>"",delete:async()=>{}}:null)};
  window.__DB__=STORE;
})();
