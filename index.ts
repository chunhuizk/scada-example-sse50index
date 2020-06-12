import { Scada } from '@chunhuizk/cloud'
import axios from 'axios'
import sse50indexList from './sse50index-list'

import iconv from 'iconv-lite';


let scada = new Scada()
scada.setScadaId("5edd4d9ebaaae50007a5cb69")
scada.setSecret("secret")

async function register() {
    let gatewayData = scada.newGatewayData("SSE-50-Index")


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

async function report() {
    let gatewayData = scada.newGatewayData("SSE-50-Index")

    for (let stockCode of (sse50indexList.slice(0, 10))) {
        let dataSource = gatewayData.newDataSourceData(`sh${stockCode}`)
        const response = await axios.get(`http://hq.sinajs.cn/list=sh${stockCode}`, { responseType: 'arraybuffer' }).then(function (response) {
            return { data: iconv.decode(response.data, 'gbk') }
        });

        let { value } = extract(response.data)
        dataSource.setValue(value)
    }

    scada.send(gatewayData).then((res) => {
        console.log(JSON.stringify(gatewayData.toMetricDatas()))
    })
}

function extract(str: string): { name: string, value: number } {
    let arrayStr = str.split("=\"")[1]

    return {
        name: arrayStr.split(",")[0],
        value: parseFloat(arrayStr.split(",")[3])
    }
}



register().then(() => {
    setInterval(report, 3000); // Time in milliseconds
})