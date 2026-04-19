import {describe, it, expect} from 'vitest';
import {applyFilters} from './src/BeanSearch.jsx'

const sampleBeans = [
    {"Country.of.Origin": "Ethiopia", "Region": "Yirgacheffe", "Aroma": "8.5", "Species": "Arabica"},
    {"Country.of.Origin": "Colombia", "Region": "Huila", "Aroma": "7.0", "Species": "Arabica"},
]

describe('applyFilters', () => {
    //Check if the function returns true when no filters are applied
    it('returns true when no filters are applied', () => {
        expect(applyFilters(sampleBeans[0], {country: [], region: [], aroma: [], species: [], minScore: 0, minFlavor: 0, minAcidity: 0, minSweetness: 0})).toBe(true)
    })

    //Check if the function returns true when the country filter matches
    it('filters by country', () => {
        expect(applyFilters(sampleBeans[0], {country: ['Ethiopia'], region: [], aroma: [], species: [], minScore: 0, minFlavor: 0, minAcidity: 0, minSweetness: 0})).toBe(true)
    })

    //Check if the function returns false when the country filter doesn't match
    it('returns false when country doesn\'t match', () => {
        expect(applyFilters(sampleBeans[0], {country: ['Colombia'], region: [], aroma: [], species: [], minScore: 0, minFlavor: 0, minAcidity: 0, minSweetness: 0})).toBe(false)
    })
})