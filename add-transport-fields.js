const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/resources/traveldata.json');
const raw = fs.readFileSync(filePath, 'utf8');

// The JSON file may contain comments (// ...) at the top as seen earlier; try to strip leading // comments
let jsonText = raw;
// Remove JS-style comments at start of file
jsonText = jsonText.replace(/^[\s\S]*?\{/m, (match) => match);

let data;
try {
  data = JSON.parse(jsonText);
} catch (err) {
  console.error('JSON parse error:', err.message);
  process.exit(1);
}

let added = 0;

if (Array.isArray(data.trips)) {
  data.trips.forEach(trip => {
    if (Array.isArray(trip.cities)) {
      trip.cities.forEach(city => {
        if (Array.isArray(city.days)) {
          city.days.forEach(day => {
            if (Array.isArray(day.activities)) {
              day.activities.forEach(act => {
                if (act && act.type === 'transport') {
                  if (!Object.prototype.hasOwnProperty.call(act, 'from')) { act.from = ''; added++; }
                  if (!Object.prototype.hasOwnProperty.call(act, 'to')) { act.to = ''; added++; }
                  if (!Object.prototype.hasOwnProperty.call(act, 'distance')) { act.distance = 0; added++; }
                }
              });
            }
          });
        }
      });
    }
  });
}

fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
console.log('Done. Fields added or left unchanged. Total properties inserted:', added);

