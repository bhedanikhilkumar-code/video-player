const fixture=require('./round790-attenuation-fixture.cjs');module.exports=(kind='stereo')=>{const p=fixture(kind);p.name='owned-balance-'+kind+'.wav';return p;};
