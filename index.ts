import { ChunhuiCloud } from './ChunhuiCloud'
import axios from 'axios'
import sse50indexList from './sse50index-list'

let scada = new ChunhuiCloud.Scada()
scada.setScadaId("5edd4d9ebaaae50007a5cb69")
scada.setSecret("secret")

let gatewayData = scada.newGatewayData("SSE-50-Index")

run()

async function run() {
    for (let stockCode of (sse50indexList.slice(0,5))) {
        let dataSource = gatewayData.newDataSourceData(`sh${stockCode}`)
        const response = await axios.get(`http://hq.sinajs.cn/list=sh${stockCode}`)
        let value = response.data.split(",")[3]
        dataSource.setValue(parseFloat(value))
    }


    // scada.register(gatewayData).then(() => {
    //     scada.send(gatewayData).then((res) => {
    //         console.log(JSON.stringify(gatewayData.toMetricDatas()))
    //         console.log(res)
    //     })
    // })

    // scada.register(gatewayData).then(() => {
        scada.send(gatewayData).then((res) => {
            console.log(JSON.stringify(gatewayData.toMetricDatas()))
            console.log(res)
        })
    // })
}



setInterval(run, 30000); // Time in milliseconds