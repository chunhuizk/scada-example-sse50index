import { ScadaDataReporter } from '@chunhuizk/cloud'

let scadaDataReporter = new ScadaDataReporter()
scadaDataReporter.setScadaId("5edd4d9ebaaae50007a5cb69")
scadaDataReporter.setSecret("secret")
scadaDataReporter.setEndpoint("https://scada.chunhuicloud.com")

const dataSourceIds = ['abc', 'def', 'ghi', 'jkl']
const gatewayPhysicalId = 'SCADA-EXAMPLE-RANDOM-READING'


export async function register() {
    let gatewayData = scadaDataReporter.newGatewayData(gatewayPhysicalId)

    for (const dataSourceId of dataSourceIds) {
        let dataSource = gatewayData.newDataSourceData(dataSourceId)

        let randomValue = randomReading()
        dataSource.setValue(randomValue)
    }

    await scadaDataReporter.register(gatewayData)
}

export async function report() {
    let gatewayData = scadaDataReporter.newGatewayData(gatewayPhysicalId)

    for (const dataSourceId of dataSourceIds) {
        let dataSource = gatewayData.newDataSourceData(dataSourceId)

        let randomValue = randomReading()
        dataSource.setValue(randomValue)
    }

    console.log(gatewayPhysicalId, "report")

    await scadaDataReporter.send(gatewayData)
}


function randomReading(errChance: number = 0.05): number {
    var weighted = function () { return Math.pow(Math.random(), errChance); }
    return parseFloat((Math.floor(weighted() * (100 - 0 + 1)) + 0).toFixed(2));
}