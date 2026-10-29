/* Iceland Winter Journal · static, client-side application */
(() => {
  'use strict';
  const LANG = window.ICELAND_LANG === 'en' ? 'en' : 'zh';
  const EN = LANG === 'en';
  const t = (zh, en) => EN ? en : zh;
  const T = EN ? window.ICELAND_TRIP_EN : window.ICELAND_TRIP;
  const P = (EN ? window.ICELAND_POINTS_EN : window.ICELAND_POINTS) || [];
  const originalPoints = Object.fromEntries((window.ICELAND_POINTS || []).map(p => [p.id, p]));
  const englishPoints = Object.fromEntries((window.ICELAND_POINTS_EN || []).map(p => [p.id, p]));
  const geoNotes = [
    'Iceland polygons extracted and simplified by approximately 30 metres for display.',
    'Retrieved 26 October 2026. Main roads selected, converted to WGS84 and simplified for display. The itinerary and winter categories are prepared by this guide and do not imply endorsement by the road authority.',
    'Static route geometry with explicit waypoints; not a live road-access service.'
  ];
  const rawGeo = window.ICELAND_GEO;
  const G = rawGeo && {...rawGeo,
    disclaimer: EN ? 'Static planning routes follow real roads. They are not live navigation or a guarantee of winter access.' : rawGeo.disclaimer,
    sources: (rawGeo.sources || []).map((s,i) => EN ? {...s, note:geoNotes[i] || s.note} : s)
  };
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeUrl = s => { try { const u = new URL(s); return ['https:', 'http:'].includes(u.protocol) ? u.href : '#'; } catch { return '#'; } };
  const ext = (u, label, cls = '') => `<a class="${cls}" href="${esc(safeUrl(u))}" target="_blank" rel="noopener noreferrer">${esc(label)} ↗</a>`;
  const byPoint = Object.fromEntries(P.map(p => [p.id, p]));
  const byDay = Object.fromEntries((T?.days || []).map(d => [d.id, d]));
  const byStay = Object.fromEntries((T?.stays || []).map(s => [s.id, s]));
  const bySource = Object.fromEntries((T?.sources || []).map(s => [s.id, s]));
  const WINTER = {usual:{name:t("冬季通常可达","Usually accessible in winter"),symbol:'✓'},conditional:{name:t("依路况与开放区域","Subject to road and site conditions"),symbol:'!'},guided:{name:t("需要正规向导","Professional guide required"),symbol:'G'},closed:{name:t("普通冬季自驾不适用","Not suitable for ordinary winter self-driving"),symbol:'×'}};
  const PLAN = {planned:t("已规划","Planned"),optional:t("沿线备选","Optional stops"),reference:t("全岛参考","Across Iceland")};
  const PHASE_COLORS = {arrival:'#527b7e',outbound:'#117b83',return:'#c5734a',daytrip:'#78649b',departure:'#527b7e'};
  const DAY_SHORT = EN ? ['Arrival','Reykjanes','Golden Circle','South Coast','Ice & lagoons','Waterfalls','Snæfellsnes','City & flight'] : ['抵达冰岛','雷克雅内斯','黄金圈','向东看海','冰洞与冰河湖','南岸回程','斯奈山半岛','雷市与返程'];
  const STATE_KEY = 'iceland-winter-2026-bookings-v1';
  const LANGUAGE_DRAFT_KEY = 'iceland-winter-2026-language-transition';
  const statusName = value => EN ? ({'正在预定':'Being arranged','已确认':'Confirmed','待调整':'Needs review'}[value] || value) : value;
  const pressureName = value => EN ? ({'轻松':'Easy','中等':'Moderate','偏高':'High','最高':'Highest'}[value] || value) : value;
  const nights = value => EN ? `${value} night${value===1?'':'s'}` : `${value} 晚`;
  const roadName = value => /^\d+$/.test(value) ? (EN ? `Route ${value}` : `${value} 号路`) : value;
  const searchText = value => String(value).toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/þ/g,'th').replace(/ð/g,'d').replace(/æ/g,'ae');
  let transition = null;
  try { transition=history.state?.icelandLanguageTransition || JSON.parse(sessionStorage.getItem(LANGUAGE_DRAFT_KEY) || 'null'); } catch {}
  let languageDraft = transition?.draft || null;
  let state = {view:'overview',day:null,point:null,stay:null,road:null,region:t("全部","All regions")};
  const filters = {planned:true,optional:true,reference:true,stays:true,routes:true,roads:true};
  const winterFilters = {usual:true,conditional:true,guided:true,closed:true};
  let bookings = {}, map, pointLayer, stayLayer, roadsLayer, routeLayer, selectionLayer, alternativeLayer, onlineTiles;
  let pointMarkers = {}, stayMarkers = {}, routeLayers = {}, toastTimer;

  const hours = a => {
    if (!a) return '—';
    if (a[1] <= .5) return `${Math.round(a[0] * 60)}–${Math.round(a[1] * 60)} ${t('分钟','min')}`;
    const n = v => Number(v.toFixed(1)).toString();
    return a[0] === a[1] ? `${n(a[0])} ${t('小时','hr')}` : `${n(a[0])}–${n(a[1])} ${t('小时','hr')}`;
  };
  const km = a => a ? `${a[0].toLocaleString()}–${a[1].toLocaleString()} km` : '—';
  const md = s => !s ? '' : EN ? `${Number(s.slice(8,10))} ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][Number(s.slice(5,7))-1]}` : s.slice(5).replace('-', '/');
  const dayNum = id => Number(id?.slice(1)) || 0;
  const winterPill = p => `<span class="pill ${esc(p.winter)}">${WINTER[p.winter]?.symbol || ''} ${WINTER[p.winter]?.name || t("查看详情","View details")}</span>`;
  const planPill = p => `<span class="pill ${p.plan === 'optional' ? 'optional' : ''}">${PLAN[p.plan] || t("参考","Reference")}</span>`;
  const list = (items, cls = 'detail-list') => items?.length ? `<ul class="${cls}">${items.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : '';
  const pointLink = (id, label) => `<button class="text-link" data-point="${esc(id)}">${esc(label || byPoint[id]?.name || id)}</button>`;
  const notice = (text, tone = '') => `<div class="notice ${tone}">${esc(text)}</div>`;
  const booking = s => ({...s, ...(bookings[s.id] || {})});
  const sourceList = sources => `<ul class="source-list">${(sources || []).filter(Boolean).map(s => `<li>${ext(s.url, s.title || s.label || s.url)}${s.note ? `<small>${esc(s.note)}</small>` : ''}</li>`).join('')}</ul>`;
  const sourcesFor = ids => sourceList((ids || []).map(id => bySource[id]).filter(Boolean));
  const alternativeDetails = d => d.routeAlternatives?.length ? `<h3>${t("路线按当天路况选择","Choose the route for conditions on the day")}</h3><div class="card-list">${d.routeAlternatives.map(a=>`<div class="item-card"><span class="card-top"><strong>${esc(a.label)}</strong><span class="pill blue">${km(a.km)}</span></span><p>${esc(a.roads)}</p><p>${esc(a.note)}</p></div>`).join('')}</div>` : '';
  const mapUrl = p => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${p.lat},${p.lng}`)}`;
  const toast = text => { const el = $('#toast'); clearTimeout(toastTimer); el.textContent = text; el.hidden = false; toastTimer = setTimeout(() => {el.hidden = true;}, 4000); };
  const setHash = hash => { try { const url=new URL(location.href);url.searchParams.set('lang',LANG);url.hash=hash;history.replaceState(history.state, '', url); } catch {} };
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
    if (obj?.version !== 1 || !Array.isArray(obj.stays)) throw new Error(t("这不是本站导出的住宿文件。","This is not a booking file exported by this site."));
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

  // Language changes never commit a draft booking or translate user-entered text.
  function captureBookingDraft() {
    const form=$('#booking-form');
    if(!form || !byStay[form.dataset.stayId])return null;
    const s=booking(byStay[form.dataset.stayId]),fields={};
    const saved={status:s.status,hotelName:s.hotelName || '',address:s.address || '',url:s.url || '',notes:s.notes || '',lat:s.exactLocation?String(s.lat):'',lng:s.exactLocation?String(s.lng):''};
    for(const [name,value] of new FormData(form))if(Object.hasOwn(saved,name) && value!==saved[name])fields[name]=value;
    const coordinatesOpen=!!$('details',form)?.open;
    return Object.keys(fields).length || coordinatesOpen ? {id:form.dataset.stayId,fields,coordinatesOpen} : null;
  }
  function restoreBookingDraft() {
    const form=$('#booking-form');
    if(!form || form.dataset.stayId!==languageDraft?.id)return;
    for(const name of ['status','hotelName','address','url','notes','lat','lng']) {
      const field=form.elements.namedItem(name),value=languageDraft.fields?.[name];
      if(field && typeof value==='string')field.value=value;
    }
    const details=$('details',form);if(details)details.open=!!languageDraft.coordinatesOpen;
    languageDraft=null;
  }
  function clearLanguageTransition() {
    try {sessionStorage.removeItem(LANGUAGE_DRAFT_KEY);} catch {}
    try {
      const next={...(history.state || {})};delete next.icelandLanguageTransition;
      history.replaceState(next,'',location.href);
    } catch {}
    transition=null;
  }
  function toggleLanguage() {
    const next=EN?'zh':'en',url=new URL(location.href),center=map?.getCenter();
    url.searchParams.set('lang',next);
    const context={
      ...state,draft:captureBookingDraft(),filters:{...filters},winterFilters:{...winterFilters},
      map:center?{lat:center.lat,lng:center.lng,zoom:map.getZoom()}:null,
      panelScroll:$('#panel-content').scrollTop,guideScroll:$('#guide-dialog').scrollTop,
      optionalRegionPoint:P.find(p=>p.plan==='optional' && p.region===state.region)?.id || null,
      layersOpen:!$('#map-layers').hidden,streetMap:$('#street-map-toggle').checked,
      islandView:$('#fit-island').classList.contains('active')
    };
    let stored=false;
    try {sessionStorage.setItem(LANGUAGE_DRAFT_KEY,JSON.stringify(context));stored=true;} catch {}
    try {
      history.replaceState({...history.state,icelandLanguageTransition:context},'',url);
      try {localStorage.setItem('iceland-winter-2026-language',next);} catch {}
      location.reload();return;
    } catch {}
    if(context.draft && !stored) {
      toast(t('浏览器无法保留未保存的住宿内容，请先保存住宿信息再切换语言。','The browser cannot preserve this unsaved booking draft. Save the stay details before switching languages.'));
      return;
    }
    try {localStorage.setItem('iceland-winter-2026-language',next);} catch {}
    location.assign(url.href);
  }
  function restoreLanguageView() {
    if(!transition)return;
    const guideOpen=$('#guide-dialog').open;
    if(transition.map && [transition.map.lat,transition.map.lng,transition.map.zoom].every(Number.isFinite))
      map.setView([transition.map.lat,transition.map.lng],transition.map.zoom,{animate:false});
    if(state.view==='optional' && transition.optionalRegionPoint && byPoint[transition.optionalRegionPoint])
      showOptional(byPoint[transition.optionalRegionPoint].region);
    if(guideOpen)openGuide();
    if(transition.islandView) {
      $('#fit-island').classList.add('active');$('#fit-trip').classList.remove('active');
      if(state.view==='overview')caption(t('全岛冬季参考 · 高地与冬季受限点保留在地图上','Winter across Iceland · highlands and restricted locations remain visible'));
    }
    $('#map-layers').hidden=!transition.layersOpen;
    $('#layers-toggle').setAttribute('aria-expanded',String(!!transition.layersOpen));
    if(transition.streetMap) {const input=$('#street-map-toggle');input.checked=true;input.dispatchEvent(new Event('change'));}
    $('#panel-content').scrollTop=Number(transition.panelScroll)||0;
    $('#guide-dialog').scrollTop=Number(transition.guideScroll)||0;
    clearLanguageTransition();
  }

  function renderDayStrip() {
    $('#day-strip').innerHTML = `<button class="day-button all ${!state.day?'active':''}" data-action="overview"><span class="day-index">◎</span><span><strong>${t("旅程全貌","Trip overview")}</strong><small>8 DAYS / 7 NIGHTS</small></span></button>` + T.days.map((d,i) => `<button class="day-button ${state.day===d.id?'active':''}" data-day="${d.id}" aria-pressed="${state.day===d.id}"><span class="day-index">D${i+1}</span><span><strong>${DAY_SHORT[i]}</strong><small>${d.shortDate} · ${esc(d.weekday || '')}</small></span></button>`).join('');
  }

  function initMap() {
    map = L.map('map',{center:[64.3,-20],zoom:6,zoomControl:false,minZoom:5,maxZoom:15,zoomSnap:.25,maxBounds:[[61,-28],[69,-10]],maxBoundsViscosity:.5});
    L.control.zoom({position:'bottomright',zoomInTitle:t('放大','Zoom in'),zoomOutTitle:t('缩小','Zoom out')}).addTo(map);
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
      layer.bindTooltip(`${esc(roadName(String(f.properties.road)))} · ${esc(f.properties.name || '')}<small>${t("主干道路参考 · 非实时路况","Road network reference · not live conditions")}</small>`,{sticky:true});
      layer.on('click',()=>showRoad(f.properties.road));
    }}).addTo(map);
    const labels=[[t("冰 岛  /  I C E L A N D","I C E L A N D"),65.05,-20.05,'country'],[t("北 大 西 洋","N O R T H  A T L A N T I C"),63.18,-20.3,'ocean'],[t("瓦特纳冰川","Vatnajökull"),64.48,-16.82,'glacier'],[t("朗格冰川","Langjökull"),64.75,-20.2,'glacier'],[t("米达尔斯冰川","Mýrdalsjökull"),63.65,-19.1,'glacier'],[t("雷克雅未克","Reykjavík"),64.2,-22.0,''],[t("阿克雷里","Akureyri"),65.77,-18.5,''],[t("东部峡湾","Eastfjords"),65.15,-14.7,'']];
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
    return (regions[dayId] || []).some(r=>originalPoints[p.id]?.region?.includes(r));
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
      marker.getElement()?.setAttribute('aria-label',`${p.name}, ${PLAN[p.plan]}, ${WINTER[p.winter]?.name}`);
      pointMarkers[p.id]=marker;
    }
    if(filters.stays) for (const s0 of T.stays) {
      const s=booking(s0);const current=state.stay===s.id;
      const relevant=!state.day || byDay[state.day]?.sleepId===s.id || byDay[`d${dayNum(state.day)-1}`]?.sleepId===s.id;
      if(!relevant && !current)continue;
      const icon=L.divIcon({className:'stay-marker',html:`<div class="hotel-pin ${current?'selected':''}"><span>H</span></div>`,iconSize:[30,33],iconAnchor:[14,30]});
      const marker=L.marker([s.lat,s.lng],{icon,title:`${t('住宿：','Stay: ')}${s.name} · ${nights(s.nights)} · ${statusName(s.status)}`,keyboard:true,zIndexOffset:1200,riseOnHover:true});
      marker.bindTooltip(`${esc(s.hotelName || s.name)} · ${nights(s.nights)}<small>${md(s.checkIn)}–${md(s.checkOut)} · ${esc(statusName(s.status))} · ${s.exactLocation?t("已填写酒店坐标","Hotel coordinates entered"):t("区域占位","Area placeholder")}</small>`,{direction:'top',offset:[0,-28]});
      marker.on('click',()=>showStay(s.id));marker.addTo(stayLayer);marker.getElement()?.setAttribute('aria-label',`${t('住宿 ','Stay ')}${s.name}, ${nights(s.nights)}, ${statusName(s.status)}`);stayMarkers[s.id]=marker;
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
      if(state.day==='d7') for(const a of G.alternatives || []) L.geoJSON({type:'Feature',geometry:a.geometry,properties:{}},{pane:'selection',style:{color:'#a38bad',weight:2.5,opacity:.8,dashArray:'4 7'},onEachFeature:(f,l)=>{l.bindTooltip(t("斯奈山西端 574 备选绕行 · 依当天路况选择","Optional western loop via Route 574 · check conditions on the day"),{sticky:true});l.on('click',()=>showDay('d7'));}}).addTo(alternativeLayer);
    }
    renderMarkers();
  }
  function fitTrip() { if(!map)return;map.fitBounds(G.tripBounds || [[63.37,-24.0],[65.13,-16.03]],{padding:[55,65],animate:false});$('#fit-trip').classList.add('active');$('#fit-island').classList.remove('active'); }
  function fitIsland() { state.day=null;refreshMap();renderDayStrip();map.fitBounds(G.bounds || [[63.28,-24.56],[66.65,-13.35]],{padding:[45,55],animate:false});$('#fit-island').classList.add('active');$('#fit-trip').classList.remove('active');caption(t("全岛冬季参考 · 高地与冬季受限点保留在地图上","Winter across Iceland · highlands and restricted locations remain visible")); }
  function focusPoint(p,zoom=10) { if(!map)return;map.setView([p.lat,p.lng],Math.max(map.getZoom(),zoom),{animate:false}); }
  function caption(text,color=PHASE_COLORS.outbound) { $('#map-caption span:last-child').textContent=text;$('.caption-line').style.background=color; }
  function setTab(view) { $$('.panel-tabs button').forEach(b=>b.classList.toggle('active',b.dataset.view===view)); }
  function setPanel(html,tab,scroll=true) { setTab(tab);$('#panel-content').innerHTML=html;if(scroll)$('#panel-content').scrollTop=0; }
  function clearSelection() {state.point=null;state.stay=null;state.road=null;}

  const stayTrack = () => `<div class="lodging-track">${T.stays.map((s0,i)=>{const s=booking(s0);return `<button class="lodging-stop" data-stay="${s.id}"><span class="stop-index">${String(i+1).padStart(2,'0')}</span><span class="stop-text"><strong>${esc(s.name)}</strong><small>${md(s.checkIn)} → ${md(s.checkOut)} · ${esc(s.hotelName || s.localName)}</small></span><span class="nights">${nights(s.nights)}</span><span class="chevron">›</span></button>`;}).join('')}</div>`;
  const pointCard = p => `<button class="item-card" data-point="${esc(p.id)}"><span class="card-top"><strong>${esc(p.name)}</strong><span class="winter-ring ${p.winter}">${WINTER[p.winter]?.symbol || ''}</span></span><span class="sub">${esc(p.localName)} · ${esc(p.region)}</span><span class="meta"><span class="legend-dot ${p.plan}"></span>${PLAN[p.plan]}<span>·</span>${esc(p.duration || t("按需停留","As needed"))}</span></button>`;
  const dayCard = (d,i) => `<button class="item-card day-card" data-day="${d.id}"><span class="day-number">${String(i+1).padStart(2,'0')}</span><span><span class="card-top"><strong>${esc(DAY_SHORT[i])}</strong><small class="muted">${d.shortDate}</small></span><span class="sub">${esc(d.subtitle)}</span><span class="meta">${t('驾驶 ','Driving ')}${hours(d.driveWinter)} <span>·</span> ${esc(pressureName(d.pressure))}</span></span></button>`;

  function showOverview(fit=false) {
    state={...state,view:'overview',day:null,point:null,stay:null,road:null};setHash('overview');renderDayStrip();refreshMap();if(fit)fitTrip();
    caption(t("已规划路线与沿线备选 · 点选任意标记查看详情","Planned routes and optional stops · select a marker for details"));
    const confirmed=T.stays.filter(s=>booking(s).status==='已确认').length;
    setPanel(`<span class="eyebrow">YOUR WINTER, MAPPED</span><h2>${t("一趟向南的冬日旅程","A winter journey along the south")}</h2><p class="intro-line">${esc(T.meta.description)}</p><div class="stats"><div class="stat"><strong>8<span style="font-size:12px">${t(' 天',' days')}</span></strong><small>${t('12.05—12.12','5–12 Dec')}</small></div><div class="stat"><strong>7<span style="font-size:12px">${t(' 晚',' nights')}</span></strong><small>${t("5 处住宿","5 bases")}</small></div><div class="stat"><strong>≈1,570</strong><small>${t("公里 · 规划估算","km · planning estimate")}</small></div></div><div class="section-heading"><h3>${t("五处落脚，两次连住","Five bases, two longer stays")}</h3><button data-view="stays">${t("查看住宿 ›","View stays ›")}</button></div>${stayTrack()}<div class="notice warm compact"><strong>${t("住宿进度 ","Stays confirmed ")}${confirmed}/5</strong> · ${confirmed?t("已填写部分酒店信息","Some hotel details have been added"):t("全部正在预定","All stays are being arranged")}${t("。H 图钉先标在城镇或搜索区域，具体酒店确认后再更新。",". H pins mark towns or search areas until the actual hotels are confirmed.")}</div><div class="section-heading"><h3>${t("留给冬天的余量","Room for winter conditions")}</h3></div><p>${t("南岸去程看黑沙滩，回程补两处瀑布。斯奈山从雷市往返，是全程最长的一天，冬季驾驶预留 ","Visit the black-sand beach on the way east and two waterfalls on the return. The Snæfellsnes day trip from Reykjavík is the longest day; allow ")}<strong>${t("7–8 小时","7–8 hours")}</strong>${t('。','.')}</p><div class="detail-actions"><button class="button button-dark" data-day="d1">${t("从第 1 天开始","Start with day 1")}</button><button class="button button-outline" data-action="open-guide">${t("阅读完整攻略","Read the complete guide")}</button></div><hr class="source-divider"><p style="font-size:10px">${t("地图保留全岛参考点。点的填色表示是否纳入行程；外圈和符号表示冬季可达性。冬季道路与景区开放须以当天信息为准。","The map includes reference locations across Iceland. Fill colour shows their role in the itinerary; rings and symbols indicate winter access. Check road and site conditions on the day.")}</p>`,'overview');
  }
  function showDays() {
    state.view='days';state.day=null;clearSelection();setHash('days');refreshMap();renderDayStrip();
    setPanel(`<span class="eyebrow">EIGHT DAYS, ONE JOURNEY</span><h2>${t("每天，走到哪里","Where each day takes you")}</h2><p>${t("点选日期，高亮当天路线。道路预算不含游览、用餐和冰洞活动。","Select a day to highlight its route. Driving budgets exclude sightseeing, meals and ice-cave activities.")}</p><div class="card-list" style="margin-top:20px">${T.days.map(dayCard).join('')}</div>`,'days');
  }
  function showDay(id,fit=true) {
    const d=byDay[id];if(!d)return;
    state.view='day';state.day=id;clearSelection();setHash(`day=${id}`);renderDayStrip();refreshMap();
    if(fit && map && routeLayers[id]) map.fitBounds(routeLayers[id].line.getBounds(),{padding:[60,80],maxZoom:10,animate:false});
    caption(`D${dayNum(id)} · ${d.subtitle}`,PHASE_COLORS[d.phase]);
    const stay=d.sleepId?booking(byStay[d.sleepId]):null;
    const pts=(d.pointIds || []).map(x=>byPoint[x]).filter(p=>p && p.kind!=='town' && p.kind!=='airport');
    const optional=P.filter(p=>p.plan==='optional'&&dayOptional(p,id));
    setPanel(`<button class="back-button" data-view="days">${t("← 全部日期","← All days")}</button><span class="eyebrow">DAY ${String(dayNum(id)).padStart(2,'0')} / ${d.shortDate} ${esc(d.weekday || '')}</span><h2>${esc(d.title)}</h2><p>${esc(d.subtitle)}</p><div class="pill-row"><span class="pill ${d.pressure==='最高'?'rust':''}">${t("驾驶压力 · ","Driving demand · ")}${esc(pressureName(d.pressure))}</span>${d.roadNumbers.map(r=>`<button class="pill blue" data-road="${esc(r)}">${esc(roadName(r))}</button>`).join('')}</div><p>${esc(d.summary)}</p><div class="stats two"><div class="stat"><strong>${km(d.km)}</strong><small>${t("当天规划里程","Planned distance")}</small></div><div class="stat"><strong>${hours(d.driveWinter)}</strong><small>${t("冬季驾驶预算","Winter driving budget")}</small></div></div><p style="font-size:10px">${t("普通路况约 ","In normal conditions, about ")}${hours(d.driveNormal)}${t("。冬季预算不含游览、餐饮与冰洞转运；天气恶化时需要调整路线。",". The winter budget excludes sightseeing, meals and ice-cave transfers. Adjust the route if conditions deteriorate.")}</p><h3>${t("当天节奏","The day at a glance")}</h3><ol class="timeline">${d.timeline.map(t=>`<li><time>${esc(t.time)}</time><h4>${t.pointId && byPoint[t.pointId]?pointLink(t.pointId,t.title):esc(t.title)}</h4><p>${esc(t.text)}</p></li>`).join('')}</ol>${stay?`<h3>${t("今晚住这里","Tonight’s stay")}</h3><button class="item-card" data-stay="${stay.id}"><span class="card-top"><strong>${esc(stay.name)}</strong><span class="pill ${stay.status==='已确认'?'confirmed':'pending'}">${esc(statusName(stay.status))}</span></span><span class="sub">${esc(stay.hotelName || stay.localName)} · ${md(stay.checkIn)}–${md(stay.checkOut)} · ${nights(stay.nights)}</span></button>`:''}<h3>${t("为什么这样安排","Why this works")}</h3><p>${esc(d.tradeoff)}</p>${list(d.tips)}${alternativeDetails(d)}${pts.length?`<h3>${t("今天的游览点","Today’s stops")}</h3><div class="card-list">${pts.map(pointCard).join('')}</div>`:''}${optional.length?`<h3>${t("有余量时的沿线备选","Optional stops if time allows")}</h3><p style="font-size:10px;margin-bottom:10px">${t("用于替换或补充；开放条件、绕行和停留时间请点开查看。","Use these as alternatives or additions. Open each one for access conditions, detours and time needed.")}</p><div class="card-list">${optional.slice(0,5).map(pointCard).join('')}</div>${optional.length>5?`<button class="text-link" data-view="optional" style="margin-top:12px;font-size:11px">${t("查看全部沿线备选 ›","View all optional stops ›")}</button>`:''}`:''}<h3>${t("依据与出发前核对","Sources and checks before departure")}</h3>${sourcesFor(d.sourceIds)}<div class="nav-days">${dayNum(id)>1?`<button data-day="d${dayNum(id)-1}">${t("← 前一天","← Previous day")}</button>`:''}${dayNum(id)<8?`<button data-day="d${dayNum(id)+1}">${t("下一天 →","Next day →")}</button>`:''}</div>`,'days');revealPanel();
  }
  function showPoint(id,focus=true) {
    const p=byPoint[id];if(!p)return;
    state.view='point';state.point=id;state.stay=null;state.road=null;
    if(state.day && !(p.days || []).includes(state.day) && !dayOptional(p,state.day)){state.day=null;renderDayStrip();}
    setHash(`point=${encodeURIComponent(id)}`);refreshMap();if(focus)focusPoint(p,p.kind==='town'?9:10);
    caption(`${p.name} · ${PLAN[p.plan]} · ${WINTER[p.winter]?.name}`);
    const days=(p.days || []).map(x=>byDay[x]).filter(Boolean);
    setPanel(`<button class="back-button" ${state.day?`data-day="${state.day}"`:`data-view="${p.plan==='optional'?'optional':'overview'}"`}>← ${state.day?t("返回当天行程","Back to this day"):p.plan==='optional'?t("沿线备选","Optional stops"):t("旅程全貌","Trip overview")}</button><span class="eyebrow">${esc(p.region)} / ${p.plan==='planned'?'ON OUR ROUTE':p.plan==='optional'?'A POSSIBLE DETOUR':'AROUND ICELAND'}</span><h2>${esc(p.name)}</h2><div class="local-name">${esc(p.localName)}</div><div class="pill-row">${planPill(p)}${winterPill(p)}</div><p>${esc(p.summary)}</p><div class="stats two"><div class="stat"><strong style="font-size:17px">${esc(p.duration || t("按需停留","As needed"))}</strong><small>${t("建议停留尺度","Suggested time")}</small></div><div class="stat"><strong style="font-size:17px">${days.length?days.map(d=>`D${dayNum(d.id)}`).join(' / '):t("行程之外","Outside this trip")}</strong><small>${p.plan==='planned'?t("对应旅行日","Scheduled day"):p.plan==='optional'?t("可考虑的日期","Possible days"):t("全国参考","Island-wide reference")}</small></div></div>${p.highlights?.length?`<h3>${t("看什么","What to see")}</h3>${list(p.highlights)}`:''}<h3>${t("十二月怎么去","Visiting in December")}</h3>${notice(p.winterNote || t("出发前查看道路、天气及现场开放信息。","Check road conditions, weather and site access before setting out."),p.winter==='usual'?'':p.winter==='closed'?'warm':'warm')}${p.fitNote?`<h3>${p.plan==='optional'?t("怎样加入才顺路","How to fit it in"):t("在这趟旅程中的位置","Where it fits in this trip")}</h3><p>${esc(p.fitNote)}</p>`:''}${days.length?`<div class="detail-actions">${days.map(d=>`<button class="button button-soft" data-day="${d.id}">${t('查看 ','View ')}${d.shortDate}${t(' 行程',' itinerary')}</button>`).join('')}</div>`:''}<div class="detail-actions">${ext(mapUrl(p),t("在 Google 地图定位","Open in Google Maps"),'button button-dark')}<button class="button button-outline" data-action="share">${t("复制此景点链接","Copy this place link")}</button></div>${p.id==='ice-cave'?notice(t("图钉只表示 Jökulsárlón 集合区域；洞口随季节变化，不表示可自行驾车进入冰川。","This pin marks only the Jökulsárlón meeting area. The cave location changes with the season; it is not a self-drive route onto the glacier."),'warm'):''}<h3>${t("官方信息与资料","Official information and sources")}</h3>${sourceList(p.sourceUrls)}<p style="font-size:10px">${t("冬季分类是出行规划参考，不能替代当天的道路与现场开放信息。","Winter categories are planning guidance. They do not replace road and site-access information on the day.")}</p>`,p.plan==='optional'?'optional':days.length?'days':'overview');revealPanel();
  }
  function showStays() {
    state.view='stays';state.day=null;clearSelection();filters.stays=true;const f=$('[data-filter="stays"]');if(f)f.checked=true;setHash('stays');renderDayStrip();refreshMap();fitTrip();
    const confirmed=T.stays.filter(s=>booking(s).status==='已确认').length;
    setPanel(`<span class="eyebrow">FIVE BASES / SEVEN NIGHTS</span><h2>${t("住得少换一点","Fewer hotel changes")}</h2><p>${t("Selfoss 与雷市各连住两晚。点击 H 图钉或下方住宿，查看选址理由并补充预订信息。","Stay two nights each in Selfoss and Reykjavík. Select an H pin or a stay below for the location rationale and booking details.")}</p><div class="pill-row"><span class="pill pending">${confirmed}${t(" / 5 处已确认"," / 5 confirmed")}</span><span class="pill">${t("共 7 晚 · 换酒店 4 次","7 nights · 4 hotel changes")}</span></div><div class="card-list">${T.stays.map(s0=>{const s=booking(s0);return `<button class="item-card" data-stay="${s.id}"><span class="card-top"><strong>${esc(s.name)}</strong><span class="pill ${s.status==='已确认'?'confirmed':'pending'}">${esc(statusName(s.status))}</span></span><span class="sub">${esc(s.localName)} · ${md(s.checkIn)} → ${md(s.checkOut)} · ${nights(s.nights)}</span><p>${esc(s.hotelName || s.rationale)}</p></button>`;}).join('')}</div>${notice(t("住宿更新保存在当前浏览器。导出后可在另一台设备导入；将导出的 bookings.json 更新到网站仓库，才会成为所有人可见的共享版本。","Booking updates are saved in this browser. Export them to import on another device. Replace data/bookings.json in the website repository to publish a shared version for everyone."),'compact')}<div class="detail-actions"><button class="button button-dark" data-action="export-bookings">${t("导出住宿更新","Export booking updates")}</button><button class="button button-outline" data-action="import-bookings">${t("导入更新","Import updates")}</button></div>`,'stays');
  }
  function showStay(id,focus=true) {
    const s0=byStay[id];if(!s0)return;const s=booking(s0);state.view='stay';state.stay=id;state.point=null;state.road=null;filters.stays=true;const cb=$('[data-filter="stays"]');if(cb)cb.checked=true;setHash(`stay=${id}`);refreshMap();if(focus)focusPoint(s,10);
    caption(`${s.name} · ${nights(s.nights)} · ${statusName(s.status)} · ${s.exactLocation?t("酒店坐标已填写","Hotel coordinates entered"):t("目前为区域占位","Currently an area placeholder")}`);
    setPanel(`<button class="back-button" data-view="stays">${t("← 五处住宿","← All five stays")}</button><span class="eyebrow">A PLACE TO REST / BASE ${T.stays.indexOf(s0)+1}</span><h2>${esc(s.name)}</h2><div class="local-name">${esc(s.localName)}</div><div class="pill-row"><span class="pill ${s.status==='已确认'?'confirmed':'pending'}">${esc(statusName(s.status))}</span><span class="pill">${nights(s.nights)}${s.nights===2?t("连住"," together"):''}</span></div><div class="stats two"><div class="stat"><strong>${md(s.checkIn)}</strong><small>${t("入住 · 2026","Check-in · 2026")}</small></div><div class="stat"><strong>${md(s.checkOut)}</strong><small>${t("退房 · 2026","Check-out · 2026")}</small></div></div>${s.hotelName?`<h3>${esc(s.hotelName)}</h3>${s.address?`<p>${esc(s.address)}</p>`:''}${s.notes?notice(s.notes):''}${s.url?`<div class="detail-actions">${ext(s.url,t("已填写的酒店链接","Saved hotel link"),'button button-outline')}</div>`:''}`:notice(t("酒店尚未确定，当前图钉表示搜索区域。下方酒店名称仅供位置参考，未核实你们日期的房态与价格。","The hotel has not been selected. This pin marks a search area. The examples below are location references only; availability and prices for your dates have not been checked."),'warm')}<h3>${t("为什么住这里","Why stay here")}</h3><p>${esc(s.rationale)}</p><h3>${t("选房范围","Where to look")}</h3><p>${esc(s.searchArea)}</p>${list(s.bookingChecks)}${s.examples?.length?`<h3>${t("可用来定位的住宿例子","Hotel examples for location reference")}</h3><ul class="source-list">${s.examples.map(e=>`<li>${ext(e.url,e.name)}<small>${esc(e.note)}</small></li>`).join('')}</ul>`:''}<div class="detail-actions">${ext(mapUrl(s),s.exactLocation?t("查看已填写的酒店坐标","View the saved hotel location"):t("查看住宿搜索区域","View the hotel search area"),'button button-outline')}</div><form class="booking-form" id="booking-form" data-stay-id="${s.id}"><h3 style="margin:0 0 14px">${t("补充住宿安排","Add your booking details")}</h3><label>${t("预订状态","Booking status")}<select name="status">${['正在预定','已确认','待调整'].map(v=>`<option value="${esc(v)}" ${s.status===v?'selected':''}>${esc(statusName(v))}</option>`).join('')}</select></label><label>${t("酒店名称","Hotel name")}<input name="hotelName" maxlength="160" value="${esc(s.hotelName || '')}" placeholder="${t("确定后填写酒店名称","Enter the hotel once selected")}"></label><label>${t("酒店地址","Hotel address")}<input name="address" maxlength="400" value="${esc(s.address || '')}" placeholder="${t("完整地址或区域","Full address or area")}"></label><label>${t("酒店网页链接","Hotel website")}<input name="url" type="url" maxlength="1500" value="${esc(s.url || '')}" placeholder="https://…"></label><details><summary style="font-size:10px;color:#7c8f75;cursor:pointer;margin-bottom:12px">${t("更新地图定位（可选）","Update the map location (optional)")}</summary><p style="font-size:10px;margin-bottom:10px">${t("经纬度都填写后，H 图钉才会移到实际酒店；留空则保留区域位置。移动图钉不会自动重算路线与车程。","Enter both coordinates to move the H pin to the actual hotel. Leave them blank to retain the area placeholder. Moving a pin does not recalculate the route or driving time.")}</p><div class="form-row"><label>${t("纬度","Latitude")}<input type="number" name="lat" step="any" min="63" max="68" value="${s.exactLocation?esc(s.lat):''}" placeholder="${t("例如 64.14","e.g. 64.14")}"></label><label>${t("经度","Longitude")}<input type="number" name="lng" step="any" min="-25" max="-12" value="${s.exactLocation?esc(s.lng):''}" placeholder="${t("例如 -21.92","e.g. -21.92")}"></label></div></details><label>${t("停车、早餐、晚到入住等备注","Parking, breakfast, late check-in and other notes")}<textarea name="notes" maxlength="2500" placeholder="${t("记录对这次入住有用的信息","Add useful details for this stay")}">${esc(s.notes || '')}</textarea></label><button class="button button-dark" type="submit">${t("保存到本设备","Save on this device")}</button><p class="booking-state">${t("仅在当前浏览器保存；需要换设备时请导出住宿更新。不会自动提交酒店预订。","Saved in this browser only. Export booking updates to use them on another device. This does not make a hotel reservation.")}</p></form><h3>${t("资料来源","Sources")}</h3>${sourcesFor(s.sourceIds)}`,'stays');restoreBookingDraft();revealPanel();
  }
  function showOptional(region=t("全部","All regions")) {
    state.view='optional';state.region=region;state.day=null;clearSelection();setHash('optional');renderDayStrip();refreshMap();
    const all=P.filter(p=>p.plan==='optional'),regions=[t("全部","All regions"),...new Set(all.map(p=>p.region))];
    const visible=region===t("全部","All regions")?all:all.filter(p=>p.region===region);
    setPanel(`<span class="eyebrow">ROOM FOR A DETOUR</span><h2>${t("沿线，还有这些可能","Other possibilities along the way")}</h2><p>${t("紫色点尚未纳入固定日程。先看开放条件与时间代价，再决定替换哪一站；不把备选全部叠加。","Purple markers are outside the fixed schedule. Check access and time needed before deciding which stop to replace; do not add every alternative.")}</p><div class="optional-filter">${regions.map(r=>`<button class="filter-chip ${r===region?'active':''}" data-region="${esc(r)}">${esc(r)}</button>`).join('')}</div><div class="card-list">${visible.map(pointCard).join('')}</div>`,'optional');
  }
  function showEssentials() {
    state.view='essentials';setHash('essentials');
    setPanel(`<span class="eyebrow">BEFORE THE ROAD</span><h2>${t("把重要的事放在一起","The essentials in one place")}</h2><p>${t("这些信息与这条路线直接相关。当天路况、活动集合和酒店安排优先于预设时间表。","These details are specific to this route. Current roads, activity meeting times and hotel arrangements take priority over the suggested schedule.")}</p>${T.essentials.map(e=>`<h3>${esc(e.title)}</h3><p>${esc(e.body)}</p>${list(e.items)}${e.links?sourceList(e.links):''}${e.sourceIds?sourcesFor(e.sourceIds):''}`).join('')}`,'essentials');
  }
  function showSources() {
    state.view='sources';setHash('sources');
    const allPointSources=uniqueSources(P.flatMap(p=>p.sourceUrls || []));
    setPanel(`<span class="eyebrow">SOURCES & MAP NOTES</span><h2>${t("有依据，也有边界","Sources and practical limits")}</h2><p>${t("行程共识与资料核验日期为 2026 年 10 月 26 日。12 月的道路、天气、景点开放与冰洞形态不能提前保证。","The itinerary and source checks are dated 26 October 2026. December road conditions, weather, site access and cave formations cannot be guaranteed in advance.")}</p><h3>${t("地图与路线","Map and routes")}</h3><p>${esc(G.disclaimer || t("真实道路几何用于行程表达，不提供实时导航或道路开放承诺。","Actual road geometry illustrates the plan; it is not live navigation or a guarantee of road access."))}</p>${sourceList(G.sources)}${notice(t("住宿未确定时，路线终点与 H 图钉使用区域占位。具体酒店、停车场及当日通行路线确定后，以实际导航和官方路况为准。","Until hotels are selected, route endpoints and H pins use area placeholders. Use actual navigation and official road information once the hotel, parking and open routes are known."),'compact')}<h3>${t("行程、住宿与冬季信息","Itinerary, stays and winter information")}</h3>${sourceList(T.sources)}<h3>${t("景点参考","Place references")}</h3>${sourceList(allPointSources)}<hr class="source-divider"><p style="font-size:10px">${t("界面使用 Leaflet 1.9.4（BSD-2-Clause）。道路数据：Vegagerðin — Vegir，获取于 2026-10-26，CC BY 4.0；路线基于 OpenStreetMap / OSRM；海岸线为 Natural Earth 公有领域资料。","The interface uses Leaflet 1.9.4 (BSD-2-Clause). Roads: Vegagerðin — Vegir, retrieved 26 October 2026, CC BY 4.0. Routes: OpenStreetMap / OSRM. Coastline: Natural Earth, public domain.")}</p>`,'essentials');
  }
  function showRoad(road) {
    state.view='road';state.road=road;state.point=null;state.stay=null;setHash(`road=${encodeURIComponent(road)}`);
    const linked=T.days.filter(d=>d.roadNumbers.some(r=>r===road||r.split('/').includes(road)));
    const f=G.roads.features.find(f=>String(f.properties.road)===String(road));
    const explanation={'1':t("1 号环岛公路是沿海主要干线，连接首都、南岸、东部与北部。冰岛还有许多其他公路；这次行程只使用环岛公路西南与南岸的部分。","Route 1, the Ring Road, is the main coastal trunk road connecting Reykjavík, the South Coast, East and North. Iceland has many other roads. This trip uses only its southwestern and southern sections."),'41':t("机场与首都方向的主要连接公路。雷克雅内斯游览后，本方案经首都外围连接 1 号路。","The main connection between the airport and the capital. After Reykjanes, this itinerary follows the outskirts of Reykjavík to join Route 1."),'54':t("斯奈山主要道路之一。部分段落跨越 Fróðárheiði，不能把整条路线理解成始终沿海、没有山口。","One of the main roads on Snæfellsnes. Some sections cross Fróðárheiði; the route is not entirely coastal and includes higher ground."),'56':t("斯奈山南北连接道路，经 Vatnaleið。冬季需看当天积雪、风和道路状况。","A north–south link on Snæfellsnes via Vatnaleið. Check snow, wind and road conditions on the day."),'574':t("斯奈山西端绕行道路。可作为中部跨越路线的备选，但不是任何天气下都更安全或必定开放。","The western loop around Snæfellsnes. It can be an alternative to crossing the middle of the peninsula, but is not necessarily safer or open in every weather condition."),'35':t("黄金圈主要道路。行程只用南部维护路段，不继续进入冬季高地。","A main Golden Circle road. This itinerary uses maintained southern sections only, without continuing into the winter highlands."),'36':t("连接辛格维利尔的主要道路。冬季普通自驾仍要核对当天道路和风雪。","A main road to Þingvellir. Winter self-driving still requires checking road, wind and snow conditions on the day.")};
    setPanel(`<button class="back-button" data-view="overview">${t("← 旅程全貌","← Trip overview")}</button><span class="eyebrow">THE ROAD NETWORK</span><h2>${esc(roadName(road))}</h2>${f?`<div class="local-name">${esc(f.properties.name || '')}</div>`:''}<p>${esc(explanation[road] || t("这条道路是行程中的连接路段。图上的公路中心线表示地理位置，不代表冬季实时通行状态。","This is a connecting road in the itinerary. The mapped centreline shows its location, not live winter access."))}</p>${notice(t("冰岛不只有一条公路。1 号是环岛主干线；黄金圈、雷克雅内斯和斯奈山都需要使用其他编号公路。高地道路不作为这次冬季自驾捷径。","Iceland has more than one road. Route 1 is the main Ring Road; the Golden Circle, Reykjanes and Snæfellsnes also use other numbered roads. Highland roads are not shortcuts for this winter trip."))}<div class="detail-actions">${ext('https://umferdin.is/en',t("查看实时道路状态","Check live road conditions"),'button button-dark')}</div>${linked.length?`<h3>${t("这次在哪几天经过","Days using this road")}</h3><div class="card-list">${linked.map(d=>dayCard(d,dayNum(d.id)-1)).join('')}</div>`:''}<h3>${t("地图数据","Map data")}</h3>${sourceList(G.sources.filter(s=>/Vegager/.test(s.title)))}`,'days');revealPanel();
  }
  function uniqueSources(a) {const seen=new Set();return a.filter(s=>s && s.url && !seen.has(s.url) && seen.add(s.url));}

  function guideHtml() {
    const sources=uniqueSources([...T.sources,...G.sources,...P.flatMap(p=>p.sourceUrls||[])]);
    const planned=P.filter(p=>p.plan==='planned' && p.kind!=='town' && p.kind!=='airport');
    const optional=P.filter(p=>p.plan==='optional');
    const references=P.filter(p=>p.plan==='reference' && p.kind!=='town');
    const detailPoint=p=>`<section class="guide-point"><h4>${esc(p.name)} <span class="muted">${esc(p.localName)}</span></h4><div class="pill-row">${planPill(p)}${winterPill(p)}<span class="pill">${esc(p.duration)}</span></div><p>${esc(p.summary)}</p>${list(p.highlights)}<p><strong>${t("冬季条件：","Winter conditions: ")}</strong>${esc(p.winterNote)}</p>${p.fitNote?`<p><strong>${t("如何安排：","How it fits: ")}</strong>${esc(p.fitNote)}</p>`:''}${sourceList(p.sourceUrls)}</section>`;
    return `<section class="guide-intro"><span class="eyebrow">ICELAND / WINTER JOURNAL</span><h2>${t("冰岛冬季完整旅行攻略","The complete Iceland winter guide")}</h2><p><strong>${t("2026.12.05–12.12 · 8 天 7 晚 · 5 处住宿 · 冰岛当地时间 UTC+0","5–12 December 2026 · 8 days / 7 nights · 5 bases · Iceland local time, UTC+0")}</strong></p><p>${esc(T.meta.description)}</p><p>${t("计划里程 ","Planned distance: ")}${km(T.meta.distanceRange)}${t("；冬季驾驶约 26–32 小时。","; approximately 26–32 hours of winter driving. ")}${esc(T.meta.estimateNote)}</p><p>${t("住宿与冰洞尚在预定阶段。资料核验：2026-10-26。","Hotels and the ice-cave trip are still being arranged. Sources checked: 26 October 2026.")}</p></section><h2>${t("一、住宿与全程结构","1. Stays and trip structure")}</h2><table><thead><tr><th>${t("落脚点","Base")}</th><th>${t("入住 → 退房","Check-in → Check-out")}</th><th>${t("晚数","Nights")}</th><th>${t("状态 / 酒店","Status / hotel")}</th></tr></thead><tbody>${T.stays.map(s0=>{const s=booking(s0);return `<tr><td>${esc(s.name)}<br>${esc(s.localName)}</td><td>${md(s.checkIn)} → ${md(s.checkOut)}</td><td>${s.nights}</td><td>${esc(statusName(s.status))}<br>${esc(s.hotelName || t("酒店尚未确定","Hotel not yet selected"))}</td></tr>`;}).join('')}</tbody></table>${list(T.meta.principles)}<h2>${t("二、每日路线与完整时间表","2. Daily routes and full schedule")}</h2><table><thead><tr><th>${t("日期","Date")}</th><th>${t("路线","Route")}</th><th>${t("里程","Distance")}</th><th>${t("冬季驾驶","Winter driving")}</th></tr></thead><tbody>${T.days.map(d=>`<tr><td>${d.shortDate}</td><td>${esc(d.subtitle)}</td><td>${km(d.km)}</td><td>${hours(d.driveWinter)}</td></tr>`).join('')}</tbody></table>${T.days.map(d=>`<section class="guide-day"><span class="eyebrow">DAY ${dayNum(d.id)} / ${d.date}</span><h3>${esc(d.title)}</h3><p><strong>${esc(d.subtitle)}</strong></p><p>${esc(d.summary)}</p><p>${t("普通驾驶：","Normal driving: ")}${hours(d.driveNormal)}${t("；冬季预算：","; winter budget: ")}${hours(d.driveWinter)}${t("；压力：","; driving demand: ")}${esc(pressureName(d.pressure))}${t("。道路：",". Roads: ")}${esc(d.roadNumbers.join(' / '))}${t('。','.')}</p><table><thead><tr><th>${t("时间尺度","Approximate time")}</th><th>${t("安排","Plan")}</th><th>${t("细节","Details")}</th></tr></thead><tbody>${d.timeline.map(t=>`<tr><td>${esc(t.time)}</td><td>${esc(t.title)}</td><td>${esc(t.text)}</td></tr>`).join('')}</tbody></table>${d.sleepId?`<p><strong>${t("当晚住宿：","Overnight: ")}</strong>${esc(byStay[d.sleepId].name)}${t('，',', ')}${esc(statusName(booking(byStay[d.sleepId]).status))}${t('。','.')}</p>`:''}<p><strong>${t("安排理由：","Rationale: ")}</strong>${esc(d.tradeoff)}</p>${list(d.tips)}${alternativeDetails(d)}${sourcesFor(d.sourceIds)}</section>`).join('')}<h2>${t("三、五处住宿的选址与预订记录","3. Five bases and booking records")}</h2>${T.stays.map(s0=>{const s=booking(s0);return `<section class="guide-point"><h3>${esc(s.name)} · ${nights(s.nights)}</h3><p>${s.checkIn} → ${s.checkOut} · ${esc(statusName(s.status))}${s.hotelName?' · '+esc(s.hotelName):''}</p><p>${esc(s.rationale)}</p><p><strong>${t("搜索范围：","Search area: ")}</strong>${esc(s.searchArea)}</p>${s.address?`<p>${t("已填地址：","Saved address: ")}${esc(s.address)}</p>`:''}${s.notes?`<p>${t("入住备注：","Stay notes: ")}${esc(s.notes)}</p>`:''}${list(s.bookingChecks)}<p><strong>${t("仅作位置参考：","Location examples only: ")}</strong>${s.examples.map(e=>ext(e.url,e.name)).join(t('；','; '))}${t("。未查询指定日期价格与房态。",". Prices and availability for the travel dates have not been checked.")}</p></section>`;}).join('')}<h2>${t("四、已规划景点详情","4. Planned places in detail")}</h2>${planned.map(detailPoint).join('')}<h2>${t("五、沿线备选，按余量替换","5. Optional stops to substitute if time allows")}</h2><p>${t("这些点不属于固定必做项目。路况、开放、绕行与日照允许时再决定；不要把它们全部叠加。","These are not mandatory stops. Decide according to road conditions, site access, detours and daylight; do not add them all.")}</p>${optional.map(detailPoint).join('')}<h2>${t("六、全岛冬季参考","6. Winter reference across Iceland")}</h2><p>${t("此表保留全国地标与冬季可达性的区别，绝大部分不在本次路线内。“普通冬季自驾不适用”不等于专业交通或专门向导也绝对无法到达。","This table distinguishes winter access at landmarks across Iceland. Most are outside this itinerary. “Not suitable for ordinary winter self-driving” does not mean specialist transport or guides can never reach them.")}</p><table><thead><tr><th>${t("地点","Place")}</th><th>${t("冬季分类","Winter category")}</th><th>${t("限制与说明","Limits and notes")}</th></tr></thead><tbody>${references.map(p=>`<tr><td>${esc(p.name)}<br>${esc(p.localName)}</td><td>${WINTER[p.winter]?.name}</td><td>${esc(p.winterNote)}</td></tr>`).join('')}</tbody></table><h2>${t("七、出行与调整规则","7. Travel essentials and adjustment rules")}</h2>${T.essentials.map(e=>`<h3>${esc(e.title)}</h3><p>${esc(e.body)}</p>${list(e.items)}${e.links?sourceList(e.links):''}`).join('')}<h2>${t("八、数据来源与使用边界","8. Data sources and limits")}</h2><p>${esc(G.disclaimer || '')}</p><p>${t("全国道路为 Vegagerðin — Vegir 数据，取得于 2026-10-26，CC BY 4.0；海岸线为 Natural Earth 公有领域资料；每日路线由 OSRM 基于 OpenStreetMap 生成并以道路途经点约束。道路几何不代表 12 月实时开放或可安全通行。","The national road network uses Vegagerðin — Vegir data retrieved on 26 October 2026, CC BY 4.0. The coastline is Natural Earth public-domain data. Daily routes were generated by OSRM from OpenStreetMap with explicit waypoints. Road geometry does not establish December access or safe passage.")}</p>${sourceList(sources)}`;
  }
  function openGuide() {$('#guide-content').innerHTML=guideHtml();const d=$('#guide-dialog');if(!d.open)d.showModal();setHash('guide');}
  function printGuide() {$('#print-guide').innerHTML=guideHtml();$('#print-guide').classList.add('guide-content');window.print();}
  function exportBookings() {
    const data={version:1,updatedAt:new Date().toISOString(),stays:T.stays.map(s=>{const b=booking(s);return {id:s.id,status:b.status,hotelName:b.hotelName || '',address:b.address || '',url:b.url || '',notes:b.notes || '',...(b.exactLocation?{lat:b.lat,lng:b.lng}:{})};})};
    const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='bookings.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);toast(t("已导出住宿更新；可导入另一设备，或更新仓库中的 data/bookings.json。","Booking updates exported. Import them on another device or replace data/bookings.json in the repository."));
  }
  function toggleLayers() {const el=$('#map-layers');el.hidden=!el.hidden;$('#layers-toggle').setAttribute('aria-expanded',String(!el.hidden));}
  async function share() {try{await navigator.clipboard.writeText(location.href);toast(t("当前页面链接已复制。","Link to this view copied."));}catch{toast(t("请复制浏览器地址栏链接，当前景点或日期已包含在链接中。","Copy the address-bar URL. It includes the selected language and the current place or day."));}}
  function routeHash() {
    const hash=location.hash.slice(1);
    if(hash.startsWith('day=') && byDay[hash.slice(4)]) return showDay(hash.slice(4));
    if(hash.startsWith('point=')) {const id=decodeURIComponent(hash.slice(6));if(byPoint[id])return showPoint(id);}
    if(hash.startsWith('stay=') && byStay[hash.slice(5)]) return showStay(hash.slice(5));
    if(hash.startsWith('road=')) return showRoad(decodeURIComponent(hash.slice(5)));
    if(hash==='days') return showDays();if(hash==='stays')return showStays();if(hash==='optional')return showOptional();if(hash==='essentials')return showEssentials();if(hash==='sources')return showSources();
    if(hash==='guide') {
      if(transition?.view==='stay' && byStay[transition.stay])showStay(transition.stay,false);
      else if(transition?.view==='point' && byPoint[transition.point])showPoint(transition.point,false);
      else if(transition?.view==='day' && byDay[transition.day])showDay(transition.day,false);
      else if(transition?.view==='road' && transition.road)showRoad(transition.road);
      else handleView(transition?.view || 'overview');
      return openGuide();
    }
    return showOverview();
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
    const actions={overview:()=>showOverview(true),'fit-trip':()=>{state.day=null;refreshMap();renderDayStrip();fitTrip();caption(t("本次行程 · 雷克雅内斯、黄金圈、南岸与斯奈山","Our trip · Reykjanes, Golden Circle, South Coast and Snæfellsnes"));},'fit-island':fitIsland,'toggle-layers':toggleLayers,'open-guide':openGuide,'close-guide':()=>{$('#guide-dialog').close();setHash(state.day?`day=${state.day}`:state.point?`point=${state.point}`:'overview');},'print-guide':printGuide,'toggle-language':toggleLanguage,share,'export-bookings':exportBookings,'import-bookings':()=>$('#booking-import').click()};
    actions[el.dataset.action]?.();
  });
  document.addEventListener('change',e=>{
    if(e.target.dataset.filter){filters[e.target.dataset.filter]=e.target.checked;refreshMap();}
    if(e.target.dataset.winter){winterFilters[e.target.dataset.winter]=e.target.checked;refreshMap();}
  });
  $('#street-map-toggle').addEventListener('change',e=>{
    if(e.target.checked){if(!onlineTiles){onlineTiles=L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png',{pane:'online',subdomains:'abcd',maxZoom:19,attribution:'© <a href="https://carto.com/attributions">CARTO</a> © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'});let warned=false;onlineTiles.on('tileerror',()=>{if(!warned){toast(t("在线底图暂不可用；本地海岸线、道路和攻略仍可查看。","The online basemap is unavailable. The bundled coastline, roads and guide still work."));warned=true;}});}onlineTiles.addTo(map);}else if(onlineTiles)map.removeLayer(onlineTiles);
  });
  $('#map-search').addEventListener('input',e=>{
    const q=searchText(e.target.value.trim());const box=$('#search-results');if(!q){box.hidden=true;return;}
    const hits=P.filter(p=>searchText([originalPoints[p.id],englishPoints[p.id],p].filter(Boolean).map(item=>`${item.name} ${item.localName} ${item.region}`).join(' ')).includes(q)).slice(0,9);
    box.innerHTML=hits.length?hits.map(p=>`<button class="search-result" data-point="${esc(p.id)}"><span class="winter-ring ${p.winter}">${WINTER[p.winter]?.symbol}</span><span><strong>${esc(p.name)}</strong><small>${esc(p.localName)} · ${PLAN[p.plan]}</small></span></button>`).join(''):`<div class="no-results">${t("没有匹配结果，试试中文名或英文地名。","No matches. Try a Chinese, English or Icelandic place name.")}</div>`;box.hidden=false;
  });
  $('#map-search').addEventListener('keydown',e=>{if(e.key==='Escape')$('#search-results').hidden=true;if(e.key==='Enter'){const b=$('#search-results [data-point]');if(b)b.click();}});
  document.addEventListener('click',e=>{if(!e.target.closest('.search-wrap'))$('#search-results').hidden=true;});
  document.addEventListener('submit',e=>{
    if(e.target.id!=='booking-form')return;e.preventDefault();const form=e.target;const data=Object.fromEntries(new FormData(form));data.id=form.dataset.stayId;const b=validateBookingRecord(data);if(!b)return;
    if((data.lat==='' && data.lng!=='') || (data.lat!=='' && data.lng==='')){toast(t("请同时填写纬度和经度，或同时留空。","Enter both latitude and longitude, or leave both blank."));return;}
    bookings[b.id]=b;languageDraft=null;const ok=saveBookings();showStay(b.id,false);toast(ok?t("住宿已保存到本设备，可随时导出备份。","Stay details saved on this device. You can export a backup at any time."):t("当前浏览器无法持久保存，请导出住宿更新备份。","This browser cannot save persistently. Export your booking updates as a backup."));
  });
  $('#booking-import').addEventListener('change',async e=>{
    const file=e.target.files[0];if(!file)return;
    try{if(file.size>500000)throw new Error(t("文件过大，请使用本站导出的住宿 JSON。","The file is too large. Use a booking JSON file exported by this site."));const incoming=parseBookings(JSON.parse(await file.text()));bookings={...bookings,...incoming};const ok=saveBookings();showStays();toast(EN ? `Imported ${Object.keys(incoming).length} stay records.${ok?'':' This browser cannot save persistently; export a backup.'}` : `已导入 ${Object.keys(incoming).length} 处住宿${ok?'。':'；请导出备份，当前浏览器无法持久保存。'}`);}catch(err){toast(err.message || t("无法读取此文件。","Unable to read this file."));}e.target.value='';
  });
  window.addEventListener('hashchange',routeHash);
  window.addEventListener('resize',()=>map?.invalidateSize());
  $('#guide-dialog').addEventListener('click',e=>{if(e.target===$('#guide-dialog'))$('#guide-dialog').close();});
  $('#guide-dialog').addEventListener('close',()=>{setHash(state.day?`day=${state.day}`:state.point?`point=${state.point}`:state.stay?`stay=${state.stay}`:state.view==='stays'?'stays':'overview');});
  if(!T || !G || !P.length || !window.L){$('#panel-content').innerHTML=`<h2>${t("资料正在加载","Loading the guide")}</h2><p>${t("请刷新页面。如果仍无法显示，检查行程、地标、地图数据与 Leaflet 文件是否完整上传。","Refresh the page. If it still fails, check that the itinerary, places, map data and Leaflet files were uploaded completely.")}</p>`;$('#map-load-note').hidden=false;$('#map-load-note').textContent=t("地图资料未完整载入。","Some map data could not be loaded.");return;}
  if(transition) {
    for(const key of Object.keys(filters))if(typeof transition.filters?.[key]==='boolean')filters[key]=transition.filters[key];
    for(const key of Object.keys(winterFilters))if(typeof transition.winterFilters?.[key]==='boolean')winterFilters[key]=transition.winterFilters[key];
    $$('[data-filter]').forEach(input=>{input.checked=filters[input.dataset.filter];});
    $$('[data-winter]').forEach(input=>{input.checked=winterFilters[input.dataset.winter];});
    if(byDay[transition.day])state.day=transition.day;
  }
  loadLocalBookings();renderDayStrip();initMap();routeHash();restoreLanguageView();
  if(!window.ICELAND_STANDALONE && /^https?:$/.test(location.protocol)) fetch('data/bookings.json',{cache:'no-store'}).then(r=>r.ok?r.json():null).then(data=>{
    if(!data)return;const shared=parseBookings(data),draft=captureBookingDraft();bookings={...shared,...bookings};
    if(Object.keys(shared).length) {
      const guideOpen=$('#guide-dialog').open,panelScroll=$('#panel-content').scrollTop;
      renderMarkers();
      if(state.view==='overview')showOverview();
      else if(state.view==='stays')showStays();
      else if(state.view==='stay'){languageDraft=draft;showStay(state.stay,false);}
      $('#panel-content').scrollTop=panelScroll;
      if(guideOpen)openGuide();
    }
  }).catch(()=>{});
})();
