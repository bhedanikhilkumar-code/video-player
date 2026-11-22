const fixture=require('./round789-polarity-fixture.cjs');module.exports=(kind='stereo')=>{const p=fixture(kind);p.name='owned-attenuation-'+kind+'.wav';return p;};
