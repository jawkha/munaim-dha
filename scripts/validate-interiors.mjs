import assert from 'node:assert/strict';
import * as THREE from '../site/assets/three.module.js';
import {makeHouse,P} from '../site/concept/scene.js';
import {FT,floors,partitions,envelopeForFloor} from '../site/concept/design.js';
import {roomSpawn} from '../site/concept/navigation.js';
import {finishes,roomDesign} from '../site/concept/interior-design.js';
import {batchFurniture,batchArchitecture} from '../site/concept/batch-furniture.js';
const scene=new THREE.Scene(),house=makeHouse(scene,null,{loadAssets:false});
scene.updateMatrixWorld(true);
const issues=[],inventory=house.interiors.inventory;
const placed=inventory.map(v=>({...v,box:new THREE.Box3().setFromObject(v.group)}));
const solid=placed.filter(v=>!v.decorative);
for(const f of floors)for(const r of f.rooms){
 const scheme=roomDesign[r.id];assert.ok(scheme,`Finish schedule: ${r.id}`);
 for(const key of ['wall','accent','floor','wood','fabric'])assert.ok(finishes[scheme[key]],`Missing ${key} finish: ${r.id}`);
 if(!['stair','escape','solar','terrace','services','hotwater','pool'].includes(r.kind))assert.ok(solid.some(v=>v.room===r.id),`Unfurnished room: ${r.id}`);
}
// Room dimensions constrain furniture and rugs, independently of their layout code.
for(const v of placed){
 const b=v.box,[x0,z0,x1,z1]=v.bounds,actual=[b.min.x/FT+25,45-b.max.z/FT,b.max.x/FT+25,45-b.min.z/FT];
 if(actual[0]<x0-.05||actual[1]<z0-.05||actual[2]>x1+.05||actual[3]>z1+.05)issues.push(`Outside room: ${v.room} / ${v.label}`);
 if(b.max.y/FT>floors[v.floor].elevation+floors[v.floor].height)issues.push(`Above ceiling: ${v.room} / ${v.label}`);
 assert.ok(actual.every(Number.isFinite),'Non-finite furniture geometry');
}
for(let i=0;i<solid.length;i++)for(let j=0;j<i;j++){
 const a=solid[i],b=solid[j];if(a.room!==b.room)continue;
 const s=a.box.clone().intersect(b.box).getSize(new THREE.Vector3()).divideScalar(FT);
 if(s.x>.13&&s.z>.13&&s.y>.1)issues.push(`Overlapping furniture: ${a.room} / ${a.label} / ${b.label}`);
}
const hits=(v,box)=>{let hit=false;v.group.traverse(o=>{if(o.isMesh&&new THREE.Box3().setFromObject(o).intersectsBox(box))hit=true;});return hit;};
let doorChecks=0,spawnChecks=0;
for(let f=0;f<4;f++){
 const items=solid.filter(v=>v.floor===f);
 for(const r of floors[f].rooms){
  const p=roomSpawn(f,r),body=new THREE.Box3(new THREE.Vector3(p.x-.15,p.y+.4,p.z-.15),new THREE.Vector3(p.x+.15,p.y+1.65,p.z+.15));
  spawnChecks++;for(const v of items)if(hits(v,body))issues.push(`Viewpoint inside furniture: ${r.id} / ${v.label}`);
 }
 for(const [a,z,b,d,opens]of [...envelopeForFloor(f),...(partitions[floors[f].id]||[])]){
  const length=Math.hypot(b-a,d-z),dx=(b-a)/length,dz=(d-z)/length;
  for(const[o,w,type]of opens){
   if(!['door','entry'].includes(type))continue;doorChecks++;
   const p0=P(a+dx*(o+.3),floors[f].elevation+.5,z+dz*(o+.3)),p1=P(a+dx*(o+w-.3),floors[f].elevation+6.5,z+dz*(o+w-.3));
   const opening=new THREE.Box3().setFromPoints([p0,p1]).expandByVector(new THREE.Vector3(Math.abs(dz)*.7*FT,0,Math.abs(dx)*.7*FT));
   for(const v of items)if(hits(v,opening))issues.push(`Furniture at door: ${v.room} / ${v.label}`);
  }
 }
}
// Batching must retain the same world-space geometry while reducing draw calls.
const bounds=house.furn.map(g=>new THREE.Box3().setFromObject(g,true));
const triangleCount=root=>{let count=0;root.traverse(o=>{if(o.isMesh)count+=(o.geometry.index?.count||o.geometry.attributes.position.count)/3;});return count;};
const triangles=house.furn.map(triangleCount),batch=batchFurniture(house.furn);
scene.updateMatrixWorld(true);
house.furn.forEach((g,i)=>{const b=new THREE.Box3().setFromObject(g,true);assert.ok(b.min.distanceTo(bounds[i].min)<1e-5&&b.max.distanceTo(bounds[i].max)<1e-5,'Batch changed furniture bounds');assert.equal(triangleCount(g),triangles[i],'Batch lost triangles');});
assert.ok(batch.after<batch.before/4,'Furniture batching did not reduce draw calls');
const allBefore=new THREE.Box3().setFromObject(scene,true),allTriangles=triangleCount(scene);
const architectureBatch=batchArchitecture(house.groups,house.furn,house.tower);scene.updateMatrixWorld(true);
const allAfter=new THREE.Box3().setFromObject(scene,true);assert.ok(allBefore.min.distanceTo(allAfter.min)<1e-5&&allBefore.max.distanceTo(allAfter.max)<1e-5,'Architecture batching changed bounds');assert.equal(triangleCount(scene),allTriangles,'Architecture batching lost triangles');
assert.ok(house.furn.slice(0,4).every((g,i)=>g.parent===house.groups[i]),'Architecture batching detached furniture toggle');
console.log(JSON.stringify({finishSchedules:Object.keys(roomDesign).length,furnitureGroups:solid.length,decorativeGroups:placed.length-solid.length,doorChecks,spawnChecks,batch,architectureBatch,issues},null,2));
assert.equal(issues.length,0,'Interior placement checks failed');
