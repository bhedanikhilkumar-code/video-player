const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const h=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8'),start=h.indexOf('    var watching = false, expected347');assert(start>0);
const handlers={},vidHandlers={},docHandlers={};let lang='en',opens=0;const msg={textContent:''},inp={value:'https://example.org/a.mp4',focus(){},addEventListener(e,f){handlers[e]=f;}},vid={currentSrc:'https://example.org/a.mp4',addEventListener(e,f){vidHandlers[e]=f;}};
const c=vm.createContext({URL,msg,inp,vid,go:{addEventListener(e,f){handlers.go=f;}},row:{scrollIntoView(){}},document:{addEventListener(e,f){docHandlers[e]=f;}},window:{__relang:[],__lpShowUrl303:()=>{opens++;return true;}},T:t=>t?lang+':'+t:'',$:()=>null});
vm.runInContext(h.slice(start,h.indexOf('    if (window.__vpWnew283)',start)),c);
handlers.go();assert.equal(opens,1);vidHandlers.loadedmetadata();assert.match(msg.textContent,/en:Playing from/);lang='hi';c.window.__relang[0]();assert.match(msg.textContent,/hi:Playing from/);
inp.value='https://example.org/b.mp4';handlers.go();vid.currentSrc='blob:another-file';vidHandlers.error();assert.equal(msg.textContent,'');
inp.value='bad';handlers.go();assert.match(msg.textContent,/hi:Paste a link/);docHandlers['vp-local-closed']();assert.equal(msg.textContent,'');
console.log('Round 347 direct-link status retranslates, ignores replaced sources and clears on close.');
