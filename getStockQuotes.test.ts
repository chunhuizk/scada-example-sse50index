import getStockQuotes from './getStockQuotes'

test('getStockQuotes', async () => {
    let testStockCodes = ["600000", "600016", "600019", "600028"]
    const quotes = await getStockQuotes(testStockCodes)

    expect(quotes).toHaveLength(4)
})