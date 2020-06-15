import { Scada } from '@chunhuizk/cloud'
import axios from 'axios'
import sse50indexList from './sse50index-list'

import iconv from 'iconv-lite';
import isCNTradingTime from './isCNTradingTime'

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
    if (isCNTradingTime()) {
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

