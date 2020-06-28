import { ScadaDataReporter } from '@chunhuizk/cloud'
import axios from 'axios'
import sse50indexList from './sse50index-list'

import iconv from 'iconv-lite';
import isCNTradingTime from './isCNTradingTime'
import getStockQuotes from './getStockQuotes';

let scada = new ScadaDataReporter()
scada.setScadaId("5edd4d9ebaaae50007a5cb69")
scada.setSecret("secret")

const gatewayPhysicalId = "SSE-50-Index"
const stockCodes = sse50indexList.slice(0, 10)

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

        const stockQuote = await getStockQuotes(stockCodes)

        for (let quote of stockQuote) {
            let dataSource = gatewayData.newDataSourceData(`sh${quote.stockCode}`)
            dataSource.setValue(quote.value)
        }

        console.log(gatewayPhysicalId, "report")

        await scada.send(gatewayData)
    } else {
        console.log(gatewayPhysicalId, "NOT IN TRADING TIME")
        return Promise.resolve()
    }
}

function extract(str: string): { name: string, value: number } {
    let arrayStr = str.split("=\"")[1]

    return {
        name: arrayStr.split(",")[0],
        value: parseFloat(arrayStr.split(",")[3])
    }
}

