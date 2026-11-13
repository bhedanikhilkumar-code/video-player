const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
for(const m of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi))new vm.Script(m[1]);
function bodyAfter(marker,start,end){const block=html.slice(html.indexOf(marker));const i=block.indexOf(start);assert(i>=0,start);const j=block.indexOf(end,i);assert(j>=0,end);return block.slice(i,j+end.length);}
const exchange=html.slice(html.indexOf('// Round 276: local-only contact sheet'));
const validSrc=bodyAfter("box.id='localExchange276'",'function valid(p){','}\n    ');
const valid=vm.runInNewContext('('+validSrc.trim()+')');
const plan={format:'vp-local-playlist',version:1,files:[{name:'lecture.webm',size:100}],index:0,position:12};
assert.equal(valid(plan),true);
for(const patch of [{version:2},{files:[]},{index:-1},{index:1},{position:NaN},{position:Infinity},{position:-1},{files:[{name:'',size:100}]},{files:[{name:'a',size:-1}]},{files:[{name:'a',size:'100'}]}])assert.equal(valid({...plan,...patch}),false,JSON.stringify(patch));
assert.equal(valid({...plan,files:Array.from({length:501},()=>plan.files[0])}),false);
const stemSrc=bodyAfter("box.id='subtitleBatch276'",'function stem(n){','}');
const stem=vm.runInNewContext('('+stemSrc+')');
assert.equal(stem('EPISODE 01.SRT'),'episode 01');
assert.equal(stem('episode.01.webm'),'episode.01');
assert.equal(stem('E\u0301pisode.vtt'),stem('Épisode.webm'));
const nodes={};function node(id){return nodes[id]||(nodes[id]={hidden:false,textContent:'',value:'100',listeners:{},setAttribute(){},classList:{toggle(){}},addEventListener(k,fn){(this.listeners[k]||(this.listeners[k]=[])).push(fn);}});}
function emit(n,k){for(const f of n.listeners[k]||[])f.call(n);}
let gain={value:3};let tick;
const loudStart=html.indexOf('    var vid = $("lpVideo"), btn = $("lpLoudBtn")');
const loudCode=html.slice(loudStart,html.indexOf('  })();',loudStart));
const loudEnv={window:{__lpNode:{gain},__lpCtx:{},__lpRms275:()=>0.12},$:node,prefs:{loud275:true},T:x=>x,savePrefs(){},setInterval(fn){tick=fn;}};
vm.runInNewContext('(function(){'+loudCode+'})();',loudEnv);
const video=node('lpVideo');Object.assign(video,{paused:false,ended:false,currentSrc:'blob:one',readyState:4});node('lpGain').value='300';
tick();assert(gain.value<3,'matching attenuates loud input');
emit(video,'loadstart');assert.equal(gain.value,3,'new file restores base gain');
tick();emit(video,'emptied');assert.equal(gain.value,3,'closing restores base gain');
// The real silence-skipping closure: own seeks keep the detection window,
// while a manual seek requires 1.5 seconds of new silence.
let silentTick;const snodes={};function snode(id){return snodes[id]||(snodes[id]={hidden:false,textContent:'',listeners:{},setAttribute(){},classList:{toggle(){}},addEventListener(k,f){(this.listeners[k]||(this.listeners[k]=[])).push(f);}});}
let now=0,hops=0;const sv=snode('lpVideo');Object.assign(sv,{paused:false,ended:false,currentSrc:'blob:silent',readyState:4,seeking:false,duration:100});Object.defineProperty(sv,'currentTime',{get(){return now;},set(v){now=v;hops++;emit(sv,'seeking');emit(sv,'seeked');}});
const silentStart=html.indexOf('    var vid = $("lpVideo"), btn = $("lpSilBtn")');
const silentCode=html.slice(silentStart,html.indexOf('  })();',silentStart));
const se={window:{__lpCtx:{},__lpMeterSource276:{}},$:snode,prefs:{sil275:true},T:x=>x,savePrefs(){},setInterval(f){silentTick=f;},Uint8Array,Math,isFinite};
// analyser substitute reports digital silence, matching a silent local file.
se.window.__lpCtx.createAnalyser=()=>({fftSize:2048,getByteTimeDomainData(a){a.fill(128);}});se.window.__lpMeterSource276.connect=()=>{};
vm.runInNewContext('(function(){'+silentCode+'})();',se);
for(let i=0;i<24;i++){now+=0.25;silentTick();}
assert(hops>=10,'automatic hops no longer reset themselves');
now=10;emit(sv,'seeking');const oldHops=hops;for(let i=0;i<4;i++){now+=0.25;silentTick();}assert.equal(hops,oldHops,'manual seeks reset the window');
assert(html.includes('window.__lpMeterSource276.connect(analyser)'));
assert(!html.includes('window.__lpNode.connect(analyser)'));
assert(html.includes('return ctx.setSinkId(id)'));
assert(html.includes("['pause','seeking','emptied','loadstart'].forEach"));
assert(html.includes('output276.gain.setValueAtTime(0,ctx.currentTime);flushDelay276()'));
assert(html.includes('window.vpStorageWarning276 = storageWarn'));
for(const name of ['Video contact sheet','Subtitle folder match','Audio sync delay','Local playlist exchange','Browse media folder'])assert(exchange.includes(name),name);
console.log('round276: script syntax, recipe validation, filename matching, real audio reset and silence-detector regression checks passed');
