//Filter function
const applyFilters = (bean, filters) => {
    const matchCounty = !filters.country || bean["Country.of.Origin"] === filters.country
    const matchRegion = !filters.region || bean["Region"] === filters.region
    const matchAroma = !filters.aroma || bean["Aroma"] === filters.aroma

    return matchCounty && matchRegion && matchAroma
}

//search through database using search bar input
const searchBeans = (beans, query, filters) => {
    const lowerQuery = query.toLowerCase()

    return beans.filter((bean) => {
        const matchSearch = 
            bean["Country.of.Origin"]?.toLowerCase().includes(lowerQuery) ||
            bean["Region"]?.toLowerCase().includes(lowerQuery) ||
            bean["Variety"]?.toLowerCase().includes(lowerQuery)
        return matchSearch && applyFilters(bean, filters)
    })
}

module.exports = { applyFilters, searchBeans }