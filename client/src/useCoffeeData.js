import { useState, useEffect } from 'react';
import Papa from 'papaparse';

export function useCoffeeData() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [countryData, setCountryData] = useState([]);

  useEffect(() => {
    const arabica_csv = "https://raw.githubusercontent.com/jldbc/coffee-quality-database/master/data/arabica_data_cleaned.csv"
    const robusta_csv = "https://raw.githubusercontent.com/jldbc/coffee-quality-database/refs/heads/master/data/robusta_data_cleaned.csv"

    Papa.parse(arabica_csv, {
      download: true,
      header: true,
      complete: function(aresults) {
        // compile database using extracted data
        const adatabase = aresults.data.map(bean => ({
          ...bean,
          Species: "Arabica"
        }));
        Papa.parse(robusta_csv, {
          download: true,
          header: true,
          complete: function(rresults) {
            // compile database using extracted data
            const rdatabase = rresults.data.map(bean => ({
              ...bean,
              Species: "Robusta",

              Acidity: firstValidValue(bean, ["Acidity", "Salt...Acid"]),
              Sweetness: firstValidValue(bean, ["Sweetness", "Bitter...Sweet"]),
              Aroma: firstValidValue(bean, ["Aroma", "Fragrance...Aroma"]),
              Flavor: firstValidValue(bean, ["Flavor"]),
              Aftertaste: firstValidValue(bean, ["Aftertaste"]),
              Body: firstValidValue(bean, ["Body"]),
              Balance: firstValidValue(bean, ["Balance"]),
              Uniformity: firstValidValue(bean, ["Uniformity", "Uniform.Cup"]),
              "Cup Cleanliness": firstValidValue(bean, ["Cup Cleanliness", "Clean.Cup"]),
              Moisture: firstValidValue(bean, ["Moisture"]),
              Defects: firstValidValue(bean, ["Defects", "Category.One.Defects", "Category.Two.Defects"]),
            }));

            const mergedData = [...adatabase, ...rdatabase];
            const processed = processData(mergedData);

            setCountryData(processed);
            setLoading(false);
          },
          error: function(err) {
            setError(err.message);
            setLoading(false);
          }
        });
      },
      error: function(err) {
        setError(err.message);
        setLoading(false);
      }
    });
  }, []);

  return { loading, error, countryData };
}

//country coordinates mapping
const COUNTRY_COORDS = {
  "Brazil": [-14.235, -51.925],
  "Colombia": [4.571, -74.297],
  "Ethiopia": [9.145, 40.489],
  "Guatemala": [15.783, -90.230],
  "Mexico": [23.634, -102.552],
  "Kenya": [-0.023, 37.906],
  "Costa Rica": [9.748, -83.753],
  "Honduras": [15.200, -86.241],
  "Peru": [-9.190, -75.015],
  "Indonesia": [-0.789, 113.921],
  "Taiwan": [23.697, 120.961],
  "United States (Hawaii)": [19.896, -155.582],
  "Uganda": [1.373, 32.290],
  "Nicaragua": [12.865, -85.207],
  "China": [35.861, 104.195],
  "Thailand": [15.870, 100.993],
  "Tanzania, United Republic Of": [-6.369, 34.888],
  "El Salvador": [13.794, -88.896],
  "Panama": [8.538, -80.783],
  "Ecuador": [-1.831, -78.183],
  "United States (Puerto Rico)": [18.221, -66.590],
  "Burundi": [-3.373, 29.918],
  "Papua New Guinea": [-6.314, 143.955],
  "Haiti": [18.971, -72.285],
  "Malawi": [-13.254, 34.301],
  "Laos": [19.856, 102.495],
  "Myanmar": [21.914, 95.956],
  "Zambia": [-13.133, 27.849],
  "Mauritius": [-20.348, 57.552],
  "Rwanda": [-1.940, 29.873],
  "Cote d?Ivoire": [7.540, -5.547],
  "Philippines": [12.879, 121.774],
  "India": [20.593, 78.962],
  "Vietnam": [14.058, 108.277],
  "Japan": [36.204, 138.252]
};

function processData(data) {
  const countries = {};
  
  //group samples by country
  data.forEach(row => {
    const country = row['Country.of.Origin'];
    if (!country) return;
    
    if (!countries[country]) {
      countries[country] = {
        name: country,
        samples: [],
        scores: [],
        metrics: {
          Aroma: [],
          Flavor: [],
          Acidity: [],
          Sweetness: [],
          Aftertaste: [],
          Body: [],
          Balance: [],
          Uniformity: [],
          Moisture: [],
          "Cup Cleanliness": [],
          Defects: [],
        },
        varieties: new Set(),
        processingMethods: new Set()
      };
    }
    
    //add score if valid
    const score = parseFloat(row['Total.Cup.Points']);
    if (!isNaN(score)) countries[country].scores.push(score);

    // parse and add flavor metrics
    const aroma = parseFloat(row.Aroma);
    if (!isNaN(aroma)) countries[country].aromas.push(aroma);

    const flavor = parseFloat(row.Flavor);
    if (!isNaN(flavor)) countries[country].flavors.push(flavor);

    const acidity = parseFloat(row.Acidity);
    if (!isNaN(acidity)) countries[country].acidity.push(acidity);

    const sweetness = parseFloat(row.Sweetness);
    if (!isNaN(sweetness)) countries[country].sweetness.push(sweetness);

    const aftertaste = parseFloat(row.Aftertaste);
    if (!isNaN(aftertaste)) countries[country].aftertaste.push(aftertaste);

    const body = parseFloat(row.Body);
    if (!isNaN(body)) countries[country].body.push(body);

    const balance = parseFloat(row.balance);
    if (!isNaN(balance)) countries[country].balance.push(balance);

    const uniformity = parseFloat(row.uniformity);
    if (!isNaN(uniformity)) countries[country].uniformity.push(uniformity);

    const moisture = parseFloat(row.moisture);
    if (!isNaN(moisture)) countries[country].moisture.push(moisture);

    const cleanliness = parseFloat(row.cleanliness);
    if (!isNaN(cleanliness)) countries[country].cleanliness.push(cleanliness);

    const defects = parseFloat(row.defects);
    if (!isNaN(defects)) countries[country].defects.push(defects);
    
    //track varieties/processing methods
    if (row.Variety) {
      countries[country].varieties.add(row.Variety);
    }
    if (row['Processing.Method']) {
      countries[country].processingMethods.add(row['Processing.Method']);
    }
    
    countries[country].samples.push(row);
  });
  
  //convert to array and add coordinates
  const countryArray = Object.keys(countries).map(countryName => {
    const country = countries[countryName];
    const coords = COUNTRY_COORDS[countryName];
    
    //skip countries without coordinates
    if (!coords) {
      console.log('No coordinates for:', countryName);
      return null;
    }
    
    // helper function to calculate averages
    const calcAvg = (arr) => {
      if (arr.length === 0) return 0;
      return parseFloat((arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2));
    };
    
    return {
      name: countryName,
      coords: coords,
      sampleCount: country.samples.length,
      avgScore: calcAvg(country.scores),
      avgAroma: calcAvg(country.aromas),
      avgFlavor: calcAvg(country.flavors),
      avgAcidity: calcAvg(country.acidity),
      avgSweetness: calcAvg(country.sweetness),
      avgAftertaste: calcAvg(country.aftertaste),
      varieties: Array.from(country.varieties),
      processingMethods: Array.from(country.processingMethods)
    };
  }).filter(country => country !== null); //remove countries without coords
  
  console.log('Processed countries:', countryArray.length);
  return countryArray;
}