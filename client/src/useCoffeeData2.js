import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import reviews_csv from './src/reviews_feb_2023.csv';

export function useCoffeeData() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [countryData, setCountryData] = useState([]);

  useEffect(() => {
    Papa.parse(reviews_csv, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        // compile database using extracted data
        const cleaned = results.data.map((row, index) => ({
                    id: `${row.title || 'review'}_${index}`,
                    title: row.title || '',
                    rating: Number(row.rating) || null,
                    aroma: Number(row.aroma) || null,
                    flavor: Number(row.flavor) || null,
                    aftertaste: Number(row.aftertaste) || null,
                    body: Number(row.body) || null,
                    acidityStructure: row.acidity_structure || '',
                    withMilk: row.with_milk || '',
                    agtron: row.agtron || '',
                    blindAssessment: row.blind_assessment || '',
                    bottomLine: row.bottom_line || '',
                    coffeeOrigin: row.coffee_origin || '',
                    estPrice: row.est_price || '',
                    notes: row.notes || '',
                    reviewDate: row.review_date || '',
                    roastLevel: row.roast_level || '',
                    roaster: row.roaster || '',
                    roasterLocation: row.roaster_location || '',
                    url: row.url || '',
                    country: extractCountry(row.coffee_origin),
                }))

                setReviews(cleaned)
                setLoading(false)
            },
            error: (err) => {
                setError(err.message)
                setLoading(false)
            }
        })
    }, [])

  return { reviews, loading, error };
}

function extractCountry(origin) {
    if (!origin) return ''

    const countries = [
        'Bolivia', 'Nicaragua', 'Ethiopia', 'Colombia', 'Guatemala', 'Kenya', 'Taiwan', 'Burundi', 'Brazil', 'Peru', 'Honduras', 'Costa Rica', 'Panama', 'Rwanda', 'El Salvador', 'Mexico', 'Indonesia', 'Uganda', 'India', 'Papua New Guinea', 'Tanzania', 'China', 'Thailand', 'Vietnam', 'Haiti', 'Jamaica', 'Yemen', 'Laos', 'Myanmar', 'Ecuador'
    ]

    for (const country of countries) {
        if (origin.toLowerCase().includes(country.toLowerCase())) {
            return country
        }
    }

    return ''
}
