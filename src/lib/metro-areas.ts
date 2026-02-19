/**
 * Metro area definitions used for clinic filtering across the public directory
 * and the clinic email campaign builder.
 *
 * Each entry maps a display name to the states it spans and the city names
 * commonly associated with it. Metro areas intentionally cross state lines
 * (e.g. New York Metro includes NY, NJ, CT).
 */
export const METRO_AREAS: Record<string, { states: string[]; cities: string[] }> = {
  "New York Metro":       { states: ["NY", "NJ", "CT"], cities: ["Manhattan", "Brooklyn", "Queens", "Bronx", "Staten Island", "Long Island", "The Hamptons", "White Plains", "Jersey City", "Hoboken", "Newark", "Stamford", "New York", "Yonkers"] },
  "Los Angeles":          { states: ["CA"],              cities: ["Los Angeles", "Beverly Hills", "Santa Monica", "West Hollywood", "Pasadena", "Burbank", "Long Beach", "Malibu", "Culver City", "Glendale", "Calabasas", "Manhattan Beach"] },
  "Chicago":              { states: ["IL"],              cities: ["Chicago", "Evanston", "Oak Park", "Naperville", "Schaumburg", "Highland Park", "Lake Forest", "Hinsdale", "Winnetka"] },
  "Dallas-Fort Worth":    { states: ["TX"],              cities: ["Dallas", "Fort Worth", "Plano", "Frisco", "Arlington", "McKinney", "Southlake", "Allen"] },
  "Houston":              { states: ["TX"],              cities: ["Houston", "The Woodlands", "Sugar Land", "Katy", "Pearland", "League City", "Cypress"] },
  "DC Metro":             { states: ["DC", "VA", "MD"], cities: ["Washington", "Arlington", "Alexandria", "Bethesda", "McLean", "Chevy Chase", "Tysons", "Reston", "Rockville"] },
  "SF Bay Area":          { states: ["CA"],              cities: ["San Francisco", "Oakland", "San Jose", "Palo Alto", "Berkeley", "Walnut Creek", "Mill Valley", "Sausalito", "Menlo Park", "Mountain View", "Los Gatos", "San Mateo"] },
  "Miami":                { states: ["FL"],              cities: ["Miami", "Miami Beach", "Coral Gables", "Fort Lauderdale", "Boca Raton", "West Palm Beach", "Aventura", "Key Biscayne"] },
  "Boston":               { states: ["MA"],              cities: ["Boston", "Cambridge", "Brookline", "Newton", "Wellesley", "Concord", "Lexington", "Salem", "Needham"] },
  "Phoenix":              { states: ["AZ"],              cities: ["Phoenix", "Scottsdale", "Paradise Valley", "Tempe", "Mesa", "Chandler", "Gilbert", "Peoria"] },
  "Seattle":              { states: ["WA"],              cities: ["Seattle", "Bellevue", "Kirkland", "Redmond", "Mercer Island", "Issaquah", "Bothell", "Edmonds"] },
  "Atlanta":              { states: ["GA"],              cities: ["Atlanta", "Decatur", "Alpharetta", "Roswell", "Marietta", "Sandy Springs", "Brookhaven"] },
  "Denver":               { states: ["CO"],              cities: ["Denver", "Boulder", "Littleton", "Englewood", "Greenwood Village", "Lone Tree", "Parker"] },
  "Tampa Bay":            { states: ["FL"],              cities: ["Tampa", "St. Petersburg", "Clearwater", "Sarasota", "Lakewood Ranch", "Brandon", "Wesley Chapel"] },
  "San Diego":            { states: ["CA"],              cities: ["San Diego", "La Jolla", "Del Mar", "Encinitas", "Carlsbad", "Coronado", "Chula Vista"] },
  "Nashville":            { states: ["TN"],              cities: ["Nashville", "Franklin", "Brentwood", "Murfreesboro", "Hendersonville"] },
  "Austin":               { states: ["TX"],              cities: ["Austin", "Round Rock", "Cedar Park", "Lakeway", "Dripping Springs"] },
  "Raleigh-Durham":       { states: ["NC"],              cities: ["Raleigh", "Durham", "Chapel Hill", "Cary", "Wake Forest", "Apex"] },
  "Las Vegas":            { states: ["NV"],              cities: ["Las Vegas", "Henderson", "Summerlin", "North Las Vegas"] },
  "Minneapolis-St. Paul": { states: ["MN"],              cities: ["Minneapolis", "St. Paul", "Edina", "Wayzata", "Minnetonka", "Bloomington", "Plymouth"] },
  "Portland":             { states: ["OR", "WA"],        cities: ["Portland", "Lake Oswego", "Beaverton", "West Linn", "Tigard", "Vancouver"] },
  "Charlotte":            { states: ["NC"],              cities: ["Charlotte", "Huntersville", "Cornelius"] },
}

export const METRO_AREA_NAMES = Object.keys(METRO_AREAS).sort()
