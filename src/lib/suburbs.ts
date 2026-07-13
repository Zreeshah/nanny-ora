/** Normalize a suburb string for matching: lowercase, strip diacritics/macrons,
 *  strip spaces & punctuation. So "Forrest Hill" / "forrest hill" / "Whangaparāoa"
 *  all compare cleanly. */
export function normSuburb(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");
}

/** Title-case a free-text suburb for display ("forrest hill" → "Forrest Hill"). */
export function titleCaseSuburb(s: string): string {
  return s.trim().split(/\s+/).map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
}

/** Master Auckland suburbs grouped by region — the source of truth for both the
 *  suggestion list AND region membership. Region keys match AUCKLAND_REGIONS.
 *  (Rodney/Hibiscus Coast fold into `north`; Franklin into `south`.) */
export const SUBURB_REGIONS: Record<string, string[]> = {
  central: [
    "Arch Hill", "Auckland Central (CBD)", "Balmoral", "Eden Terrace", "Epsom", "Grafton",
    "Greenlane", "Grey Lynn", "Herne Bay", "Kingsland", "Morningside", "Mount Albert",
    "Mount Eden", "Mount Roskill", "Mount Wellington", "Newmarket", "Newton", "One Tree Hill",
    "Onehunga", "Orakei", "Otahuhu", "Parnell", "Point Chevalier", "Ponsonby", "Remuera",
    "Royal Oak", "Saint Johns", "Saint Marys Bay", "Sandringham", "Three Kings", "Waterview",
    "Western Springs", "Westmere",
    "Ellerslie", "Freemans Bay", "Hillsborough", "Lynfield", "Penrose", "Oranga", "Te Papapa",
    "Owairaka", "Waikowhai", "Wesley", "Saint Lukes",
  ],
  north: [
    "Albany", "Bayswater", "Bayview", "Beach Haven", "Belmont", "Birkdale", "Birkenhead",
    "Browns Bay", "Campbells Bay", "Castor Bay", "Chatswood", "Devonport", "Fairview Heights",
    "Forrest Hill", "Glenfield", "Greenhithe", "Hauraki", "Hillcrest", "Long Bay", "Mairangi Bay",
    "Milford", "Murrays Bay", "Northcote", "Northcote Point", "Northcross", "Oteha", "Pinehill", "Rosedale",
    "Rothesay Bay", "Sunnynook", "Stanley Bay", "Stanley Point", "Takapuna", "Torbay",
    "Totara Vale", "Unsworth Heights", "Waiake", "Wairau Valley",
    // Rodney / Hibiscus Coast / Northwest
    "Coatesville", "Dairy Flat", "Gulf Harbour", "Helensville", "Hobsonville", "Huapai", "Kumeu",
    "Milldale", "Millwater", "Orewa", "Paremoremo", "Red Beach", "Redvale", "Riverhead",
    "Silverdale", "Stanmore Bay", "Taupaki", "Waimauku", "Wainui", "Whangaparāoa",
    "Waiwera", "Hatfields Beach", "Army Bay", "Manly", "Arkles Bay",
    "Tindalls Beach", "Warkworth", "Snells Beach", "Matakana", "Puhoi", "Wellsford",
    "Kaukapakapa", "Parakai", "Windsor Park", "Schnapper Rock", "Okura", "Waitoki",
  ],
  east: [
    "Beachlands", "Botany Downs", "Bucklands Beach", "Dannemora", "Eastern Beach", "Farm Cove",
    "Flat Bush", "Glendowie", "Golflands", "Half Moon Bay", "Highland Park", "Howick", "Maraetai",
    "Meadowlands", "Mellons Bay", "Mission Bay", "Ormiston", "Pakuranga", "Panmure",
    "Point England", "Shelly Park", "Stonefields", "Sunnyhills", "Whitford",
    "Botany", "Saint Heliers", "Kohimarama", "Meadowbank", "Glen Innes", "Tamaki", "Cockle Bay",
    "Northpark", "Point View", "Burswood", "Chapel Downs",
  ],
  south: [
    "Airport Oaks", "Alfriston", "Clover Park", "East Tamaki", "Favona", "Goodwood Heights",
    "Hillpark", "Manukau", "Mangere", "Mangere Bridge", "Mangere East", "Manurewa", "Otara",
    "Papatoetoe", "Randwick Park", "Takanini", "The Gardens", "Totara Heights", "Wattle Downs",
    "Weymouth",
    // Franklin
    "Bombay", "Drury", "Karaka", "Pahurehure", "Papakura", "Patumahoe", "Pukekohe", "Tuakau",
    "Waiuku",
    "Conifer Grove", "Opaheke", "Rosehill", "Clevedon", "Ardmore", "Ramarama", "Kingseat",
    "Waiau Pa", "Clarks Beach", "Glenbrook", "Buckland",
  ],
  west: [
    "Avondale", "Blockhouse Bay", "Glen Eden", "Glendene", "Green Bay", "Henderson",
    "Henderson Valley", "Kelston", "Laingholm", "Massey", "New Lynn", "New Windsor", "Oratia",
    "Ranui", "Sunnyvale", "Swanson", "Te Atatu Peninsula", "Te Atatu South", "Titirangi",
    "Waiatarua", "Waitakere",
    "Piha", "Karekare", "Bethells Beach", "Te Henga", "Huia", "Cornwallis", "Parau",
    "French Bay", "Wood Bay", "Western Heights", "McLaren Park", "Woodlands Park", "Konini",
    "Fruitvale", "Rosebank", "Waima",
  ],
};

