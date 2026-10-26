#!/usr/bin/env python3
"""Rebuild the static Iceland map data from public geographic sources.

The generated road routes are planning illustrations, not live navigation.
Natural Earth is public domain; Vegagerdin data is CC BY 4.0;
OSRM route geometry is derived from OpenStreetMap (ODbL).
"""
from __future__ import annotations

import argparse
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor
import json
import math
from pathlib import Path
import urllib.parse
import urllib.request

PROJECT = Path(__file__).resolve().parents[1]
CACHE = Path('/tmp/iceland_geo_build')
CHECKED = '2026-10-26'
ROAD_LAYER = 'https://vegasja.vegagerdin.is/arcgis/rest/services/data/vegakerfi/MapServer/6'
LAND_URL = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_0_countries.geojson'
OSRM = 'https://router.project-osrm.org/route/v1/driving/'
ROADS = ['1','41','35','36','37','365','54','56','574','425','44','43','42','427','49','40','60','61','68','85','862','864','93','95','92','26','32','208','F208','F26','F35','F225','F249','218','215','998']

# Coordinates here are longitude, latitude. Overnight coordinates are regional
# reference points only; no hotel is represented as a confirmed reservation.
P = {
    'kef-airport': [-22.6244, 63.9960],
    'keflavik': [-22.5612, 64.0055],
    'bridge-continents': [-22.6767, 63.8677],
    'gunnuhver': [-22.6852, 63.8193],
    'hafnir': [-22.6797, 63.9324],
    'road41-vogar': [-22.04329, 64.03987],
    'road1-east-reyk': [-21.7808, 64.11123],
    'selfoss': [-20.9971, 63.9335],
    'thingvellir': [-21.1280, 64.2558],
    'geysir': [-20.3001, 64.3106],
    'gullfoss': [-20.1255, 64.3265],
    'road35-south-geysir': [-20.3576, 64.27328],
    'reynisfjara': [-19.0449, 63.4047],
    'vik': [-19.0085, 63.4187],
    'hnappavellir': [-16.60809, 63.90005],
    'jokulsarlon': [-16.1794, 64.0476],
    'diamond-beach': [-16.1870, 64.0438],
    'skogafoss': [-19.5125, 63.5278],
    'seljalandsfoss': [-19.9929, 63.6151],
    'reykjavik': [-21.9426, 64.1466],
    'borgarnes': [-21.9032, 64.5503],
    'budir': [-23.3847, 64.8210],
    'arnarstapi': [-23.6258, 64.7660],
    'road54-frodarheidi': [-23.50916, 64.85701],
    'kirkjufell': [-23.3088, 64.9260],
    'road56-vatnaleid': [-22.85787, 64.90560],
    'londrangar': [-23.7758, 64.7359],
    'hellissandur': [-23.8850, 64.9172],
}

ROUTE_POINTS = {
    'd1': ['kef-airport','keflavik'],
    'd2': ['keflavik','bridge-continents','gunnuhver','hafnir','road41-vogar','road1-east-reyk','selfoss'],
    'd3': ['selfoss','thingvellir','geysir','gullfoss','road35-south-geysir','selfoss'],
    'd4': ['selfoss','reynisfjara','vik','hnappavellir'],
    'd5': ['hnappavellir','jokulsarlon','diamond-beach','vik'],
    'd6': ['vik','skogafoss','seljalandsfoss','reykjavik'],
    'd7': ['reykjavik','borgarnes','budir','arnarstapi','road54-frodarheidi','kirkjufell','road56-vatnaleid','borgarnes','reykjavik'],
    'd8': ['reykjavik','kef-airport'],
    'd7-west': ['reykjavik','borgarnes','budir','arnarstapi','londrangar','hellissandur','kirkjufell','road56-vatnaleid','borgarnes','reykjavik'],
}

def fetch_json(url: str, filename: str, offline: bool = False):
    path = CACHE / filename
    if path.exists():
        return json.loads(path.read_text())
    if offline:
        raise FileNotFoundError(f'Missing cached source: {path}')
    request = urllib.request.Request(url, headers={'User-Agent': 'IcelandWinterTripMap/1.0 (static educational travel map)'})
    with urllib.request.urlopen(request, timeout=90) as response:
        raw = response.read()
    data = json.loads(raw)
    path.write_bytes(raw)
    return data

def distance_m(a, b):
    lat = math.radians((a[1] + b[1]) / 2)
    return math.hypot((a[0]-b[0])*111320*math.cos(lat), (a[1]-b[1])*111320)

