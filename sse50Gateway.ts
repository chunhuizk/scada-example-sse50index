import { ScadaDataReporter } from '@chunhuizk/cloud'
import sse50indexList from './sse50index-list'

import isCNTradingTime from './isCNTradingTime'
import getStockQuotes from './getStockQuotes';
import { debug } from './utils';

let scada = new ScadaDataReporter()
scada.setScadaId("5edd4d9ebaaae50007a5cb69")
scada.setSecret("secret")

const gatewayPhysicalId = "SSE-50-Index"
const stockCodes = sse50indexList

export async function register() {
    let gatewayData = scada.newGatewayData(gatewayPhysicalId)

    const stockQuote = await getStockQuotes(stockCodes)

    for (let quote of stockQuote) {
        const { name, value, stockCode } = quote
        let dataSource = gatewayData.newDataSourceData(`sh${stockCode}`)
        dataSource.setValue(value)
        dataSource.setMeta("Name", name)
    }

    await scada.register(gatewayData)
}

export async function report() {
    if (isCNTradingTime()) {
        let gatewayData = scada.newGatewayData(gatewayPhysicalId)
        console.log(gatewayPhysicalId, "::getStockQuotes::start")
        const stockQuote = await getStockQuotes(stockCodes)
        console.log(gatewayPhysicalId, "::getStockQuotes::done")

        for (let quote of stockQuote) {
            let dataSource = gatewayData.newDataSourceData(`sh${quote.stockCode}`)
            dataSource.setValue(quote.value)
        }


        debug("Report MetricDataLength: " + gatewayData.toMetricDatas().length)
        console.log(gatewayPhysicalId, "::scada.send::start")
        await scada.send(gatewayData)
        console.log(gatewayPhysicalId, "::scada.send::done")
    } else {
        console.log(gatewayPhysicalId, "::NOT_IN_TRADING_TIME")
        return Promise.resolve()
    }
}