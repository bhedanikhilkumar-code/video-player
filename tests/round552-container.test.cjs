const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8'),source=html.slice(html.indexOf('  window.VPContainer552='),html.indexOf('  Object.assign(TR_MSG,{',html.indexOf('  window.VPContainer552=')));const w={};vm.runInNewContext(source,{window:w});const scan=w.VPContainer552.scan;
function box(type,payload=Buffer.alloc(0),size){const h=Buffer.alloc(8);h.writeUInt32BE(size===undefined?payload.length+8:size);h.write(type,4);return Buffer.concat([h,payload]);}
function riff(chunks,extra=Buffer.alloc(0)){const all=Buffer.concat(chunks),h=Buffer.alloc(12);h.write('RIFF');h.writeUInt32LE(all.length+4,4);h.write('WAVE',8);return new Blob([h,all,extra]);}
function chunk(type,b){const h=Buffer.alloc(8);h.write(type);h.writeUInt32LE(b.length,4);return Buffer.concat([h,b,b.length%2?Buffer.alloc(1):Buffer.alloc(0)]);}
function fmt(code=1){const f=Buffer.alloc(16);f.writeUInt16LE(code,0);f.writeUInt16LE(2,2);f.writeUInt32LE(48000,4);f.writeUInt32LE(192000,8);f.writeUInt16LE(4,12);f.writeUInt16LE(16,14);return f;}
(async()=>{
 let r=await scan(riff([chunk('JUNK',Buffer.from([9])),chunk('fmt ',fmt()),chunk('data',Buffer.alloc(40))]));assert.equal(r.kind,'WAVE');assert.equal(r.rows[0].size,10);assert.equal(r.rows[1].offset,22);assert.equal(r.rows[2].offset,46);assert.equal(r.audio.rate,48000);assert.equal(r.audio.channels,2);assert.equal(r.audio.pcm,true);assert.equal(r.complete,true);assert.equal(r.hasData,true);assert.equal(r.readBytes,52);
 r=await scan(riff([chunk('fmt ',fmt()),chunk('data',Buffer.alloc(0))],Buffer.from([1,2])));assert.equal(r.trailing,2);assert.equal(r.hasData,true);
 const ext=Buffer.alloc(40);fmt(65534).copy(ext);ext.writeUInt16LE(22,16);ext.writeUInt16LE(16,18);ext.writeUInt32LE(3,24);Buffer.from([0,0,16,0,128,0,0,170,0,56,155,113]).copy(ext,28);r=await scan(riff([chunk('fmt ',ext)]));assert.equal(r.audio.code,3);assert.equal(r.audio.pcm,true);assert.equal(r.hasData,false);
 const ftyp=box('ftyp',Buffer.from('isom\0\0\0\0'));r=await scan(new Blob([ftyp,box('free'),box('mdat',Buffer.alloc(4))]));assert.equal(r.kind,'ISO media');assert.equal(r.brand,'isom');assert.equal(r.rows.length,3);assert.equal(r.rows[2].offset,24);
 const extended=Buffer.alloc(16);extended.writeUInt32BE(1);extended.write('mdat',4);extended.writeBigUInt64BE(16n,8);r=await scan(new Blob([ftyp,extended]));assert.equal(r.rows[1].size,16);
 r=await scan(new Blob([ftyp,box('mdat',Buffer.alloc(10),0)]));assert.equal(r.rows[1].size,18);
 r=await scan(new Blob([ftyp,...Array.from({length:300},()=>box('free'))]));assert.equal(r.rows.length,256);assert.equal(r.complete,false);assert.ok(r.readBytes<2200);
 await assert.rejects(scan(new Blob([Buffer.alloc(4)])),/truncated/);await assert.rejects(scan(new Blob([Buffer.alloc(20)])),/unsupported/);
 await assert.rejects(scan(new Blob([ftyp,box('mdat',Buffer.alloc(0),100)])),/truncated/);await assert.rejects(scan(new Blob([ftyp,box('mdat',Buffer.alloc(0),4)])),/malformed/);
 const huge=Buffer.from(extended);huge.writeBigUInt64BE(9007199254740992n,8);await assert.rejects(scan(new Blob([ftyp,huge])),/malformed/);
 const broken=Buffer.from(await riff([chunk('data',Buffer.alloc(1))]).arrayBuffer());broken.writeUInt32LE(1000,4);await assert.rejects(scan(new Blob([broken])),/truncated/);
 await assert.rejects(scan(riff([chunk('fmt ',Buffer.alloc(15))])),/malformed/);
 let reads=0;await assert.rejects(scan({size:20,slice(){reads++;return {arrayBuffer:async()=>new ArrayBuffer(12)};}},()=>true),/cancelled/);assert.equal(reads,0);
 let cancelled=false;await assert.rejects(scan({size:20,slice(){return {arrayBuffer:async()=>{cancelled=true;return new ArrayBuffer(12);}};}},()=>cancelled),/cancelled/);
 // A 1GiB mdat is skipped, not allocated or read into memory.
 const bigSize=1073741824,head=Buffer.concat([ftyp,box('mdat',Buffer.alloc(0),bigSize)]);let requested=0;
 r=await scan({size:ftyp.length+bigSize,slice(a,b){requested+=b-a;assert.ok(b-a<=40);return new Blob([head.subarray(a,b)]);}});assert.equal(r.rows[1].size,bigSize);assert.ok(requested<=40);assert.equal(r.complete,true);
 console.log('PASS container parser: WAVE/odd padding/extensible float/trailing bytes, MP4/extended/EOF box sizes, 256 cap, malformed/truncated/unknown, pre/post-read cancellation, 1GiB payload skipped with 36 header bytes');
})().catch(e=>{console.error(e);process.exitCode=1;});
