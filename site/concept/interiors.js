import * as THREE from 'three';
import {FT,floors,roomBounds,partitions,envelopeForFloor} from './design.js';
import {finishes,roomDesign} from './interior-design.js';

// Furniture dimensions are in feet. Each room keeps its own finish scheme and inventory.
export function furnishHouse({groups,furn,court,site,m,mat,box,fb,cyl,groupAt,line,plant,lights,P}){
 const paint={},cloth={},wood={},floorMaterials={},inventory=[];
 for(const [key,v] of Object.entries(finishes)){
  paint[key]=mat(v.hex,.86);cloth[key]=mat(v.hex,.97);wood[key]=mat(v.hex,.64);
 }
 const metal=mat(finishes.brass.hex,.37,.65),screen=mat('#172326',.22,.25),ceramic=mat('#f2eadb',.3),mirror=mat('#bac9c6',.14,.88);
 for(const key of ['stone','tile','timber','rubber'])floorMaterials[key]=mat(finishes[key].hex,key==='rubber'?.95:.73);
 const accents=['olive','clay','blue','sand','ivory'];
 const local=(g,x,z,rot=0)=>{const q=new THREE.Group();q.position.set(x*FT,0,z*FT);q.rotation.y=rot;g.add(q);return q;};
 function vase(g,x,y,z,color='ivory',h=.7){cyl(g,.18,.29,h,x,y+h/2,z,paint[color]);cyl(g,.15,.15,.04,x,y+h,z,paint[color]);for(let j=0;j<3;j++){const stem=fb(g,.014,.7,.014,x+j*.13-.13,y+h+.25,z,paint.olive,0);stem.rotation.z=(j-1)*.18;}}
 function books(g,x,y,z,n=5){for(let j=0;j<n;j++){const h=.55+(j%3)*.16;fb(g,.12,h,.42,x+j*.15,y+h/2,z,paint[accents[j%5]],.012);}}
 function lamp(g,x=0,z=0){cyl(g,.33,.38,.09,x,0.05,z,metal);cyl(g,.04,.04,.8,x,.49,z,metal,10);cyl(g,.38,.6,.7,x,1.08,z,cloth.cream);cyl(g,.35,.45,.018,x,.74,z,m.light);}
 function tableLamp(g,x,y,z){const q=local(g,x,z);q.position.y=y*FT;lamp(q);}
 function rug(g,s,w,d){fb(g,w,.026,d,0,.032,0,cloth[s.accent],.008);fb(g,w-.35,.02,d-.35,0,.05,0,cloth.linen,.008);for(const z of[-d/2+.35,d/2-.35])for(let j=-3;j<=3;j++){const q=fb(g,.2,.009,.2,j*w/9,.064,z,cloth[s.accent],0);q.rotation.y=Math.PI/4;}for(const x of[-w/2+.24,w/2-.24])fb(g,.035,.006,d-.55,x,.063,0,cloth[s.accent],0);}
 function chair(g,s,arm=false){const w=arm?2.55:1.8,d=arm?2.45:1.8;fb(g,w,.42,d,0,1.43,0,cloth[s.fabric],.13);fb(g,w,1.8,.32,0,2.15,-d/2+.1,cloth[arm?s.accent:s.fabric],.14);for(const x of[-w/2+.2,w/2-.2])for(const z of[-d/2+.22,d/2-.22])fb(g,.12,1.27,.12,x,.64,z,wood[s.wood],.018);if(arm)for(const x of[-w/2,w/2])fb(g,.21,1.2,d,x,1.72,0,wood[s.wood],.06);}
 function sofa(g,s,w=7.5){fb(g,w,.6,3.1,0,.72,0,wood[s.wood],.1);fb(g,w,2.25,.45,0,1.85,-1.4,cloth[s.fabric],.14);for(const x of[-w/2+.17,w/2-.17])fb(g,.4,1.65,3.15,x,1.55,0,cloth[s.fabric],.14);const seats=Math.max(2,Math.floor(w/2.4));for(let j=0;j<seats;j++)fb(g,(w-.9)/seats-.04,.45,2.5,(j-(seats-1)/2)*(w-.9)/seats,1.25,.04,cloth[s.fabric],.14);for(const [j,x]of[-w/2+1,w/2-1].entries()){const p=fb(g,1.3,1.2,.4,x,2.03,-.9,cloth[j?s.accent:'linen'],.12);p.rotation.z=j?-.16:.16;}for(const x of[-w/2+.4,w/2-.4])for(const z of[-1.1,1.1])fb(g,.13,.42,.13,x,.24,z,wood[s.wood],.02);}
 function bed(g,s,w=5.8){fb(g,w,.58,6.85,0,.5,0,wood[s.wood],.09);fb(g,w-.08,.65,6.65,0,1.08,0,cloth.cream,.17);fb(g,w+.15,4.25,.27,0,2.12,-3.5,cloth[s.accent],.12);for(let j=-3;j<=3;j++)fb(g,.018,3.7,.025,j*w/7,2.2,-3.351,cloth[s.fabric],0);fb(g,w-.12,.12,4.3,0,1.46,.85,cloth[s.fabric],.09);fb(g,w-.1,.11,1.8,0,1.56,2,cloth[s.accent],.06);for(const x of(w>4?[-w/4,w/4]:[0])){fb(g,w>4?w/2-.3:w-.4,.32,1.35,x,1.6,-2.1,cloth.cream,.15);fb(g,.95,.5,.38,x,1.86,-1.45,cloth[s.accent],.11);} }
 function nightstand(g,s){fb(g,1.5,1.65,1.45,0,.86,0,wood[s.wood],.04);fb(g,1.35,.58,.025,0,1.15,.736,paint[s.wall],.012);fb(g,.38,.035,.06,0,1.16,.78,metal,.01);tableLamp(g,0,1.71,0);}
 function coffee(g,s,w=3.6){fb(g,w,.18,2,0,1.2,0,paint.stone,.12);for(const x of[-w/2+.6,w/2-.6])fb(g,.15,1.08,1.5,x,.55,0,wood[s.wood],.025);fb(g,.85,.09,.65,.55,1.34,0,paint[s.accent],.02);vase(g,-.65,1.3,0,'ivory',.5);}
 function roundTable(g,s,r=1.05,h=1.75){cyl(g,r,r,.13,0,h,0,wood[s.wood]);cyl(g,.12,.18,h,0,h/2,0,metal);cyl(g,.6,.75,.12,0,.08,0,metal);vase(g,0,h+.08,0,s.accent,.48);}
 function cabinet(g,s,w=4,h=7,d=1.75,open=false){fb(g,w,h,d,0,h/2,0,wood[s.wood],.025);if(open){fb(g,w-.18,h-.18,.03,0,h/2,d/2+.018,paint[s.accent],0);for(let k=0;k<4;k++){const y=.25+k*(h-.4)/4;fb(g,w-.1,.1,d+.08,0,y,.02,wood[s.wood],.01);books(g,-w/2+.2,y+.07,d/2+.04,Math.min(8,Math.floor(w/.2)));if(w>2)vase(g,w/2-.4,y+.08,d/2-.15,'sand',.5);}}else{const n=Math.ceil(w/1.7);for(let j=0;j<n;j++){const x=-w/2+(j+.5)*w/n;fb(g,w/n-.06,h-.15,.055,x,h/2,d/2+.025,paint[s.accent],.015);fb(g,.035,.7,.045,x+w/n*.27,h*.52,d/2+.077,metal,.008);}}}
 function bench(g,s,w=3.5){fb(g,w,.35,1.5,0,1.35,0,cloth[s.fabric],.1);for(const x of[-w/2+.25,w/2-.25])for(const z of[-.52,.52])fb(g,.14,1.15,.14,x,.57,z,wood[s.wood],.02);}
 function desk(g,s,w=4){fb(g,w,.15,1.9,0,2.45,0,wood[s.wood],.04);for(const x of[-w/2+.2,w/2-.2])for(const z of[-.65,.65])fb(g,.14,2.35,.14,x,1.17,z,wood[s.wood],.02);fb(g,1.2,.055,.8,-.55,2.56,0,paint.ivory,.02);fb(g,1.2,.72,.06,-.55,2.9,-.4,screen,.02);books(g,w/2-.7,2.54,-.15,3);tableLamp(g,-w/2+.38,2.53,-.2);const c=local(g,0,1.9,Math.PI);chair(c,s);}
 function media(g,s,w=6,cinema=false){cabinet(g,s,w,1.35,1.1);const sw=cinema?Math.min(w,9):Math.min(w,5.3);fb(g,sw,sw*.56,.13,0,4,-.05,screen,.05);fb(g,sw-.14,sw*.56-.14,.02,0,4,.03,paint.ink,.01);for(const x of[-w/2+.35,w/2-.35])fb(g,.42,1.1,.4,x,2.05,0,paint.graphite,.045);}
 function dining(g,s,w=3,d=6,ends=true){fb(g,w,.2,d,0,2.55,0,wood[s.wood],.07);for(const x of[-w/2+.3,w/2-.3])for(const z of[-d/2+.5,d/2-.5])fb(g,.18,2.4,.18,x,1.2,z,wood[s.wood],.02);for(const x of[-w/2-1,w/2+1])for(const z of[-2,0,2])chair(local(g,x,z,x>0?-Math.PI/2:Math.PI/2),s);if(ends)for(const z of[-d/2-1,d/2+1])chair(local(g,0,z,z>0?Math.PI:0),s);for(const x of[-.8,.8])for(const z of[-2,0,2]){cyl(g,.32,.32,.045,x,2.69,z,ceramic);cyl(g,.1,.1,.35,x+.28,2.84,z+.4,m.glass);}vase(g,0,2.68,0,'ivory',.9);}
 function art(g,s,w=3.4,h=3){fb(g,w,h,.09,0,5.35,0,wood[s.wood],.015);fb(g,w-.18,h-.18,.015,0,5.35,.057,paint.chalk,0);for(let j=0;j<3;j++){const o=fb(g,w*(.25+j*.02),h*(.48-j*.07),.009,(j-1)*w*.23,5.35+(j-1)*.23,.069,paint[j===0?s.accent:j===1?'sand':'olive'],.05);o.rotation.z=(j-1)*.12;}}
 function pendant(g,s,y,type='shade'){cyl(g,.24,.24,.08,0,y,0,metal);cyl(g,.015,.015,1.9,0,y-1,0,metal,8);if(type==='shade'){cyl(g,.65,1.25,.75,0,y-2.15,0,cloth.linen);cyl(g,.58,1.14,.018,0,y-2.54,0,m.light);}else{for(const x of[-1,0,1]){cyl(g,.016,.016,.5+Math.abs(x)*.35,x,y-2.05,0,metal,8);cyl(g,.28,.48,.48,x,y-2.5-Math.abs(x)*.35,0,paint[s.accent]);}}}
 function floorLamp(g,s){cyl(g,.5,.6,.09,0,.05,0,metal);cyl(g,.035,.035,4.6,0,2.35,0,metal,10);cyl(g,.45,.8,.8,0,4.9,0,cloth.linen);}
 function bathroom(g,s,w,d){
  const vx=-w/2+2.05,vz=-d/2+1.02;
  cabinet(local(g,vx,vz),s,2.8,2.5,1.7);fb(g,3,.17,1.85,vx,2.62,vz,paint.stone,.035);
  fb(g,1.4,.2,.9,vx,2.8,vz,ceramic,.12);fb(g,1.12,.012,.62,vx,2.91,vz,paint.taupe,.1);
  cyl(g,.045,.045,.65,vx,3.02,vz-.65,metal,10);fb(g,.08,.07,.4,vx,3.33,vz-.5,metal,.02);
  fb(g,2.45,2.55,.055,vx,4.72,-d/2+.06,mirror,.12);
  fb(g,1.3,.08,.08,vx,6.18,-d/2+.2,m.light,.025);
  const tx=w/2-.78;fb(g,1.42,1.28,2.1,tx,.67,d/2-1.35,ceramic,.28);fb(g,1.4,2.15,.45,tx,1.12,d/2-.3,ceramic,.1);fb(g,1.2,.1,1.5,tx,1.37,d/2-1.5,ceramic,.22);
  fb(g,2.9,.09,2.7,w/2-1.51,.06,-d/2+1.42,paint[s.accent],.02);fb(g,.06,6.4,1.8,w/2-2.98,3.2,-d/2+1.05,m.glass,0);
  cyl(g,.045,.045,5.8,w/2-.65,3.3,-d/2+.12,metal,10);fb(g,.06,.06,.7,w/2-.65,6.18,-d/2+.4,metal);cyl(g,.35,.35,.055,w/2-.65,6.13,-d/2+.68,metal);
  for(let j=0;j<3;j++)fb(g,.75,.12,.42,-w/2+.6,.45+j*.13,d/2-.4,cloth[j===1?s.accent:'linen'],.045);
  fb(g,1.5,.1,.65,-w/2+.85,.3,d/2-.4,wood[s.wood],.02);
 }
 function storage(g,s,w=4){fb(g,w,6.7,.08,0,3.35,-.48,paint[s.accent],.01);for(const x of[-w/2+.06,w/2-.06])fb(g,.12,6.7,1,x,3.35,0,wood[s.wood],.012);for(let k=0;k<5;k++){const y=.2+k*1.5;fb(g,w,.1,1.06,0,y,.01,wood[s.wood],.01);const n=Math.max(2,Math.floor(w/.95));for(let j=0;j<n;j++){const x=-w/2+(j+.5)*w/n;if(k<2){fb(g,Math.min(.8,w/n-.1),.65,.72,x,y+.38,.05,cloth.linen,.03);fb(g,.24,.14,.015,x,y+.48,.42,paint.ivory,.01);}else if(j%2){for(let n=0;n<4;n++)cyl(g,.28,.28,.045,x,y+.1+n*.065,.05,ceramic);}else{cyl(g,.2,.2,.6,x,y+.35,.06,paint[k%2?'sage':'ivory']);cyl(g,.21,.21,.07,x,y+.69,.06,wood.oak);}}}}
 function counter(g,s,w=5,sink=false){cabinet(g,s,w,2.85,2);fb(g,w+.08,.14,2.1,0,2.96,0,paint.stone,.02);if(sink){fb(g,1.5,.05,1.3,0,3.05,0,metal,.08);fb(g,1.28,.03,1.05,0,3.085,0,paint.graphite,.08);cyl(g,.035,.035,.8,0,3.43,-.6,metal,8);fb(g,.06,.06,.48,0,3.82,-.39,metal,.01);}else{fb(g,2,.03,1.5,0,3.06,0,screen,.025);for(const x of[-.55,.55])for(const z of[-.4,.4])cyl(g,.23,.23,.013,x,3.09,z,metal);} }
 function fridge(g){fb(g,2.65,6.6,2.55,0,3.3,0,paint.graphite,.065);for(const [y,h]of[[1.1,2.05],[4.4,4.35]]){fb(g,2.49,h,.065,0,y,1.29,mirror,.025);fb(g,.04,.7,.08,-.94,y+.3,1.36,metal,.01);}}
 function laundry(g,s,w,d){for(const x of[-w/2+1.45,-w/2+4.22]){fb(g,2.55,3,2.5,x,1.5,-d/2+1.33,ceramic,.07);const o=cyl(g,.66,.66,.08,x,1.47,-d/2+2.62,screen,28);o.rotation.x=Math.PI/2;fb(g,2.3,.3,.03,x,2.63,-d/2+2.64,paint.taupe);}
 fb(g,5.5,.16,2.7,-w/2+2.87,3.15,-d/2+1.4,paint.stone,.03);cabinet(local(g,0,-d/2+.6),s,4.6,2.1,1);const upper=g.children[g.children.length-1];upper.position.y=5.1*FT;
 for(let j=0;j<3;j++)fb(g,.8,.17,.65,-w/2+.65+j*.9,3.34,-d/2+1.4,cloth[j===1?s.accent:'linen'],.04);
 fb(g,1.35,1.6,1.25,-w/2+.85,.8,d/2-.9,cloth.linen,.07);fb(g,1.05,.06,1,.0,3.32,-d/2+1.4,cloth.cream,.02);
 }
 const byId={};floors.forEach((f,fi)=>f.rooms.forEach(r=>byId[r.id]={r,fi,b:roomBounds(r),s:roomDesign[r.id]}));
 function put(id,label,fn,x,z,rot=0,...args){const ctx=byId[id],{r,fi,b,s}=ctx;const g=groupAt(furn[fi],b[0]+x,floors[fi].elevation,b[1]+z,rot);g.name=id+': '+label;fn(g,s,...args);inventory.push({room:id,label,group:g,bounds:b,floor:fi});return g;}
 function deco(id,label,fn,x,z,rot=0,...args){const g=put(id,label,fn,x,z,rot,...args);inventory[inventory.length-1].decorative=true;return g;}
 // Finishes sit on the real wall faces and preserve every modeled opening.
 for(const {r,fi,b,s}of Object.values(byId)){
  if(fi===3||['pool','escape','stair'].includes(r.kind))continue;
  const [a,z,c,d]=b,w=c-a,depth=d-z,y=floors[fi].elevation;
  box(groups[fi],w-.035,.017,depth-.035,(a+c)/2,y+.009,(z+d)/2,floorMaterials[s.floor]);
  const isPrivate=['bed','single','twin','cinema'].includes(r.kind);
  for(const [wi,wall]of [...envelopeForFloor(fi).map(q=>({v:q,t:1})),...(partitions[floors[fi].id]||[]).map(q=>({v:q,t:.5}))].entries()){
   const{v:[ax,az,bx,bz,opens],t}=wall,vertical=Math.abs(ax-bx)<.01,len=Math.hypot(bx-ax,bz-az),center=vertical?(a+c)/2:(z+d)/2,coord=vertical?ax:az;
   const boundaries=vertical?[a,c]:[z,d];if(Math.min(...boundaries.map(v=>Math.abs(v-coord)))>t/2+.03)continue;
   const direction=vertical?Math.sign(bz-az):Math.sign(bx-ax),origin=vertical?az:ax;
   let lo=Math.max(0,Math.min(( (vertical?z:a)-origin)/direction,((vertical?d:c)-origin)/direction)),hi=Math.min(len,Math.max(((vertical?z:a)-origin)/direction,((vertical?d:c)-origin)/direction));if(hi<=lo)continue;
   const side=Math.sign(center-coord),face=coord+side*(t/2+.018),height=floors[fi].height-.025;
   const accent=isPrivate?(vertical&&side>0):(!vertical&&side>0);const material=paint[accent?s.accent:s.wall];
   const part=(start,end,base,h)=>{if(end-start<.02||h<.01)return;const mid=origin+direction*(start+end)/2;box(groups[fi],vertical?.025:end-start,h,vertical?end-start:.025,vertical?face:mid,y+base+h/2,vertical?mid:face,material);};
   let cursor=lo;for(const[o,width,type]of[...opens,[len,0,'end']]){const start=Math.max(lo,o),end=Math.min(hi,o+width);if(start>cursor)part(cursor,Math.min(start,hi),0,height);if(end>start){const sill=type==='window'?2.3:type==='vent'?(fi===0?8.7:6.5):0,head=type==='vent'?(fi===0?9.6:8):8.5;if(sill)part(start,end,0,sill);part(start,end,head,height-head);}cursor=Math.max(cursor,end);if(cursor>=hi)break;}if(cursor<hi)part(cursor,hi,0,height);
  }
  // One warm ceiling source per occupied room; fittings also read in evening mode.
  if(!['power','pantry','filter'].includes(r.kind)){
   const lamp=new THREE.PointLight('#ffe2bf',7,8,2);lamp.position.copy(P((a+c)/2,y+Math.min(floors[fi].height-1,8.8),(z+d)/2));groups[fi].add(lamp);lights.push({lamp,f:fi});
   const lg=groupAt(furn[fi],(a+c)/2,y,(z+d)/2);
   if(['bed','twin','single'].includes(r.kind)||r.id==='family'){const h=floors[fi].height-.7;cyl(lg,.18,.18,.55,0,h+.25,0,metal);cyl(lg,.36,.44,.27,0,h-.14,0,wood[s.wood]);for(let k=0;k<3;k++){const blade=local(lg,0,0,k*Math.PI*2/3);fb(blade,.4,.07,1.8,0,h-.3,1.02,wood[s.wood],.07);}cyl(lg,.23,.29,.1,0,h-.36,0,m.light);}else if(['dining','living','lounge','hall'].includes(r.kind))pendant(lg,s,floors[fi].height-.2,r.kind==='dining'?'cluster':'shade');else{const fit=local(lg,0,0);fit.position.y=(floors[fi].height-.22)*FT;cyl(fit,.45,.45,.13,0,0,0,m.light);}
  }
 }
 // Window dressings are tied to actual glazed openings, never to doorways.
 for(let fi=0;fi<3;fi++)for(const v of envelopeForFloor(fi)){
  const[ax,az,bx,bz,opens]=v,dx=bx-ax,dz=bz-az,len=Math.hypot(dx,dz),nx=-dz/len,nz=dx/len;
  for(const[o,w,type]of opens){if(type!=='window')continue;const cx=ax+dx/len*(o+w/2)+nx*.68,cz=az+dz/len*(o+w/2)+nz*.68;
   const match=Object.values(byId).find(({r,fi:f,b})=>f===fi&&cx>b[0]-.3&&cx<b[2]+.3&&cz>b[1]-.3&&cz<b[3]+.3&&['bed','single','twin','living','lounge','dining','hall'].includes(r.kind));if(!match)continue;
   const g=groupAt(furn[fi],cx,floors[fi].elevation,cz);g.rotation.y=Math.atan2(dz,dx);fb(g,w+.5,.08,.07,0,8.72,0,metal);
   for(const side of[-1,1])for(let j=0;j<7;j++)fb(g,.14,8.25,.075,side*(w/2-.15)+j*.07-.21,4.36,Math.sin(j*1.6)*.055,cloth[match.s.fabric],.025);
  }
 }
 // Reception: two conversation groups, without turning the room into another cinema.
 deco('drawing','woven rug',rug,7.8,8,0,11,11);
 put('drawing','main sofa',sofa,7.8,13.1,0,8);
 put('drawing','second sofa',sofa,2,8,Math.PI/2,6.3);
 put('drawing','olive chair',chair,12,7.8,-Math.PI/2,true);
 put('drawing','coffee table',coffee,7.7,8,0,4);
 put('drawing','side table',roundTable,13.1,13.1,0,.85,1.8);
 put('drawing','low console',cabinet,7.3,.8,Math.PI,7,1.8,1.3);
 deco('drawing','geometric artwork',art,7.5,16.55,0,4.8,3.2);
 put('foyer','entrance console',cabinet,8.9,4.5,-Math.PI/2,4,2.6,1);
 put('foyer','entry bench',bench,.95,5.8,Math.PI/2,3.6);
 deco('foyer','runner',rug,4.8,9,0,3,10);
 deco('foyer','entry art',art,9.36,4.5,-Math.PI/2,3.3,3.8);
 // Ground-floor grandparents: headboard against a solid section of the inner wall.
 put('parents','double bed',bed,4.1,4.6,Math.PI/2,5.4);
 put('parents','bedside table A',nightstand,1,.84,Math.PI/2);
 
 deco('parents','bedside rug',rug,4.5,4.8,0,8,8.5);
 put('parents','wardrobe',cabinet,3.25,13.7,0,5.2,7.8,1.9);
 put('parents','reading chair',chair,8.5,9.5,-.4,true);
 put('parents','reading table',roundTable,10.3,12.2,0,.65,1.8);
 
 // Family living: seven seats, low furniture and an open route to the pool-side passage.
 deco('family','woven rug',rug,9.5,5.6,0,13.5,8.3);
 put('family','four-seat sofa',sofa,9.2,8.7,0,9.8);
 put('family','armchair A',chair,2.7,3.4,Math.PI/2,true);
 put('family','armchair B',chair,16.3,7,-Math.PI/2,true);
 put('family','armchair C',chair,16.3,3.4,-Math.PI/2,true);
 put('family','coffee table',coffee,9.4,5.2,0,4.2);
 put('family','media cabinet',media,4.7,.8,Math.PI,7.2);
 put('family','side table',roundTable,3.3,8.7,0,.8,1.7);
 // Dining furniture is sized for eight; the short wall takes a shallow buffet.
 put('dining','eight-seat table',dining,4.5,6,0,3,6,true);
 put('dining','shallow buffet',cabinet,.48,6,Math.PI/2,4.2,2.5,.8);
 
 // Kitchens: counter runs stop before connecting doorways.
 put('kitchen','cooking counter',counter,8.35,9.9,-Math.PI/2,7.8,false);
 put('kitchen','sink counter',counter,1.1,1.7,Math.PI/2,3.25,true);
 put('kitchen','fridge',fridge,1.4,8.7,Math.PI/2);
 put('kitchen','tall pantry cabinet',cabinet,8.35,4.3,-Math.PI/2,2.5,7.6,2);
 deco('kitchen','open upper shelves',storage,8.95,9.7,-Math.PI/2,5.8).position.y+=4.8*FT;
 // Upper shelf height is limited separately below; the room inventory retains the cabinet intent.
 put('dirty','wash counter',counter,2.875,8.4,0,4.8,true);
 put('dirty','cooking counter',counter,2.875,1.1,Math.PI,4.8,false);
 put('pantry','pantry shelving',storage,.6,2.2,Math.PI/2,3.8);
 put('pantry','pantry shelving rear',storage,3.5,3.95,0,3.2);
 // Bedrooms: different palettes, with study space for each child.
 put('master','king bed',bed,7.8,4.3,0,6.1);
 put('master','bedside table A',nightstand,3.85,7.35);
 put('master','bedside table B',nightstand,11.8,7.35);
 deco('master','bedroom rug',rug,7.8,5.2,0,10.3,8.3);
 put('master','bedroom bench',bench,1.2,5.1,Math.PI/2,4.5);
 put('master','reading chair',chair,13.4,2.7,-.7,true);
 put('master','reading lamp',floorLamp,13.5,5.8);
 for(const [id,rot,bx,bz]of[['bed2',0,5.45,8.2],['bed3',0,4.8,9.4],['bed4',-Math.PI/2,8.1,9.175]]){
  const {b}=byId[id],w=b[2]-b[0],d=b[3]-b[1];put(id,'single bed',bed,bx,bz,rot,3.7);
  if(id==='bed4')deco(id,'woven rug',rug,7.1,8.15,0,8.7,5.7);else deco(id,'woven rug',rug,bx+1,bz-1,0,Math.min(7,w-1),7.6);
  if(id==='bed4')put(id,'wardrobe',cabinet,2.5,1.02,Math.PI,4,7.5,1.8);else if(id==='bed2')put(id,'wardrobe',cabinet,1.05,3.5,Math.PI/2,4.3,7.5,1.8);else put(id,'wardrobe',cabinet,w-1.04,7.15,-Math.PI/2,4.2,7.5,1.8);
  put(id,'study desk',desk,w-3,1.08,Math.PI,4.1);
  if(id!=='bed4')put(id,'bookcase',cabinet,id==='bed2'?2.15:1.2,id==='bed2'?14.05:1,id==='bed2'?0:Math.PI,2,5.8,1.2,true);
  if(id==='bed2')deco(id,'geometric artwork',art,.07,6.7,Math.PI/2,1.8,2.8);else if(id==='bed4')deco(id,'geometric artwork',art,w-3,.07,Math.PI,2.4,2.8);else deco(id,'geometric artwork',art,w-.07,d-6,-Math.PI/2,2.4,2.8);
 }
 put('bed2','bedside table',nightstand,8.35,10.6);
 put('bed3','bedside table',nightstand,1.8,11.7);
 put('bed4','bedside table',nightstand,8.8,6.05);
 put('guest','queen bed',bed,4.5,10.9,0,5);
 put('guest','bedside table A',nightstand,1.15,13.2);
 put('guest','bedside table B',nightstand,7.85,13.2);
 deco('guest','guest rug',rug,4.5,9.8,0,7.7,8.8);
 put('guest','wardrobe',cabinet,1.03,2.7,Math.PI/2,4.5,7.7,1.8);
 put('guest','luggage bench',bench,6.3,5.5,0,3.3);
 
 put('mdress','wardrobes',cabinet,4.25,4.5,0,8,7.6,1.8);
 put('mdress','dressing stool',bench,1.2,1.1,0,1.6);
 // Upstairs shared rooms have books and writing/play furniture, not duplicate TVs.
 put('lounge','reading sofa',sofa,4.75,13.2,0,6.4);
 deco('lounge','reading rug',rug,4.7,10.9,0,7.8,7);
 put('lounge','coffee table',coffee,4.75,9.4,0,3);
 put('lounge','bookcase',cabinet,.7,6.4,Math.PI/2,4.5,7.2,1.2,true);
 put('lounge','writing desk',desk,6.5,1.2,Math.PI,3.8);
 put('lounge','reading lamp',floorLamp,8.5,15.7);
 put('landing','reading bench',bench,8.8,6.5,-Math.PI/2,4.8);
 put('landing','low bookcase',cabinet,9.05,2.1,-Math.PI/2,3.1,2.7,1,true);
 deco('landing','play rug',rug,4.7,4.8,0,5.5,5.5);
 put('landing','soft stool',bench,4,4.6,0,1.8);
 // Staff rooms receive the same material quality and complete, practical furniture.
 for(const x of[2.25,7.1])put('staff2','single bed',bed,x,7.5,0,3.15);
 put('staff2','shared study desk',desk,4.9,.97,Math.PI,4.2);
 put('staff2','personal wardrobe',cabinet,10.6,2.7,-Math.PI/2,4.3,7.2,1.7);
 put('staff2','shared bedside table',nightstand,4.7,9.5);
 deco('staff2','runner',rug,4.75,6.1,0,1.4,6);
 put('staff','single bed',bed,5.6,7.9,0,3.4);
 put('staff','bedside table',nightstand,2.9,9.3);
 put('staff','wardrobe',cabinet,1.03,2.1,Math.PI/2,2.4,7.2,1.8);
 put('staff','study desk',desk,7.9,2.15,-Math.PI/2,3.6);
 put('games','lounge sofa',sofa,4.8,12.4,0,6.3);
 put('games','coffee table',coffee,4.8,9.1,0,3.1);
 deco('games','lounge rug',rug,4.8,10.5,0,7.4,6.5);
 put('games','media cabinet',media,8.9,5.6,-Math.PI/2,4.2);
 put('games','small dining table',roundTable,3.1,3.9,0,1.15,2.5);
 put('games','dining chair A',chair,.95,3.9,Math.PI/2);
 put('games','dining chair B',chair,5.25,3.9,-Math.PI/2);
 // Basement recreation and workshop.
 put('cinema','screen cabinet',media,5.4,15.8,0,9,true);
 deco('cinema','cinema rug',rug,7.8,9.5,0,12,10.5);
 put('cinema','main sofa',sofa,7.9,5.8,Math.PI,8.7);
 put('cinema','second sofa',sofa,2.1,10.5,Math.PI/2,6.3);
 put('cinema','armchair',chair,13.3,10.5,-Math.PI/2,true);
 put('cinema','coffee table',coffee,7.9,10.2,0,4.1);
 deco('cinema','acoustic panel A',art,3.2,16.58,0,2,5);
 deco('cinema','acoustic panel B',art,12.6,16.58,0,2,5);
 put('hobby','worktable',(g,s)=>{fb(g,3.3,.18,6,0,2.55,0,wood.oak,.04);for(const x of[-1.35,1.35])for(const z of[-2.6,2.6])fb(g,.16,2.45,.16,x,1.23,z,paint.graphite);for(const x of[-2.7,2.7])chair(local(g,x,0,x>0?-Math.PI/2:Math.PI/2),s);fb(g,1.7,.03,2,0,2.68,0,paint.ivory);fb(g,1.3,.06,1,-.5,2.72,1.7,paint.clay);books(g,-1,2.67,-2.4,6);tableLamp(g,.85,2.67,2.2);},7.7,7.1);
 put('hobby','tools cabinet',storage,1,7.2,Math.PI/2,7);
 put('hobby','craft storage',cabinet,7.8,13.5,0,7.8,3.5,1.7);
 deco('hobby','pegboard',(g,s)=>{fb(g,6,3,.12,0,5.5,0,wood.oak,.035);for(let x=-2.5;x<=2.5;x+=.5)for(let y=4.5;y<=6.5;y+=.5)fb(g,.045,.045,.035,x,y,.085,paint.graphite,0);for(const x of[-1.8,0,1.8]){fb(g,.09,.65,.09,x,5.5,.13,metal,.01);fb(g,.45,.1,.13,x,5.83,.13,paint.graphite,.02);}},9.3,14.4);
 for(const id of ['utility']){const{b}=byId[id],w=b[2]-b[0],d=b[3]-b[1];put(id,'storage shelves',storage,w-.57,d/2,-Math.PI/2,d-.5);put(id,'storage shelves rear',storage,2.1,d-.57,0,3.5);}
 for(const id of ['pbath','change','mbath','b2bath','shared','bwash']){const{b}=byId[id];put(id,'vanity, WC and shower',bathroom,(b[2]-b[0])/2,(b[3]-b[1])/2,0,b[2]-b[0]-.12,b[3]-b[1]-.12);}
 {const{b}=byId.laundry;put('laundry','laundry work area',laundry,(b[2]-b[0])/2+1,(b[3]-b[1])/2,0,b[2]-b[0]-.15,b[3]-b[1]-.15);}
 // Exercise equipment, mats and a weights rack.
 put('gym','cardio equipment',(g,s)=>{for(const x of[-2.8,2.8]){fb(g,2.65,.34,6,x,.2,0,paint.graphite,.1);fb(g,2.1,.03,4.8,x,.4,.2,paint.rubber,.02);for(const side of[-1,1])fb(g,.1,3.6,.12,x+side*1.05,2,-2.3,metal);fb(g,2.1,.17,.9,x,3.85,-2.3,screen,.06);}},5.9,7);
 put('gym','weights rack',(g,s)=>{for(const y of[1.2,2.7]){fb(g,4.2,.12,1.2,0,y,0,wood.oak);for(let j=-2;j<=2;j++){fb(g,.48,.28,.75,j*.75,y+.21,0,paint.graphite,.07);}}for(const x of[-1.9,1.9])fb(g,.12,3,.12,x,1.5,0,metal);},8.8,16.1);
 deco('gym','yoga mat',rug,3.1,14,0,2.7,6);
 deco('gym','training mirror',(g)=>fb(g,7.4,5.2,.05,0,4,0,mirror),5.9,.08,Math.PI);
 // Dedicated plant and battery rooms remain functional.
 put('power','battery cabinets',(g)=>{for(let j=0;j<4;j++){fb(g,2.2,6.2,2.5,-3,3.1,-6+j*3.6,paint.graphite,.07);for(let k=0;k<5;k++)fb(g,.05,.05,.05,-1.88,1+k*.8,-6+j*3.6,m.light);}fb(g,.6,3.2,3,3.4,4,0,ceramic,.04);},4.75,8.8);
 put('filter','pool filtration',(g)=>{cyl(g,.9,1.05,2.6,-1.4,1.3,0,paint.graphite);fb(g,1.9,2.5,2.3,1.3,1.25,0,ceramic,.08);for(const x of[-1.4,1.3])cyl(g,.08,.08,3,x,2,-.9,metal,10);},3.4,3.1);
 // Stair sconces and hallway art avoid stair openings and headroom.
 for(const id of ['bcore','gcore','fcore']){
  const{fi}=byId[id],g=groupAt(furn[fi],22.65,floors[fi].elevation,36);g.rotation.y=Math.PI/2;fb(g,.4,1,.15,0,5.9,0,metal,.06);fb(g,.23,.8,.08,0,5.9,.1,m.light,.03);
 }
 // Roof seating keeps the north-to-south passage to the stair clear.
 put('terrace','outdoor sofa',sofa,2,10.5,Math.PI/2,6.2);
 put('terrace','outdoor chair',chair,7.4,11.6,-Math.PI/2,true);
 put('terrace','outdoor coffee table',coffee,4.75,10.3,0,2.5);
 deco('terrace','outdoor rug',rug,4.8,10.5,0,6.7,7.2);
 put('terrace','lantern',(g)=>{fb(g,.65,1.05,.65,0,.55,0,metal,.04);fb(g,.52,.87,.52,0,.55,0,m.glass,.015);cyl(g,.12,.12,.48,0,.34,0,m.light);},8.6,15.7);
 deco('drying','retractable drying lines',(g)=>{for(const x of[-3.4,3.4]){fb(g,.065,6.4,.065,x,3.2,0,metal);fb(g,.1,.1,2.2,x,6.3,0,metal);}for(const z of[-.8,0,.8])fb(g,6.8,.017,.017,0,6.3,z,metal,0);},4.1,2.8);
 const deck=new THREE.Group();court.add(deck);furn.push(deck);
 for(const z of[61.5,68,74.5]){const g=groupAt(deck,43.55,2,z);fb(g,1.85,.5,5.8,0,.6,0,wood.oak,.07);fb(g,1.8,.2,5.65,0,.98,0,cloth.cream,.09);const q=fb(g,1.8,.2,1.75,0,1.31,-1.85,cloth.cream,.09);q.rotation.x=.4;fb(g,1.3,.25,.65,0,1.13,1.7,cloth.blue,.07);}
 for(const z of[64.7,71.3]){const g=groupAt(deck,43.55,2,z);roundTable(g,roomDesign.pool,.52,1.1);}
 plant(deck,30.5,2,80.5,1.5);plant(deck,43.5,2,81.2,1.35);
 for(const [id,x,z,size]of[['drawing',19.9,36.4,1],['family',7.4,63.8,.85],['foyer',30.5,32,1],['dining',27,80.8,.7],['lounge',30.8,31.5,.9],['terrace',30.4,17.5,1.1]]){const{fi}=byId[id];plant(furn[fi],x,floors[fi].elevation,z,size);}
 // Keep upper kitchen shelves light and safely beneath the ceiling.
 const upper=inventory.find(v=>v.label==='open upper shelves');if(upper){upper.group.scale.y=.4;upper.group.position.y=floors[1].elevation*FT+4.8*FT;}
 return {inventory,paint,cloth,wood,floorMaterials,mirror};
}
