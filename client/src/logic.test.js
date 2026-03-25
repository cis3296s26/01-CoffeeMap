import { applyFilters, searchBeans } from "./logic";

const beansSample = [
    { "Country.of.Origin": "Ethiopia", "Region": "Sidamo", "Variety": "guji-hambela", "Aroma": "8.25" },
    { "Country.of.Origin": "Brazil", "Region": "south of minas", "Variety": "Bourbon", "Aroma": "8.0" }
];

describe("applyFilters", () => {
    test('Returns true if country matches filter', () => {
        const filters = { country: "Ethiopia", region: "", aroma: "" };
        expect(applyFilters(beansSample[0], filters)).toBe(true);
    });
});

describe('searchBeans', () => {
    test('returns all beans when query is empty', () => {
        const filters = { country: "", region: "", aroma: "" };
        const result = searchBeans(beansSample, "", filters);
        expect(result.length).toBe(2); //2 beans in sample data
    });

    test('Searching "brazil" finds "Brazil"', () => {
        const filters = { country: "", region: "", aroma: "" };
        const result = searchBeans(beansSample, "brazil", filters);
        expect(result[0]["Country.of.Origin"]).toBe("Brazil");
    });
});