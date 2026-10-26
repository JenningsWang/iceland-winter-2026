import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const ctx={window:{}};
for(const f of ['data/trip.js','data/points.js','data/geo.js'])vm.runInNewContext(fs.readFileSync(path.join(root,f),'utf8'),ctx,{filename:f});
const {ICELAND_TRIP:t,ICELAND_POINTS:p,ICELAND_GEO:g}=ctx.window;
assert.equal(t.days.length,8);assert.equal(t.stays.length,5);assert.equal(t.stays.reduce((n,s)=>n+s.nights,0),7);
assert.deepEqual(Array.from(t.stays,s=>s.nights),[1,2,1,1,2]);
const pids=new Set(p.map(x=>x.id)),sids=new Set(t.stays.map(x=>x.id)),dids=new Set(t.days.map(x=>x.id)),sources=new Set(t.sources.map(x=>x.id));
assert.equal(pids.size,p.length);assert(p.length>=65);assert.equal(g.routes.length,8);
for(const x of p){assert(['planned','optional','reference'].includes(x.plan));assert(['usual','conditional','guided','closed'].includes(x.winter));assert(x.lat>=63&&x.lat<=68&&x.lng>=-25&&x.lng<=-12);assert(x.sourceUrls.length>0);for(const d of x.days)assert(dids.has(d),`${x.id}: unknown day ${d}`);}
for(const d of t.days){assert(!d.sleepId || sids.has(d.sleepId));for(const id of d.pointIds)assert(pids.has(id),`${d.id}: missing point ${id}`);for(const id of d.sourceIds)assert(sources.has(id));for(const slot of d.timeline)if(slot.pointId)assert(pids.has(slot.pointId));assert(d.km[0]<=d.km[1]);assert(d.driveWinter[0]<=d.driveWinter[1]);}
for(let i=0;i<t.stays.length;i++){const s=t.stays[i];assert.equal(s.status,'正在预定');assert.equal(s.hotelName,'');assert.equal((Date.parse(s.checkOut)-Date.parse(s.checkIn))/86400000,s.nights);if(i)assert.equal(t.stays[i-1].checkOut,s.checkIn);}
function coords(a){if(typeof a[0]==='number'){assert(a[0]>=-28&&a[0]<=-10&&a[1]>=61&&a[1]<=69);}else a.forEach(coords);}
for(const r of g.routes){assert(dids.has(r.id));assert(['LineString','MultiLineString'].includes(r.geometry.type));coords(r.geometry.coordinates);assert(r.distanceKm>0);}
for(const a of g.alternatives)coords(a.geometry.coordinates);
const d3=g.routes.find(r=>r.id==='d3');assert(!d3.roadRefs?.includes('435'));
const d7=g.routes.find(r=>r.id==='d7');assert(d7.distanceKm>400&&d7.distanceKm<460);assert(!d7.roadRefs?.some(x=>['570','F575'].includes(x)));
assert.equal(p.find(x=>x.id==='ice-cave').winter,'guided');assert.equal(p.find(x=>x.id==='reynisfjara').winter,'conditional');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');for(const m of html.matchAll(/(?:src|href)="([^"#]+)"/g)){const f=m[1];if(!/^https?:/.test(f))assert(fs.existsSync(path.join(root,f)),`Missing asset ${f}`);}
new vm.Script(fs.readFileSync(path.join(root,'app.js'),'utf8'),{filename:'app.js'});
JSON.parse(fs.readFileSync(path.join(root,'data/bookings.json'),'utf8'));
console.log(`Validated: ${t.days.length} days, ${t.stays.length} bases, 7 nights, ${p.length} points, ${g.routes.length} road routes.`);
console.log('All references, coordinates, dates, winter classes and local assets are consistent.');
