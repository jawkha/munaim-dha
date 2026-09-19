import assert from 'node:assert/strict';
import * as THREE from '../site/assets/three.module.js';
import {makeHouse,P} from '../site/concept/scene.js';
import {floors,footprint,FT,energy,insetPolygon} from '../site/concept/design.js';
import {navigation,roomSpawn} from '../site/concept/navigation.js';
const scene=new THREE.Scene(),house=makeHouse(scene,null,{loadAssets:false});scene.updateMatrixWorld(true);
const nav=navigation(house),issues=[];let rooms=0,stairSamples=0;
for(let f=0;f<4;f++)for(const r of floors[f].rooms){const p=roomSpawn(f,r),g=nav.groundAt(p.x,p.z,p.y);rooms++;if(g===undefined||Math.abs(g-p.y)>.02||nav.blocked(p.x,p.z,p.y))issues.push(`Room spawn: ${r.id}, support=${g}, blocked=${nav.blocked(p.x,p.z,p.y)}`);}
const flights=[];
for(let f=0;f<3;f++){const a=floors[f].elevation,b=floors[f+1].elevation,m=(a+b)/2;flights.push([24.25,37.75,47.8333333333,a,m,11],[29.75,47.8333333333,37.75,m,b,11]);}
flights.push([7.6,79.5,70.3333333333,-8.5,-3.25,10],[12.7,70.3333333333,79.5,-3.25,2,10]);
for(const[x,z0,z1,y0,y1,n]of flights){assert.ok((y1-y0)/n*12<=7.001,'riser height');assert.ok(Math.abs(z1-z0)/n*12>=10.999,'tread depth');for(const reverse of[false,true]){let previous=(reverse?y1:y0)*FT;for(let i=0;i<160;i++){let t=(i+.5)/160;if(reverse)t=1-t;const p=P(x,0,z0+(z1-z0)*t),g=nav.groundAt(p.x,p.z,previous);stairSamples++;if(g===undefined||nav.blocked(p.x,p.z,g??previous)){issues.push(`Stair ${x},${z0},${y0}, reverse=${reverse}, sample=${i}, support=${g}`);break;}previous=g;}const target=(reverse?y0+(y1-y0)/n:y1)*FT;if(Math.abs(previous-target)>.02)issues.push('Stair end level mismatch');}}
// Trace stair turns, the step-free entrance and the independent exit at small steps.
const traces=[];
for(let f=0;f<3;f++){const y=floors[f].elevation,b=floors[f+1].elevation;traces.push({name:'Main stair '+f,y,points:[[24.25,36.5],[24.25,49.7],[29.75,49.7],[29.75,36.5]],end:b});}
traces.push({name:'Escape stair',y:-8.5,points:[[16.5,81.5],[7.6,81.5],[7.6,68.6],[12.7,68.6],[12.7,89]],end:.05},{name:'Entry ramp',y:.05,points:[[44,3],[25.8,3],[25.8,16.8]],end:2});
let routeSamples=0;
for(const t of traces){let y=t.y*FT;for(let k=1;k<t.points.length;k++){const a=t.points[k-1],b=t.points[k],n=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])*12);for(let i=1;i<=n;i++){const p=P(a[0]+(b[0]-a[0])*i/n,0,a[1]+(b[1]-a[1])*i/n),g=nav.groundAt(p.x,p.z,y);routeSamples++;if(g===undefined||nav.blocked(p.x,p.z,g??y)){issues.push(t.name+' continuous route blocked at '+JSON.stringify([p.x/FT+25,45-p.z/FT,y/FT]));break;}y=g;}}if(Math.abs(y/FT-t.end)>.1)issues.push(t.name+' arrival height');}
assert.equal(house.solarPanels.length,26);assert.equal(energy.modules*energy.moduleWatts,energy.kwp*1000);
const centreline=insetPolygon(footprint,.5);for(const [x,z]of centreline){assert.ok(x-.5>=5-1e-6&&x+.5<=45+1e-6&&z-.5>=15-1e-6&&z+.5<=83+1e-6,'setback envelope');}
function inside(x,z){let ok=false;for(let i=0,j=footprint.length-1;i<footprint.length;j=i++){const a=footprint[i],b=footprint[j];if((a[1]>z)!==(b[1]>z)&&x<(b[0]-a[0])*(z-a[1])/(b[1]-a[1])+a[0])ok=!ok;}return ok;}
const pvBoxes=house.solarPanels.map(p=>new THREE.Box3().setFromObject(p));
for(let i=0;i<pvBoxes.length;i++){const b=pvBoxes[i];for(const x of[b.min.x,b.max.x])for(const z of[b.min.z,b.max.z])assert.ok(inside(x/FT+25,45-z/FT),'PV outside roof');for(let j=0;j<i;j++){const a=pvBoxes[j];assert.ok(!(b.min.x<a.max.x&&b.max.x>a.min.x&&b.min.z<a.max.z&&b.max.z>a.min.z),'PV module overlap');}}
const pool=P(37,2,68);assert.equal(nav.groundAt(pool.x,pool.z,2*FT),undefined,'pool water must not support a walker');
const slabRay=new THREE.Raycaster(P(37,0,68),new THREE.Vector3(0,-1,0));assert.equal(slabRay.intersectObjects(house.slabs[0].children,true).length,0,'no basement under pool');
// Check every room is connected to its main landing on its own level, using actual wall collision and floor geometry.
const routes=[];
for(let f=0;f<4;f++){
 const y=floors[f].elevation*FT,step=.5,valid=new Map();
 const key=(x,z)=>x+','+z;
 const free=(x,z)=>{const k=key(x,z);if(valid.has(k))return valid.get(k);const p=P(x,y/FT,z),g=nav.groundAt(p.x,p.z,y);const ok=g!==undefined&&Math.abs(g-y)<.03&&!nav.blocked(p.x,p.z,y);valid.set(k,ok);return ok;};
 const queue=[[29.5,35.5]],seen=new Set([key(...queue[0])]);
 for(let i=0;i<queue.length;i++){const[x,z]=queue[i];for(const[dx,dz]of[[step,0],[-step,0],[0,step],[0,-step]]){const a=x+dx,b=z+dz,k=key(a,b);if(a<1||a>49||b<1||b>89||seen.has(k)||!free(a,b))continue;seen.add(k);queue.push([a,b]);}}
 for(const r of floors[f].rooms){const p=roomSpawn(f,r),x=Math.round((p.x/FT+25)/step)*step,z=Math.round((45-p.z/FT)/step)*step;if(!seen.has(key(x,z)))issues.push('Unreachable room on level '+f+': '+r.id);}
 routes.push({floor:floors[f].id,reachableSamples:seen.size});
}
console.log(JSON.stringify({roomSpawns:rooms,stairSamples,routeSamples,solarModules:house.solarPanels.length,routes,issues},null,2));
assert.equal(issues.length,0,'Concept navigation checks failed');
