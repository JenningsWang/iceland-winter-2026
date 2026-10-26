/* Iceland Winter Journal · static, client-side application */
(() => {
  'use strict';
  const T = window.ICELAND_TRIP;
  const P = window.ICELAND_POINTS || [];
  const G = window.ICELAND_GEO;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeUrl = s => { try { const u = new URL(s); return ['https:', 'http:'].includes(u.protocol) ? u.href : '#'; } catch { return '#'; } };
  const ext = (u, label, cls = '') => `<a class="${cls}" href="${esc(safeUrl(u))}" target="_blank" rel="noopener noreferrer">${esc(label)} ↗</a>`;
  const byPoint = Object.fromEntries(P.map(p => [p.id, p]));
  const byDay = Object.fromEntries((T?.days || []).map(d => [d.id, d]));
  const byStay = Object.fromEntries((T?.stays || []).map(s => [s.id, s]));
  const bySource = Object.fromEntries((T?.sources || []).map(s => [s.id, s]));
  const WINTER = {usual:{name:'冬季通常可达',symbol:'✓'},conditional:{name:'依路况与开放区域',symbol:'!'},guided:{name:'需要正规向导',symbol:'G'},closed:{name:'普通冬季自驾不适用',symbol:'×'}};
  const PLAN = {planned:'已规划',optional:'沿线备选',reference:'全岛参考'};
  const PHASE_COLORS = {arrival:'#527b7e',outbound:'#117b83',return:'#c5734a',daytrip:'#78649b',departure:'#527b7e'};
  const DAY_SHORT = ['抵达冰岛','雷克雅内斯','黄金圈','向东看海','冰洞与冰河湖','南岸回程','斯奈山半岛','雷市与返程'];
  const STATE_KEY = 'iceland-winter-2026-bookings-v1';
  let state = {view:'overview',day:null,point:null,stay:null,road:null,region:'全部'};
  const filters = {planned:true,optional:true,reference:true,stays:true,routes:true,roads:true};
  const winterFilters = {usual:true,conditional:true,guided:true,closed:true};
  let bookings = {}, map, pointLayer, stayLayer, roadsLayer, routeLayer, selectionLayer, alternativeLayer, onlineTiles;
  let pointMarkers = {}, stayMarkers = {}, routeLayers = {}, toastTimer;

  const hours = a => {
    if (!a) return '—';
    if (a[1] <= .5) return `${Math.round(a[0] * 60)}–${Math.round(a[1] * 60)} 分钟`;
    const n = v => Number(v.toFixed(1)).toString();
    return a[0] === a[1] ? `${n(a[0])} 小时` : `${n(a[0])}–${n(a[1])} 小时`;
  };
  const km = a => a ? `${a[0].toLocaleString()}–${a[1].toLocaleString()} km` : '—';
  const md = s => s?.slice(5).replace('-', '/') || '';
  const dayNum = id => Number(id?.slice(1)) || 0;
  const winterPill = p => `<span class="pill ${esc(p.winter)}">${WINTER[p.winter]?.symbol || ''} ${WINTER[p.winter]?.name || '查看详情'}</span>`;
  const planPill = p => `<span class="pill ${p.plan === 'optional' ? 'optional' : ''}">${PLAN[p.plan] || '参考'}</span>`;
  const list = (items, cls = 'detail-list') => items?.length ? `<ul class="${cls}">${items.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : '';
  const pointLink = (id, label) => `<button class="text-link" data-point="${esc(id)}">${esc(label || byPoint[id]?.name || id)}</button>`;
  const notice = (text, tone = '') => `<div class="notice ${tone}">${esc(text)}</div>`;
  const booking = s => ({...s, ...(bookings[s.id] || {})});
  const sourceList = sources => `<ul class="source-list">${(sources || []).filter(Boolean).map(s => `<li>${ext(s.url, s.title || s.label || s.url)}${s.note ? `<small>${esc(s.note)}</small>` : ''}</li>`).join('')}</ul>`;
  const sourcesFor = ids => sourceList((ids || []).map(id => bySource[id]).filter(Boolean));
  const alternativeDetails = d => d.routeAlternatives?.length ? `<h3>路线按当天路况选择</h3><div class="card-list">${d.routeAlternatives.map(a=>`<div class="item-card"><span class="card-top"><strong>${esc(a.label)}</strong><span class="pill blue">${km(a.km)}</span></span><p>${esc(a.roads)}</p><p>${esc(a.note)}</p></div>`).join('')}</div>` : '';
  const mapUrl = p => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${p.lat},${p.lng}`)}`;
  const toast = text => { const el = $('#toast'); clearTimeout(toastTimer); el.textContent = text; el.hidden = false; toastTimer = setTimeout(() => {el.hidden = true;}, 4000); };
  const setHash = hash => { try { history.replaceState(null, '', `#${hash}`); } catch {} };
  const revealPanel = () => { if (innerWidth <= 720) $('#detail-panel').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'}); };

  function validateBookingRecord(r) {
    if (!r || !byStay[r.id]) return null;
    const b = {id:r.id};
    for (const [k,n] of [['hotelName',160],['address',400],['notes',2500],['url',1500]]) if (typeof r[k] === 'string') b[k] = r[k].slice(0,n);
    if (['正在预定','已确认','待调整'].includes(r.status)) b.status = r.status;
    if (r.lat !== '' && r.lng !== '' && Number.isFinite(Number(r.lat)) && Number.isFinite(Number(r.lng)) && Number(r.lat) >= 63 && Number(r.lat) <= 68 && Number(r.lng) >= -25 && Number(r.lng) <= -12) {b.lat=Number(r.lat);b.lng=Number(r.lng);b.exactLocation=true;}
    if (b.url && safeUrl(b.url) === '#') b.url = '';
    return b;
  }
  const parseBookings = obj => {
    if (obj?.version !== 1 || !Array.isArray(obj.stays)) throw new Error('这不是本站导出的住宿文件。');
    const out = {};
    for (const r of obj.stays) {const b=validateBookingRecord(r);if(b)out[b.id]=b;}
    return out;
  };
  function loadLocalBookings() {
    try { const text = localStorage.getItem(STATE_KEY); if (text) bookings={...bookings,...parseBookings(JSON.parse(text))}; } catch {}
  }
  function saveBookings() {
    const data={version:1,updatedAt:new Date().toISOString(),stays:Object.values(bookings)};
    try { localStorage.setItem(STATE_KEY,JSON.stringify(data)); return true; } catch { return false; }
  }

  function renderDayStrip() {
    $('#day-strip').innerHTML = `<button class="day-button all ${!state.day?'active':''}" data-action="overview"><span class="day-index">◎</span><span><strong>旅程全貌</strong><small>8 DAYS / 7 NIGHTS</small></span></button>` + T.days.map((d,i) => `<button class="day-button ${state.day===d.id?'active':''}" data-day="${d.id}" aria-pressed="${state.day===d.id}"><span class="day-index">D${i+1}</span><span><strong>${DAY_SHORT[i]}</strong><small>${d.shortDate} · ${esc(d.weekday || '')}</small></span></button>`).join('');
  }

  function initMap() {
    map = L.map('map',{center:[64.3,-20],zoom:6,zoomControl:false,minZoom:5,maxZoom:15,zoomSnap:.25,maxBounds:[[61,-28],[69,-10]],maxBoundsViscosity:.5});
    L.control.zoom({position:'bottomright'}).addTo(map);
    L.control.scale({position:'bottomright',imperial:false,maxWidth:80}).addTo(map);
    map.attributionControl.setPrefix(false);
    map.attributionControl.addAttribution('<a href="https://www.naturalearthdata.com/about/terms-of-use/" target="_blank" rel="noopener">Natural Earth</a> · <a href="https://www.vegagerdin.is/" target="_blank" rel="noopener">Vegagerðin / Vegir / 2026-10-26</a> <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">CC BY 4.0</a> · © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap contributors</a>');
    map.createPane('land');map.getPane('land').style.zIndex=210;
    map.createPane('online');map.getPane('online').style.zIndex=220;
    map.createPane('roads');map.getPane('roads').style.zIndex=300;
    map.createPane('routes');map.getPane('routes').style.zIndex=350;
    map.createPane('selection');map.getPane('selection').style.zIndex=360;
    map.createPane('labels');map.getPane('labels').style.zIndex=380;map.getPane('labels').style.pointerEvents='none';
    L.geoJSON(G.land,{pane:'land',interactive:false,style:{fillColor:'#f0f3e9',fillOpacity:1,color:'#bdcfc4',weight:1.1}}).addTo(map);
    for (let lat=63;lat<=67;lat++) L.polyline([[lat,-27],[lat,-12]],{pane:'land',interactive:false,color:'#bdcfd0',opacity:.25,weight:.6,dashArray:'3 8'}).addTo(map);
    for (let lng=-26;lng<=-12;lng+=2) L.polyline([[62,lng],[68,lng]],{pane:'land',interactive:false,color:'#bdcfd0',opacity:.25,weight:.6,dashArray:'3 8'}).addTo(map);
    roadsLayer = L.geoJSON(G.roads,{pane:'roads',style:f=>({color:f.properties.road==='1'?'#91aa98':'#b5c4af',weight:f.properties.road==='1'?2.2:1.2,opacity:.8}),onEachFeature:(f,layer)=>{
      layer.bindTooltip(`${esc(f.properties.road)} 号公路 · ${esc(f.properties.name || '')}<small>主干道路参考 · 非实时路况</small>`,{sticky:true});
      layer.on('click',()=>showRoad(f.properties.road));
    }}).addTo(map);
    const labels=[['冰 岛  /  I C E L A N D',65.05,-20.05,'country'],['北 大 西 洋',63.18,-20.3,'ocean'],['瓦特纳冰川',64.48,-16.82,'glacier'],['朗格冰川',64.75,-20.2,'glacier'],['米达尔斯冰川',63.65,-19.1,'glacier'],['雷克雅未克',64.2,-22.0,''],['阿克雷里',65.77,-18.5,''],['东部峡湾',65.15,-14.7,'']];
    labels.forEach(([txt,lat,lng,cls])=>L.marker([lat,lng],{interactive:false,keyboard:false,pane:'labels',icon:L.divIcon({className:`map-label ${cls}`,html:esc(txt),iconSize:[160,22],iconAnchor:[60,10]})}).addTo(map));
    [['1',64.02,-21.35],['1',63.7,-18.1],['1',65.62,-16.0],['41',64.02,-22.22],['35',64.13,-20.69],['36',64.25,-21.45],['54',64.76,-22.6],['56',64.97,-22.85]].forEach(([txt,lat,lng])=>L.marker([lat,lng],{interactive:false,keyboard:false,pane:'labels',icon:L.divIcon({className:'road-badge',html:txt,iconSize:[24,17],iconAnchor:[12,8]})}).addTo(map));
    routeLayer=L.layerGroup().addTo(map);selectionLayer=L.layerGroup().addTo(map);alternativeLayer=L.layerGroup().addTo(map);pointLayer=L.layerGroup().addTo(map);stayLayer=L.layerGroup().addTo(map);
    for (const r of G.routes) {
      const d=byDay[r.id];if(!d)continue;
      const feature={type:'Feature',properties:{id:r.id},geometry:r.geometry};
      const casing=L.geoJSON(feature,{pane:'routes',interactive:false,style:{color:'#fffefa',weight:6.5,opacity:.8}});
      const line=L.geoJSON(feature,{pane:'routes',style:{color:PHASE_COLORS[d.phase],weight:3.5,opacity:.9,dashArray:d.phase==='return'?'9 6':null},onEachFeature:(f,l)=>{
        l.bindTooltip(`D${dayNum(d.id)} · ${esc(d.title)}<small>${esc(d.subtitle)}</small>`,{sticky:true});l.on('click',()=>showDay(d.id));
      }});
      routeLayers[r.id]={casing,line,feature};casing.addTo(routeLayer);line.addTo(routeLayer);
    }
    map.on('zoomend',()=>{ if (state.view!=='road') renderMarkers(); });
    fitTrip();renderMarkers();refreshMap();
  }

  function pointVisible(p) {
    if (state.point===p.id) return true;
    if (!filters[p.plan] || !winterFilters[p.winter]) return false;
    if (p.kind==='town' && p.plan==='planned') return false;
    if (state.day) return (p.days || []).includes(state.day) || (p.plan==='optional' && dayOptional(p,state.day));
    return true;
  }
  function dayOptional(p,dayId) {
    if ((p.days || []).includes(dayId)) return true;
    const regions = {d2:['雷克雅内斯'],d3:['黄金圈'],d4:['南岸','东南'],d5:['东南','南岸'],d6:['南岸','雷克雅未克','首都'],d7:['斯奈山','西部'],d8:['雷克雅未克','首都']};
    return (regions[dayId] || []).some(r=>p.region?.includes(r));
  }
  function renderMarkers() {
    if (!map) return;
    pointLayer.clearLayers();stayLayer.clearLayers();pointMarkers={};stayMarkers={};
    for (const p of P) {
      if(!pointVisible(p))continue;
      const selected=state.point===p.id;
      const sz=p.plan==='planned'?20:p.plan==='optional'?16:13;
      const symbol=p.winter==='closed'?'×':p.winter==='guided'?'G':p.winter==='conditional'?'!':'';
      const icon=L.divIcon({className:'sight-marker',html:`<div class="marker-core ${esc(p.plan)} ${esc(p.winter)} ${selected?'selected':''}"><span>${symbol}</span></div>`,iconSize:[sz,sz],iconAnchor:[sz/2,sz/2]});
      const marker=L.marker([p.lat,p.lng],{icon,title:`${p.name} · ${PLAN[p.plan]} · ${WINTER[p.winter]?.name}`,keyboard:true,riseOnHover:true,zIndexOffset:selected?1500:p.plan==='planned'?700:p.plan==='optional'?350:0});
      marker.bindTooltip(`${esc(p.name)}<small>${esc(p.localName)} · ${WINTER[p.winter]?.name}</small>`,{direction:'top',offset:[0,-9]});
      marker.on('click',()=>showPoint(p.id));marker.addTo(pointLayer);
      marker.getElement()?.setAttribute('aria-label',`${p.name}，${PLAN[p.plan]}，${WINTER[p.winter]?.name}`);
      pointMarkers[p.id]=marker;
    }
    if(filters.stays) for (const s0 of T.stays) {
      const s=booking(s0);const current=state.stay===s.id;
      const relevant=!state.day || byDay[state.day]?.sleepId===s.id || byDay[`d${dayNum(state.day)-1}`]?.sleepId===s.id;
      if(!relevant && !current)continue;
      const icon=L.divIcon({className:'stay-marker',html:`<div class="hotel-pin ${current?'selected':''}"><span>H</span></div>`,iconSize:[30,33],iconAnchor:[14,30]});
      const marker=L.marker([s.lat,s.lng],{icon,title:`住宿：${s.name} · ${s.nights}晚 · ${s.status}`,keyboard:true,zIndexOffset:1200,riseOnHover:true});
      marker.bindTooltip(`${esc(s.hotelName || s.name)} · ${s.nights} 晚<small>${md(s.checkIn)}–${md(s.checkOut)} · ${esc(s.status)} · ${s.exactLocation?'已填写酒店坐标':'区域占位'}</small>`,{direction:'top',offset:[0,-28]});
      marker.on('click',()=>showStay(s.id));marker.addTo(stayLayer);marker.getElement()?.setAttribute('aria-label',`住宿 ${s.name}，${s.nights}晚，${s.status}`);stayMarkers[s.id]=marker;
    }
  }
  function refreshMap() {
    if(!map)return;
    filters.roads?roadsLayer.addTo(map):map.removeLayer(roadsLayer);
    filters.routes?routeLayer.addTo(map):map.removeLayer(routeLayer);
    selectionLayer.clearLayers();alternativeLayer.clearLayers();
    for(const [id,r] of Object.entries(routeLayers)) {
      r.line.setStyle({opacity:state.day && state.day!==id ? .2:.9,weight:state.day===id?4.5:3.5});
      r.casing.setStyle({opacity:state.day && state.day!==id ? .25:.8});
    }
    if(state.day && filters.routes && routeLayers[state.day]) {
      L.geoJSON(routeLayers[state.day].feature,{pane:'selection',interactive:false,style:{color:'#fff9e4',weight:9,opacity:.95}}).addTo(selectionLayer);
      L.geoJSON(routeLayers[state.day].feature,{pane:'selection',style:{color:PHASE_COLORS[byDay[state.day].phase],weight:5.5,opacity:1},onEachFeature:(f,l)=>l.on('click',()=>showDay(state.day))}).addTo(selectionLayer);
      if(state.day==='d7') for(const a of G.alternatives || []) L.geoJSON({type:'Feature',geometry:a.geometry,properties:{}},{pane:'selection',style:{color:'#a38bad',weight:2.5,opacity:.8,dashArray:'4 7'},onEachFeature:(f,l)=>{l.bindTooltip('斯奈山西端 574 备选绕行 · 依当天路况选择',{sticky:true});l.on('click',()=>showDay('d7'));}}).addTo(alternativeLayer);
    }
    renderMarkers();
  }
  function fitTrip() { if(!map)return;map.fitBounds(G.tripBounds || [[63.37,-24.0],[65.13,-16.03]],{padding:[55,65],animate:false});$('#fit-trip').classList.add('active');$('#fit-island').classList.remove('active'); }
  function fitIsland() { state.day=null;refreshMap();renderDayStrip();map.fitBounds(G.bounds || [[63.28,-24.56],[66.65,-13.35]],{padding:[45,55],animate:false});$('#fit-island').classList.add('active');$('#fit-trip').classList.remove('active');caption('全岛冬季参考 · 高地与冬季受限点保留在地图上'); }
  function focusPoint(p,zoom=10) { if(!map)return;map.setView([p.lat,p.lng],Math.max(map.getZoom(),zoom),{animate:false}); }
  function caption(text,color=PHASE_COLORS.outbound) { $('#map-caption span:last-child').textContent=text;$('.caption-line').style.background=color; }
  function setTab(view) { $$('.panel-tabs button').forEach(b=>b.classList.toggle('active',b.dataset.view===view)); }
  function setPanel(html,tab,scroll=true) { setTab(tab);$('#panel-content').innerHTML=html;if(scroll)$('#panel-content').scrollTop=0; }
  function clearSelection() {state.point=null;state.stay=null;state.road=null;}

  const stayTrack = () => `<div class="lodging-track">${T.stays.map((s0,i)=>{const s=booking(s0);return `<button class="lodging-stop" data-stay="${s.id}"><span class="stop-index">${String(i+1).padStart(2,'0')}</span><span class="stop-text"><strong>${esc(s.name)}</strong><small>${md(s.checkIn)} → ${md(s.checkOut)} · ${esc(s.hotelName || s.localName)}</small></span><span class="nights">${s.nights} 晚</span><span class="chevron">›</span></button>`;}).join('')}</div>`;
  const pointCard = p => `<button class="item-card" data-point="${esc(p.id)}"><span class="card-top"><strong>${esc(p.name)}</strong><span class="winter-ring ${p.winter}">${WINTER[p.winter]?.symbol || ''}</span></span><span class="sub">${esc(p.localName)} · ${esc(p.region)}</span><span class="meta"><span class="legend-dot ${p.plan}"></span>${PLAN[p.plan]}<span>·</span>${esc(p.duration || '按需停留')}</span></button>`;
  const dayCard = (d,i) => `<button class="item-card day-card" data-day="${d.id}"><span class="day-number">${String(i+1).padStart(2,'0')}</span><span><span class="card-top"><strong>${esc(DAY_SHORT[i])}</strong><small class="muted">${d.shortDate}</small></span><span class="sub">${esc(d.subtitle)}</span><span class="meta">驾驶 ${hours(d.driveWinter)} <span>·</span> ${esc(d.pressure)}</span></span></button>`;

  function showOverview(fit=false) {
    state={...state,view:'overview',day:null,point:null,stay:null,road:null};setHash('overview');renderDayStrip();refreshMap();if(fit)fitTrip();
    caption('已规划路线与沿线备选 · 点选任意标记查看详情');
    const confirmed=T.stays.filter(s=>booking(s).status==='已确认').length;
    setPanel(`<span class="eyebrow">YOUR WINTER, MAPPED</span><h2>一趟向南的冬日旅程</h2><p class="intro-line">${esc(T.meta.description)}</p><div class="stats"><div class="stat"><strong>8<span style="font-size:12px"> 天</span></strong><small>12.05—12.12</small></div><div class="stat"><strong>7<span style="font-size:12px"> 晚</span></strong><small>5 处住宿</small></div><div class="stat"><strong>≈1,570</strong><small>公里 · 规划估算</small></div></div><div class="section-heading"><h3>五处落脚，两次连住</h3><button data-view="stays">查看住宿 ›</button></div>${stayTrack()}<div class="notice warm compact"><strong>住宿进度 ${confirmed}/5</strong> · ${confirmed?'已填写部分酒店信息':'全部正在预定'}。H 图钉先标在城镇或搜索区域，具体酒店确认后再更新。</div><div class="section-heading"><h3>留给冬天的余量</h3></div><p>南岸去程看黑沙滩，回程补两处瀑布。斯奈山从雷市往返，是全程最长的一天，冬季驾驶预留 <strong>7–8 小时</strong>。</p><div class="detail-actions"><button class="button button-dark" data-day="d1">从第 1 天开始</button><button class="button button-outline" data-action="open-guide">阅读完整攻略</button></div><hr class="source-divider"><p style="font-size:10px">地图保留全岛参考点。点的填色表示是否纳入行程；外圈和符号表示冬季可达性。冬季道路与景区开放须以当天信息为准。</p>`,'overview');
  }
  function showDays() {
    state.view='days';state.day=null;clearSelection();setHash('days');refreshMap();renderDayStrip();
    setPanel(`<span class="eyebrow">EIGHT DAYS, ONE JOURNEY</span><h2>每天，走到哪里</h2><p>点选日期，高亮当天路线。道路预算不含游览、用餐和冰洞活动。</p><div class="card-list" style="margin-top:20px">${T.days.map(dayCard).join('')}</div>`,'days');
  }
  function showDay(id,fit=true) {
    const d=byDay[id];if(!d)return;
    state.view='day';state.day=id;clearSelection();setHash(`day=${id}`);renderDayStrip();refreshMap();
    if(fit && map && routeLayers[id]) map.fitBounds(routeLayers[id].line.getBounds(),{padding:[60,80],maxZoom:10,animate:false});
    caption(`D${dayNum(id)} · ${d.subtitle}`,PHASE_COLORS[d.phase]);
    const stay=d.sleepId?booking(byStay[d.sleepId]):null;
    const pts=(d.pointIds || []).map(x=>byPoint[x]).filter(p=>p && p.kind!=='town' && p.kind!=='airport');
    const optional=P.filter(p=>p.plan==='optional'&&dayOptional(p,id));
    setPanel(`<button class="back-button" data-view="days">← 全部日期</button><span class="eyebrow">DAY ${String(dayNum(id)).padStart(2,'0')} / ${d.shortDate} ${esc(d.weekday || '')}</span><h2>${esc(d.title)}</h2><p>${esc(d.subtitle)}</p><div class="pill-row"><span class="pill ${d.pressure==='最高'?'rust':''}">驾驶压力 · ${esc(d.pressure)}</span>${d.roadNumbers.map(r=>`<button class="pill blue" data-road="${esc(r)}">${esc(r)}${/^\d+$/.test(r)?' 号路':''}</button>`).join('')}</div><p>${esc(d.summary)}</p><div class="stats two"><div class="stat"><strong>${km(d.km)}</strong><small>当天规划里程</small></div><div class="stat"><strong>${hours(d.driveWinter)}</strong><small>冬季驾驶预算</small></div></div><p style="font-size:10px">普通路况约 ${hours(d.driveNormal)}。冬季预算不含游览、餐饮与冰洞转运；天气恶化时需要调整路线。</p><h3>当天节奏</h3><ol class="timeline">${d.timeline.map(t=>`<li><time>${esc(t.time)}</time><h4>${t.pointId && byPoint[t.pointId]?pointLink(t.pointId,t.title):esc(t.title)}</h4><p>${esc(t.text)}</p></li>`).join('')}</ol>${stay?`<h3>今晚住这里</h3><button class="item-card" data-stay="${stay.id}"><span class="card-top"><strong>${esc(stay.name)}</strong><span class="pill ${stay.status==='已确认'?'confirmed':'pending'}">${esc(stay.status)}</span></span><span class="sub">${esc(stay.hotelName || stay.localName)} · ${md(stay.checkIn)}–${md(stay.checkOut)} · ${stay.nights} 晚</span></button>`:''}<h3>为什么这样安排</h3><p>${esc(d.tradeoff)}</p>${list(d.tips)}${alternativeDetails(d)}${pts.length?`<h3>今天的游览点</h3><div class="card-list">${pts.map(pointCard).join('')}</div>`:''}${optional.length?`<h3>有余量时的沿线备选</h3><p style="font-size:10px;margin-bottom:10px">用于替换或补充；开放条件、绕行和停留时间请点开查看。</p><div class="card-list">${optional.slice(0,5).map(pointCard).join('')}</div>${optional.length>5?`<button class="text-link" data-view="optional" style="margin-top:12px;font-size:11px">查看全部沿线备选 ›</button>`:''}`:''}<h3>依据与出发前核对</h3>${sourcesFor(d.sourceIds)}<div class="nav-days">${dayNum(id)>1?`<button data-day="d${dayNum(id)-1}">← 前一天</button>`:''}${dayNum(id)<8?`<button data-day="d${dayNum(id)+1}">下一天 →</button>`:''}</div>`,'days');revealPanel();
  }
  function showPoint(id,focus=true) {
    const p=byPoint[id];if(!p)return;
    state.view='point';state.point=id;state.stay=null;state.road=null;
    if(state.day && !(p.days || []).includes(state.day) && !dayOptional(p,state.day)){state.day=null;renderDayStrip();}
    setHash(`point=${encodeURIComponent(id)}`);refreshMap();if(focus)focusPoint(p,p.kind==='town'?9:10);
    caption(`${p.name} · ${PLAN[p.plan]} · ${WINTER[p.winter]?.name}`);
    const days=(p.days || []).map(x=>byDay[x]).filter(Boolean);
    setPanel(`<button class="back-button" ${state.day?`data-day="${state.day}"`:`data-view="${p.plan==='optional'?'optional':'overview'}"`}>← ${state.day?'返回当天行程':p.plan==='optional'?'沿线备选':'旅程全貌'}</button><span class="eyebrow">${esc(p.region)} / ${p.plan==='planned'?'ON OUR ROUTE':p.plan==='optional'?'A POSSIBLE DETOUR':'AROUND ICELAND'}</span><h2>${esc(p.name)}</h2><div class="local-name">${esc(p.localName)}</div><div class="pill-row">${planPill(p)}${winterPill(p)}</div><p>${esc(p.summary)}</p><div class="stats two"><div class="stat"><strong style="font-size:17px">${esc(p.duration || '按需停留')}</strong><small>建议停留尺度</small></div><div class="stat"><strong style="font-size:17px">${days.length?days.map(d=>`D${dayNum(d.id)}`).join(' / '):'行程之外'}</strong><small>${p.plan==='planned'?'对应旅行日':p.plan==='optional'?'可考虑的日期':'全国参考'}</small></div></div>${p.highlights?.length?`<h3>看什么</h3>${list(p.highlights)}`:''}<h3>十二月怎么去</h3>${notice(p.winterNote || '出发前查看道路、天气及现场开放信息。',p.winter==='usual'?'':p.winter==='closed'?'warm':'warm')}${p.fitNote?`<h3>${p.plan==='optional'?'怎样加入才顺路':'在这趟旅程中的位置'}</h3><p>${esc(p.fitNote)}</p>`:''}${days.length?`<div class="detail-actions">${days.map(d=>`<button class="button button-soft" data-day="${d.id}">查看 ${d.shortDate} 行程</button>`).join('')}</div>`:''}<div class="detail-actions">${ext(mapUrl(p),'在 Google 地图定位','button button-dark')}<button class="button button-outline" data-action="share">复制此景点链接</button></div>${p.id==='ice-cave'?notice('图钉只表示 Jökulsárlón 集合区域；洞口随季节变化，不表示可自行驾车进入冰川。','warm'):''}<h3>官方信息与资料</h3>${sourceList(p.sourceUrls)}<p style="font-size:10px">冬季分类是出行规划参考，不能替代当天的道路与现场开放信息。</p>`,p.plan==='optional'?'optional':days.length?'days':'overview');revealPanel();
  }
  function showStays() {
    state.view='stays';state.day=null;clearSelection();filters.stays=true;const f=$('[data-filter="stays"]');if(f)f.checked=true;setHash('stays');renderDayStrip();refreshMap();fitTrip();
    const confirmed=T.stays.filter(s=>booking(s).status==='已确认').length;
    setPanel(`<span class="eyebrow">FIVE BASES / SEVEN NIGHTS</span><h2>住得少换一点</h2><p>Selfoss 与雷市各连住两晚。点击 H 图钉或下方住宿，查看选址理由并补充预订信息。</p><div class="pill-row"><span class="pill pending">${confirmed} / 5 处已确认</span><span class="pill">共 7 晚 · 换酒店 4 次</span></div><div class="card-list">${T.stays.map(s0=>{const s=booking(s0);return `<button class="item-card" data-stay="${s.id}"><span class="card-top"><strong>${esc(s.name)}</strong><span class="pill ${s.status==='已确认'?'confirmed':'pending'}">${esc(s.status)}</span></span><span class="sub">${esc(s.localName)} · ${md(s.checkIn)} → ${md(s.checkOut)} · ${s.nights} 晚</span><p>${esc(s.hotelName || s.rationale)}</p></button>`;}).join('')}</div>${notice('住宿更新保存在当前浏览器。导出后可在另一台设备导入；将导出的 bookings.json 更新到网站仓库，才会成为所有人可见的共享版本。','compact')}<div class="detail-actions"><button class="button button-dark" data-action="export-bookings">导出住宿更新</button><button class="button button-outline" data-action="import-bookings">导入更新</button></div>`,'stays');
  }
  function showStay(id,focus=true) {
    const s0=byStay[id];if(!s0)return;const s=booking(s0);state.view='stay';state.stay=id;state.point=null;state.road=null;filters.stays=true;const cb=$('[data-filter="stays"]');if(cb)cb.checked=true;setHash(`stay=${id}`);refreshMap();if(focus)focusPoint(s,10);
    caption(`${s.name} · ${s.nights} 晚 · ${s.status} · ${s.exactLocation?'酒店坐标已填写':'目前为区域占位'}`);
    setPanel(`<button class="back-button" data-view="stays">← 五处住宿</button><span class="eyebrow">A PLACE TO REST / BASE ${T.stays.indexOf(s0)+1}</span><h2>${esc(s.name)}</h2><div class="local-name">${esc(s.localName)}</div><div class="pill-row"><span class="pill ${s.status==='已确认'?'confirmed':'pending'}">${esc(s.status)}</span><span class="pill">${s.nights} 晚${s.nights===2?'连住':''}</span></div><div class="stats two"><div class="stat"><strong>${md(s.checkIn)}</strong><small>入住 · 2026</small></div><div class="stat"><strong>${md(s.checkOut)}</strong><small>退房 · 2026</small></div></div>${s.hotelName?`<h3>${esc(s.hotelName)}</h3>${s.address?`<p>${esc(s.address)}</p>`:''}${s.notes?notice(s.notes):''}${s.url?`<div class="detail-actions">${ext(s.url,'已填写的酒店链接','button button-outline')}</div>`:''}`:notice('酒店尚未确定，当前图钉表示搜索区域。下方酒店名称仅供位置参考，未核实你们日期的房态与价格。','warm')}<h3>为什么住这里</h3><p>${esc(s.rationale)}</p><h3>选房范围</h3><p>${esc(s.searchArea)}</p>${list(s.bookingChecks)}${s.examples?.length?`<h3>可用来定位的住宿例子</h3><ul class="source-list">${s.examples.map(e=>`<li>${ext(e.url,e.name)}<small>${esc(e.note)}</small></li>`).join('')}</ul>`:''}<div class="detail-actions">${ext(mapUrl(s),s.exactLocation?'查看已填写的酒店坐标':'查看住宿搜索区域','button button-outline')}</div><form class="booking-form" id="booking-form" data-stay-id="${s.id}"><h3 style="margin:0 0 14px">补充住宿安排</h3><label>预订状态<select name="status">${['正在预定','已确认','待调整'].map(v=>`<option ${s.status===v?'selected':''}>${v}</option>`).join('')}</select></label><label>酒店名称<input name="hotelName" maxlength="160" value="${esc(s.hotelName || '')}" placeholder="确定后填写酒店名称"></label><label>酒店地址<input name="address" maxlength="400" value="${esc(s.address || '')}" placeholder="完整地址或区域"></label><label>酒店网页链接<input name="url" type="url" maxlength="1500" value="${esc(s.url || '')}" placeholder="https://…"></label><details><summary style="font-size:10px;color:#7c8f75;cursor:pointer;margin-bottom:12px">更新地图定位（可选）</summary><p style="font-size:10px;margin-bottom:10px">经纬度都填写后，H 图钉才会移到实际酒店；留空则保留区域位置。移动图钉不会自动重算路线与车程。</p><div class="form-row"><label>纬度<input type="number" name="lat" step="any" min="63" max="68" value="${s.exactLocation?esc(s.lat):''}" placeholder="例如 64.14"></label><label>经度<input type="number" name="lng" step="any" min="-25" max="-12" value="${s.exactLocation?esc(s.lng):''}" placeholder="例如 -21.92"></label></div></details><label>停车、早餐、晚到入住等备注<textarea name="notes" maxlength="2500" placeholder="记录对这次入住有用的信息">${esc(s.notes || '')}</textarea></label><button class="button button-dark" type="submit">保存到本设备</button><p class="booking-state">仅在当前浏览器保存；需要换设备时请导出住宿更新。不会自动提交酒店预订。</p></form><h3>资料来源</h3>${sourcesFor(s.sourceIds)}`,'stays');revealPanel();
  }
  function showOptional(region='全部') {
    state.view='optional';state.region=region;state.day=null;clearSelection();setHash('optional');renderDayStrip();refreshMap();
    const all=P.filter(p=>p.plan==='optional'),regions=['全部',...new Set(all.map(p=>p.region))];
    const visible=region==='全部'?all:all.filter(p=>p.region===region);
    setPanel(`<span class="eyebrow">ROOM FOR A DETOUR</span><h2>沿线，还有这些可能</h2><p>紫色点尚未纳入固定日程。先看开放条件与时间代价，再决定替换哪一站；不把备选全部叠加。</p><div class="optional-filter">${regions.map(r=>`<button class="filter-chip ${r===region?'active':''}" data-region="${esc(r)}">${esc(r)}</button>`).join('')}</div><div class="card-list">${visible.map(pointCard).join('')}</div>`,'optional');
  }
  function showEssentials() {
    state.view='essentials';setHash('essentials');
    setPanel(`<span class="eyebrow">BEFORE THE ROAD</span><h2>把重要的事放在一起</h2><p>这些信息与这条路线直接相关。当天路况、活动集合和酒店安排优先于预设时间表。</p>${T.essentials.map(e=>`<h3>${esc(e.title)}</h3><p>${esc(e.body)}</p>${list(e.items)}${e.links?sourceList(e.links):''}${e.sourceIds?sourcesFor(e.sourceIds):''}`).join('')}`,'essentials');
  }
  function showSources() {
    state.view='sources';setHash('sources');
    const allPointSources=uniqueSources(P.flatMap(p=>p.sourceUrls || []));
    setPanel(`<span class="eyebrow">SOURCES & MAP NOTES</span><h2>有依据，也有边界</h2><p>行程共识与资料核验日期为 2026 年 10 月 26 日。12 月的道路、天气、景点开放与冰洞形态不能提前保证。</p><h3>地图与路线</h3><p>${esc(G.disclaimer || '真实道路几何用于行程表达，不提供实时导航或道路开放承诺。')}</p>${sourceList(G.sources)}${notice('住宿未确定时，路线终点与 H 图钉使用区域占位。具体酒店、停车场及当日通行路线确定后，以实际导航和官方路况为准。','compact')}<h3>行程、住宿与冬季信息</h3>${sourceList(T.sources)}<h3>景点参考</h3>${sourceList(allPointSources)}<hr class="source-divider"><p style="font-size:10px">界面使用 Leaflet 1.9.4（BSD-2-Clause）。道路数据：Vegagerðin — Vegir，获取于 2026-10-26，CC BY 4.0；路线基于 OpenStreetMap / OSRM；海岸线为 Natural Earth 公有领域资料。</p>`,'essentials');
  }
  function showRoad(road) {
    state.view='road';state.road=road;state.point=null;state.stay=null;setHash(`road=${encodeURIComponent(road)}`);
    const linked=T.days.filter(d=>d.roadNumbers.some(r=>r===road||r.split('/').includes(road)));
    const f=G.roads.features.find(f=>String(f.properties.road)===String(road));
    const explanation={'1':'1 号环岛公路是沿海主要干线，连接首都、南岸、东部与北部。冰岛还有许多其他公路；这次行程只使用环岛公路西南与南岸的部分。','41':'机场与首都方向的主要连接公路。雷克雅内斯游览后，本方案经首都外围连接 1 号路。','54':'斯奈山主要道路之一。部分段落跨越 Fróðárheiði，不能把整条路线理解成始终沿海、没有山口。','56':'斯奈山南北连接道路，经 Vatnaleið。冬季需看当天积雪、风和道路状况。','574':'斯奈山西端绕行道路。可作为中部跨越路线的备选，但不是任何天气下都更安全或必定开放。','35':'黄金圈主要道路。行程只用南部维护路段，不继续进入冬季高地。','36':'连接辛格维利尔的主要道路。冬季普通自驾仍要核对当天道路和风雪。'};
    setPanel(`<button class="back-button" data-view="overview">← 旅程全貌</button><span class="eyebrow">THE ROAD NETWORK</span><h2>${esc(road)}${/^\d+$/.test(road)?' 号公路':''}</h2>${f?`<div class="local-name">${esc(f.properties.name || '')}</div>`:''}<p>${esc(explanation[road] || '这条道路是行程中的连接路段。图上的公路中心线表示地理位置，不代表冬季实时通行状态。')}</p>${notice('冰岛不只有一条公路。1 号是环岛主干线；黄金圈、雷克雅内斯和斯奈山都需要使用其他编号公路。高地道路不作为这次冬季自驾捷径。')}<div class="detail-actions">${ext('https://umferdin.is/en','查看实时道路状态','button button-dark')}</div>${linked.length?`<h3>这次在哪几天经过</h3><div class="card-list">${linked.map(d=>dayCard(d,dayNum(d.id)-1)).join('')}</div>`:''}<h3>地图数据</h3>${sourceList(G.sources.filter(s=>/Vegager|道路/.test(s.title)))}`,'days');revealPanel();
  }
  function uniqueSources(a) {const seen=new Set();return a.filter(s=>s && s.url && !seen.has(s.url) && seen.add(s.url));}

  function guideHtml() {
    const sources=uniqueSources([...T.sources,...G.sources,...P.flatMap(p=>p.sourceUrls||[])]);
    const planned=P.filter(p=>p.plan==='planned' && p.kind!=='town' && p.kind!=='airport');
    const optional=P.filter(p=>p.plan==='optional');
    const references=P.filter(p=>p.plan==='reference' && p.kind!=='town');
    const detailPoint=p=>`<section class="guide-point"><h4>${esc(p.name)} <span class="muted">${esc(p.localName)}</span></h4><div class="pill-row">${planPill(p)}${winterPill(p)}<span class="pill">${esc(p.duration)}</span></div><p>${esc(p.summary)}</p>${list(p.highlights)}<p><strong>冬季条件：</strong>${esc(p.winterNote)}</p>${p.fitNote?`<p><strong>如何安排：</strong>${esc(p.fitNote)}</p>`:''}${sourceList(p.sourceUrls)}</section>`;
    return `<section class="guide-intro"><span class="eyebrow">ICELAND / WINTER JOURNAL</span><h2>冰岛冬季完整旅行攻略</h2><p><strong>2026.12.05–12.12 · 8 天 7 晚 · 5 处住宿 · 冰岛当地时间 UTC+0</strong></p><p>${esc(T.meta.description)}</p><p>计划里程 ${km(T.meta.distanceRange)}；冬季驾驶约 26–32 小时。${esc(T.meta.estimateNote)}</p><p>住宿与冰洞尚在预定阶段。资料核验：2026-10-26。</p></section><h2>一、住宿与全程结构</h2><table><thead><tr><th>落脚点</th><th>入住 → 退房</th><th>晚数</th><th>状态 / 酒店</th></tr></thead><tbody>${T.stays.map(s0=>{const s=booking(s0);return `<tr><td>${esc(s.name)}<br>${esc(s.localName)}</td><td>${md(s.checkIn)} → ${md(s.checkOut)}</td><td>${s.nights}</td><td>${esc(s.status)}<br>${esc(s.hotelName || '酒店尚未确定')}</td></tr>`;}).join('')}</tbody></table>${list(T.meta.principles)}<h2>二、每日路线与完整时间表</h2><table><thead><tr><th>日期</th><th>路线</th><th>里程</th><th>冬季驾驶</th></tr></thead><tbody>${T.days.map(d=>`<tr><td>${d.shortDate}</td><td>${esc(d.subtitle)}</td><td>${km(d.km)}</td><td>${hours(d.driveWinter)}</td></tr>`).join('')}</tbody></table>${T.days.map(d=>`<section class="guide-day"><span class="eyebrow">DAY ${dayNum(d.id)} / ${d.date}</span><h3>${esc(d.title)}</h3><p><strong>${esc(d.subtitle)}</strong></p><p>${esc(d.summary)}</p><p>普通驾驶：${hours(d.driveNormal)}；冬季预算：${hours(d.driveWinter)}；压力：${esc(d.pressure)}。道路：${esc(d.roadNumbers.join(' / '))}。</p><table><thead><tr><th>时间尺度</th><th>安排</th><th>细节</th></tr></thead><tbody>${d.timeline.map(t=>`<tr><td>${esc(t.time)}</td><td>${esc(t.title)}</td><td>${esc(t.text)}</td></tr>`).join('')}</tbody></table>${d.sleepId?`<p><strong>当晚住宿：</strong>${esc(byStay[d.sleepId].name)}，${esc(booking(byStay[d.sleepId]).status)}。</p>`:''}<p><strong>安排理由：</strong>${esc(d.tradeoff)}</p>${list(d.tips)}${alternativeDetails(d)}${sourcesFor(d.sourceIds)}</section>`).join('')}<h2>三、五处住宿的选址与预订记录</h2>${T.stays.map(s0=>{const s=booking(s0);return `<section class="guide-point"><h3>${esc(s.name)} · ${s.nights} 晚</h3><p>${s.checkIn} → ${s.checkOut} · ${esc(s.status)}${s.hotelName?' · '+esc(s.hotelName):''}</p><p>${esc(s.rationale)}</p><p><strong>搜索范围：</strong>${esc(s.searchArea)}</p>${s.address?`<p>已填地址：${esc(s.address)}</p>`:''}${s.notes?`<p>入住备注：${esc(s.notes)}</p>`:''}${list(s.bookingChecks)}<p><strong>仅作位置参考：</strong>${s.examples.map(e=>ext(e.url,e.name)).join('；')}。未查询指定日期价格与房态。</p></section>`;}).join('')}<h2>四、已规划景点详情</h2>${planned.map(detailPoint).join('')}<h2>五、沿线备选，按余量替换</h2><p>这些点不属于固定必做项目。路况、开放、绕行与日照允许时再决定；不要把它们全部叠加。</p>${optional.map(detailPoint).join('')}<h2>六、全岛冬季参考</h2><p>此表保留全国地标与冬季可达性的区别，绝大部分不在本次路线内。“普通冬季自驾不适用”不等于专业交通或专门向导也绝对无法到达。</p><table><thead><tr><th>地点</th><th>冬季分类</th><th>限制与说明</th></tr></thead><tbody>${references.map(p=>`<tr><td>${esc(p.name)}<br>${esc(p.localName)}</td><td>${WINTER[p.winter]?.name}</td><td>${esc(p.winterNote)}</td></tr>`).join('')}</tbody></table><h2>七、出行与调整规则</h2>${T.essentials.map(e=>`<h3>${esc(e.title)}</h3><p>${esc(e.body)}</p>${list(e.items)}${e.links?sourceList(e.links):''}`).join('')}<h2>八、数据来源与使用边界</h2><p>${esc(G.disclaimer || '')}</p><p>全国道路为 Vegagerðin — Vegir 数据，取得于 2026-10-26，CC BY 4.0；海岸线为 Natural Earth 公有领域资料；每日路线由 OSRM 基于 OpenStreetMap 生成并以道路途经点约束。道路几何不代表 12 月实时开放或可安全通行。</p>${sourceList(sources)}`;
  }
  function openGuide() {$('#guide-content').innerHTML=guideHtml();const d=$('#guide-dialog');if(!d.open)d.showModal();setHash('guide');}
  function printGuide() {$('#print-guide').innerHTML=guideHtml();$('#print-guide').classList.add('guide-content');window.print();}
  function exportBookings() {
    const data={version:1,updatedAt:new Date().toISOString(),stays:T.stays.map(s=>{const b=booking(s);return {id:s.id,status:b.status,hotelName:b.hotelName || '',address:b.address || '',url:b.url || '',notes:b.notes || '',...(b.exactLocation?{lat:b.lat,lng:b.lng}:{})};})};
    const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='bookings.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);toast('已导出住宿更新；可导入另一设备，或更新仓库中的 data/bookings.json。');
  }
  function toggleLayers() {const el=$('#map-layers');el.hidden=!el.hidden;$('#layers-toggle').setAttribute('aria-expanded',String(!el.hidden));}
  async function share() {try{await navigator.clipboard.writeText(location.href);toast('当前页面链接已复制。');}catch{toast('请复制浏览器地址栏链接，当前景点或日期已包含在链接中。');}}
  function routeHash() {
    const hash=location.hash.slice(1);
    if(hash.startsWith('day=') && byDay[hash.slice(4)]) return showDay(hash.slice(4));
    if(hash.startsWith('point=')) {const id=decodeURIComponent(hash.slice(6));if(byPoint[id])return showPoint(id);}
    if(hash.startsWith('stay=') && byStay[hash.slice(5)]) return showStay(hash.slice(5));
    if(hash.startsWith('road=')) return showRoad(decodeURIComponent(hash.slice(5)));
    if(hash==='days') return showDays();if(hash==='stays')return showStays();if(hash==='optional')return showOptional();if(hash==='essentials')return showEssentials();if(hash==='sources')return showSources();
    if(hash==='guide'){showOverview();return openGuide();}return showOverview();
  }
  function handleView(view) {({overview:()=>showOverview(),days:showDays,stays:showStays,optional:showOptional,essentials:showEssentials,sources:showSources}[view] || showOverview)();}

  document.addEventListener('click',e=>{
    const el=e.target.closest('[data-day],[data-point],[data-stay],[data-view],[data-road],[data-region],[data-action]');if(!el)return;
    if(el.dataset.day)return showDay(el.dataset.day);
    if(el.dataset.point){$('#search-results').hidden=true;$('#map-search').value='';return showPoint(el.dataset.point);}
    if(el.dataset.stay)return showStay(el.dataset.stay);
    if(el.dataset.view)return handleView(el.dataset.view);
    if(el.dataset.road)return showRoad(el.dataset.road);
    if(el.dataset.region)return showOptional(el.dataset.region);
    const actions={overview:()=>showOverview(true),'fit-trip':()=>{state.day=null;refreshMap();renderDayStrip();fitTrip();caption('本次行程 · 雷克雅内斯、黄金圈、南岸与斯奈山');},'fit-island':fitIsland,'toggle-layers':toggleLayers,'open-guide':openGuide,'close-guide':()=>{$('#guide-dialog').close();setHash(state.day?`day=${state.day}`:state.point?`point=${state.point}`:'overview');},'print-guide':printGuide,share,'export-bookings':exportBookings,'import-bookings':()=>$('#booking-import').click()};
    actions[el.dataset.action]?.();
  });
  document.addEventListener('change',e=>{
    if(e.target.dataset.filter){filters[e.target.dataset.filter]=e.target.checked;refreshMap();}
    if(e.target.dataset.winter){winterFilters[e.target.dataset.winter]=e.target.checked;refreshMap();}
  });
  $('#street-map-toggle').addEventListener('change',e=>{
    if(e.target.checked){if(!onlineTiles){onlineTiles=L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png',{pane:'online',subdomains:'abcd',maxZoom:19,attribution:'© <a href="https://carto.com/attributions">CARTO</a> © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'});let warned=false;onlineTiles.on('tileerror',()=>{if(!warned){toast('在线底图暂不可用；本地海岸线、道路和攻略仍可查看。');warned=true;}});}onlineTiles.addTo(map);}else if(onlineTiles)map.removeLayer(onlineTiles);
  });
  $('#map-search').addEventListener('input',e=>{
    const q=e.target.value.trim().toLocaleLowerCase();const box=$('#search-results');if(!q){box.hidden=true;return;}
    const hits=P.filter(p=>`${p.name} ${p.localName} ${p.region}`.toLocaleLowerCase().includes(q)).slice(0,9);
    box.innerHTML=hits.length?hits.map(p=>`<button class="search-result" data-point="${esc(p.id)}"><span class="winter-ring ${p.winter}">${WINTER[p.winter]?.symbol}</span><span><strong>${esc(p.name)}</strong><small>${esc(p.localName)} · ${PLAN[p.plan]}</small></span></button>`).join(''):'<div class="no-results">没有匹配结果，试试中文名或英文地名。</div>';box.hidden=false;
  });
  $('#map-search').addEventListener('keydown',e=>{if(e.key==='Escape')$('#search-results').hidden=true;if(e.key==='Enter'){const b=$('#search-results [data-point]');if(b)b.click();}});
  document.addEventListener('click',e=>{if(!e.target.closest('.search-wrap'))$('#search-results').hidden=true;});
  document.addEventListener('submit',e=>{
    if(e.target.id!=='booking-form')return;e.preventDefault();const form=e.target;const data=Object.fromEntries(new FormData(form));data.id=form.dataset.stayId;const b=validateBookingRecord(data);if(!b)return;
    if((data.lat==='' && data.lng!=='') || (data.lat!=='' && data.lng==='')){toast('请同时填写纬度和经度，或同时留空。');return;}
    bookings[b.id]=b;const ok=saveBookings();showStay(b.id,false);toast(ok?'住宿已保存到本设备，可随时导出备份。':'当前浏览器无法持久保存，请导出住宿更新备份。');
  });
  $('#booking-import').addEventListener('change',async e=>{
    const file=e.target.files[0];if(!file)return;
    try{if(file.size>500000)throw new Error('文件过大，请使用本站导出的住宿 JSON。');const incoming=parseBookings(JSON.parse(await file.text()));bookings={...bookings,...incoming};const ok=saveBookings();showStays();toast(`已导入 ${Object.keys(incoming).length} 处住宿${ok?'。':'；请导出备份，当前浏览器无法持久保存。'}`);}catch(err){toast(err.message || '无法读取此文件。');}e.target.value='';
  });
  window.addEventListener('hashchange',routeHash);
  window.addEventListener('resize',()=>map?.invalidateSize());
  $('#guide-dialog').addEventListener('click',e=>{if(e.target===$('#guide-dialog'))$('#guide-dialog').close();});
  $('#guide-dialog').addEventListener('close',()=>{setHash(state.day?`day=${state.day}`:state.point?`point=${state.point}`:state.stay?`stay=${state.stay}`:state.view==='stays'?'stays':'overview');});
  if(!T || !G || !P.length || !window.L){$('#panel-content').innerHTML='<h2>资料正在加载</h2><p>请刷新页面。如果仍无法显示，检查行程、地标、地图数据与 Leaflet 文件是否完整上传。</p>';$('#map-load-note').hidden=false;$('#map-load-note').textContent='地图资料未完整载入。';return;}
  loadLocalBookings();renderDayStrip();initMap();routeHash();
  if(!window.ICELAND_STANDALONE && /^https?:$/.test(location.protocol)) fetch('data/bookings.json',{cache:'no-store'}).then(r=>r.ok?r.json():null).then(data=>{if(!data)return;const shared=parseBookings(data);bookings={...shared,...bookings};if(Object.keys(shared).length){renderMarkers();if(state.view==='overview')showOverview();else if(state.view==='stays')showStays();else if(state.view==='stay')showStay(state.stay,false);}}).catch(()=>{});
})();
