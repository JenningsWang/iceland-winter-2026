# 地标层：来源、分类与位置说明

数据文件：`data/points.js`。整理日期：**2026-10-26**。行程日期：2026-12-05 至 2026-12-12。

## 数据范围

- 71 个地标或服务区域：24 个已规划景点/行程节点、24 个沿线备选、23 个全岛参考。
- 冬季标记：35 个通常可达、28 个条件限制较强、2 个需向导、6 个普通十二月自驾不适用。
- 全岛参考用于理解冰岛地理和冬季限制，**不表示这些点可以临时添加到这次七晚行程**。
- 所有停留时间都是本攻略的规划尺度，不是场地方或运营方的到访承诺；活动时长按具体产品和订单为准。

## 两个独立维度

`plan` 表示本次安排：

| 值 | 含义 |
| --- | --- |
| `planned` | 已纳入路线，或作为机场、城镇、集合区等行程节点 |
| `optional` | 沿线候选，加入后需要相应删减其他停留或增加时间 |
| `reference` | 全国地图参考，本次不前往 |

`winter` 表示通常的十二月旅行方式和限制：

| 值 | 含义 |
| --- | --- |
| `usual` | 在道路可通行时，通常能到达主要游客区域；不保证所有步道或设施开放 |
| `conditional` | 支路、山口、海浪、风雪或步道条件对能否参观有较强影响 |
| `guided` | 此体验必须通过运营方、专业向导与具体班次安排 |
| `closed` | 本攻略不将其视为普通租车十二月自驾的可执行目标；并非断言特殊专业交通方式绝对不能到 |

可达性是基于官方道路、园方与旅游机构信息作的**行程编辑判断**，不是实时状态，也不是2026年12月的道路预报。出发前应重新查看 [Umferðin](https://umferdin.is/en)、[SafeTravel](https://safetravel.is/) 与 [气象局](https://en.vedur.is/)。

## 对本次行程有影响的官方更新

### Reynisfjara 黑沙滩

冰岛旅游局在 **2026-02-24** 公告中描述海岸侵蚀、上部沙脊观景限制，以及警示设施被侵蚀后调整。数据保留此点为主计划，但标为 `conditional`，只承诺按当日开放区域参观。**不承诺能下到玄武岩柱，也不假定原警示灯设施必然存在。** 该历史公告不能代替12月的最新现场信息。

来源：[Reynisfjara: Recent Changes Due to Coastal Erosion](https://www.ferdamalastofa.is/en/news/category/1/reynisfjara-recent-changes-due-to-coastal-erosion)

### Sólheimajökull 冰缘

南岸旅游局在 **2026-07-23** 转述冰缘不稳定、落石与冰湖风险。该点只保留为低优先级条件备选，不能沿用旧攻略自行靠近冰缘；上冰与现场路线交由专业向导判断。

来源：[Increased Hazard at Sólheimajökull Glacier](https://www.south.is/en/travel-info/newsblog/increased-hazard-at-solheimajokull-glacier)

### Dettifoss 与西峡湾

Dettifoss 东侧864道路冬季关闭，西侧862冬季服务有限；因此标记条件限制较强，不能简单当作与1号公路旁瀑布等同的停靠。

- [国家公园：Dettifoss](https://www.vatnajokulsthjodgardur.is/en/areas/jokulsargljufur/dettifoss)
- [西峡湾旅游局：道路信息](https://www.westfjords.is/en/travel-info/information/road-conditions)
- [Látrabjarg：官方冬季道路说明](https://www.westfjords.is/en/destinations/nature-reserves/latrabjarg-birdcliff)

西峡湾没有被整体标为关闭：Ísafjörður、Dynjandi分别标为条件限制较强；Látrabjarg进出道路不进行冬季维护，不列为普通十二月自驾目标。

### 高地

Landmannalaugar、Askja、Kerlingarfjöll地热谷、Þórsmörk与Laki不纳入本次普通冬季自驾。特别是**黄金瀑布以南的35号公路与继续进入高地的Kjalvegur段不能混为一谈**。

来源：[冰岛道路管理局：高地道路开放规则](https://www.vegagerdin.is/en/the-transportation-system/the-road-system/roads/opening-of-mountain-roads)

## 坐标与导航边界

坐标用于地图展示景点、观景区域或城镇位置；不是经过测绘认证的停车场入口或步行轨迹。部分自然景观图钉与可开车到达的停车场有小量偏移，不能把它们当作允许车辆驶入的位置。

- **Hnappavellir** 使用 Fosshotel Glacier Lagoon 所在位置附近（63.90005, -16.60809）作为住宿搜索区锚点。南岸旅游局酒店页给的另一组坐标靠近村落本体；二者约相差一公里。酒店没有预订，地图锚点不代表该酒店已经选定。
- **Hof** 与 Hnappavellir 是同一晚住宿搜索范围的两个区域点；不是两处新增住宿。Hof 与更东面的 Höfn 是不同地方。
- **Ice cave** 图钉只表示 Jökulsárlón 集合区域，绝不代表固定冰洞洞口；具体集合位置以订单为准。
- **Diamond Beach** 统一使用河口西岸停车区域附近（64.0438, -16.1870），与每日道路路线一致；河口两侧都可能有冰，冰量受潮汐和天气影响。
- **Kirkjufell** 图钉放在山脚瀑布观景区域，行程不包含登山。
- **Svartifoss** 图钉为瀑布位置，开车应到 Skaftafell 的指定停车区域，再按开放步道步行。

主要位置和地理参照：各地官方旅游局、国家公园地标页面、西部旅游局地图，以及 Hnappavellir 酒店位置的公开地图交叉核对。逐点来源链接保存在每个条目的 `sourceUrls` 中。部分全国参考使用地区官方资料，而非声称每一处支路均已获得特定日期的开放确认。

## 使用建议

界面应同时显示行程归属与冬季状态；不要让“已规划”的颜色覆盖或隐藏冬季限制。图例宜使用“普通冬季自驾不适用”，而非绝对的“任何方式不可达”。乡镇点可使用更小或不同形状的图标，避免与住宿标志混淆。
