import { Scada } from '@chunhuizk/cloud'
import axios from 'axios'
import sse50indexList from './sse50index-list'

import iconv from 'iconv-lite';

let scada = new Scada()
scada.setScadaId("5edd4d9ebaaae50007a5cb69")
scada.setSecret("secret")

const gatewayPhysicalId = "SSE-50-Index"

export async function register() {
    let gatewayData = scada.newGatewayData(gatewayPhysicalId)


    for (let stockCode of (sse50indexList.slice(0, 10))) {
        let dataSource = gatewayData.newDataSourceData(`sh${stockCode}`)
        const response = await axios.get(`http://hq.sinajs.cn/list=sh${stockCode}`, { responseType: 'arraybuffer' }).then(function (response) {
            return { data: iconv.decode(response.data, 'gbk') }
        });
        let { name, value } = extract(response.data)
        dataSource.setValue(value)
        dataSource.setMeta("Name", name)
    }


    await scada.register(gatewayData)
}

export async function report() {
    if (isTradingTime()) {
        let gatewayData = scada.newGatewayData(gatewayPhysicalId)

        for (let stockCode of (sse50indexList.slice(0, 10))) {
            let dataSource = gatewayData.newDataSourceData(`sh${stockCode}`)
            const response = await axios.get(`http://hq.sinajs.cn/list=sh${stockCode}`, { responseType: 'arraybuffer' }).then(function (response) {
                return { data: iconv.decode(response.data, 'gbk') }
            });
    
            let { value } = extract(response.data)
            dataSource.setValue(value)
        }
    
        console.log(gatewayPhysicalId, "report")

        scada.send(gatewayData).then((res) => {
            console.log(JSON.stringify(gatewayData.toMetricDatas()))
        })
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

function isTradingTime(): boolean {
    const currentDate = new Date()
    const day = currentDate.getDay()

    if (day > 5 || day < 1) {
        // weekend
        return false
    }

    const morningTradingStartTime = new Date()
    morningTradingStartTime.setHours(9, 30, 0)
    const morningTradingEndTime = new Date()
    morningTradingStartTime.setHours(11, 30, 0)

    const afternoonTradingStartTime = new Date()
    morningTradingStartTime.setHours(13, 0, 0)
    const afternoonTradingEndTime = new Date()
    morningTradingStartTime.setHours(15, 0, 0)

    if (currentDate.getTime() < morningTradingStartTime.getTime() || currentDate.getTime() > afternoonTradingEndTime.getTime()) {
        return false
    }

    if (currentDate.getTime() > morningTradingEndTime.getTime() && currentDate.getTime() < afternoonTradingStartTime.getTime()) {
        return false
    }

    return true
}