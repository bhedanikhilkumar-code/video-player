const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,pick,files,boot})=>{
 await pick(files.slice(0,1));await p.locator('#localCompare445').evaluate(e=>e.open=true);await p.locator('#lcFile445').setInputFiles(files[1]);await p.waitForFunction(()=>document.querySelector('#lcVideo445').readyState>=2);await p.locator('#frameDiff446').evaluate(e=>e.open=true);
 async function seek(a,b){await p.locator('#lpVideo').evaluate((v,t)=>v.currentTime=t,a);await p.locator('#lcVideo445').evaluate((v,t)=>v.currentTime=t,b);await p.waitForFunction(()=>['lpVideo','lcVideo445'].every(id=>{const v=document.getElementById(id);return v.readyState>=2&&!v.seeking;}));}
 const energy=()=>p.locator('#fdCanvas446').evaluate(c=>{let d=c.getContext('2d').getImageData(0,0,c.width,c.height).data,n=0;for(let i=0;i<d.length;i+=4)n+=d[i];return n;});
 await seek(7,7);await p.locator('#fdCapture446').click();assert.equal(await energy(),0,'Identical decoded frames must be black');await seek(7,12);await p.locator('#fdCapture446').click();const initial=await energy();assert.ok(initial>10000);await p.locator('#fdGain446').fill('8');await p.locator('#fdGain446').dispatchEvent('input');await p.waitForTimeout(80);assert.ok(await energy()>initial);await p.waitForFunction(()=>!document.querySelector('#fdSave446').hidden);
 const download=p.waitForEvent('download');await p.locator('#fdSave446').click();await(await download).saveAs('/downloads/round446-frame-difference.png');await p.locator('#fdClear446').click();assert.equal(await p.locator('#fdCanvas446').isHidden(),true);assert.equal(await p.locator('#fdGain446').isDisabled(),true);
 await p.locator('#fdCapture446').click();await p.locator('#lcClose445').click();assert.equal(await p.locator('#fdSave446').isHidden(),true);
 for(let i=0;i<2;i++){await boot();assert.equal(await p.locator('#fdCanvas446').isHidden(),true);}
 console.log('PASS identical frames black, changed frames highlighted, gain updates frozen pixels, real PNG download, Clear/source invalidation and fresh/repeat loads.');
}).catch(e=>{console.error(e);process.exitCode=1;});
