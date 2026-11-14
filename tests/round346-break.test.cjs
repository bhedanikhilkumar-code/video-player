const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');const h=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
let resumed=null,cleared=0;const snapshot={local:{src:'blob:original'}};const c=vm.createContext({window:{__vpResumePlayback346:s=>resumed=s},pausedMedia301:snapshot,wasPlaying301:true,clearCard301:()=>cleared++});
const start=h.indexOf('  function closeCard301(resume) {'),end=h.indexOf('  function openCard301(',start);vm.runInContext(h.slice(start,end),c);c.closeCard301(true);assert.equal(resumed,snapshot);assert.equal(c.pausedMedia301,null);assert.equal(c.wasPlaying301,false);assert.equal(cleared,1);
resumed=null;c.pausedMedia301=snapshot;c.closeCard301(false);assert.equal(resumed,null);
assert.match(h,/if \(ans === null\) \{ closeCard301\(true\); return; \}/);assert.match(h,/pausedMedia301 = window\.__vpCapturePlayback346/);assert.doesNotMatch(h,/wasLocal301/);
console.log('Round 346 manual-break cancellation clears the card and resumes only its captured source.');
