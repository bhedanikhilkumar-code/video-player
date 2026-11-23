const fixture=require('./round791-balance-fixture.cjs');module.exports=(kind='stereo')=>{const p=fixture(kind);p.name='owned-single-polarity-'+kind+'.wav';return p;};
