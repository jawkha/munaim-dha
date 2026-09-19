import * as THREE from 'three';
import {FT,floors} from './design.js';
export const eye=1.65;
export function roomSpawn(f,r){
 const [a,b,c,d]=r.rect;let x=(a+c)/2,z=b+2.3,yaw=0;
 if(['bed','single','twin'].includes(r.kind)){x=a+2.1;z=b+2.2;yaw=-.43;}
 if(['bath','wardrobe','pantry','filter','laundry','services','hotwater'].includes(r.kind))z=(b+d)/2;
 if(r.kind==='stair'){x=29.4;z=35.7;}
 if(r.id==='escape'){x=16.5;z=80;yaw=Math.PI/2;}
 if(r.id==='pool'){x=30.5;z=60;yaw=-.55;}
 if(r.id==='solar'){x=24;z=56;yaw=Math.PI/2;}
 if(['terrace','drying'].includes(r.id)){x=28;z=19;yaw=.1;}
 if(r.id==='hotwater'){x=41.5;z=37;yaw=Math.PI/2;}
 if(r.id==='services'){x=36.8;z=46;yaw=Math.PI/2;}
 if(r.id==='family'){x=26;z=63;yaw=Math.PI/2;}
 if(r.kind==='kitchen'||r.kind==='dirty'){x=(a+c)/2;z=(b+d)/2;}
 if(r.kind==='lounge'){x=c-2;z=b+2.5;}
 // Furnished entry viewpoints sit in clear aisles and face the room's focal furniture.
 const views={drawing:[18,25.4,13.8,33],parents:[40.6,28.9,36.3,20.5],master:[8.8,23.3,13.8,26.3],bed2:[34.5,26,38,23.8],bed3:[19.6,51.5,10.8,48.6],bed4:[10.4,57.5,14.1,63.4],guest:[25,66.5,23.5,76],lounge:[29.8,25.5,27,29],landing:[20.5,56.5,25.8,60],staff2:[16.2,61.5,10.8,62.5],staff:[22,73,24.6,78.2],dining:[20.8,71.1,24.5,77],cinema:[19.8,26.2,11.4,37.8],mbath:[8.3,35.3,11,37],filter:[38.5,48.5,42,51.6],laundry:[39,49.7,42,52.3]};
 if(views[r.id]){const v=views[r.id];x=v[0];z=v[1];yaw=Math.atan2(-(v[2]-x),v[3]-z);}
 return {x:(x-25)*FT,z:(45-z)*FT,y:floors[f].elevation*FT,yaw};
}
export function navigation(house){
 const ceilingRay=new THREE.Raycaster(),up=new THREE.Vector3(0,1,0);
 const ray=new THREE.Raycaster(),down=new THREE.Vector3(0,-1,0),origin=new THREE.Vector3();
 function groundAt(x,z,feet){
  origin.set(x,feet+.23,z);ray.set(origin,down);ray.far=.72;
  const hits=ray.intersectObjects(house.walkable,false);
  for(const h of hits)if(h.face.normal.clone().transformDirection(h.object.matrixWorld).y>.5&&h.point.y<=feet+.225&&h.point.y>=feet-.47)return h.point.y;
 }
 function blocked(x,z,feet){
  ceilingRay.set(new THREE.Vector3(x,feet+.04,z),up);ceilingRay.far=eye+.08;if(ceilingRay.intersectObjects(house.walkable,false).some(h=>h.face.normal.clone().transformDirection(h.object.matrixWorld).y<-.5))return true;
  x=x/FT+25;z=45-z/FT;feet/=FT;const radius=.6;
  for(const c of house.colliders){
   if(c.rect){const[a,b,d,e]=c.rect;if(feet+eye/FT>c.y+.15&&feet<c.top-.15&&x>a-radius&&x<d+radius&&z>b-radius&&z<e+radius)return true;continue;}
   const dx=c.b[0]-c.a[0],dz=c.b[1]-c.a[1],len=dx*dx+dz*dz,t=Math.max(0,Math.min(1,((x-c.a[0])*dx+(z-c.a[1])*dz)/len));
   let bottom=c.y,top=c.top;if(c.slope){bottom=c.slope[0]+(c.slope[1]-c.slope[0])*t;top=bottom+3.5;}
   if(feet+eye/FT<=bottom+.15||feet>=top-.15)continue;
   if(Math.hypot(x-c.a[0]-dx*t,z-c.a[1]-dz*t)<radius+c.t/2)return true;
  }return false;
 }
 function step(position,dx,dz){
  for(const [mx,mz]of[[dx,dz],[dx,0],[0,dz]]){if(!mx&&!mz)continue;const x=position.x+mx,z=position.z+mz,g=groundAt(x,z,position.y);if(g!==undefined&&!blocked(x,z,g)){position.set(x,g,z);return true;}}
  return false;
 }
 return {groundAt,blocked,step};
}
