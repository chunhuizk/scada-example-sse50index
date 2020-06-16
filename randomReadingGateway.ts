import { Scada } from '@chunhuizk/cloud'

let scada = new Scada()
scada.setScadaId("5edd4d9ebaaae50007a5cb69")
scada.setSecret("secret")

const dataSourceIds = ['abc', 'def', 'ghi', 'jkl']
const gatewayPhysicalId = 'SCADA-EXAMPLE-RANDOM-READING'


export async function register() {
    let gatewayData = scada.newGatewayData(gatewayPhysicalId)

    for (const dataSourceId of dataSourceIds) {
        let dataSource = gatewayData.newDataSourceData(dataSourceId)

        let randomValue = randomReading()
        dataSource.setValue(randomValue)
    }

    await scada.register(gatewayData)
}

export async function report() {
    let gatewayData = scada.newGatewayData(gatewayPhysicalId)

    for (const dataSourceId of dataSourceIds) {
        let dataSource = gatewayData.newDataSourceData(dataSourceId)

        let randomValue = randomReading()
        dataSource.setValue(randomValue)
    }

    console.log(gatewayPhysicalId, "report")

    await scada.send(gatewayData)
}


function randomReading(errChance: number = 0.05): number {
    var weighted = function () { return Math.pow(Math.random(), errChance); }
    return parseFloat((Math.floor(weighted() * (100 - 0 + 1)) + 0).toFixed(2));
}