// Run: node tests/round346-lock.test.cjs
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const start=html.indexOf('  // Privacy covers also stop native media resumes');
let play;let covered=true,paused=0,stopped=0;const v={};
const c=vm.createContext({document:{addEventListener:(event,fn,capture)=>{assert.equal(event,'play');assert.equal(capture,true);play=fn;}},$:()=>v,playbackCovered345:()=>covered,HTMLMediaElement:{prototype:{pause(){assert.equal(this,v);paused++;}}}});
vm.runInContext(html.slice(start,html.indexOf('  function send(',start)),c);
play({target:v,stopImmediatePropagation(){stopped++;}});assert.equal(paused,1);assert.equal(stopped,1);
covered=false;play({target:v});assert.equal(paused,1);
covered=true;play({target:{}});assert.equal(paused,1);
let localPause=0,softPending=42,cleared=0;const p=html.indexOf('  vid.pause = function () {');
const c2=vm.createContext({vid:{paused:false},document:{querySelector:()=>true},clearTimeout:x=>{assert.equal(x,42);cleared++;},softPend283:softPending,origPause283:()=>localPause++});
vm.runInContext(html.slice(p,html.indexOf('\n  };',p)+5),c2);c2.vid.pause();assert.equal(localPause,1);assert.equal(cleared,1);
assert.match(html,/ov\.showModal\(\); pauseCoveredYouTube345\(\);\s+var local346.*local346\.pause\(\)/);
console.log('Round 346 local cover guard, immediate soft-pause bypass and app-lock regression checks passed.');
