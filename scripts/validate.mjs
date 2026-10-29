import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const ctx={window:{}};
for(const f of ['data/trip.js','data/trip-en.js','data/points.js','data/points-en.js','data/geo.js'])vm.runInNewContext(fs.readFileSync(path.join(root,f),'utf8'),ctx,{filename:f});
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
new vm.Script(fs.readFileSync(path.join(root,'data/language.js'),'utf8'),{filename:'data/language.js'});
JSON.parse(fs.readFileSync(path.join(root,'data/bookings.json'),'utf8'));

// Translation must preserve the itinerary, geometry references and booking compatibility.
const protectedFields=new Set(['id','date','startDate','endDate','updated','checked','checkIn','checkOut','localName','type','phase','sleepId','pointId','pointIds','sourceIds','status','pressure','plan','winter','kind']);
const chinese=/[\u3400-\u9fff]/;
function compareLocale(zh,en,trail=[]){
  const label=trail.join('.');
  assert.equal(typeof en,typeof zh,`${label}: translation type differs`);
  if(Array.isArray(zh)){
    assert(Array.isArray(en),`${label}: missing translated array`);
    assert.equal(en.length,zh.length,`${label}: translated item count differs`);
    zh.forEach((item,i)=>compareLocale(item,en[i],[...trail,i]));return;
  }
  if(zh && typeof zh==='object'){
    assert.deepEqual(Object.keys(en).sort(),Object.keys(zh).sort(),`${label}: translation fields differ`);
    for(const key of Object.keys(zh))compareLocale(zh[key],en[key],[...trail,key]);return;
  }
  const field=trail.at(-1),parent=trail.at(-2);
  if(typeof zh!=='string' || protectedFields.has(field) || ['pointIds','sourceIds','days'].includes(parent) || /^https?:\/\//.test(zh)){
    assert.equal(en,zh,`${label}: translation changed a protected value`);
  }
  if(typeof en==='string' && !['status','pressure'].includes(field))assert(!chinese.test(en),`${label}: untranslated English content`);
  if(typeof zh==='string' && zh.trim())assert(en.trim(),`${label}: empty English content`);
}
compareLocale(t,ctx.window.ICELAND_TRIP_EN,['trip']);
compareLocale(p,ctx.window.ICELAND_POINTS_EN,['points']);
assert(html.includes('id="language-toggle"'),'Language switch missing');
assert(html.indexOf('data/language.js')<html.indexOf('src="app.js"'),'Language selection must load before the application');
console.log(`Validated: ${t.days.length} days, ${t.stays.length} bases, 7 nights, ${p.length} points, ${g.routes.length} road routes.`);
console.log('Both languages preserve all IDs, coordinates, dates, route references, winter classes and booking status values.');
