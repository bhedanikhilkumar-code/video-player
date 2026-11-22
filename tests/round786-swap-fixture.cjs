module.exports=function(mode='stereo'){const source=require('./round785-side-fixture.cjs')(mode);return{...source,name:'swap-source-'+mode+'.wav'};};