/** Region umbrella terms — so a nanny typing "North Shore" gets a suggestion, not
 *  just specific suburbs. These resolve to regions via REGION_ALIASES, so the
 *  parent filter matches them too. */
export const AUCKLAND_REGION_LABELS: string[] = [
  "Central Auckland", "North Shore", "East Auckland", "South Auckland", "West Auckland",
];

/** Flat suggestion list for the suburb pickers (free entry still allowed). */
export const AUCKLAND_SUBURBS_FULL: string[] = Object.values(SUBURB_REGIONS).flat();

/** What the nanny forms suggest: region umbrellas first (so "North Shore" surfaces),
 *  then every specific suburb. Free entry still allowed for anything off-list. */
export const AUCKLAND_SUBURBS_ALL: string[] = [...AUCKLAND_REGION_LABELS, ...AUCKLAND_SUBURBS_FULL];

/** Region words people actually type → region key. Exact-normalized match only
 *  (substring on short words like "west" would wrongly catch "Westmere"). */
const REGION_ALIASES: Record<string, string> = {
  central: "central", centralauckland: "central", cbd: "central", aucklandcentral: "central",
  north: "north", northshore: "north", northauckland: "north", rodney: "north",
  hibiscuscoast: "north", northwest: "north", northwestauckland: "north",
  east: "east", eastauckland: "east", easternsuburbs: "east", easternbays: "east",
  south: "south", southauckland: "south", franklin: "south",
  west: "west", westauckland: "west", westernsuburbs: "west",
};

// normalized suburb -> region key
const NORM_SUBURB_REGION = new Map<string, string>();
for (const [region, subs] of Object.entries(SUBURB_REGIONS)) {
  for (const s of subs) NORM_SUBURB_REGION.set(normSuburb(s), region);
}

/** Region key of any location string, or null. Handles region words, exact
 *  suburbs, and messy free-text via substring ("Botany" ⊂ "Botany Downs" → east).
 *  ponytail: O(n) scan over ~160 suburbs — fine at this scale; index by prefix if
 *  the list ever grows huge. */
export function regionOf(raw: string): string | null {
  const n = normSuburb(raw);
  if (!n) return null;
  if (REGION_ALIASES[n]) return REGION_ALIASES[n];
  const exact = NORM_SUBURB_REGION.get(n);
  if (exact) return exact;
  for (const [snorm, region] of NORM_SUBURB_REGION) {
    if (n.includes(snorm) || snorm.includes(n)) return region;
  }
  return null;
}

const asRegionWord = (raw: string): string | null => REGION_ALIASES[normSuburb(raw)] ?? null;

/** Does a search term match a nanny location? Region-aware:
 *  - direct substring (exact/typo'd suburb, region-word ~ region-word)
 *  - a region SEARCH covers every suburb in it ("East Auckland" finds Botany)
 *  - a nanny covering a REGION covers a searched suburb ("Botany" finds a nanny
 *    who lists "East Auckland").
 *  Two specific suburbs only match directly — searching "Botany" won't return
 *  every other East Auckland suburb. */
export function suburbMatches(search: string, location: string): boolean {
  const s = normSuburb(search), l = normSuburb(location);
  if (!s || !l) return false;
  if (s.includes(l) || l.includes(s)) return true;
  const sRegion = asRegionWord(search);
  if (sRegion && regionOf(location) === sRegion) return true;
  const lRegion = asRegionWord(location);
  if (lRegion && regionOf(search) === lRegion) return true;
  return false;
}
