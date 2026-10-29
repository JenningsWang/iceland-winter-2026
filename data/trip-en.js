/* English edition of the agreed Iceland winter itinerary.
   All times are Iceland local time (UTC+0). Booking status and driving-pressure
   values remain canonical Chinese keys; the interface translates their labels. */
window.ICELAND_TRIP_EN = {
  meta: {
    title: "Iceland in Winter · 8 Days, 7 Nights",
    subtitle: "Reykjanes · Golden Circle · South Coast · Snæfellsnes",
    dates: "2026.12.05 — 12.12",
    startDate: "2026-12-05",
    endDate: "2026-12-12",
    updated: "2026-10-26",
    timezone: "Iceland local time, UTC+0",
    version: "2026-10-26 / Agreed five-base itinerary",
    durationDays: 8,
    nights: 7,
    baseCount: 5,
    hotelChanges: 4,
    distanceRange: [1520, 1625],
    driveWinterRange: [25.83, 32],
    description: "Start in Keflavík, then use Selfoss and the area west of Jökulsárlón as the two eastbound bases. Stay in Vík on the way back to visit the South Coast waterfalls, followed by two nights in Reykjavík.",
    bookingStatus: "Accommodation bookings in progress; ice-cave departure still to be confirmed",
    routeStatus: "A planned route for ordinary winter conditions. Follow official road and weather information and local access instructions on the day of travel.",
    estimateNote: "Distances and driving times are estimated from the current accommodation areas. Winter allowances include typical slower driving, but exclude sightseeing, meals and guided ice-cave transfers. They are not upper limits during blizzards, road closures or diversions.",
    coordinateNote: "Accommodation pins mark the proposed towns or search areas, not hotels that have already been selected.",
    flights: [
      { date: "2026-12-05", time: "17:15", airport: "KEF", type: "arrival", text: "Arrive at Keflavík Airport. The flight time comes from the agreed itinerary; check the airline's latest information before departure." },
      { date: "2026-12-12", time: "18:05", airport: "KEF", type: "departure", text: "Return flight departs. Aim to reach the terminal at 15:00–15:15, after refuelling, returning the car and taking any required shuttle." }
    ],
    principles: [
      "Seven nights across five bases, with two consecutive nights each in Selfoss and Reykjavík.",
      "Visit the black-sand beach eastbound and the two waterfalls on the return journey, reducing repeat stops at the same sights.",
      "Jökulsárlón is the furthest eastbound core destination; accommodation does not move farther east to Höfn.",
      "Visit Snæfellsnes as a day trip from Reykjavík, focusing on Búðir's black church, the Arnarstapi coast and Kirkjufell.",
      "Optional stops are replacements or additions when conditions allow, not a list to fit in all at once."
    ]
  },
  days: [
    {
      id: "d1", date: "2026-12-05", shortDate: "5 Dec", weekday: "Sat",
      title: "Arrive in Iceland, then a short drive to your stay",
      subtitle: "KEF Airport → Keflavík",
      phase: "arrival", km: [5, 15], driveNormal: [0.17, 0.33], driveWinter: [0.33, 0.5],
      pressure: "轻松", sleepId: "stay-kef", pointIds: ["kef-airport", "keflavik"],
      summary: "After landing at 17:15, collect the rental car and make the short drive to Keflavík. Use the first evening to settle in; sightseeing around the peninsula starts the next day.",
      roadNumbers: ["41", "Local access roads"],
      timeline: [
        { time: "17:15", title: "Flight arrives at KEF", text: "Verify the actual arrival time against your ticket and airline updates. Immigration, baggage collection and car collection are not included in the driving allowance.", pointId: "kef-airport" },
        { time: "After arrival", title: "Collect the rental car", text: "Confirm winter tyres, the return address and how to hand back the keys. Save the rental company's roadside-assistance number on your phone." },
        { time: "Around 19:00–20:00", title: "Check in at Keflavík", text: "This is a reasonable planning window if car collection goes smoothly. If the flight is delayed, follow the accommodation's late-arrival procedure.", pointId: "keflavik" },
        { time: "After check-in", title: "Dinner and preparations for tomorrow", text: "Buy water, simple meals and snacks for the car. Check the next day's roads and wind on the western peninsula before deciding on the exact stops." }
      ],
      tips: ["The drive from car collection to your accommodation is short; there is no need to reach Reykjavík or the Golden Circle on the first evening.", "For a hotel in town, confirm where to park and how evening check-in works."],
      tradeoff: "An airport-area first night keeps driving after arrival short and sets up the next day's Reykjanes visit.",
      sourceIds: ["winter-driving", "hotel-berg"]
    },
    {
      id: "d2", date: "2026-12-06", shortDate: "6 Dec", weekday: "Sun",
      title: "Geothermal landscapes and the continental rift",
      subtitle: "Keflavík → Bridge Between Continents → Gunnuhver → Selfoss",
      phase: "outbound", km: [150, 170], driveNormal: [2.5, 3], driveWinter: [3, 4],
      pressure: "中等", sleepId: "stay-selfoss", pointIds: ["keflavik", "bridge-continents", "gunnuhver", "selfoss"],
      summary: "Make two core stops on the western peninsula, then move to Selfoss for two consecutive nights. The coastal lighthouse, cliffs and Blue Lagoon remain optional alternatives.",
      roadNumbers: ["44", "425", "41", "1"],
      timeline: [
        { time: "Around 09:30", title: "Leave Keflavík", text: "Check wind and road conditions on the western coast first. It may still be twilight at this time.", pointId: "keflavik" },
        { time: "Around 10:00–10:30", title: "Bridge Between Continents", text: "Allow about 20–30 minutes for a short walk and views of the rift. Keep the stop shorter if paths are icy or winds are strong.", pointId: "bridge-continents" },
        { time: "Around 10:45–11:30", title: "Gunnuhver geothermal area", text: "Allow about 30–45 minutes to view the steam and geothermal landscape from open paths. Stay on maintained routes.", pointId: "gunnuhver" },
        { time: "Midday", title: "Lunch and some flexibility", text: "Have lunch after the two core stops. Consider the nearby lighthouse or Valahnúkamöl only if roads, wind and time all allow; do not add every optional stop." },
        { time: "Afternoon", title: "Continue to Selfoss", text: "The default route follows Roads 425/44 back to Road 41, then joins Route 1 around the edge of the capital. It does not depend on the coastal Road 427 route through Grindavík." },
        { time: "Around 15:30–17:00", title: "Check in and stock up in Selfoss", text: "Stay for the next two nights. Buy breakfast supplies or simple meals; return to the same hotel after tomorrow's Golden Circle trip.", pointId: "selfoss" }
      ],
      tips: ["Access around Reykjanes' volcanic activity areas and the Blue Lagoon can change. Opening conditions for December cannot be guaranteed in advance.", "If the Blue Lagoon becomes a confirmed booking, rearrange the peninsula stops around its reserved time slot. It is currently optional.", "Today's distance range assumes the selected main-road route. The actual accommodation and access roads will affect the total."],
      tradeoff: "Keep representative peninsula landscapes within the short daylight window while completing the move to Selfoss.",
      sourceIds: ["reykjanes-kef", "winter-driving", "south-towns", "blue-lagoon-access"]
    },
    {
      id: "d3", date: "2026-12-07", shortDate: "7 Dec", weekday: "Mon",
      title: "The Golden Circle, without moving hotels",
      subtitle: "Selfoss → Þingvellir → Geysir → Gullfoss → Selfoss",
      phase: "daytrip", km: [190, 200], driveNormal: [2.75, 3.25], driveWinter: [3.5, 4],
      pressure: "中等", sleepId: "stay-selfoss", pointIds: ["selfoss", "thingvellir", "geysir", "gullfoss"],
      summary: "Leave your luggage in Selfoss and visit the Golden Circle's three core sights in one day. Return to the same hotel, then head east along Route 1 and the South Coast the following morning.",
      roadNumbers: ["35", "36", "365", "37"],
      timeline: [
        { time: "Around 09:30", title: "Leave Selfoss", text: "Take Roads 35/36 towards Þingvellir, allowing around one hour of winter driving.", pointId: "selfoss" },
        { time: "Around 10:30–11:30", title: "Þingvellir National Park", text: "Allow about 60 minutes for the main viewpoints and a short walk on open paths. Do not try to cover every trail.", pointId: "thingvellir" },
        { time: "Around 12:40–13:20", title: "Geysir geothermal area", text: "Spend about 40 minutes watching Strokkur and the surrounding geothermal features. Stay on designated paths.", pointId: "geysir" },
        { time: "Around 13:45–14:30", title: "Gullfoss", text: "Prioritise open viewing platforms and allow around 45 minutes. Follow on-site instructions if paths are icy or closed.", pointId: "gullfoss" },
        { time: "Around 14:30–15:00", title: "A simple meal and a hot drink", text: "Use whichever facilities are actually open along the route, or bring food for the car. If weather causes delays, protect the return-driving allowance first." },
        { time: "Around 16:00–17:00", title: "Return to the same hotel", text: "Follow Road 35 back to Selfoss and organise your luggage for tomorrow's move along the South Coast.", pointId: "selfoss" }
      ],
      tips: ["Main Golden Circle roads receive winter service, but road and weather checks are still necessary on the day.", "This route does not need shortcuts via Roads 435, 550 or highland roads.", "Kerið, Brúarfoss and hot springs are optional. To include one, shorten other stops or replace an activity."],
      tradeoff: "Selfoss does not give the shortest possible Golden Circle day, but balances the previous day's arrival, town services and the next day's eastbound South Coast drive.",
      sourceIds: ["golden-circle", "selfoss-thingvellir-distance", "winter-driving"]
    },
    {
      id: "d4", date: "2026-12-08", shortDate: "8 Dec", weekday: "Tue",
      title: "Black sand, then east towards the glacier lagoon",
      subtitle: "Selfoss → Reynisfjara → Vík → Hof / Hnappavellir",
      phase: "outbound", km: [295, 310], driveNormal: [3.75, 4.25], driveWinter: [4.5, 5.5],
      pressure: "偏高", sleepId: "stay-glacier", pointIds: ["selfoss", "reynisfjara", "vik", "hnappavellir"],
      summary: "The black-sand beach is today's main sightseeing stop; the rest of the day is mainly an eastbound transfer. Save the two major waterfalls for the return journey and stay west of the glacier lagoon to make tomorrow's ice-cave meeting point easier to reach.",
      roadNumbers: ["1", "215"],
      timeline: [
        { time: "Around 09:00", title: "Check out and leave Selfoss", text: "Prepare simple food in advance. Before leaving, check access at the black-sand beach and roads on the eastern South Coast.", pointId: "selfoss" },
        { time: "Around 11:15–12:00", title: "Reynisfjara's open viewing area", text: "Allow around 45 minutes, using the upper viewing areas that are open on the day. Erosion may restrict access to the beach or basalt columns; follow current fences, notices and local instructions.", pointId: "reynisfjara" },
        { time: "Around 12:15–13:00", title: "Lunch and supplies in Vík", text: "Top up fuel, food and drinking water before continuing east. You pass through Vík today and stay here on the return journey.", pointId: "vik" },
        { time: "Afternoon", title: "Continue east along Route 1", text: "Focus on reaching the next base. Canyons, long glacier hikes and the plane wreck are not fixed activities for today." },
        { time: "Around 16:30–17:30", title: "Check in west of the glacier lagoon", text: "Hof / Hnappavellir is the accommodation search area. Confirm tomorrow's ice-cave meeting point, departure time, advance check-in requirement and breakfast arrangements.", pointId: "hnappavellir" },
        { time: "Evening", title: "Dinner at your stay and rest", text: "Accommodation is spread out in this area. Arrange a hotel dinner or bring food before arrival, rather than starting a restaurant search after the long drive." }
      ],
      tips: ["The last part of the drive to the hotel is likely to be after sunset. Do not assume the entire transfer will be in daylight.", "An official February 2026 notice restricted access to the upper sand ridge because of coastal erosion. Recheck the actual open area in December; access to the basalt columns is not guaranteed.", "If the black-sand beach is unsuitable for a stop, consider visiting when leaving Vík on 10 December and shorten other stops that day.", "Hof is different from Höfn farther east. This itinerary does not require a hotel in Höfn."],
      tradeoff: "Nearly 300 kilometres of driving today makes tomorrow's transfer to the ice-cave meeting point shorter. Keep sightseeing selective.",
      sourceIds: ["selfoss-glacier-distance", "winter-driving", "fosshotel-glacier", "reynisfjara-safety"]
    },
    {
      id: "d5", date: "2026-12-09", shortDate: "9 Dec", weekday: "Wed",
      title: "Ice caves and floating ice, then back to Vík",
      subtitle: "West of the glacier lagoon → Jökulsárlón → Diamond Beach → Vík",
      phase: "return", km: [220, 235], driveNormal: [2.75, 3.25], driveWinter: [3.5, 4.5],
      pressure: "偏高", sleepId: "stay-vik", pointIds: ["hnappavellir", "jokulsarlon", "ice-cave", "diamond-beach", "vik"],
      summary: "Prioritise a standard morning guided ice-cave tour, then visit the lagoon and Diamond Beach before starting west towards Vík in the afternoon. The confirmed ice-cave departure is the key to making today's timings work.",
      roadNumbers: ["1"],
      timeline: [
        { time: "Around 08:15–09:15", title: "Check out and drive to the meeting area", text: "This is an illustrative schedule for a morning tour. Work backwards from the booked meeting point and departure time, allowing extra time for parking and check-in.", pointId: "jokulsarlon" },
        { time: "Morning; departure to be confirmed", title: "Join a guided ice-cave tour", text: "Allow about 2.5–4 hours for a standard tour, including the operator's vehicle transfers, equipment and glacier activity. The cave or blue-ice features visited depend on safe conditions that day.", pointId: "ice-cave" },
        { time: "After the tour", title: "Lagoon views and a simple meal", text: "Allow about 30–45 minutes to see ice floating on the lagoon. If the tour finishes late, shorten the stop rather than the driving allowance.", pointId: "jokulsarlon" },
        { time: "Within roughly 13:30–14:30", title: "Diamond Beach", text: "Visit along with the lagoon while natural light is available, spending about 20–30 minutes. The amount and shape of ice on the beach change with sea conditions.", pointId: "diamond-beach" },
        { time: "Around 14:00–15:00", title: "Start west towards Vík", text: "The lagoon is about 191 kilometres from Vík. Focus on completing the transfer, with rest stops as needed." },
        { time: "Around 17:30–19:00", title: "Check in at Vík", text: "The later part of the drive is likely to be dark. Arrange check-in and dinner in advance; tomorrow's waterfall visits start from Vík.", pointId: "vik" }
      ],
      tips: ["This sample schedule assumes a standard morning ice-cave tour. Availability for a particular departure has not been confirmed.", "The guide's glacier transfer is separate from the rental-car route. Do not drive your rental car onto the glacier.", "If the only suitable tour is very late or much longer, reassess the return-night base and the day's activities instead of forcing this timetable.", "Today combines an activity with a long return drive. The 3.5–4.5-hour driving allowance is not the total length of the day."],
      tradeoff: "Staying in Vík makes more progress west than staying in Kirkjubæjarklaustur, giving 10 December a smoother waterfall-and-capital route.",
      sourceIds: ["ice-cave-2026", "vik-jokulsarlon-distance", "winter-driving"]
    },
    {
      id: "d6", date: "2026-12-10", shortDate: "10 Dec", weekday: "Thu",
      title: "Two waterfalls on the way back to Reykjavík",
      subtitle: "Vík → Skógafoss → Seljalandsfoss → Reykjavík",
      phase: "return", km: [190, 200], driveNormal: [2.5, 3], driveWinter: [3, 4],
      pressure: "中等", sleepId: "stay-reyk", pointIds: ["vik", "skogafoss", "seljalandsfoss", "reykjavik"],
      summary: "Head west from Vík to visit the two major waterfalls before reaching Reykjavík. Start a two-night stay this evening and leave time to rest before tomorrow's Snæfellsnes trip.",
      roadNumbers: ["1", "Waterfall car-park access roads"],
      timeline: [
        { time: "Around 09:30", title: "Check out and leave Vík", text: "If you did not visit the black-sand beach on 8 December, you can consider it first, with shorter stops elsewhere today.", pointId: "vik" },
        { time: "Around 10:15–11:15", title: "Skógafoss", text: "Allow about 45–60 minutes for the waterfall's front view and open viewing areas. The full stair climb and upstream hike are not fixed activities.", pointId: "skogafoss" },
        { time: "Around 12:00–12:45", title: "Seljalandsfoss", text: "Allow about 30–45 minutes to view the falls from the front and open paths. Walking behind the waterfall is not a required winter experience.", pointId: "seljalandsfoss" },
        { time: "Around 13:00–13:45", title: "Lunch and supplies", text: "Plan around facilities actually open along the route, then continue towards the capital." },
        { time: "Around 15:30–17:00", title: "Check in at Reykjavík", text: "Stay at the same hotel for two nights. Confirm its parking or a nearby car park; leave luggage at the hotel for tomorrow's round trip.", pointId: "reykjavik" },
        { time: "Evening", title: "Dinner, a short walk and rest", text: "Tomorrow is an early start and late return, so keep the evening light. Adjust the Snæfellsnes stop order to the weather." }
      ],
      tips: ["Both waterfalls lie along the westbound return route, avoiding a separate trip back out from Reykjavík.", "City parking arrangements depend on the hotel and street. Check them when booking accommodation.", "If delays build up, prioritise reaching the next base and getting some rest."],
      tradeoff: "Putting the western South Coast sights on the return journey keeps the eastbound day on 8 December from becoming too crowded and eases the day before Snæfellsnes.",
      sourceIds: ["vik-reykjavik-distance", "winter-driving", "storm-hotel"]
    },
    {
      id: "d7", date: "2026-12-11", shortDate: "11 Dec", weekday: "Fri",
      title: "A day trip around Snæfellsnes",
      subtitle: "Reykjavík → Búðir → Arnarstapi → Kirkjufell → Reykjavík",
      phase: "daytrip", km: [420, 435], driveNormal: [6, 7], driveWinter: [7, 8],
      pressure: "最高", sleepId: "stay-reyk", pointIds: ["reykjavik", "budir", "arnarstapi", "kirkjufell"],
      summary: "Leave luggage at your Reykjavík hotel and focus on three core stops: the black church, Arnarstapi's coast and Kirkjufell. This is roughly a 10–12-hour day and the most demanding driving day of the trip.",
      roadNumbers: ["1", "54", "574 (Arnarstapi access section)", "56"],
      routeAlternatives: [
        { label: "Core route", roads: "Road 54 across Fróðárheiði between the south and north coasts; return via Road 56", km: [420, 435], note: "Parts of this route cross higher ground. Use it only if the day's wind, snow and road conditions are suitable." },
        { label: "Western loop", roads: "Road 574 around the western end, joining the north coast via Hellissandur", km: [440, 460], note: "This adds about 20–30 kilometres, plus driving and stopping time. It is not guaranteed to be open or automatically safer." }
      ],
      daylight: { place: "Grundarfjörður / near Kirkjufell", sunrise: "11:28", sunset: "15:23", civilDawn: "10:05", civilDusk: "16:46", note: "Twilight is not the same as full daylight after sunrise." },
      timeline: [
        { time: "Around 08:00", title: "Leave your Reykjavík hotel", text: "Check Roads 1, 54, 56 and 574 before deciding whether to follow the full-day route. The first driving section is before sunrise.", pointId: "reykjavik" },
        { time: "On the way", title: "A short break in Borgarnes", text: "Buy supplies or use the toilets as needed. Keep the stop brief to preserve natural light on the peninsula." },
        { time: "Around 11:00–11:30", title: "Búðir black church", text: "Spend about 20–30 minutes on the church exterior and surrounding landscape. The plan does not depend on the interior being open.", pointId: "budir" },
        { time: "Around 12:00–12:45", title: "Arnarstapi coast", text: "Choose open short paths and coastal rock formations, allowing about 40–50 minutes. A full return hike to Hellnar is not planned.", pointId: "arnarstapi" },
        { time: "Around 12:45–13:15", title: "A simple meal and a road check for the north coast", text: "Choose the central crossing or western loop according to actual road conditions. If conditions are unsuitable, reduce the remaining stops and return." },
        { time: "Around 14:15–15:00", title: "Kirkjufell", text: "Focus on the mountain and open viewpoints, allowing about 30–45 minutes. Respect closures if the waterfall surroundings are icy.", pointId: "kirkjufell" },
        { time: "Around 15:00–16:00", title: "Begin the return journey", text: "Allow enough time to cross the peninsula and drive back to the capital, with short rests as needed." },
        { time: "Around 19:00–20:00", title: "Return to the same hotel", text: "The return time depends on the chosen route, wind, snow and breaks. There is no new hotel check-in to arrange.", pointId: "reykjavik" }
      ],
      tips: ["Fewer accommodation changes simplify check-in, but the Snæfellsnes day still involves a long round-trip drive.", "Removing western-end sights mainly saves time spent stopping. The core route is still around 420–435 kilometres.", "Roads 570/F575 are not December self-drive shortcuts.", "If the weather does not support a long drive, keep the Reykjavík accommodation and choose city or nearby alternatives. The core stops are not obligations in unsuitable conditions."],
      tradeoff: "Two final nights in Reykjavík mean one early-start, late-return Snæfellsnes day. Follow the three core stops when weather permits.",
      sourceIds: ["west-map", "snaefellsjokull-faq", "snaefellsnes-daylight", "winter-driving"]
    },
    {
      id: "d8", date: "2026-12-12", shortDate: "12 Dec", weekday: "Sat",
      title: "A morning in the capital, then return the car",
      subtitle: "Central Reykjavík → Car return at KEF → 18:05 flight",
      phase: "departure", km: [50, 60], driveNormal: [0.75, 1], driveWinter: [1, 1.5],
      pressure: "轻松", sleepId: null, pointIds: ["reykjavik", "hallgrimskirkja", "laugavegur", "harpa", "kef-airport"],
      summary: "Keep the morning for central Reykjavík, linking the church, shopping streets and Harpa area with short walks. Start towards the airport at around 13:00, returning the car before entering the terminal.",
      roadNumbers: ["City streets", "41"],
      timeline: [
        { time: "Around 09:30", title: "Breakfast and check-out", text: "Arrange luggage and parking according to the hotel's rules. Keep the walking itinerary in the city centre, without adding a long detour.", pointId: "reykjavik" },
        { time: "Around 10:00–11:00", title: "The church and shopping streets", text: "See Hallgrímskirkja from outside and walk around Laugavegur. Decide on the tower, interiors or shopping according to actual opening hours and time available.", pointId: "hallgrimskirkja" },
        { time: "Around 11:00–12:00", title: "Harpa and the harbour area", text: "Choose a short city walk and photo stops. The plan does not assume that indoor attractions will be open at a fixed time.", pointId: "harpa" },
        { time: "Around 12:00–12:45", title: "Lunch and collect the car", text: "Leave a margin for the airport transfer. Confirm the refuelling stop, car-return location and any shuttle requirement in advance." },
        { time: "13:00 is the default city departure", title: "Head towards KEF", text: "Use 13:30 only if roads are clear and the car-return and shuttle timings are known. Finish sightseeing earlier if road conditions deteriorate." },
        { time: "Around 14:15–14:45", title: "Refuel, return the car and take any shuttle", text: "Allow separate time for these steps; they are not included in the road-driving estimate. Follow the rental company's actual return procedure." },
        { time: "Target: 15:00–15:15", title: "Enter the terminal", text: "The airport recommends arriving 2.5–3 hours before departure. Allow time for baggage, security and boarding.", pointId: "kef-airport" },
        { time: "18:05", title: "Return flight departs", text: "Follow the airline's final flight and boarding information.", pointId: "kef-airport" }
      ],
      tips: ["This plan gives Reykjavík the evening of 10 December and the departure morning, not two full city-sightseeing days.", "Hot springs, long museum visits and distant excursions are not fixed activities on the final day."],
      tradeoff: "A later return flight leaves a morning in the city while treating car return and airport procedures as separate blocks of time.",
      sourceIds: ["kef-checkin"]
    }
  ],
  stays: [
    {
      id: "stay-kef", name: "Keflavík", localName: "Keflavík", pointId: "keflavik", lat: 64.0017, lng: -22.5543,
      checkIn: "2026-12-05", checkOut: "2026-12-06", nights: 1,
      status: "正在预定", hotelName: "", rationale: "Keep the arrival-evening drive short, then start exploring the Reykjanes peninsula the next day.",
      searchArea: "Central Keflavík or the harbour area, or easily accessible accommodation near the airport.",
      bookingChecks: ["Late-arrival check-in procedure", "Parking location", "Breakfast time or a self-catering alternative"],
      examples: [{ name: "Hotel Berg", url: "https://www.hotelberg.is/", note: "Near Keflavík harbour, included only as a location reference. Availability and prices for the travel dates have not been checked." }],
      sourceIds: ["hotel-berg"]
    },
    {
      id: "stay-selfoss", name: "Selfoss", localName: "Selfoss", pointId: "selfoss", lat: 63.9330, lng: -20.9971,
      checkIn: "2026-12-06", checkOut: "2026-12-08", nights: 2,
      status: "正在预定", hotelName: "", rationale: "Arrive after the peninsula on 6 December, take a luggage-free Golden Circle day trip on the 7th, then head east along Route 1 on the 8th. Use the same property for both nights.",
      searchArea: "Prioritise Selfoss town near food and supplies. Check the actual map location rather than relying on a broad postal address.",
      bookingChecks: ["The same room type for both nights and parking arrangements", "Whether you need a kitchen or breakfast", "Whether the actual address is in or near the town"],
      examples: [{ name: "Hotel Selfoss", url: "https://www.hotelselfoss.is/", note: "A location reference within Selfoss. Prices for your party size, room type and dates have not been checked." }],
      sourceIds: ["south-towns", "hotel-selfoss"]
    },
    {
      id: "stay-glacier", name: "West of the glacier lagoon", localName: "Hof / Hnappavellir", pointId: "hnappavellir", lat: 63.90005, lng: -16.60809,
      checkIn: "2026-12-08", checkOut: "2026-12-09", nights: 1,
      status: "正在预定", hotelName: "", rationale: "Complete the long eastbound drive in advance of a morning ice-cave tour meeting around Jökulsárlón on 9 December.",
      searchArea: "Hof–Hnappavellir, close to Route 1. The map pin marks only a search area. Hof is not Höfn farther east.",
      bookingChecks: ["Driving time to the actual ice-cave meeting point", "Hotel dinner and breakfast times", "Late check-in and the access road", "Whether the selected room has a private bathroom"],
      examples: [{ name: "Fosshotel Glacier Lagoon", url: "https://www.islandshotel.is/hotels-in-iceland/fosshotel-glacier-lagoon/", note: "In Hnappavellir, between Skaftafell and Jökulsárlón, with a restaurant and parking. It is not on the lagoon shore, and availability has not been confirmed." }],
      sourceIds: ["fosshotel-glacier", "ice-cave-2026"]
    },
    {
      id: "stay-vik", name: "Vík", localName: "Vík í Mýrdal", pointId: "vik", lat: 63.4186, lng: -19.0060,
      checkIn: "2026-12-09", checkOut: "2026-12-10", nights: 1,
      status: "正在预定", hotelName: "", rationale: "Return west after the ice cave and glacier lagoon on 9 December and finish the day here. On the 10th, visit the two waterfalls on the western South Coast before reaching Reykjavík.",
      searchArea: "Prioritise Vík town or immediately nearby accommodation with straightforward access to Route 1.",
      bookingChecks: ["Check-in procedure for an expected evening arrival", "Dinner opening hours or food to bring", "Parking and bathroom type"],
      examples: [{ name: "Hótel Vík í Mýrdal", url: "https://www.stayinvik.is/", note: "A location reference for accommodation in Vík. The operator offers several accommodation products; check the actual room type, price and availability separately." }],
      sourceIds: ["stay-in-vik"]
    },
    {
      id: "stay-reyk", name: "Reykjavík", localName: "Reykjavík", pointId: "reykjavik", lat: 64.1435, lng: -21.9168,
      checkIn: "2026-12-10", checkOut: "2026-12-12", nights: 2,
      status: "正在预定", hotelName: "", rationale: "Stay for two nights after arriving on 10 December. Visit Snæfellsnes on the 11th, then explore the city centre on the 12th before driving directly to the airport to return the car.",
      searchArea: "Prioritise the eastern city centre around Laugavegur / Hlemmur, or somewhere within walking distance of the centre with clear parking arrangements.",
      bookingChecks: ["Parking cost for both nights, access and whether a space is guaranteed", "Luggage and parking arrangements after check-out on 12 December", "Early departures, late returns and breakfast times"],
      examples: [{ name: "Storm Hotel by Keahotels", url: "https://www.keahotels.is/storm-hotel", note: "A location reference in the eastern city centre. The official site states that free parking is limited; a room booking does not guarantee a parking space." }],
      sourceIds: ["storm-hotel"]
    }
  ],
  essentials: [
    {
      id: "read-map", title: "How to read this map",
      body: "Trip inclusion and winter access are separate layers of information. Planned stops, optional stops along the route and island-wide reference points have different markers. Winter access separately indicates usual winter self-drive access, conditional access, a guide requirement, or places unsuitable for ordinary winter self-driving.",
      items: ["Select a sight for suggested visit length, related dates and winter restrictions.", "Select a daily route for the full day's plan. Use the date filter to separate overlapping roads.", "Accommodation pins show the current search areas; all bookings are in progress.", "Optional stops are substitutes or additions when time allows, not a promise that they can all be visited in one day."]
    },
    {
      id: "road-check", title: "Three checks before setting off each day",
      body: "Access categories are for planning; whether a road is open in December must be checked on the day. Even main roads with winter service can close temporarily. Four-wheel drive does not remove the risk of skidding on ice.",
      items: ["Check road opening and surface conditions first, then wind and snow forecasts and travel alerts.", "Change or cancel a section if roads or weather are unsuitable. Do not make up time simply to reach a hotel or fixed sightseeing stop."],
      links: [{ label: "Road and surface conditions · Umferðin", url: "https://umferdin.is/en" }, { label: "Weather and wind · Icelandic Met Office", url: "https://en.vedur.is/" }, { label: "Travel alerts · SafeTravel", url: "https://safetravel.is/" }],
      sourceIds: ["winter-driving"]
    },
    {
      id: "winter-light", title: "Save natural light for the sights",
      body: "December days are short, so this plan includes departures before sunrise and transfers after sunset. In particular, keep driving and sightseeing times separate for the eastbound drive on 8 December, the return after the ice cave on the 9th, and the Snæfellsnes round trip on the 11th.",
      items: ["Near Kirkjufell on 11 December, sunrise is 11:28 and sunset 15:23; the civil-twilight window is approximately 10:05–16:46.", "Twilight may allow some outdoor viewing, but light and path conditions differ from full daylight.", "Treat the northern lights as an extra near your accommodation when energy and weather allow, without adding long late-night drives to chase them."],
      sourceIds: ["snaefellsnes-daylight"]
    },
    {
      id: "booking-order", title: "Bookings to settle first",
      body: "First confirm the meeting point and duration of a morning ice-cave tour on 9 December, then check the location of the previous night's stay west of the lagoon. Fill in the other four accommodation bases next.",
      items: ["Ice cave: prioritise a standard morning tour. The exact cave or blue-ice features depend on the day's conditions.", "Selfoss and Reykjavík: book two consecutive nights at the same property in each town.", "Southeast Iceland and Vík: confirm dinner, late check-in and parking together.", "Prices, availability, cancellation terms and final hotel names remain unconfirmed. Hotel examples on the map are location references only."],
      sourceIds: ["ice-cave-2026"]
    },
    {
      id: "when-delayed", title: "What to remove first if delayed",
      body: "Reduce extra side roads and long walks first, protecting essential transfers and rest. Even core sights are conditional on suitable weather.",
      items: ["6 December: leave out optional lighthouse, cliff and Blue Lagoon stops first.", "7 December: focus on the three Golden Circle core sights instead of adding every hot spring and side-route waterfall.", "8 December: if the black-sand beach is unsuitable, consider it when leaving Vík on 10 December.", "9 December: work around the booked ice-cave time and available light, shortening the lagoon stop. Reassess the evening transfer if the activity is seriously delayed.", "11 December: prioritise the three core stops; shorten the route or switch to Reykjavík alternatives if weather requires."]
    },
    {
      id: "shore-ice", title: "Coasts and icy paths",
      body: "At black-sand beaches and coastal viewpoints, follow warnings and the actual open areas. At waterfalls, stairs and viewing platforms, decide how far to walk according to the day's ice conditions.",
      items: ["At Reynisfjara, stay away from the waterline and do not cross restrictions for a photograph.", "The path behind Seljalandsfoss is not a required winter activity on this trip.", "Access glaciers and natural ice caves through qualified guided tours. Do not extend the rental-car route onto a glacier."],
      links: [{ label: "SafeTravel local and regional alerts", url: "https://safetravel.is/" }],
      sourceIds: ["reynisfjara-safety", "ice-cave-2026"]
    },
    {
      id: "packing", title: "Equipment for this particular route",
      body: "Prepare for wind, rain, snow, icy paths and short sightseeing stops outside the car. Follow the operator's requirements for ice-cave equipment.",
      items: ["A windproof and waterproof outer layer, warm mid-layer, hat and warm waterproof gloves.", "Waterproof footwear with suitable grip. Use traction aids for paths and ice-cave equipment according to local or guide instructions.", "Offline maps, charging cables, a power bank, drinking water and simple food for the car.", "Save hotel late-arrival instructions, the rental assistance number and ice-cave meeting details in advance. Call 112 in an emergency."],
      sourceIds: ["winter-driving", "ice-cave-2026"]
    },
    {
      id: "airport-return", title: "Departure-day timing",
      body: "The flight on 12 December departs at 18:05. The default is to leave Reykjavík at around 13:00 and aim for the terminal at 15:00–15:15. Allow separate time for returning the rental car and any shuttle.",
      items: ["Keep city sightseeing in the morning and avoid adding a distant excursion before departure.", "The car-return location may not be at the terminal. Confirm its actual address and shuttle arrangements in advance.", "Finish city sightseeing earlier if weather or roads deteriorate."],
      sourceIds: ["kef-checkin"]
    }
  ],
  sources: [
    { id: "winter-driving", title: "SafeTravel · Winter driving", url: "https://safetravel.is/driving/winter-driving/", checked: "2026-10-26", note: "Winter driving allowances, changing weather, vehicle advice and road-information links. It does not guarantee that a road will be open on a future date." },
    { id: "reykjanes-kef", title: "KEF · Exploring the Reykjanes peninsula", url: "https://www.kefairport.com/news/7-things-to-do-around-kef", checked: "2026-10-26", note: "The geographical relationship between the Bridge Between Continents, Gunnuhver and nearby sights. The day's full schedule is planned separately in this guide." },
    { id: "blue-lagoon-access", title: "Blue Lagoon · Seismic activity and access", url: "https://www.bluelagoon.com/seismic-activity", checked: "2026-10-26", note: "Access updates relating to the Blue Lagoon and volcanic activity. Current status does not establish December conditions." },
    { id: "golden-circle", title: "Visit South Iceland · The Golden Circle", url: "https://www.south.is/en/destinations/travel-routes/the-golden-circle", checked: "2026-10-26", note: "Core Golden Circle sights, winter travel and main-road information." },
    { id: "south-towns", title: "Visit South Iceland · Towns & Villages", url: "https://www.south.is/en/destinations/towns", checked: "2026-10-26", note: "Selfoss services, food and accommodation, supporting its practical use as a base." },
    { id: "ice-cave-2026", title: "Local Guide · 2026–2027 Ice Cave Tour", url: "https://localguide.is/ice-cave-tour", checked: "2026-10-26", note: "Meets at Jökulsárlón, with a standard duration of about 2.5–4 hours. Used only to illustrate scheduling; this does not mean the tour has been booked." },
    { id: "reynisfjara-safety", title: "Icelandic Tourist Board · Reynisfjara coastal-erosion notice", url: "https://www.ferdamalastofa.is/en/news/category/1/reynisfjara-recent-changes-due-to-coastal-erosion", checked: "2026-10-26", note: "The notice dated 24 February 2026 described access limited to the upper sand ridge, with no walking access in front of the basalt columns and erosion affecting existing warning infrastructure. It does not establish the final access conditions for December." },
    { id: "west-map", title: "Visit West Iceland · Official map and distance table", url: "https://www.west.is/static/files/_blob/markadsstofa.vesturland.2023.kort.1.pdf", checked: "2026-10-26", note: "Reykjavík–Borgarnes: 74 km; Reykjavík–Arnarstapi: 192 km; Reykjavík–Grundarfjörður: 177 km. The full-day route is estimated by adding its individual sections." },
    { id: "snaefellsjokull-faq", title: "Snæfellsjökull National Park · FAQ", url: "https://snaefellsjokull.is/en/education/faq/", checked: "2026-10-26", note: "Main roads, winter information, seasonal access on Roads 570/F575, and the scale of the Arnarstapi–Hellnar walk." },
    { id: "snaefellsnes-daylight", title: "Timeanddate · Grundarfjörður, December 2026", url: "https://www.timeanddate.com/sun/@3416839?month=12&year=2026", checked: "2026-10-26", note: "11 December: sunrise 11:28, sunset 15:23, civil-twilight window 10:05–16:46." },
    { id: "kef-checkin", title: "KEF Airport · Check-in information", url: "https://www.kefairport.com/check-in-information", checked: "2026-10-26", note: "The airport recommends arriving 2.5–3 hours before departure. Allow extra time for car return and any shuttle." },
    { id: "selfoss-thingvellir-distance", title: "Route-distance reference · Selfoss → Þingvellir", url: "https://www.rome2rio.com/s/Selfoss/%C3%9Eingvellir", checked: "2026-10-26", note: "About 47.7 km by road and 44 minutes in ordinary conditions. This is not a live December driving time." },
    { id: "selfoss-glacier-distance", title: "Route-distance reference · Selfoss → Hnappavellir", url: "https://www.rome2rio.com/s/Selfoss/Fosshotel-Glacier-Lagoon-Hnappavellir", checked: "2026-10-26", note: "About 292.5 km by road and 3 hours 43 minutes in ordinary conditions. This guide separately allows for the black-sand beach detour and slower winter driving." },
    { id: "vik-jokulsarlon-distance", title: "Route-distance reference · Vík → Jökulsárlón", url: "https://www.rome2rio.com/s/Vik-Iceland/J%C3%B6kuls%C3%A1rl%C3%B3n", checked: "2026-10-26", note: "About 191.2 km by road and 2 hours 25 minutes in ordinary conditions, excluding an ice-cave tour or lagoon sightseeing." },
    { id: "vik-reykjavik-distance", title: "Route-distance reference · Vík → Reykjavík", url: "https://www.rome2rio.com/s/Vik-Iceland/Reykjav%C3%ADk", checked: "2026-10-26", note: "About 183.7 km by road and 2 hours 24 minutes in ordinary conditions. This guide separately includes the waterfall car-park access roads." },
    { id: "hotel-berg", title: "Hotel Berg · Official website", url: "https://www.hotelberg.is/", checked: "2026-10-26", note: "A location reference in Keflavík. Availability and prices for the travel dates have not been checked." },
    { id: "hotel-selfoss", title: "Hotel Selfoss · Official website", url: "https://www.hotelselfoss.is/", checked: "2026-10-26", note: "An accommodation location reference in Selfoss. Availability and prices for the travel dates have not been checked." },
    { id: "fosshotel-glacier", title: "Fosshotel Glacier Lagoon · Íslandshótel", url: "https://www.islandshotel.is/hotels-in-iceland/fosshotel-glacier-lagoon/", checked: "2026-10-26", note: "Hnappavellir location, restaurant and parking. Availability and prices for the travel dates have not been checked." },
    { id: "stay-in-vik", title: "Stay in Vík · Official website", url: "https://www.stayinvik.is/", checked: "2026-10-26", note: "An accommodation location reference in Vík. Availability and prices for the travel dates have not been checked." },
    { id: "storm-hotel", title: "Storm Hotel · Keahotels", url: "https://www.keahotels.is/storm-hotel", checked: "2026-10-26", note: "A location reference in Reykjavík. The official site states that free parking is limited. Availability and prices for the travel dates have not been checked." }
  ]
};
