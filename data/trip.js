/* Iceland winter itinerary. All times are Iceland local time (UTC+0).
   Planning estimates and hotel search areas are not live navigation or bookings. */
window.ICELAND_TRIP = {
  meta: {
    title: "冰岛冬行 · 8 天 7 晚",
    subtitle: "雷克雅内斯 · 黄金圈 · 南岸 · 斯奈山",
    dates: "2026.12.05 — 12.12",
    startDate: "2026-12-05",
    endDate: "2026-12-12",
    updated: "2026-10-26",
    timezone: "冰岛当地时间 UTC+0",
    version: "2026-10-26 / 五处住宿共识版",
    durationDays: 8,
    nights: 7,
    baseCount: 5,
    hotelChanges: 4,
    distanceRange: [1520, 1625],
    driveWinterRange: [25.83, 32],
    description: "从凯夫拉维克出发，去程以 Selfoss 和冰河湖西侧为两个基地，返程住维克补看南岸瀑布，最后雷克雅未克连住两晚。",
    bookingStatus: "住宿正在预定；冰洞班次尚待确认",
    routeStatus: "一般冬季条件下的规划路线；出发当天以官方道路、天气及现场开放信息为准。",
    estimateNote: "公里数和驾驶时间按现有落脚区域估算。冬季预算包含一般慢行余量，不含景点游览、用餐、冰洞向导转运；它不是暴风雪、封路或改道时的上限。",
    coordinateNote: "住宿图钉代表拟入住的城镇或搜索区域，不代表已经选定酒店。",
    flights: [
      { date: "2026-12-05", time: "17:15", airport: "KEF", type: "arrival", text: "抵达凯夫拉维克机场；航班时间来自当前行程共识，出发前再核对航空公司通知。" },
      { date: "2026-12-12", time: "18:05", airport: "KEF", type: "departure", text: "返程起飞；目标 15:00–15:15 到达航站楼，之前完成加油、还车和接驳。" }
    ],
    principles: [
      "7 晚住 5 处，Selfoss 与雷克雅未克各连住两晚。",
      "南岸去程看黑沙滩，回程补两处瀑布；减少同一景点重复停靠。",
      "东行最远核心目标是杰古沙龙冰河湖，不继续把住宿推进至 Höfn。",
      "斯奈山从雷市往返，以黑教堂、Arnarstapi 海岸、教会山三个核心点为主。",
      "备选点用于替换或天气允许时补充，不是全部叠加到当天。"
    ]
  },
  days: [
    {
      id: "d1", date: "2026-12-05", shortDate: "12/05", weekday: "周六",
      title: "抵达冰岛，短途入住",
      subtitle: "KEF 机场 → 凯夫拉维克",
      phase: "arrival", km: [5, 15], driveNormal: [0.17, 0.33], driveWinter: [0.33, 0.5],
      pressure: "轻松", sleepId: "stay-kef", pointIds: ["kef-airport", "keflavik"],
      summary: "17:15 落地后取车，在凯夫拉维克短距离入住。首晚用于安顿，次日再开始半岛游览。",
      roadNumbers: ["41", "当地接入道路"],
      timeline: [
        { time: "17:15", title: "航班抵达 KEF", text: "按机票与航空公司通知核实实际抵达时间。入境、行李和取车耗时未计入驾驶预算。", pointId: "kef-airport" },
        { time: "抵达后", title: "领取租车", text: "确认冬季轮胎、还车地址和钥匙交还方式；把租车公司道路援助电话保存到手机。" },
        { time: "约 19:00–20:00", title: "入住凯夫拉维克", text: "取车顺利时可按这个尺度安排；若航班延误，按住宿提供的晚到方式入住。", pointId: "keflavik" },
        { time: "入住后", title: "晚餐与次日准备", text: "补充饮水、简餐和车上零食。查看翌日半岛西端道路与风力，再决定具体停靠。" }
      ],
      tips: ["取车到酒店只是一小段路，首晚无需赶往首都或黄金圈。", "如住镇内酒店，核实停车位置与晚间入住方法。"],
      tradeoff: "首晚住机场附近是为了缩短抵达后的驾驶，并直接衔接雷克雅内斯。",
      sourceIds: ["winter-driving", "hotel-berg"]
    },
    {
      id: "d2", date: "2026-12-06", shortDate: "12/06", weekday: "周日",
      title: "半岛地热与大陆裂隙",
      subtitle: "凯夫拉维克 → 大陆桥 → Gunnuhver → Selfoss",
      phase: "outbound", km: [150, 170], driveNormal: [2.5, 3], driveWinter: [3, 4],
      pressure: "中等", sleepId: "stay-selfoss", pointIds: ["keflavik", "bridge-continents", "gunnuhver", "selfoss"],
      summary: "半岛西端选择两个核心停靠，之后进入 Selfoss 基地，开始连续两晚的住宿。沿海灯塔、崖岸和蓝湖保留为可选替换项。",
      roadNumbers: ["44", "425", "41", "1"],
      timeline: [
        { time: "约 09:30", title: "从凯夫拉维克出发", text: "先检查西端沿海的风与道路状态；此时可能仍在晨昏阶段。", pointId: "keflavik" },
        { time: "约 10:00–10:30", title: "大陆桥", text: "短距离步行和裂隙景观，预留约 20–30 分钟；积冰或大风时缩短停留。", pointId: "bridge-continents" },
        { time: "约 10:45–11:30", title: "Gunnuhver 地热区", text: "沿开放步道观察蒸汽与地热景观，预留约 30–45 分钟；不离开维护路径。", pointId: "gunnuhver" },
        { time: "中午", title: "午餐与余量", text: "核心两点结束后吃午餐。只有道路、风力和时间都合适时，再考虑附近灯塔或 Valahnúkamöl；不要把全部备选叠加。" },
        { time: "午后", title: "前往 Selfoss", text: "默认沿 425／44 接回 41，经首都外围接 1 号公路；不把经 Grindavík 的 427 沿海路线作为固定前提。" },
        { time: "约 15:30–17:00", title: "Selfoss 入住与补给", text: "接下来连住两晚。采购早餐或简餐，翌日黄金圈游览后回同一家酒店。", pointId: "selfoss" }
      ],
      tips: ["雷克雅内斯火山活动区和蓝湖接入条件可能变化，未来 12 月的开放情况不能提前保证。", "蓝湖若成为确定项目，应按预约时段重新分配半岛停留；当前未纳入必做行程。", "本日里程是选定常规主路后的规划区间，实际住宿与入口道路会带来差异。"],
      tradeoff: "在有限白昼内保留半岛代表性景观，同时完成向 Selfoss 的转场。",
      sourceIds: ["reykjanes-kef", "winter-driving", "south-towns", "blue-lagoon-access"]
    },
    {
      id: "d3", date: "2026-12-07", shortDate: "12/07", weekday: "周一",
      title: "黄金圈，轻装往返",
      subtitle: "Selfoss → 辛格维利尔 → 盖歇尔 → 黄金瀑布 → Selfoss",
      phase: "daytrip", km: [190, 200], driveNormal: [2.75, 3.25], driveWinter: [3.5, 4],
      pressure: "中等", sleepId: "stay-selfoss", pointIds: ["selfoss", "thingvellir", "geysir", "gullfoss"],
      summary: "行李留在 Selfoss，同一天走完黄金圈三大核心景点。返回原酒店，第二天再沿 1 号公路向南岸东行。",
      roadNumbers: ["35", "36", "365", "37"],
      timeline: [
        { time: "约 09:30", title: "从 Selfoss 出发", text: "沿 35／36 前往辛格维利尔，按约一小时冬季道路时间安排。", pointId: "selfoss" },
        { time: "约 10:30–11:30", title: "辛格维利尔国家公园", text: "以主要观景区和开放的短步行为主，留约 60 分钟；不把所有步道都排入。", pointId: "thingvellir" },
        { time: "约 12:40–13:20", title: "盖歇尔地热区", text: "观看 Strokkur 间歇泉及周边地热景观，约 40 分钟；留在划定步道内。", pointId: "geysir" },
        { time: "约 13:45–14:30", title: "黄金瀑布", text: "优先开放观景平台，预留约 45 分钟；局部步道结冰或关闭时以现场指示为准。", pointId: "gullfoss" },
        { time: "约 14:30–15:00", title: "简餐与热饮", text: "按沿线实际营业情况补给，也可准备车上简餐。天气造成延误时，先保留返程余量。" },
        { time: "约 16:00–17:00", title: "返回同一家酒店", text: "沿 35 号公路返回 Selfoss，整理次日南岸转场所需的行李。", pointId: "selfoss" }
      ],
      tips: ["黄金圈主要道路有冬季服务，仍须检查当天道路与天气。", "本路线不需要借 435、550 或高地道路抄近路。", "Kerið、Brúarfoss、温泉等是备选；若加入，应缩减其他停留或替换一个项目。"],
      tradeoff: "Selfoss 不是黄金圈当日距离最短的住宿点，但兼顾前一天抵达、镇内补给与下一天南岸东行。",
      sourceIds: ["golden-circle", "selfoss-thingvellir-distance", "winter-driving"]
    },
    {
      id: "d4", date: "2026-12-08", shortDate: "12/08", weekday: "周二",
      title: "黑沙滩，向冰河湖推进",
      subtitle: "Selfoss → Reynisfjara → Vík → Hof／Hnappavellir",
      phase: "outbound", km: [295, 310], driveNormal: [3.75, 4.25], driveWinter: [4.5, 5.5],
      pressure: "偏高", sleepId: "stay-glacier", pointIds: ["selfoss", "reynisfjara", "vik", "hnappavellir"],
      summary: "今天以黑沙滩为主要游览点，其余时间用于向东转场。两处大瀑布留给回程，提前住到冰河湖西侧，为次日冰洞集合创造条件。",
      roadNumbers: ["1", "215"],
      timeline: [
        { time: "约 09:00", title: "Selfoss 退房出发", text: "提前准备简餐，出发前确认黑沙滩及南岸东段路况。", pointId: "selfoss" },
        { time: "约 11:15–12:00", title: "Reynisfjara 开放观景区", text: "预留约 45 分钟，以当日开放的上部观景区域为准。侵蚀可能限制下到沙滩或玄武岩柱旁，遵守最新围栏、告示与现场指示。", pointId: "reynisfjara" },
        { time: "约 12:15–13:00", title: "维克午餐与补给", text: "补充燃油、食物和饮水，再继续东行。今天经过维克，返程才在这里住宿。", pointId: "vik" },
        { time: "午后", title: "沿 1 号公路继续向东", text: "以转场为主。峡谷、长时间冰川徒步和飞机残骸不属于今天的固定项目。" },
        { time: "约 16:30–17:30", title: "冰河湖西侧入住", text: "Hof／Hnappavellir 为搜索区域。确认次日冰洞集合点、班次、提前抵达要求和早餐安排。", pointId: "hnappavellir" },
        { time: "晚间", title: "酒店晚餐与休息", text: "这一区域住宿相对分散，入住前落实酒店晚餐或自备方案，不把找餐厅留到长途结束后。" }
      ],
      tips: ["到达酒店前的最后一段很可能已日落；不要把整个转场理解为白天驾驶。", "2026 年 2 月官方公告曾因海岸侵蚀限制到上部沙脊；12 月实际开放范围必须重新确认，不保证能走到玄武岩柱旁。", "黑沙滩若不适合停留，可移到 12/10 从维克出发时补看，并缩减那天其他停留。", "Hof 与更东面的 Höfn 不同；这版不需要再把酒店订到 Höfn。"],
      tradeoff: "今天接近 300 公里的道路时间换来次日更短的冰洞集合转场；游览项目必须克制。",
      sourceIds: ["selfoss-glacier-distance", "winter-driving", "fosshotel-glacier", "reynisfjara-safety"]
    },
    {
      id: "d5", date: "2026-12-09", shortDate: "12/09", weekday: "周三",
      title: "冰洞与浮冰，西返维克",
      subtitle: "冰河湖西侧 → Jökulsárlón → 钻石沙滩 → Vík",
      phase: "return", km: [220, 235], driveNormal: [2.75, 3.25], driveWinter: [3.5, 4.5],
      pressure: "偏高", sleepId: "stay-vik", pointIds: ["hnappavellir", "jokulsarlon", "ice-cave", "diamond-beach", "vik"],
      summary: "优先选择上午的常规向导冰洞团，之后看冰河湖和钻石沙滩，下午开始西返维克。今天的冰洞班次是落实整段节奏的关键。",
      roadNumbers: ["1"],
      timeline: [
        { time: "约 08:15–09:15", title: "退房、前往集合区", text: "这是上午班次的示范节奏；实际出发时间以所订团的集合点和班次倒推。停车和报到另留余量。", pointId: "jokulsarlon" },
        { time: "上午，班次待定", title: "参加向导冰洞活动", text: "为标准产品预留约 2.5–4 小时，含运营方车辆转运、装备与冰川活动。洞穴或蓝冰形态按当日安全条件选择。", pointId: "ice-cave" },
        { time: "活动结束后", title: "冰河湖观景与简餐", text: "预留约 30–45 分钟看湖面浮冰；若活动结束较晚，压缩停留而不压缩道路时间。", pointId: "jokulsarlon" },
        { time: "约 13:30–14:30 内", title: "钻石沙滩", text: "与湖区一起在可用自然光内完成，停留约 20–30 分钟。沙滩上的浮冰数量和形态随海况变化。", pointId: "diamond-beach" },
        { time: "约 14:00–15:00", title: "开始西返维克", text: "冰河湖到维克约 191 公里；以完成转场为主，途中按需要休息。" },
        { time: "约 17:30–19:00", title: "维克入住", text: "后半程很可能天黑。提前确认入住和晚餐，第二天从维克开始补看瀑布。", pointId: "vik" }
      ],
      tips: ["示范日程以上午标准冰洞团为前提，尚未承诺具体班次可订。", "向导车辆的冰川转运不是租车自驾路线；不要用自己的租车驶入冰川。", "如果最终只能选很晚或很长的团，应重新评估返程夜的位置与当天活动，而不是强行照搬时间表。", "这天同时有活动和长途返回，不能把 3.5–4.5 小时车程误认为全部行程时长。"],
      tradeoff: "住维克比住教堂镇多推进一段回程，换来 12/10 更顺的瀑布补游和回首都安排。",
      sourceIds: ["ice-cave-2026", "vik-jokulsarlon-distance", "winter-driving"]
    },
    {
      id: "d6", date: "2026-12-10", shortDate: "12/10", weekday: "周四",
      title: "补看双瀑布，回到首都",
      subtitle: "Vík → Skógafoss → Seljalandsfoss → Reykjavík",
      phase: "return", km: [190, 200], driveNormal: [2.5, 3], driveWinter: [3, 4],
      pressure: "中等", sleepId: "stay-reyk", pointIds: ["vik", "skogafoss", "seljalandsfoss", "reykjavik"],
      summary: "从维克一路向西补看两处大瀑布，再进入雷克雅未克。晚上开始连续两晚住宿，为次日斯奈山留出休息时间。",
      roadNumbers: ["1", "瀑布停车场支路"],
      timeline: [
        { time: "约 09:30", title: "维克退房出发", text: "如果 12/8 黑沙滩未完成，可以先补看，但需要相应缩短今天其他停留。", pointId: "vik" },
        { time: "约 10:15–11:15", title: "斯科加瀑布", text: "以瀑布正面和开放观景区为主，约 45–60 分钟。完整登阶和上游徒步不作为固定项目。", pointId: "skogafoss" },
        { time: "约 12:00–12:45", title: "塞里雅兰瀑布", text: "从正面和开放步道观景，约 30–45 分钟；冬季不把绕到瀑布后方视为必做体验。", pointId: "seljalandsfoss" },
        { time: "约 13:00–13:45", title: "午餐与补给", text: "根据沿线营业情况安排，之后继续向首都。" },
        { time: "约 15:30–17:00", title: "雷克雅未克入住", text: "入住同一家酒店两晚。确认停车位或附近停车场，行李可以留在酒店进入次日往返行程。", pointId: "reykjavik" },
        { time: "晚间", title: "晚餐、短散步与休息", text: "翌日需要早出晚归，首都晚间活动保持轻量；按天气更新斯奈山停靠顺序。" }
      ],
      tips: ["两处瀑布都在向西返回的线路上，不需要再从雷市单独折返补看。", "城市停车规则取决于具体酒店和路段，订房时一起确认。", "如当天延误较多，以完成转场和休息为优先。"],
      tradeoff: "把南岸西段游览放到回程，避免 12/8 东行当天塞入太多景点，也减轻斯奈山前一天的压力。",
      sourceIds: ["vik-reykjavik-distance", "winter-driving", "storm-hotel"]
    },
    {
      id: "d7", date: "2026-12-11", shortDate: "12/11", weekday: "周五",
      title: "斯奈山一日往返",
      subtitle: "Reykjavík → Búðir → Arnarstapi → Kirkjufell → Reykjavík",
      phase: "daytrip", km: [420, 435], driveNormal: [6, 7], driveWinter: [7, 8],
      pressure: "最高", sleepId: "stay-reyk", pointIds: ["reykjavik", "budir", "arnarstapi", "kirkjufell"],
      summary: "行李留在雷市酒店，围绕黑教堂、Arnarstapi 海岸和教会山三个核心点安排。约 10–12 小时的一日行程，是本次驾驶压力最大的一天。",
      roadNumbers: ["1", "54", "574（Arnarstapi 接入段）", "56"],
      routeAlternatives: [
        { label: "核心路线", roads: "54 号 Fróðárheiði 接南北两侧，56 号返回", km: [420, 435], note: "部分路段经过高处，按当天风雪和路况决定是否采用。" },
        { label: "西端绕行", roads: "574 绕西端，经 Hellissandur 接北岸", km: [440, 460], note: "比核心路线多约 20–30 公里，也增加驾驶与停留时间；不是保证开放或自动更安全的替代。" }
      ],
      daylight: { place: "Grundarfjörður／教会山附近", sunrise: "11:28", sunset: "15:23", civilDawn: "10:05", civilDusk: "16:46", note: "晨昏光线不等于日出后的完整白昼。" },
      timeline: [
        { time: "约 08:00", title: "从雷市酒店出发", text: "先核对 1、54、56、574 的当日情况，再决定是否执行全日路线。前段交通在日出前。", pointId: "reykjavik" },
        { time: "途中", title: "Borgarnes 短休息", text: "按需要补给、上洗手间，控制停留，保留半岛上的自然光。" },
        { time: "约 11:00–11:30", title: "Búðir 黑教堂", text: "主要在外部观察教堂与周围景观，约 20–30 分钟；不以室内开放为前提。", pointId: "budir" },
        { time: "约 12:00–12:45", title: "Arnarstapi 海岸", text: "选择开放的短步道和海蚀景观，约 40–50 分钟；不安排往返 Hellnar 的完整徒步。", pointId: "arnarstapi" },
        { time: "约 12:45–13:15", title: "简餐，确认北岸接线", text: "按道路实际情况选择中部穿越或西端绕行；如果条件不合适，减少后续点并返回。" },
        { time: "约 14:15–15:00", title: "Kirkjufell 教会山", text: "以山体与开放观景位置为主，约 30–45 分钟；瀑布周围结冰时遵守封闭范围。", pointId: "kirkjufell" },
        { time: "约 15:00–16:00", title: "开始返程", text: "留足跨半岛及回首都的时间，按需要安排短休息。" },
        { time: "约 19:00–20:00", title: "回原酒店", text: "晚归时间随路线、风雪和休息变化。无需再办另一处酒店入住。", pointId: "reykjavik" }
      ],
      tips: ["少换住宿带来的是更简单的入住安排，斯奈山当天仍要承担较长往返驾驶。", "删除西端景点主要节省停留时间；核心版仍有约 420–435 公里。", "570／F575 不作为十二月自驾捷径。", "如天气不支持长途，保留雷市住宿并改为城市或近郊备选，不能把所有核心点视为必须完成。"],
      tradeoff: "最后两晚固定在雷市，换取一个早出晚归的斯奈山日；天气合适时执行三处核心停靠。",
      sourceIds: ["west-map", "snaefellsjokull-faq", "snaefellsnes-daylight", "winter-driving"]
    },
    {
      id: "d8", date: "2026-12-12", shortDate: "12/12", weekday: "周六",
      title: "首都漫步，午后还车",
      subtitle: "雷市市中心 → KEF 还车 → 18:05 航班",
      phase: "departure", km: [50, 60], driveNormal: [0.75, 1], driveWinter: [1, 1.5],
      pressure: "轻松", sleepId: null, pointIds: ["reykjavik", "hallgrimskirkja", "laugavegur", "harpa", "kef-airport"],
      summary: "上午给首都市中心，按短距离步行串联教堂、步行街与 Harpa 周边。13:00 左右开始机场方向转场，先还车，再进入航站楼。",
      roadNumbers: ["市区街道", "41"],
      timeline: [
        { time: "约 09:30", title: "早餐、退房", text: "按酒店规则处理行李和停车；步行段以市中心为范围，不再增加远距离绕行。", pointId: "reykjavik" },
        { time: "约 10:00–11:00", title: "教堂与步行街", text: "Hallgrímskirkja 外观与 Laugavegur 一带散步。塔楼、室内参观或购物根据实际开放和时间决定。", pointId: "hallgrimskirkja" },
        { time: "约 11:00–12:00", title: "Harpa 与海港附近", text: "选择一段轻量的市区步行与拍照；不把室内活动营业时间当成固定承诺。", pointId: "harpa" },
        { time: "约 12:00–12:45", title: "午餐并取车", text: "为机场转场留余量，提前确认加油点、还车位置及是否需要接驳。" },
        { time: "13:00 为默认离城时间", title: "前往 KEF 方向", text: "13:30 仅在道路顺畅、还车手续与接驳时间明确时采用；道路变差时更早结束市区活动。" },
        { time: "约 14:15–14:45", title: "加油、还车和接驳", text: "这一环节单独留时间，不包含在表中的公路驾驶预算里；以租车公司的实际流程为准。" },
        { time: "目标 15:00–15:15", title: "进入航站楼", text: "机场建议在航班起飞前 2.5–3 小时到达。办理行李、安检和登机。", pointId: "kef-airport" },
        { time: "18:05", title: "返程航班起飞", text: "以航空公司最终航班和登机信息为准。", pointId: "kef-airport" }
      ],
      tips: ["这版给雷市的是 12/10 晚间加离境日上午，不是两个完整城市游览日。", "最后一天不把温泉、博物馆长参观或远郊项目列入固定行程。"],
      tradeoff: "使用较晚的返程航班保留城市上午，同时把还车与机场手续作为独立时间段。",
      sourceIds: ["kef-checkin"]
    }
  ],
  stays: [
    {
      id: "stay-kef", name: "凯夫拉维克", localName: "Keflavík", pointId: "keflavik", lat: 64.0017, lng: -22.5543,
      checkIn: "2026-12-05", checkOut: "2026-12-06", nights: 1,
      status: "正在预定", hotelName: "", rationale: "抵达当晚只开短距离，第二天直接游览雷克雅内斯半岛。",
      searchArea: "Keflavík 镇内／港口附近，或进出方便的机场周边住宿。",
      bookingChecks: ["晚到入住方式", "停车地点", "早餐时间或自备方案"],
      examples: [{ name: "Hotel Berg", url: "https://www.hotelberg.is/", note: "位于 Keflavík 港口附近，作为区域定位参考；未查询指定日期房态、价格。" }],
      sourceIds: ["hotel-berg"]
    },
    {
      id: "stay-selfoss", name: "塞尔福斯", localName: "Selfoss", pointId: "selfoss", lat: 63.9330, lng: -20.9971,
      checkIn: "2026-12-06", checkOut: "2026-12-08", nights: 2,
      status: "正在预定", hotelName: "", rationale: "6 日半岛后入住，7 日轻装往返黄金圈，8 日从这里沿 1 号公路东行；两晚同一家。",
      searchArea: "优先 Selfoss 镇内、靠近餐饮与补给的位置，避免用广泛邮政地址替代实际地图位置。",
      bookingChecks: ["两晚同一房型与停车安排", "是否需要厨房或早餐", "实际地址是否在镇内或附近"],
      examples: [{ name: "Hotel Selfoss", url: "https://www.hotelselfoss.is/", note: "Selfoss 镇内的位置参考；未查询你们人数、房型及入住日期的价格。" }],
      sourceIds: ["south-towns", "hotel-selfoss"]
    },
    {
      id: "stay-glacier", name: "冰河湖西侧", localName: "Hof / Hnappavellir", pointId: "hnappavellir", lat: 63.90005, lng: -16.60809,
      checkIn: "2026-12-08", checkOut: "2026-12-09", nights: 1,
      status: "正在预定", hotelName: "", rationale: "提前完成向东的大段驾驶，衔接 9 日上午从 Jökulsárlón 一带集合的冰洞团。",
      searchArea: "Hof–Hnappavellir、1 号公路附近；地图图钉仅代表搜索区域。Hof 不等于更东侧的 Höfn。",
      bookingChecks: ["与实际冰洞集合点的车程", "酒店晚餐及早餐时间", "晚到入住方式和入口支路", "选择的具体房型是否独立卫浴"],
      examples: [{ name: "Fosshotel Glacier Lagoon", url: "https://www.islandshotel.is/hotels-in-iceland/fosshotel-glacier-lagoon/", note: "位于 Hnappavellir，在 Skaftafell 与 Jökulsárlón 之间，有餐厅与停车；不是湖岸酒店，也未确认房态。" }],
      sourceIds: ["fosshotel-glacier", "ice-cave-2026"]
    },
    {
      id: "stay-vik", name: "维克", localName: "Vík í Mýrdal", pointId: "vik", lat: 63.4186, lng: -19.0060,
      checkIn: "2026-12-09", checkOut: "2026-12-10", nights: 1,
      status: "正在预定", hotelName: "", rationale: "9 日冰洞和冰河湖后西返，在这里结束一天；10 日从南岸西段开始补两处瀑布，再进入雷市。",
      searchArea: "优先 Vík 镇内或紧邻镇区、进出 1 号公路方便的位置。",
      bookingChecks: ["预计晚间抵达时的入住方式", "晚餐营业或自备安排", "停车及房间卫浴类型"],
      examples: [{ name: "Hótel Vík í Mýrdal", url: "https://www.stayinvik.is/", note: "维克住宿的位置参考，运营方同时提供不同住宿产品；具体房型、价格、房态另行核对。" }],
      sourceIds: ["stay-in-vik"]
    },
    {
      id: "stay-reyk", name: "雷克雅未克", localName: "Reykjavík", pointId: "reykjavik", lat: 64.1435, lng: -21.9168,
      checkIn: "2026-12-10", checkOut: "2026-12-12", nights: 2,
      status: "正在预定", hotelName: "", rationale: "10 日抵达后连住两晚；11 日斯奈山往返，12 日市中心游览后直接去机场还车。",
      searchArea: "优先市中心东侧、Laugavegur／Hlemmur 一带或步行可达中心且停车明确的位置。",
      bookingChecks: ["两晚停车成本、入口与是否保证车位", "12 日退房后行李与停车安排", "早出晚归和早餐时间"],
      examples: [{ name: "Storm Hotel by Keahotels", url: "https://www.keahotels.is/storm-hotel", note: "市中心东侧的位置参考；官网写明免费车位有限，不等于预订房间就保证有车位。" }],
      sourceIds: ["storm-hotel"]
    }
  ],
  essentials: [
    {
      id: "read-map", title: "怎样读这张地图",
      body: "行程身份与冬季可达性是两层信息：已经规划的点、沿线备选点和全岛参考点分别标识；可达性另外说明一般冬季自驾、需看条件、需向导或常规自驾不适用。",
      items: ["点开景点查看停留建议、对应日期和冬季限制。", "点开每日路线查看整天安排；重叠道路可用日期筛选分开看。", "住宿图钉是当前搜索区域，全部标为正在预定。", "备选点用于替换或腾出余量后的补充，不代表一天内全部可完成。"]
    },
    {
      id: "road-check", title: "每天出发前的三个入口",
      body: "可达性是规划分类，未来 12 月道路是否开放须看当天信息。主路有冬季服务也可能临时关闭；四驱不消除冰面打滑风险。",
      items: ["先看道路开放与路面情况，再看风雪预报和旅游警报。", "道路或天气不支持时调整或取消该段，不以赶酒店或固定景点为理由追赶时间。"],
      links: [{ label: "道路与路面状况 · Umferðin", url: "https://umferdin.is/en" }, { label: "天气与风力 · 冰岛气象局", url: "https://en.vedur.is/" }, { label: "旅行警报 · SafeTravel", url: "https://safetravel.is/" }],
      sourceIds: ["winter-driving"]
    },
    {
      id: "winter-light", title: "把自然光留给景点",
      body: "十二月白昼短，这版会出现日出前出发和日落后转场。尤其 12/8 东行、12/9 冰洞后西返、12/11 斯奈山往返，需要把驾驶与游览时间分开理解。",
      items: ["12/11 教会山附近日出 11:28、日落 15:23；民用晨昏约 10:05–16:46。", "晨昏可用于部分户外观景，但光线和步道条件不同于完整白昼。", "极光只作为住宿附近、体力和天气允许时的加项，不额外安排深夜长途追逐。"],
      sourceIds: ["snaefellsnes-daylight"]
    },
    {
      id: "booking-order", title: "先落实的预订",
      body: "先把 12/9 上午冰洞的集合点与产品时长落实，再核对 12/8 冰河湖西侧住宿的位置；随后填入其他四处住宿。",
      items: ["冰洞：优先常规上午团，具体洞穴或蓝冰形态由当天条件决定。", "Selfoss 与雷市：分别连续订同一家两晚。", "东南部与维克：把晚餐、晚到入住和停车一起确认。", "价格、空房、取消条件和最终酒店名称都尚未确认；图中的酒店例子只用于定位。"],
      sourceIds: ["ice-cave-2026"]
    },
    {
      id: "when-delayed", title: "遇到延误，优先删什么",
      body: "先减少额外支路和长步行，保留必要转场与休息。主景点也不承诺在不合适的天气下完成。",
      items: ["12/6：灯塔、海崖、蓝湖等备选先不加入。", "12/7：围绕黄金圈三核心，不再叠加所有温泉与支线瀑布。", "12/8：黑沙滩不适合时，可考虑 12/10 从维克出发补看。", "12/9：以已订冰洞时刻和天光为准，缩短湖区停留；活动明显延误时重新评估当晚转场。", "12/11：保留三个核心的优先级，天气不允许时减少路线或改为首都备选。"]
    },
    {
      id: "shore-ice", title: "海岸与结冰步道",
      body: "黑沙滩和海岸观景服从警示及现场开放范围；瀑布步道、台阶和观景平台按当日结冰状况决定走到哪里。",
      items: ["Reynisfjara 不靠近浪线，不以拍照为理由越过限制。", "Seljalandsfoss 的瀑布后方步道不是本行程的冬季必做项目。", "冰川与天然冰洞通过有资质的向导产品进入，不把租车路线延伸到冰川上。"],
      links: [{ label: "SafeTravel 现场与区域警报", url: "https://safetravel.is/" }],
      sourceIds: ["reynisfjara-safety", "ice-cave-2026"]
    },
    {
      id: "packing", title: "与这条路线直接相关的装备",
      body: "以能应对风、雨雪、结冰步道和短时间下车观景为目标。冰洞专用装备按运营方要求准备。",
      items: ["防风防水外层、保暖中层、帽子和防水保暖手套。", "抓地力合适的防水鞋；步道防滑装备与冰洞装备按现场或向导要求使用。", "离线地图、充电线、充电宝、车上饮水与简餐。", "提前保存酒店晚到方法、租车援助电话、冰洞集合说明；紧急情况拨打 112。"],
      sourceIds: ["winter-driving", "ice-cave-2026"]
    },
    {
      id: "airport-return", title: "离境日的时间边界",
      body: "12/12 航班 18:05 起飞。13:00 左右离开雷市是默认安排，目标 15:00–15:15 到航站楼；租车交还及接驳要另留时间。",
      items: ["市区游览集中在上午，不在离境前再加远郊行程。", "还车地点不一定就在航站楼，提前确认具体地址和接驳。", "天气或道路变差时，提前结束市区游览。"],
      sourceIds: ["kef-checkin"]
    }
  ],
  sources: [
    { id: "winter-driving", title: "SafeTravel · Winter driving", url: "https://safetravel.is/driving/winter-driving/", checked: "2026-10-26", note: "冬季道路留量、天气变化、车辆与道路信息入口；不提供未来某天开放保证。" },
    { id: "reykjanes-kef", title: "KEF · 雷克雅内斯半岛游览", url: "https://www.kefairport.com/news/7-things-to-do-around-kef", checked: "2026-10-26", note: "大陆桥、Gunnuhver 和邻近景观的地理衔接；完整当天时间由本攻略另行规划。" },
    { id: "blue-lagoon-access", title: "Blue Lagoon · Seismic activity and access", url: "https://www.bluelagoon.com/seismic-activity", checked: "2026-10-26", note: "蓝湖与火山活动相关接入信息入口；当前状态不代表 12 月状态。" },
    { id: "golden-circle", title: "Visit South Iceland · The Golden Circle", url: "https://www.south.is/en/destinations/travel-routes/the-golden-circle", checked: "2026-10-26", note: "黄金圈核心景点、冬季出行和主路信息。" },
    { id: "south-towns", title: "Visit South Iceland · Towns & Villages", url: "https://www.south.is/en/destinations/towns", checked: "2026-10-26", note: "Selfoss 的服务、餐饮与住宿作为基地的实用性。" },
    { id: "ice-cave-2026", title: "Local Guide · 2026–2027 Ice Cave Tour", url: "https://localguide.is/ice-cave-tour", checked: "2026-10-26", note: "从 Jökulsárlón 集合，标准产品约 2.5–4 小时；仅用来说明排程尺度，不表示已经预订该产品。" },
    { id: "reynisfjara-safety", title: "冰岛旅游局 · Reynisfjara 海岸侵蚀公告", url: "https://www.ferdamalastofa.is/en/news/category/1/reynisfjara-recent-changes-due-to-coastal-erosion", checked: "2026-10-26", note: "2026-02-24 公告描述当时仅能到上部沙脊，玄武岩柱前方不可步行抵达，原警示设施受侵蚀影响；这不代表 12 月最终开放状态。" },
    { id: "west-map", title: "Visit West Iceland · 官方地图与距离表", url: "https://www.west.is/static/files/_blob/markadsstofa.vesturland.2023.kort.1.pdf", checked: "2026-10-26", note: "雷市–Borgarnes 74 km，雷市–Arnarstapi 192 km，雷市–Grundarfjörður 177 km；全日路线为分段汇总估算。" },
    { id: "snaefellsjokull-faq", title: "Snæfellsjökull National Park · FAQ", url: "https://snaefellsjokull.is/en/education/faq/", checked: "2026-10-26", note: "主要道路、冬季查询、570/F575 非全年开放、Arnarstapi–Hellnar 徒步尺度。" },
    { id: "snaefellsnes-daylight", title: "Timeanddate · Grundarfjörður, December 2026", url: "https://www.timeanddate.com/sun/@3416839?month=12&year=2026", checked: "2026-10-26", note: "12/11 日出 11:28、日落 15:23、民用晨昏 10:05–16:46。" },
    { id: "kef-checkin", title: "KEF Airport · Check-in information", url: "https://www.kefairport.com/check-in-information", checked: "2026-10-26", note: "机场建议提前 2.5–3 小时抵达；还车与接驳另外留量。" },
    { id: "selfoss-thingvellir-distance", title: "路线距离参考 · Selfoss → Þingvellir", url: "https://www.rome2rio.com/s/Selfoss/%C3%9Eingvellir", checked: "2026-10-26", note: "道路约 47.7 km、普通条件约 44 分钟；不是十二月实时车程。" },
    { id: "selfoss-glacier-distance", title: "路线距离参考 · Selfoss → Hnappavellir", url: "https://www.rome2rio.com/s/Selfoss/Fosshotel-Glacier-Lagoon-Hnappavellir", checked: "2026-10-26", note: "道路约 292.5 km、普通条件约 3 小时 43 分钟；攻略另计黑沙滩支路与冬季余量。" },
    { id: "vik-jokulsarlon-distance", title: "路线距离参考 · Vík → Jökulsárlón", url: "https://www.rome2rio.com/s/Vik-Iceland/J%C3%B6kuls%C3%A1rl%C3%B3n", checked: "2026-10-26", note: "道路约 191.2 km、普通条件约 2 小时 25 分钟；不含冰洞或湖区游览。" },
    { id: "vik-reykjavik-distance", title: "路线距离参考 · Vík → Reykjavík", url: "https://www.rome2rio.com/s/Vik-Iceland/Reykjav%C3%ADk", checked: "2026-10-26", note: "道路约 183.7 km、普通条件约 2 小时 24 分钟；攻略另计瀑布停车场支路。" },
    { id: "hotel-berg", title: "Hotel Berg · 官方网站", url: "https://www.hotelberg.is/", checked: "2026-10-26", note: "凯夫拉维克位置参考，未核指定日期房态和价格。" },
    { id: "hotel-selfoss", title: "Hotel Selfoss · 官方网站", url: "https://www.hotelselfoss.is/", checked: "2026-10-26", note: "Selfoss 住宿位置参考，未核指定日期房态和价格。" },
    { id: "fosshotel-glacier", title: "Fosshotel Glacier Lagoon · Íslandshótel", url: "https://www.islandshotel.is/hotels-in-iceland/fosshotel-glacier-lagoon/", checked: "2026-10-26", note: "Hnappavellir 地理位置、餐厅与停车；未核指定日期房态和价格。" },
    { id: "stay-in-vik", title: "Stay in Vík · 官方网站", url: "https://www.stayinvik.is/", checked: "2026-10-26", note: "维克住宿位置参考，未核指定日期房态和价格。" },
    { id: "storm-hotel", title: "Storm Hotel · Keahotels", url: "https://www.keahotels.is/storm-hotel", checked: "2026-10-26", note: "雷市位置参考；官网说明免费停车位有限，未核指定日期房态和价格。" }
  ]
};