def simplify(points, tolerance=14.0):
    """Douglas-Peucker simplification in local approximate metres."""
    if len(points) <= 2:
        return [[round(float(v), 5) for v in p[:2]] for p in points]
    keep = {0, len(points)-1}
    stack = [(0, len(points)-1)]
    while stack:
        a, b = stack.pop()
        p, q = points[a], points[b]
        scale_x = 111320*math.cos(math.radians((p[1]+q[1])/2))
        dx, dy = (q[0]-p[0])*scale_x, (q[1]-p[1])*111320
        denom = dx*dx+dy*dy
        best_dist, best_i = -1.0, a
        for i in range(a+1, b):
            x, y = (points[i][0]-p[0])*scale_x, (points[i][1]-p[1])*111320
            t = min(1.0, max(0.0, (x*dx+y*dy)/denom)) if denom else 0.0
            d = math.hypot(x-t*dx,y-t*dy)
            if d > best_dist:
                best_dist, best_i = d, i
        if best_dist > tolerance:
            keep.add(best_i)
            stack.extend([(a,best_i),(best_i,b)])
    return [[round(float(v),5) for v in points[i][:2]] for i in sorted(keep)]

def load_roads(offline):
    cached = CACHE/'official_roads.json'
    if cached.exists():
        data = json.loads(cached.read_text())
    else:
        features = []
        for page in range(20):
            params = {
                'where': 'NRVEGUR IN ('+','.join("'"+r+"'" for r in ROADS)+')',
                'outFields': 'NRVEGUR,NRKAFLI,KAFLIVEGURHEITI,VEGHLUTI,DAGS_URNOTKUN',
                'outSR': '4326', 'f': 'geojson','returnGeometry':'true',
                'maxAllowableOffset':'0.0002','geometryPrecision':'5',
                'resultRecordCount':'1000','resultOffset':str(page*1000),
            }
            url = ROAD_LAYER+'/query?'+urllib.parse.urlencode(params)
            part = fetch_json(url, f'roads-page-{page}.json',offline)
            if 'error' in part:
                raise RuntimeError(part['error'])
            features.extend(part.get('features',[]))
            if len(part.get('features',[])) < 1000:
                break
        data = {'type':'FeatureCollection','features':features}
        cached.write_text(json.dumps(data))
    grouped, names = defaultdict(list), {}
    for feature in data['features']:
        prop = feature['properties']
        road = str(prop['NRVEGUR'])
        names[road] = prop.get('KAFLIVEGURHEITI','')
        # 9999-12-31 is the provider's active-road end-date sentinel.
        if prop.get('DAGS_URNOTKUN',253402214400000) < 1792972800000:
            continue
        geom = feature['geometry']
        lines = [geom['coordinates']] if geom['type']=='LineString' else geom['coordinates']
        for line in lines:
            if len(line)>=2:
                grouped[road].append(simplify(line,12))
    return {'type':'FeatureCollection','features':[
        {'type':'Feature','properties':{
            'road':road,'name':names[road],
            'kind':'highland' if road.startswith('F') or road in ['208','26'] else ('ring' if road=='1' else 'main'),
            'winter':'seasonal' if road.startswith('F') else ('mixed' if road in ['35','208','26','864'] else 'check'),
            'source':'Vegagerðin — Vegir','checked':CHECKED,
        },'geometry':{'type':'MultiLineString','coordinates':lines}}
        for road,lines in sorted(grouped.items(),key=lambda p:(p[0]!='1',p[0]))
    ]}

def load_land(offline):
    data = fetch_json(LAND_URL,'land.json',offline)
    island = next(f for f in data['features'] if f['properties'].get('ADM0_A3')=='ISL')
    original = island['geometry']
    polygons = original['coordinates'] if original['type']=='MultiPolygon' else [original['coordinates']]
    simplified = []
    for polygon in polygons:
        rings=[]
        for ring in polygon:
            s=simplify(ring,30)
            if s[0]!=s[-1]:s.append(s[0])
            if len(s)>=4:rings.append(s)
        if rings:simplified.append(rings)
    return {'type':'FeatureCollection','features':[{
        'type':'Feature','properties':{'name':'Iceland','nameZh':'冰岛','source':'Natural Earth 10m','license':'Public domain'},
        'geometry':{'type':'MultiPolygon','coordinates':simplified},
    }]}

