import { useState, useEffect } from 'react';
import Papa from 'papaparse';

export function useCoffeeData() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [countryData, setCountryData] = useState([]);

  useEffect(() => {
    const cqiUrl = 'https://raw.githubusercontent.com/jldbc/coffee-quality-database/refs/heads/master/data/arabica_data_cleaned.csv';
    
    Papa.parse(cqiUrl, {
      download: true,
      header: true,
      complete: (results) => {
        console.log('CQI Data loaded:', results.data.length, 'records');
        
        //process the data
        const processed = processData(results.data);
        setCountryData(processed);
        setLoading(false);
      },
      error: (err) => {
        console.error('Error loading CQI data:', err);
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
        varieties: new Set(),
        processingMethods: new Set()
      };
    }
    
    //add score if valid
    const score = parseFloat(row['Total.Cup.Points']);
    if (!isNaN(score)) {
      countries[country].scores.push(score);
    }
    
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
    
    //calculate average score
    let avgScore = null;
    if (country.scores.length > 0) {
      avgScore = (country.scores.reduce((a, b) => a + b, 0) / country.scores.length).toFixed(2);
    }
    
    return {
      name: countryName,
      coords: coords,
      sampleCount: country.samples.length,
      avgScore: avgScore,
      varieties: Array.from(country.varieties),
      processingMethods: Array.from(country.processingMethods)
    };
  }).filter(country => country !== null); //remove countries without coords
  
  console.log('Processed countries:', countryArray.length);
  return countryArray;
}
