import * as THREE from 'three';
import {mergeGeometries} from '../assets/addons/utils/BufferGeometryUtils.js';

// Static furniture shares materials. Bake its transforms once to reduce draw calls.
// Transparent meshes retain individual depth sorting; walls and navigation stay untouched.
export function batchFurniture(roots){
 let before=0,after=0;
 for(const root of roots){
  root.updateWorldMatrix(true,true);
  const inverse=root.matrixWorld.clone().invert(),buckets=new Map();
  root.traverse(o=>{if(!o.isMesh)return;before++;if(Array.isArray(o.material)||o.material.transparent)return;const key=o.material.uuid;let bucket=buckets.get(key);if(!bucket){bucket=[];buckets.set(key,bucket);}bucket.push(o);});
  for(const meshes of buckets.values()){
   if(meshes.length<2)continue;
   const geometries=meshes.map(mesh=>{
    const g=mesh.geometry.index?mesh.geometry.toNonIndexed():mesh.geometry.clone();
    g.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inverse,mesh.matrixWorld));
    return g;
   });
   const merged=mergeGeometries(geometries,false);
   if(!merged){geometries.forEach(g=>g.dispose());continue;}
   const mesh=new THREE.Mesh(merged,meshes[0].material);mesh.castShadow=mesh.receiveShadow=true;mesh.name='Batched furniture';root.add(mesh);
   for(const o of meshes){o.removeFromParent();o.geometry.dispose();}
   geometries.forEach(g=>g.dispose());
  }
  root.traverse(o=>{if(o.isMesh)after++;});
 }
 return {before,after};
}

export function batchArchitecture(groups,furniture,tower){
 const roots=[];
 groups.forEach((group,i)=>{
  const shell=new THREE.Group();shell.name='Architectural finishes';
  for(const child of [...group.children])if(child!==furniture[i]&&!child.isLight)shell.add(child);
  group.add(shell);roots.push(shell);
 });
 roots.push(tower);
 return batchFurniture(roots);
}
