# 地图几何、数据来源与许可

本网站的海岸线、全国道路与每日驾驶路线来自公开地理数据。路线沿真实道路绘制；没有用景点之间的直线冒充公路。获取与核验日期：**2026-10-26**。

## 1. 海岸线

- 数据：**Natural Earth 1:10m Admin 0 – Countries**，提取 Iceland / `ADM0_A3=ISL`。
- 源文件：<https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_0_countries.geojson>
- 许可：**Public domain（公有领域）**。
- 条款：<https://www.naturalearthdata.com/about/terms-of-use/>
- 处理：保留冰岛及数据内附属岛屿的 MultiPolygon，移除其他国家及无关属性，作约 30 米的显示简化。Natural Earth 是国家尺度底图，不应当作海岸步行或航海地图。

## 2. 全国主干道路

- 提供者：**Vegagerðin / Icelandic Road and Coastal Administration**。
- 数据名称：**Vegir – road centerlines**。
- 图层：<https://vegasja.vegagerdin.is/arcgis/rest/services/data/vegakerfi/MapServer/6>
- 获取日期：**2026-10-26**。
- 许可：**Creative Commons Attribution 4.0 International（CC BY 4.0）**。
- 许可链接：<https://creativecommons.org/licenses/by/4.0/>
- 提供者条款：<https://www.vegagerdin.is/vegagerdin/gagnasafn/vefthjonustur/skilmalar-vefthjonustur>
- 处理：按道路编号提取 35 条主要道路的 444 个中心线段，转换至 WGS84（EPSG:4326），删去高程及无关字段，简化并按道路编号组合为 MultiLineString。`1` 为环岛公路；同时包含西南部行程支路、斯奈山道路和部分全岛参考道路。
- 地图署名至少应保留：**道路：Vegagerðin · Vegir · 2026-10-26 · CC BY 4.0**，并链接数据与许可。

道路的显示样式和冬季说明由本攻略编制。数据提供者不为本攻略的行程安排背书。灰色主干道路只表示道路位置，不表示冬季必然可通行。尤其是 35 号北部高地路段、部分 26/208/864 路段以及 F 路段，不能因为地图画出了道路就视为十二月自驾方案。

## 3. 每日路线

- 数据：**© OpenStreetMap contributors**。
- 路由：OSRM driving service，<https://project-osrm.org/>。
- OpenStreetMap 许可与署名：<https://www.openstreetmap.org/copyright>，ODbL 1.0。
- 获取日期：**2026-10-26**。
- 处理：设置明确的景点与道路控制途经点，提取完整驾驶路线几何，再作约 10 米的显示简化。网站直接加载生成的静态数据，访问者不需要现场调用路线服务。
- 路由结果中的 `routingEngineMinutes` 仅为算法参考，不是网站的十二月行程时间预算，也不是当天道路条件下的预计抵达时间。

### 道路约束与实际绘图距离

| 路线 | 绘图距离 | 路线说明 |
|---|---:|---|
| D1 | 4.6 km | KEF → Keflavík 区域参考点，实际酒店位置会改变距离 |
| D2 | 149.1 km | 西端大陆桥与 Gunnuhver，回 425/44/41，经首都外围接 1 号公路到 Selfoss；不把 427/Grindavík 作为默认通路 |
| D3 | 192.4 km | Selfoss 黄金圈往返；黄金瀑布回程强制经 35 号，排除算法原先提出的 30/358 捷径 |
| D4 | 305.4 km | Selfoss → Reynisfjara → Vík → Hnappavellir 区域参考点 |
| D5 | 223.2 km | Hnappavellir → Jökulsárlón → 钻石沙滩 → Vík；不绘制向导进入冰川的活动路线 |
| D6 | 192.3 km | Vík → Skógafoss → Seljalandsfoss → Reykjavík |
| D7 核心 | 430.2 km | 雷市往返 Búðir、Arnarstapi、Kirkjufell；经 54 号 Fróðárheiði 与 56 号 Vatnaleið |
| D7 西端备选 | 450.1 km | 经 574 号绕西端、Lóndrangar 与 Hellissandur；这条线本身也可能受天气影响 |
| D8 | 51.0 km | 雷市参考点 → KEF；城内步行游览没有被算作自驾线路 |

这些值是固定地图锚点之间的几何路由距离。攻略表格保留整数范围，因为酒店尚在预定、停车场入口及补给停靠也会造成差异。

### 不能从地图推导的结论

- 十二月任何一天一定可以走完某条线。
- 54 号、56 号或 574 号其中一条永远比另一条安全。
- 570 / F575 可以作为斯奈山冬季捷径；本地图的行程路线没有使用这些道路。
- 住宿坐标代表已经订到酒店。所有住宿为搜索区域或定位参考，初始状态均是“正在预定”。

实时情况应以 [Umferðin 道路信息](https://umferdin.is/en)、[SafeTravel](https://safetravel.is/) 和 [冰岛气象局](https://en.vedur.is/) 为准。

## 4. 文件结构和重建

- `data/geo.js`：`window.ICELAND_GEO`。海岸线/道路为 GeoJSON FeatureCollection；路线在 `routes` 和 `alternatives` 数组中。
- GeoJSON 几何坐标顺序为 **[经度, 纬度]**；`bounds` / `tripBounds` 为 Leaflet 使用的 **[纬度, 经度]**。
- `scripts/build_geo.py`：公开数据获取、途经点约束、简化与输出脚本。需要 Python 3 标准库与网络访问，无额外 Python 包。
- 执行 `python scripts/build_geo.py` 重建；默认缓存位于 `/tmp/iceland_geo_build`。`--offline` 只读取已有缓存。
- 导出的 JS 约 391 KB，包含 8 条主体路线与 1 条可选路线。

许可要求由对应数据条款决定。本文不更改原数据的许可。
