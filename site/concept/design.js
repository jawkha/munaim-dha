// All plan coordinates and dimensions are in feet. x: north→south; z: west/front→east/rear (west-facing concept).
export const FT = .3048;
export const SITE = {width:50,depth:90,front:15,rear:7,side:5,frontFacing:'West (provisional)',name:'Sahn House',pool:{x:33,z:60,w:8,d:20,depth:4},court:[29,57,45,83],lightwell:[5,66.5,18,83]};
export const footprint=[[22,15],[45,15],[45,57],[29,57],[29,83],[18,83],[18,66.5],[5,66.5],[5,21],[22,21]];
export const core={x:22,z:34,w:10,d:19};
const room=(id,name,rect,kind,note,look=0)=>({id,name,rect,kind,note,look});
export const floors=[
 {id:'basement',name:'Basement',short:'B',elevation:-8.5,height:9.75,summary:'Recreation, two staff bedrooms & an independent escape stair',rooms:[
 room('cinema','Cinema & games',[5,21,22,39],'cinema','A separated recreation room keeps evening noise away from bedrooms.'),
 room('power','Battery & inverter room',[22,15,32,34],'power','120 kWh nominal storage provision in a dry, dedicated room. Ventilation, fire separation, flood protection and electrical design require specialist engineering.'),
 room('gym','Gym',[32,15,45,39],'gym','Exercise space with high-level daylight openings.'),
 room('hobby','Workshop & hobbies',[5,39,22,54],'office','Flexible space for crafts, work or storage.'),
 room('staff2','Staff twin room',[5,54,18,66.5],'twin','Two single beds and a tall window into the open lightwell.'),
 room('games','Staff lounge',[18,54,29,70],'lounge','A shared lounge beside the two staff bedrooms.'),
 room('staff','Staff single room',[18,70,29,83],'single','A real room with a window into the open lightwell; shared washroom.'),
 room('utility','Utility store',[37,39,45,47],'pantry','Services and maintenance supplies, separated from staff accommodation.'),
 room('bwash','Washroom',[37,47,45,54],'bath','Basement drainage requires a pumped disposal system.'),
 room('bcore','Main stair',[22,34,32,53],'stair','Continuous dogleg staircase to the ground floor.'),
 room('escape','Lightwell & escape stair',[5,66.5,18,83],'escape','An independent route rises to the rear garden, separate from the main stair.')
 ]},
 {id:'ground',name:'Ground floor',short:'G',elevation:2,height:11.25,summary:'Private family life around an open pool court',rooms:[
 room('drawing','Drawing room',[5,21,22,39],'living','Guest seating beside the entrance, separated from the family rooms.'),
 room('foyer','Entrance gallery',[22,15,32,34],'hall','A screened entrance protects family privacy and leads to the central stair.'),
 room('parents','Grandparents’ bedroom',[32,15,45,31],'bed','A ground-floor bedroom with integrated wardrobes and an attached bathroom.'),
  room('pbath','Grandparents’ bathroom',[37,31,45,39],'bath','Shower, WC and vanity; detailed accessibility design remains to be developed.'),
 room('kitchen','Family kitchen',[12,39,22,54],'kitchen','A practical galley layout with a generous central aisle.'),
 room('dirty','Dirty kitchen',[5,39,12,49],'dirty','Cooking and extraction separated from the family kitchen, with a service-side door.'),
 room('pantry','Pantry',[5,49,12,54],'pantry','Dry food and kitchen storage beside the cooking spaces.'),
 room('family','Family living',[5,54,29,66.5],'living','A broad, shaded living room looking into the pool court.'),
 room('dining','Family dining',[18,70,29,83],'dining','Dining beside the pool and open lightwell.'),
 room('change','Pool shower & WC',[37,39,45,47],'bath','A dedicated changing/shower room, separate from bedrooms.'),
 room('filter','Pool plant',[37,47,45,54],'filter','Filtration and a holding-tank allowance. Water disposal must follow the authority-approved route.'),
 room('gcore','Main stair',[22,34,32,53],'stair','4 ft wide flights, maximum concept riser under 7 in.'),
 room('pool','Pool court',[29,57,45,83],'pool','An 8 × 20 ft pool, 4 ft deep, inside the building envelope. Open to sky, with a barrier and a covered-pool option.')
 ]},
 {id:'first',name:'First floor',short:'1',elevation:14,height:11.25,summary:'Parents, three children, a guest room & quieter shared spaces',rooms:[
 room('master','Parents’ suite',[5,21,22,33],'bed','A west-facing bedroom with recessed glazing, dressing and a separate bathroom.'),
 room('mbath','Main bathroom',[5,33,13,39],'bath','Wet areas align with the service side of the house.'),
 room('mdress','Main dressing',[13,33,22,39],'wardrobe','Storage is kept out of the main bedroom.'),
 room('lounge','Reading lounge',[22,15,32,34],'lounge','An upstairs retreat overlooking the entrance garden.'),
 room('bed2','Bedroom 2',[32,15,45,31],'bed','A family bedroom above the grandparents’ suite.'),
  room('b2bath','Bedroom 2 bathroom',[37,31,45,39],'bath','Stacked above the ground-floor bathroom.'),
 room('bed3','Bedroom 3',[5,39,22,54],'bed','A generous room with access to the shared bathroom.'),
 room('bed4','Bedroom 4',[5,54,18,66.5],'bed','A compact family room beside the rear lightwell; uses the shared bathroom.'),
 room('guest','Guest bedroom',[18,64,29,83],'bed','A quieter guest room overlooking the pool court; uses the shared bathroom.'),
 room('landing','Family landing',[18,54,29,64],'lounge','A small play/reading area connects the rear bedrooms.'),
 room('shared','Shared bathroom',[37,39,45,47],'bath','Shared by bedrooms 3, 4 and the guest room.'),
 room('laundry','Laundry & linen',[37,47,45,54],'laundry','Laundry stays near the bedrooms and roof drying area.'),
 room('fcore','Main stair',[22,34,32,53],'stair','Continuous access between living floors and the roof.')
 ]},
 {id:'roof',name:'Roof',short:'R',elevation:26,height:9.75,summary:'A working energy roof with space left for people',rooms:[
 room('solar','Solar array',[5,21,22,64],'solar','26 × 600 W modules: 15.6 kWp DC. South-facing at 15°. The panel layout reserves access lanes and avoids the mumty.'),
 room('terrace','Roof terrace',[22,15,32,34],'terrace','A small open terrace, separate from the solar field.'),
 room('hotwater','Solar hot water',[32,34,45,43],'hotwater','Dedicated solar thermal collectors and an insulated hot-water cylinder provision.'),
 room('services','Roof services',[32,43,45,54],'services','Screened outdoor AC equipment and water tank, with service access.'),
 room('drying','Roof drying area',[22,15,32,25],'terrace','Retractable drying lines share the open terrace; kept away from solar modules.'),
 room('rcore','Stair tower',[22,34,32,53],'stair','A compact 190 sq ft stair tower. Roof level +26 ft; tower top +36.5 ft.')
 ]}
];
// Exterior outline uses outside faces; partitions use centre-lines. Openings follow each wall segment.
// Different wall thicknesses are rendered: 12 in exterior assembly and 6 in finished partitions.
export const partitions={
 basement:[
 [22,34,22,54,[]],
 [22,21,22,34,[[7,3.5,'door']]],[5,39,22,39,[[11,3.5,'door']]],[32,15,32,34,[[11,3.5,'door']]],[32,34,45,34,[[5,3.5,'door']]],[22,34,32,34,[[5,3.5,'door']]],
 [5,54,22,54,[[14,3.5,'door']]],[18,54,18,66.5,[[6,3.5,'door']]],[18,70,29,70,[[4,3.5,'door']]],[37,39,37,54,[[2,3,'door'],[10,3,'door']]],[37,47,45,47,[]],[37,54,45,54,[]]
 ],
 ground:[
 [22,34,22,54,[]],
 [22,21,22,34,[[5,4,'door']]],[5,39,22,39,[[12,3.5,'door']]],[32,15,32,34,[[9,3.5,'door']]],[32,31,45,31,[[7,3,'door']]],[37,31,37,39,[]],[37,39,45,39,[]],
 [12,39,12,54,[[4,3,'door'],[11,2.5,'door']]],[5,49,12,49,[]],[5,54,22,54,[[11,5,'door']]],[37,39,37,54,[[2,3,'door'],[10,3,'door']]],[37,47,45,47,[]],[37,54,45,54,[]]
 ],
 first:[
 [22,34,22,54,[]],
 [22,21,22,34,[[5,3.5,'door']]],[5,33,22,33,[[3,3,'door'],[11,3,'door']]],[13,33,13,39,[]],[5,39,22,39,[]],
 [32,15,32,34,[[9,3.5,'door']]],[32,31,45,31,[[7,3,'door']]],[37,31,37,39,[]],[37,39,45,39,[]],
 [5,54,22,54,[[14,3.5,'door']]],[18,54,18,66.5,[[4,3.5,'door']]],[18,64,29,64,[[5,3.5,'door']]],[37,39,37,54,[[2,3,'door'],[10,3,'door']]],[37,47,45,47,[]],[37,54,45,54,[]]
 ]
};
export const exteriorOpenings=[
 // Indexed by edge of footprint; offsets from edge start in feet.
 [[2,6,'entry']], // front entrance gallery, x22→45? overridden below by full wall descriptors
];
export const envelopeWalls=[
 [22,15,45,15,[[2,6,'entry'],[12,8,'window']]],
 [45,15,45,57,[[6,7,'window'],[19,3,'vent'],[25,4,'vent'],[34,3.5,'door']]],
 [45,57,29,57,[[2,3.5,'door'],[10,5,'door']]],
 [29,57,29,83,[[2,5,'window'],[10,8,'door'],[22,5,'window']]],
 [29,83,18,83,[[2,7,'window']]],
 [18,83,18,66.5,[[3,6,'window']]],
 [18,66.5,5,66.5,[[2,5,'window'],[9,3,'window']]],
 [5,66.5,5,21,[[3,7,'window'],[20,3,'door'],[25,4,'window'],[35,9,'window']]],
 [5,21,22,21,[[3,10,'window']]],
 [22,21,22,15,[]]
];
// Envelope coordinates describe the outside face; partitions use centre-lines.
export function insetPolygon(points,offset){return points.map((p,i)=>{const a=points[(i+points.length-1)%points.length],b=points[(i+1)%points.length],u=[p[0]-a[0],p[1]-a[1]],v=[b[0]-p[0],b[1]-p[1]],ul=Math.hypot(...u),vl=Math.hypot(...v);return [p[0]-offset*(u[1]/ul+v[1]/vl),p[1]+offset*(u[0]/ul+v[0]/vl)];});}
export function envelopeForFloor(level){const pts=insetPolygon(footprint,level===3?.25:.5);return envelopeWalls.map((w,j)=>{let openings=w[4].map(o=>[...o]);if(level===0){openings=openings.map(([o,w])=>[o,w,'vent']);if(j===5)openings=[[2,7,'window'],[13.5,3,'door']];if(j===6)openings=[[2,8,'window']];}if(level===2)openings=openings.map(([o,w,t])=>[o,w,t==='door'||t==='entry'?'window':t]);if(level===3)openings=[];return [...pts[j],...pts[(j+1)%pts.length],openings];});}
export function roomBounds(r){const [x0,z0,x1,z1]=r.rect,f=floors.find(f=>f.rooms.includes(r));const walls=[...envelopeWalls.map(w=>({w,t:2})),...(partitions[f?.id]||[]).map(w=>({w,t:.5}))];const thick=(x,z,axis)=>walls.find(({w})=>axis==='v'?Math.abs(w[0]-x)<.01&&Math.abs(w[2]-x)<.01&&z>=Math.min(w[1],w[3])&&z<=Math.max(w[1],w[3]):Math.abs(w[1]-z)<.01&&Math.abs(w[3]-z)<.01&&x>=Math.min(w[0],w[2])&&x<=Math.max(w[0],w[2]))?.t||0;return [x0+thick(x0,(z0+z1)/2,'v')/2,z0+thick((x0+x1)/2,z0,'h')/2,x1-thick(x1,(z0+z1)/2,'v')/2,z1-thick((x0+x1)/2,z1,'h')/2];}
export function clearSize(r){const[a,b,c,d]=roomBounds(r);return {w:c-a,d:d-b};}
export function feet(v){const inches=Math.round(v*12);return `${Math.floor(inches/12)}′${inches%12?` ${inches%12}″`:''}`;}
export function roomLabel(r){const s=clearSize(r);return ['pool','escape','solar','terrace','services','hotwater','stair','hall','lounge'].includes(r.kind)?r.note.split('.')[0]:`${feet(s.w)} × ${feet(s.d)}`;}
export const energy={kwp:15.6,modules:26,moduleWatts:600,battery:120,dod:.9,inverterEfficiency:.9,base:20,cooking:4,hotwater:2,poolKW:.55,poolHours:5,acKW:.55,acUnits:7,acHours:9,annualKWh:23452.84,monthly:[51.86,57.18,64.70,75,77.77,76.92,65.44,63.60,66.30,63.78,55.45,52.90],months:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']};
export const sources=[
 ['DHA Peshawar: 2025 construction regulations','https://www.dhapeshawar.org/Content/Pdf/Amended%20DHAP%20Regulations%20final.pdf'],
 ['DHA Peshawar: published amendments and solar policy','https://www.dhapeshawar.org/Content/Pdf/Amended%20Bylaws%20to%20be%20uploaded.pdf'],
 ['NEECA: Energy Conservation Building Code 2023','https://neeca.gov.pk/SiteImage/Downloads/ecbc23.pdf'],
 ['Pakistan Engineering Council: building codes','https://www.pec.org.pk/thinktank/building-code-of-pakistan-thinktank/'],
 ['European Commission JRC: PVGIS methodology','https://joint-research-centre.ec.europa.eu/photovoltaic-geographical-information-system-pvgis/using-pvgis-5/api-non-interactive-service_en']
];
