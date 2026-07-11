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

/** Master Auckland suburb list — the suggestion source for nannies picking their
 *  home suburb + areas covered. Free entry is still allowed for anything not here. */
export const AUCKLAND_SUBURBS_FULL: string[] = [
  // Central
  "Arch Hill", "Auckland Central (CBD)", "Balmoral", "Eden Terrace", "Epsom", "Grafton",
  "Greenlane", "Grey Lynn", "Herne Bay", "Kingsland", "Morningside", "Mount Albert",
  "Mount Eden", "Mount Roskill", "Mount Wellington", "Newmarket", "Newton", "One Tree Hill",
  "Onehunga", "Orakei", "Otahuhu", "Parnell", "Point Chevalier", "Ponsonby", "Remuera",
  "Royal Oak", "Saint Johns", "Saint Marys Bay", "Sandringham", "Three Kings", "Waterview",
  "Western Springs", "Westmere",
  // North Shore
  "Albany", "Bayswater", "Bayview", "Beach Haven", "Belmont", "Birkdale", "Birkenhead",
  "Browns Bay", "Campbells Bay", "Castor Bay", "Chatswood", "Devonport", "Fairview Heights",
  "Forrest Hill", "Glenfield", "Greenhithe", "Hauraki", "Hillcrest", "Long Bay", "Mairangi Bay",
  "Milford", "Northcote", "Northcote Point", "Northcross", "Oteha", "Pinehill", "Rosedale",
  "Rothesay Bay", "Sunnynook", "Stanley Bay", "Stanley Point", "Takapuna", "Torbay",
  "Totara Vale", "Unsworth Heights", "Waiake", "Wairau Valley",
  // East Auckland
  "Beachlands", "Botany Downs", "Bucklands Beach", "Dannemora", "Eastern Beach", "Farm Cove",
  "Flat Bush", "Glendowie", "Golflands", "Half Moon Bay", "Highland Park", "Howick", "Maraetai",
  "Meadowlands", "Mellons Bay", "Mission Bay", "Ormiston", "Pakuranga", "Panmure",
  "Point England", "Shelly Park", "Stonefields", "Sunnyhills", "Whitford",
  // South Auckland
  "Airport Oaks", "Alfriston", "Clover Park", "East Tamaki", "Favona", "Goodwood Heights",
  "Hillpark", "Manukau", "Mangere", "Mangere Bridge", "Mangere East", "Manurewa", "Otara",
  "Papatoetoe", "Randwick Park", "Takanini", "The Gardens", "Totara Heights", "Wattle Downs",
  "Weymouth",
  // West Auckland
  "Avondale", "Blockhouse Bay", "Glen Eden", "Glendene", "Green Bay", "Henderson",
  "Henderson Valley", "Kelston", "Laingholm", "Massey", "New Lynn", "New Windsor", "Oratia",
  "Ranui", "Sunnyvale", "Swanson", "Te Atatu Peninsula", "Te Atatu South", "Titirangi",
  "Waiatarua", "Waitakere",
  // Northwest / Rodney / Outer Auckland
  "Coatesville", "Dairy Flat", "Gulf Harbour", "Helensville", "Hobsonville", "Huapai", "Kumeu",
  "Milldale", "Millwater", "Orewa", "Paremoremo", "Red Beach", "Redvale", "Riverhead",
  "Silverdale", "Stanmore Bay", "Taupaki", "Waimauku", "Wainui", "Whangaparāoa",
  // Franklin (Southern Auckland)
  "Bombay", "Drury", "Karaka", "Pahurehure", "Papakura", "Patumahoe", "Pukekohe", "Tuakau",
  "Waiuku",
];
