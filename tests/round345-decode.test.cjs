const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');let i=html.indexOf('    function decodeAudioSafe345(');assert(i>=0);const c=vm.createContext({});vm.runInContext(html.slice(i,html.indexOf('\n',i)),c);
(async()=>{let failures=0,successes=0;const ok=()=>successes++,fail=()=>failures++;
c.decodeAudioSafe345({decodeAudioData(d,yes,no){no();return Promise.reject(new Error('No audio stream'));}},new ArrayBuffer(1),ok,fail);
c.decodeAudioSafe345({decodeAudioData(){throw new Error('Unsupported decoder');}},new ArrayBuffer(1),ok,fail);
c.decodeAudioSafe345({decodeAudioData(d,yes){yes();return Promise.resolve();}},new ArrayBuffer(1),ok,fail);
c.decodeAudioSafe345({decodeAudioData(d,yes){yes();}},new ArrayBuffer(1),ok,fail);
await new Promise(r=>setTimeout(r,10));assert.equal(failures,2);assert.equal(successes,2);assert.equal((html.match(/decodeAudioSafe345\(dc, rd.result/g)||[]).length,2);console.log('Round 345 modern Promise, legacy callback and synchronous decoder failure paths passed.');})();
