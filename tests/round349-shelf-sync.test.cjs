const assert=require('node:assert/strict'),fs=require('fs'),vm=require('vm');
const h=fs.readFileSync(require('path').join(__dirname,'../index.html'),'utf8');
const start=h.indexOf('    function write(items)',h.indexOf('card.id = "mediaShelf346"'));
assert(start>0);const line=h.slice(start,h.indexOf('\n',start));let events=[];
const c={localStorage:{setItem(){}},key:'shelf',JSON,cleanMediaShelf346:x=>x,document:{dispatchEvent:e=>events.push(e.type)},Event:class{constructor(type){this.type=type;}},paint(){},state:''};vm.createContext(c);vm.runInContext(line,c);assert.equal(c.write([{url:'a'}]),true);assert.deepEqual(events,['vp-media-shelf346-change']);events=[];c.localStorage.setItem=()=>{throw Error('full')};assert.equal(c.write([]),false);assert.deepEqual(events,[]);console.log('Shelf writes notify same-tab dependents only after storage succeeds.');
