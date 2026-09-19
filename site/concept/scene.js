import * as THREE from 'three';
import {RoundedBoxGeometry} from '../assets/addons/geometries/RoundedBoxGeometry.js';
import {RoomEnvironment} from '../assets/addons/environments/RoomEnvironment.js';
import {HDRLoader} from '../assets/addons/loaders/HDRLoader.js';
import {batchFurniture,batchArchitecture} from './batch-furniture.js';
import {furnishHouse} from './interiors.js';
import {FT,SITE,footprint,core,floors,partitions,envelopeWalls,insetPolygon,roomBounds,envelopeForFloor} from './design.js';
export const P=(x,y,z)=>new THREE.Vector3((x-25)*FT,y*FT,(45-z)*FT);
export function makeHouse(scene,renderer,{loadAssets=true}={}){
 const mat=(c,r=.8,metalness=0)=>new THREE.MeshStandardMaterial({color:c,roughness:r,metalness});
 const m={wall:mat('#e7ddca'),edge:mat('#d1c5ac'),stone:mat('#d8cbb0',.65),wood:mat('#bc956b',.65),oak:mat('#96704f'),fabric:mat('#cec8b7',1),green:mat('#70806c',1),linen:mat('#e5dfcd',1),dark:mat('#26372e',.48,.25),brass:mat('#a58b59',.35,.65),soil:mat('#4c4a32'),grass:mat('#8b9b70'),concrete:mat('#acae9e'),water:new THREE.MeshPhysicalMaterial({color:'#387f88',roughness:.13,metalness:.28,transparent:true,opacity:.82,clearcoat:1}),glass:new THREE.MeshPhysicalMaterial({color:'#d1e7da',roughness:.08,metalness:.16,transparent:true,opacity:.17,depthWrite:false,side:THREE.DoubleSide}),light:new THREE.MeshStandardMaterial({color:'#ffe3a7',emissive:'#ffd286',emissiveIntensity:1.6})};
 const groups=floors.map(()=>new THREE.Group()),slabs=floors.map(()=>new THREE.Group()),furn=floors.map(()=>new THREE.Group()),stairGroups=[],walkable=[],colliders=[],solarPanels=[],lights=[],labels=[];groups.forEach((g,i)=>{scene.add(g,slabs[i]);g.add(furn[i]);});
 const site=new THREE.Group(),court=new THREE.Group(),tower=new THREE.Group();scene.add(site,court,tower);
 function uv(mesh){const g=mesh.geometry,p=g.attributes.position,n=g.attributes.normal,t=g.attributes.uv;if(!t)return;for(let i=0;i<p.count;i++){const ax=Math.abs(n.getX(i)),ay=Math.abs(n.getY(i)),az=Math.abs(n.getZ(i));t.setXY(i,ay>ax&&ay>az?p.getX(i):ax>az?p.getZ(i):p.getX(i),ay>ax&&ay>az?p.getZ(i):p.getY(i));}t.needsUpdate=true;}
 function raw(g,w,h,d,x,y,z,material,r=0){const geo=r?new RoundedBoxGeometry(w,h,d,3,Math.min(r,h*.3,w*.2,d*.2)):new THREE.BoxGeometry(w,h,d);const o=new THREE.Mesh(geo,material);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;g.add(o);uv(o);return o;}
 function box(g,w,h,d,x,y,z,material=m.wall,r=0){const p=P(x,y,z);return raw(g,w*FT,h*FT,d*FT,p.x,p.y,p.z,material,r*FT);}
 const fb=(g,w,h,d,x,y,z,material,r=.04)=>raw(g,w*FT,h*FT,d*FT,x*FT,y*FT,z*FT,material,r*FT);
 function cyl(g,r1,r2,h,x,y,z,material,segments=20){const o=new THREE.Mesh(new THREE.CylinderGeometry(r1*FT,r2*FT,h*FT,segments),material);o.position.set(x*FT,y*FT,z*FT);o.castShadow=o.receiveShadow=true;g.add(o);return o;}
 function groupAt(parent,x,y,z,rot=0){const g=new THREE.Group();g.position.copy(P(x,y,z));g.rotation.y=rot;parent.add(g);return g;}
 function line(g,a,b,h,y,t,material,collide=false){const pa=P(a[0],y+h/2,a[1]),pb=P(b[0],y+h/2,b[1]),len=pa.distanceTo(pb);const o=raw(g,len,h*FT,t*FT,(pa.x+pb.x)/2,pa.y,(pa.z+pb.z)/2,material);o.rotation.y=-Math.atan2(pb.z-pa.z,pb.x-pa.x);if(collide)colliders.push({a,b,t,y,top:y+h});return o;}
 function slab(g,pts,y,t=.75,material=m.stone,holes=[],walking=true){const shape=new THREE.Shape();pts.forEach(([x,z],i)=>{const p=P(x,0,z);i?shape.lineTo(p.x,-p.z):shape.moveTo(p.x,-p.z);});shape.closePath();holes.forEach(poly=>{const h=new THREE.Path();poly.forEach(([x,z],i)=>{const p=P(x,0,z);i?h.lineTo(p.x,-p.z):h.moveTo(p.x,-p.z);});h.closePath();shape.holes.push(h);});const geo=new THREE.ExtrudeGeometry(shape,{depth:t*FT,bevelEnabled:false});geo.rotateX(-Math.PI/2);const n=geo.attributes.normal;geo.clearGroups();let start=0,last=n.getY(0)<-.5?1:0;for(let i=3;i<n.count;i+=3){const v=n.getY(i)<-.5?1:0;if(v!==last){geo.addGroup(start,i-start,last);start=i;last=v;}}geo.addGroup(start,n.count-start,last);const o=new THREE.Mesh(geo,[material,m.wall]);o.position.y=(y-t)*FT;o.castShadow=o.receiveShadow=true;g.add(o);uv(o);if(walking)walkable.push(o);return o;}
 const envelopeCentres=insetPolygon(footprint,.5);
 const rect=(x,z,w,d)=>[[x,z],[x+w,z],[x+w,z+d],[x,z+d]];
 function wall(g,a,b,y,h,t,opens=[],level=1){const dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz),at=d=>[a[0]+dx/len*d,a[1]+dz/len*d];let start=0;const sorted=opens.map(o=>[Math.max(0,o[0]),Math.min(o[1],len-o[0]),o[2]]).filter(o=>o[1]>0).sort((a,b)=>a[0]-b[0]);for(const [off,w,type]of [...sorted,[len,0,'end']]){if(off>start)line(g,at(start),at(off),h,y,t,m.wall,true);if(!w)break;const sill=type==='window'?2.3:type==='vent'?(level===0?8.7:6.5):0,head=type==='entry'?8.5:type==='vent'?(level===0?9.6:8):8.5;if(sill)line(g,at(off),at(off+w),sill,y,t,m.wall,true);if(h>head)line(g,at(off),at(off+w),h-head,y+head,t,m.wall,true);if(sill){line(g,at(off),at(off+w),head-sill,y+sill,.08,m.glass,true);for(let k=0;k<=Math.max(2,Math.ceil(w/3));k++){const p=at(off+w*k/Math.max(2,Math.ceil(w/3)));box(g,.09,head-sill,.09,p[0],y+(sill+head)/2,p[1],m.dark);}line(g,at(off),at(off+w),.09,y+sill,.16,m.dark);line(g,at(off),at(off+w),.09,y+head,.16,m.dark);}else{for(const p of[at(off),at(off+w)])box(g,.10,head,.10,p[0],y+head/2,p[1],m.wood);line(g,at(off),at(off+w),.12,y+head,.13,m.wood);}start=off+w;}
 // Skirting remains below openings and reads at human eye level.
 for(const side of[-1,1]){const nx=-dz/len*(t/2+.015)*side,nz=dx/len*(t/2+.015)*side;let s=0;for(const [off,w,type]of [...sorted,[len,0,'end']]){if(off>s)line(g,[at(s)[0]+nx,at(s)[1]+nz],[at(off)[0]+nx,at(off)[1]+nz],.25,y,.035,m.edge);if(type==='window'||type==='vent')line(g,[at(off)[0]+nx,at(off)[1]+nz],[at(off+w)[0]+nx,at(off+w)[1]+nz],.25,y,.035,m.edge);s=off+w;}}
 }
 // Floor plates are shared with navigation. Core openings remain open for stair headroom.
 floors.forEach((f,i)=>{const holes=i>0?[rect(22,37.75,10,14.55)]:[];slab(slabs[i],footprint,f.elevation,.75,i===3?m.edge:m.stone,holes);if(i===3)return;for(const w of envelopeForFloor(i))wall(groups[i],w.slice(0,2),w.slice(2,4),f.elevation,f.height,1,w[4],i);
 for(const w of partitions[f.id]||[])wall(groups[i],w.slice(0,2),w.slice(2,4),f.elevation,f.height,.5,w[4],i);
 });
 // Stair core: four-foot flights with 11-inch treads. Independent rear escape stair uses the same logic.
 function rail(g,a,b,y0,y1,style='metal'){const pa=P(a[0],y0+3.5,a[1]),pb=P(b[0],y1+3.5,b[1]),delta=pb.clone().sub(pa);const o=new THREE.Mesh(new THREE.CylinderGeometry(.018,.018,delta.length(),10),m.dark);o.position.copy(pa).add(pb).multiplyScalar(.5);o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());g.add(o);const len=Math.hypot(b[0]-a[0],b[1]-a[1]);for(let i=0;i<=Math.ceil(len/2);i++){const t=i/Math.ceil(len/2);box(g,.09,3.5,.09,a[0]+(b[0]-a[0])*t,y0+(y1-y0)*t+1.75,a[1]+(b[1]-a[1])*t,m.dark);}colliders.push({a,b,t:.1,y:Math.min(y0,y1),top:Math.max(y0,y1)+3.5,slope:[y0,y1]});}
 function flight(g,x,z0,z1,y0,y1,width=4,n=11){const run=Math.abs(z1-z0)/n;for(let i=0;i<n;i++){const z=z0+(z1-z0)*(i+.5)/n,y=y0+(y1-y0)*(i+1)/n;const o=box(g,width,.25,run+.012,x,y-.125,z,m.oak);walkable.push(o);}const a=P(x,(y0+y1)/2-.35,(z0+z1)/2),length=Math.hypot((z1-z0)*FT,(y1-y0)*FT);const under=raw(g,width*FT,.18*FT,length,a.x,a.y,a.z,m.edge);under.rotation.x=Math.atan2((y1-y0),(z1-z0));for(const side of[-1,1])rail(g,[x+side*width/2,z0],[x+side*width/2,z1],y0,y1);}
 for(let f=0;f<3;f++){const g=new THREE.Group();scene.add(g);stairGroups.push({g,low:f,high:f+1});const y0=floors[f].elevation,y1=floors[f+1].elevation,mid=(y0+y1)/2;flight(g,24.25,37.75,47.8333333333,y0,mid);slab(g,rect(22.25,47.8333333333,9.5,4),mid,.5,m.oak);flight(g,29.75,47.8333333333,37.75,mid,y1);rail(g,[22.25,51.833],[31.75,51.833],mid,mid);}
 const eg=new THREE.Group();scene.add(eg);stairGroups.push({g:eg,low:0,high:1,escape:true});const e0=-8.5,e1=2,em=(e0+e1)/2;slab(eg,rect(5,66.5,13,16.5),e0,.6,m.concrete);flight(eg,7.6,79.5,70.3333333333,e0,em,4,10);slab(eg,rect(5.5,66.8333333333,9.2,3.5),em,.5,m.concrete);flight(eg,12.7,70.3333333333,79.5,em,e1,4,10);slab(eg,rect(10.5,79.5,7.5,4.75),2,.4,m.stone);rail(eg,[5.5,66.8333333333],[14.7,66.8333333333],em,em);
 for(let i=0;i<4;i++)walkable.push(box(eg,4,.5,1.1,12.75,1.75-i*.5,84.8+i*1.1,m.stone));
 for(let f=1;f<4;f++){rail(groups[f],[22.25,52.3],[31.9,52.3],floors[f].elevation,floors[f].elevation);rail(groups[f],[31.9,37.75],[31.9,52.3],floors[f].elevation,floors[f].elevation);rail(groups[f],[26.4,37.75],[27.6,37.75],floors[f].elevation,floors[f].elevation);}
 // Retaining walls surround the open basement lightwell; the rear edge has an exit gate.
 for(const [a,b]of [[[5,66.5],[5,83]],[[5,83],[10.5,83]],[[15,83],[18,83]]])line(court,a,b,10.5,-8.5,.75,m.concrete,true);
 for(const [a,b]of [[[5,66.5],[18,66.5]],[[18,66.5],[18,83]],[[5,66.5],[5,83]],[[5,83],[10.5,83]],[[15,83],[18,83]]])rail(court,a,b,2,2);
 // Pool court: no basement beneath this area. Pool water never counts as a walkable floor.
 const pool=SITE.pool;slab(court,rect(29,57,16,26),2,.65,m.stone,[rect(pool.x-.15,pool.z-.15,pool.w+.3,pool.d+.3)]);box(court,pool.w+.8,.5,pool.d+.8,pool.x+pool.w/2,-2.25,pool.z+pool.d/2,m.concrete);
 for(const [a,b]of [[[pool.x,pool.z],[pool.x+pool.w,pool.z]],[[pool.x+pool.w,pool.z],[pool.x+pool.w,pool.z+pool.d]],[[pool.x+pool.w,pool.z+pool.d],[pool.x,pool.z+pool.d]],[[pool.x,pool.z+pool.d],[pool.x,pool.z]]]){line(court,a,b,4, -2,.18,mat('#5e9290',.42));line(court,a,b,.18,2,.65,m.edge);}
 const water=box(court,pool.w,.04,pool.d,pool.x+pool.w/2,1.68,pool.z+pool.d/2,m.water);const waterTime={value:0};m.water.onBeforeCompile=s=>{s.uniforms.uTime=waterTime;s.fragmentShader=s.fragmentShader.replace('#include <common>','#include <common>\nuniform float uTime;').replace('#include <normal_fragment_begin>','#include <normal_fragment_begin>\nnormal.x += 0.055*sin(vViewPosition.x*12.0+uTime*.8)*cos(vViewPosition.z*9.0-uTime); normal.z += 0.03*sin(vViewPosition.z*17.0+uTime*.7); normal=normalize(normal);');};
 const cover=box(court,pool.w,.05,pool.d,pool.x+pool.w/2,2.04,pool.z+pool.d/2,mat('#bcc8a3',.65));cover.visible=false;for(let z=pool.z+.25;z<pool.z+pool.d;z+=.5){const strip=box(cover,pool.w,.013,.02,pool.x+pool.w/2,2.075,z,m.edge);strip.position.sub(cover.position);} 
 for(const [a,b]of [[[32,59],[42,59]],[[42,59],[42,81]],[[42,81],[32,81]],[[32,81],[32,70]],[[32,66],[32,59]]]){line(court,a,b,4,2,.06,m.glass);rail(court,a,b,2.5,2.5);}rail(court,[32,66],[32,70],2.5,2.5); // Latched pool gate; entry to the water is not enabled.
 for(const[a,b]of [[[45,57],[45,83]],[[45,83],[29,83]]]){line(court,a,b,6,2,.3,m.edge,true);const n=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/.5);for(let j=0;j<=n;j++){const t=j/n;box(court,.07,2.5,.07,a[0]+(b[0]-a[0])*t,6.75,a[1]+(b[1]-a[1])*t,m.oak);}}
 // Ground outside the building remains open. A broad front forecourt holds two cars.
 slab(site,rect(0,0,50,90),.05,.35,m.concrete,[rect(5,15,40,68)]);box(site,400,.3,400,25,-12,45,mat('#a7b099'));slab(site,rect(0,-18,50,18),-.1,.2,m.dark);box(site,36,.08,4,28,.13,87,m.grass);
 // Boundary walls. The 20 ft vehicle gate has an integrated pedestrian opening.
 for(const [a,b]of [[[0,0],[2,0]],[[22,0],[50,0]],[[0,0],[0,90]],[[50,0],[50,90]],[[0,90],[50,90]]])line(site,a,b,6,0,.55,m.edge,true);
 for(let x=2;x<=22;x+=.5)box(site,.07,5.6,.12,x,2.8,0,m.dark);
 const pave=mat('#c7cab7');slab(site,rect(2,.4,20,20.6),.14,.2,pave);
 function ramp(g,a,b,y0,y1,width){const pa=P(a[0],y0,a[1]),pb=P(b[0],y1,b[1]),len=pa.distanceTo(pb),mid=pa.clone().add(pb).multiplyScalar(.5),o=raw(g,width*FT,.14*FT,len,mid.x,mid.y-.07*FT,mid.z,m.stone);const forward=pb.clone().sub(pa).normalize();o.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),forward);walkable.push(o);}
 ramp(site,[44,3],[28,3],.05,1.23,4);slab(site,rect(23,1,5,5),1.23,.25,m.stone);ramp(site,[25.8,6],[25.8,16],1.23,2,3.5);rail(site,[44,1],[28,1],.05,1.23);rail(site,[24.05,6],[24.05,15],1.23,1.923);for(let i=0;i<4;i++)walkable.push(box(site,4,.5,1.25,29.5, .25+i*.5,10.625+i*1.25,m.stone));
 for(let i=0;i<3;i++){walkable.push(box(site,1,.5,3.5,4.5-i,1.25-i*.5,44.5,m.stone));walkable.push(box(site,1,.5,3.5,45.5+i,1.25-i*.5,50.25,m.stone));}
 // Water storage and rainwater harvesting are kept separate; access lids indicate the reserve.
 for(const [x,z]of[[39,8],[42,8]])box(site,2.2,.1,2.2,x,.2,z,m.dark);
 // Roof parapets keep the same structural outline and leave the stair passage open.
 const parapet=insetPolygon(footprint,.25);parapet.forEach((p,i)=>{const q=parapet[(i+1)%parapet.length];line(groups[3],p,q,3.5,26,.5,m.edge,true);line(groups[3],p,q,.12,29.5,.64,m.stone);});
 wall(tower,[22,34],[32,34],26,9.75,.75,[[2,5,'door']]);wall(tower,[32,34],[32,53],26,9.75,.75,[[6,5,'window']]);wall(tower,[32,53],[22,53],26,9.75,.75,[]);wall(tower,[22,53],[22,34],26,9.75,.75,[[7,4,'window']]);slab(tower,rect(22,34,10,19),36.5,.75,m.edge,[],false);
 // South is plan-right for the provisional west-facing plot. Modules tilt toward +x.
 function panel(x,z){const g=groupAt(groups[3],x,30.2,z);g.rotation.z=-15*Math.PI/180;const panel=fb(g,3.72,.12,7.48,0,0,0,m.dark);const face=fb(g,3.57,.018,7.3,0,.071,0,mat('#223c4e',.27,.45));for(let j=-5;j<=5;j++)fb(g,3.55,.009,.018,0,.087,j*.61,mat('#66838b',.45,.7),0);for(let i=-1;i<=1;i++)fb(g,.018,.012,7.27,i*1.18,.088,0,m.brass,0);solarPanels.push(panel);for(const side of[-1,1])box(groups[3],.13,4.2,.13,x+side*1.35,28.1,z,m.dark);colliders.push({rect:[x-1.9,z-3.8,x+1.9,z+3.8],y:26,top:31});}
 for(const x of[7.7,13.2,18.7])for(const z of[24.8,32.36,39.92,47.48,55.04,62.6])panel(x,z);
 for(const x of[34.7,40.2])for(const z of[19,26.6])panel(x,z);
 for(const x of[20.2,25.7])for(const z of[70.2,77.8])panel(x,z);
 // A separate solar-thermal allowance, water tank and screened condenser bank.
 for(const z of[37.5,41]){const p=box(groups[3],6,.2,3,37,27,z,m.dark);p.rotation.z=-.3;for(let j=0;j<10;j++)box(groups[3],.1,.05,2.8,34.5+j*.55,27.15,z,mat('#445b65',.22,.4));}
 box(groups[3],5,5,5,41.5,28.5,49.5,m.edge,.15);for(let j=0;j<3;j++){box(groups[3],2.7,2.8,1.2,34.3,27.4,45.5+j*3,m.linen,.12);const g=groupAt(groups[3],34.3,27.4,45.5+j*3);const fan=new THREE.Mesh(new THREE.CylinderGeometry(.28,.28,.025,28),m.dark);fan.rotation.x=Math.PI/2;fan.position.z=.2;g.add(fan);}line(groups[3],[32.7,43],[32.7,54],5,26,.12,m.oak);
 colliders.push({rect:[34,36,40,42.5],y:26,top:28},{rect:[39,47,44,52],y:26,top:31});for(let j=0;j<3;j++)colliders.push({rect:[32.95,44.9+j*3,35.65,46.1+j*3],y:26,top:28.8});colliders.push({a:[32.7,43],b:[32.7,54],t:.12,y:26,top:31});
 // West-facing front: deep chajjas, narrow timber-look screens and recessed glazing.
 for(const f of[1,2]){const y=floors[f].elevation;for(const[a,b]of[[[5,21],[22,21]],[[32,15],[45,15]]]){line(groups[f],a,b,.28,y+8.8,2.5,m.edge);for(let j=0;j<7;j++)box(groups[f],.12,7,.32,a[0]+.25+j*.6,y+4.5,a[1]-.7,m.oak);}for(let j=0;j<4;j++)box(groups[f],.14,6,.18,22.6+j*.4,y+5.5,14.35,m.oak);}
 function plant(parent,x,y,z,size=1){const g=groupAt(parent,x,y,z);g.scale.setScalar(size);cyl(g,.65,.45,1.4,0,.7,0,m.edge);cyl(g,.6,.6,.05,0,1.42,0,m.soil);for(let j=0;j<16;j++){const a=j*2.399,h=2+(j%5)*.35,tip=new THREE.Vector3(Math.cos(a)*.6*FT,(1.1+h*.6)*FT,Math.sin(a)*.6*FT);const stem=new THREE.Mesh(new THREE.CylinderGeometry(.008,.012,tip.y-1.2*FT,5),m.green);stem.position.set(tip.x/2,(tip.y+1.2*FT)/2,tip.z/2);g.add(stem);const leaf=new THREE.Mesh(new THREE.SphereGeometry(1,10,7),m.green);leaf.scale.set(.18*FT,h*.22*FT,.03*FT);leaf.position.copy(tip);leaf.rotation.set(.5*Math.sin(a),a,.5*Math.cos(a));g.add(leaf);}}
 const interiors=furnishHouse({groups,furn,court,site,m,mat,box,fb,cyl,groupAt,line,plant,lights,P});
 plant(site,34,.2,11,1.8);plant(site,47,.2,19,1.5);plant(site,2,.2,32,1.8);
 function car(x,z,color){const g=groupAt(site,x,.15,z);const paint=mat(color,.22,.55);fb(g,6,1.7,14.2,0,1.55,0,paint,.6);fb(g,5.1,1.85,7.7,0,3.1,-.2,m.dark,.45);fb(g,4.8,.15,7,0,4.05,-.2,paint,.15);for(const sx of[-3,3])for(const zz of[-4.45,4.45]){const tire=cyl(g,1,1,.5,sx,1,zz,m.dark,20);tire.rotation.z=Math.PI/2;}for(const sx of[-2.1,2.1])fb(g,1.5,.3,.14,sx,1.75,7.08,m.light,.06);}
 car(7,10,'#d5d5c8');car(16.5,10,'#495c55');
 // A planted front garden softens the hard western edge.
 box(site,12,.1,4,39,.13,11,m.grass);for(let i=0;i<5;i++){const g=groupAt(site,35+i*2,.2,11.5);cyl(g,.05,.09,4.6,0,2.3,0,m.oak);for(let j=0;j<5;j++){const leaf=new THREE.Mesh(new THREE.SphereGeometry(1,14,10),m.green);leaf.scale.set(.48,.7,.42);leaf.position.set(Math.sin(j*2.4)*.26,1.4+(j%2)*.25,Math.cos(j*2.4)*.25);g.add(leaf);}}
 // Local textures: stone, timber and cloth keep a consistent physical grain scale.
 const result=ready=>({m,interiors,groups,slabs,furn,site,court,tower,stairGroups,walkable,colliders,solarPanels,lights,cover,ready,tick(t){waterTime.value=t;},P});
 if(!loadAssets)return result(Promise.resolve());
 interiors.batch=batchFurniture(furn);
 interiors.architectureBatch=batchArchitecture(groups,furn,tower);
 const status=document.getElementById('load-status'),manager=new THREE.LoadingManager(),loader=new THREE.TextureLoader(manager);manager.onProgress=(_,done,total)=>status.textContent=`Finishing materials · ${Math.round(done/total*100)}%`;
 async function texture(path,size,color=false){const t=await loader.loadAsync('../assets/realism/'+path);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(1/size,1/size);t.colorSpace=color?THREE.SRGBColorSpace:THREE.NoColorSpace;t.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());return t;}
 const pmrem=new THREE.PMREMGenerator(renderer),env=pmrem.fromScene(new RoomEnvironment(),.05);scene.environment=env.texture;scene.environmentIntensity=.42;
 const ready=Promise.allSettled([
 Promise.all([texture('travertine/Travertine009_1K-JPG_Color.jpg',1.2,true),texture('travertine/Travertine009_1K-JPG_NormalGL.jpg',1.2),texture('travertine/Travertine009_1K-JPG_Roughness.jpg',1.2)]).then(([map,normalMap,roughnessMap])=>{for(const v of [m.stone,interiors.paint.stone,interiors.floorMaterials.stone]){v.map=map;v.normalMap=normalMap;v.normalScale.set(.22,.22);v.roughnessMap=roughnessMap;v.needsUpdate=true;}}),
 Promise.all([texture('wood_floor/wood_floor_diff_1k.jpg',1.7,true),texture('wood_floor/wood_floor_nor_gl_1k.jpg',1.7)]).then(([map,normalMap])=>{for(const v of[m.oak,m.wood,interiors.wood.oak,interiors.wood.walnut,interiors.floorMaterials.timber]){v.map=map;v.normalMap=normalMap;v.normalScale.set(.22,.22);v.needsUpdate=true;}}),
 texture('cotton_jersey/cotton_jersey_nor_gl_1k.jpg',.264).then(t=>{for(const v of[m.fabric,m.linen,...Object.values(interiors.cloth)]){v.normalMap=t;v.normalScale.set(.25,.25);v.needsUpdate=true;}}),
 new HDRLoader(manager).loadAsync('../assets/realism/daylight_1k.hdr').then(t=>{scene.environment=pmrem.fromEquirectangular(t).texture;env.dispose();t.dispose();})
 ]).then(r=>{const bad=r.filter(x=>x.status==='rejected');if(bad.length){status.textContent='Some textures could not load';console.error('Texture loading failed',bad.map(x=>String(x.reason)));}else status.remove();renderer.shadowMap.needsUpdate=true;});
 return result(ready);
}