def load_route(route_id, offline):
    keys = ROUTE_POINTS[route_id]
    coordinates=';'.join(','.join(str(x) for x in P[key]) for key in keys)
    params=urllib.parse.urlencode({'overview':'full','geometries':'geojson','steps':'true','continue_straight':'false'})
    url=OSRM+coordinates+'?'+params
    version = '-via35' if route_id == 'd3' else ''
    data=fetch_json(url,route_id+version+'-osrm.json',offline)
    if data.get('code')!='Ok':raise RuntimeError(f'{route_id}: {data}')
    route=data['routes'][0]
    road_refs=sorted(set(str(step.get('ref')) for leg in route['legs'] for step in leg['steps'] if step.get('ref')))
    road_names=sorted(set(str(step.get('name')) for leg in route['legs'] for step in leg['steps'] if step.get('name')))
    forbidden=[ref for ref in road_refs if ref in ['435','570','F575'] or ref.startswith('F')]
    if forbidden:raise RuntimeError(f'Unexpected mountain shortcut {route_id}: {forbidden}')
    if route_id=='d2' and any(ref in ['427','43'] for ref in road_refs):
        raise RuntimeError('Day 2 incorrectly routed through Grindavik/coastal 427')
    if route_id=='d3' and any(ref in ['30','358'] for ref in road_refs):
        raise RuntimeError('Day 3 must return from Gullfoss via Route 35, not 30/358')
    result={
        'id':route_id,'geometry':{'type':'LineString','coordinates':simplify(route['geometry']['coordinates'],10)},
        'distanceKm':round(route['distance']/1000,1),
        'routingEngineMinutes':round(route['duration']/60),
        'method':'OSRM driving route over OpenStreetMap with explicit road-control waypoints; simplified for map display',
        'sourceUrl':'https://www.openstreetmap.org/copyright',
        'routingService':'https://project-osrm.org/',
        'roadRefs':road_refs,'waypointIds':keys,'waypoints':[P[k] for k in keys],
        'note':'规划几何，不反映实时路况；住宿为区域占位，实际酒店和入口确定后需重新导航。',
    }
    if route_id in ['d7','d7-west']:
        result['note']='54／56／574 路线须按出发当日条件选择；图示不代表十二月保证通行。570／F575 不作为冬季捷径。'
    if route_id=='d7-west':
        result.update({'name':'斯奈山西端备选绕行','dayId':'d7','optional':True,'note':'经 574 号绕西端，增加道路和停靠时间；不能保证比中部山口更安全或始终开放。'})
    print(route_id, result['distanceKm'],'km',result['routingEngineMinutes'],'routing min',road_refs,
          'max_snap_m',round(max(w['distance'] for w in data['waypoints']),1),flush=True)
    (CACHE/(route_id+'-audit.json')).write_text(json.dumps({'roadRefs':road_refs,'roadNames':road_names,'waypoints':data['waypoints']},ensure_ascii=False,indent=2))
    return result

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--offline',action='store_true',help='Only use already-downloaded public source cache')
    args=parser.parse_args()
    CACHE.mkdir(exist_ok=True)
    roads=load_roads(args.offline)
    land=load_land(args.offline)
    with ThreadPoolExecutor(max_workers=2) as executor:
        routes=list(executor.map(lambda key:load_route(key,args.offline),ROUTE_POINTS))
    sources=[
        {'title':'Natural Earth 10m country coastline — Iceland','url':LAND_URL,'license':'Public domain','note':'提取冰岛多边形并作约 30 米显示简化。','checked':CHECKED},
        {'title':'Vegagerðin — Vegir, Iceland road centerlines','url':ROAD_LAYER,'license':'CC BY 4.0','licenseUrl':'https://creativecommons.org/licenses/by/4.0/','termsUrl':'https://www.vegagerdin.is/vegagerdin/gagnasafn/vefthjonustur/skilmalar-vefthjonustur','note':'2026-10-26 获取；选取主要道路，转换 WGS84 并作显示简化。路线安排与冬季分类由本攻略编制，不代表道路管理局认可。','checked':CHECKED},
        {'title':'OpenStreetMap contributors / OSRM driving geometry','url':'https://www.openstreetmap.org/copyright','license':'OpenStreetMap ODbL 1.0; routed by OSRM','note':'带明确途经点的静态路线几何；不是实时道路通行服务。','checked':CHECKED},
    ]
    output={
        'land':land,'roads':roads,'routes':[r for r in routes if r['id']!='d7-west'],
        'alternatives':[r for r in routes if r['id']=='d7-west'],
        'sources':sources,'bounds':[[63.25,-24.65],[66.60,-13.40]],
        'tripBounds':[[63.32,-23.94],[65.03,-16.08]],
        'updated':CHECKED,'coordinateOrder':'longitude,latitude',
        'attribution':'© OpenStreetMap contributors · Vegagerðin (2026-10-26, CC BY 4.0) · Natural Earth',
        'disclaimer':'路线为静态规划示意，沿真实公路绘制，不是实时导航或冬季通行保证。',
    }
    path=PROJECT/'data'/'geo.js'
    path.parent.mkdir(exist_ok=True)
    path.write_text('/* Geographic data sources and licenses: see GEO_SOURCES.md */\nwindow.ICELAND_GEO = '+json.dumps(output,ensure_ascii=False,separators=(',',':'))+';\n')
    print('Wrote',path,'bytes',path.stat().st_size,flush=True)

if __name__=='__main__':main()
