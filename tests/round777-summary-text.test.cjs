const {test}=require('node:test'),assert=require('node:assert/strict'),api=require('./round777-summary-levels.test.cjs'),wave=require('./round555-wav.test.cjs');module.exports=api;
if(require.main===module){test('compact deterministic stereo summary contains exact counts rounded levels and no private metadata',()=>{const r=api.summaryFixture(),before=JSON.stringify(r),text=api.sampleSummaryText777(r);assert.equal(text,`WAV sample summary
Encoding: PCM integer
Bits per sample: 16
Channels: 2
Sample rate (Hz): 8000
Sample frames: 4
Duration (seconds): 0.000500

Left channel
Finite samples: 4
Non-finite samples: 0
Peak (dBFS): -6.021
RMS (dBFS): -9.031
DC offset: 0.000000

Right channel
Finite samples: 4
Non-finite samples: 0
Peak (dBFS): -12.041
RMS (dBFS): -12.041
DC offset: 0.250000

Levels and duration are rounded. Counts are exact.
No filename or raw samples included.`);assert.ok(text.length<1000);assert.equal(JSON.stringify(r),before);assert.doesNotMatch(text,/private|sensitive|opening|jointProfile/i);});
test('mono silence and all nonfinite values remain distinguishable and every fixed label passes through translation',()=>{const r={...api.summaryFixture(),channels:1,stats:[{count:4,invalid:0,peak:0,rms:0,dc:0}]};let text=api.sampleSummaryText777(r,k=>'['+k+']');assert.match(text,/\[Mono channel\]/);assert.match(text,/\[Peak \(dBFS\)\]: -Infinity/);assert.doesNotMatch(text,/Left channel|Right channel/);r.stats[0]={count:0,invalid:4,peak:null,rms:null,dc:null};text=api.sampleSummaryText777(r);assert.match(text,/Finite samples: 0/);assert.match(text,/Non-finite samples: 4/);assert.match(text,/Peak \(dBFS\): --/);assert.match(text,/DC offset: --/);});
test('real scanned PCM depths and float overrange summaries agree with original unmodified result fields',async()=>{for(const bits of [8,16,24,32]){const result=await api.scan(new Blob([wave({bits,frames:4})]));const before=JSON.stringify(result),text=api.sampleSummaryText777(result);assert.match(text,new RegExp('Bits per sample: '+bits));assert.match(text,/Sample frames: 4/);assert.match(text,/Peak \(dBFS\): -6\.021/);assert.equal(JSON.stringify(result),before);}const f=await api.scan(new Blob([wave({bits:32,float:true,frames:4,channels:1,values:[[2,-1,NaN,Infinity]]})]));const text=api.sampleSummaryText777(f);assert.match(text,/Encoding: IEEE float/);assert.match(text,/Finite samples: 2/);assert.match(text,/Non-finite samples: 2/);assert.match(text,/Peak \(dBFS\): 6\.021/);});}
