import https from 'https'

export namespace ChunhuiCloud {
    export class Scada {
        protected scadaAppId?: string;
        protected secret?: string;
        apiVersion = "20200519"
        endpoint = "https://{scadaId}.scada.chunhuicloud.com"

        constructor(apiVersion?: string, endpoint?: string) {
            this.apiVersion = apiVersion || this.apiVersion
            this.endpoint = endpoint || this.endpoint
        }

        newGatewayData(gatewayPhysicalId: string): ChunhuiCloud.GatewayData {
            return new ChunhuiCloud.GatewayData(gatewayPhysicalId)
        }

        setScadaId(scadaAppId: string) {
            this.scadaAppId = scadaAppId
            this.endpoint = this.endpoint.replace('{scadaId}', scadaAppId)
        }

        setSecret(secret: string) {
            this.secret = secret
        }

        valid(): Promise<boolean> {
            if (this.scadaAppId === undefined) {
                return Promise.reject("scadaId is undefined")
            }

            if (this.secret === undefined) {
                return Promise.reject("secret is undefined")
            }

            return Promise.resolve(true)
        }

        async register(reportData: ChunhuiCloud.GatewayData): Promise<any> {
            try {
                this.valid()
                let metricDatas = reportData.toMetricDatas()
                let gatewatReportData: ChunhuiCloud.IGatewayReportData = {
                    Version: this.apiVersion,
                    ScadaAppId: this.scadaAppId,
                    Timestamp: new Date(),
                    GatewayPhysicalId: reportData.getGatewayPhysicalId(),
                    Secret: this.secret,
                    MetricData: metricDatas,
                    InfoData: {
                        Name: ChunhuiCloud.IInfoName.REGISTER,
                        Message: "Register gateway"
                    }
                }

                const res = await httpPost(`${this.endpoint}/gateway`, gatewatReportData)
                return Promise.resolve(res)
            } catch (err) {
                return Promise.reject(err)
            }
        }

        async send(reportData: ChunhuiCloud.GatewayData): Promise<void> {
            try {
                this.valid()
                let metricDatas = reportData.toMetricDatas()
                let gatewatReportData: ChunhuiCloud.IGatewayReportData = {
                    Version: this.apiVersion,
                    ScadaAppId: this.scadaAppId,
                    Timestamp: new Date(),
                    GatewayPhysicalId: reportData.getGatewayPhysicalId(),
                    Secret: this.secret,
                    MetricData: metricDatas
                }

                const res = await httpPost(`${this.endpoint}/gateway`, gatewatReportData)
                return Promise.resolve(res)
            } catch (err) {
                return Promise.reject(err)
            }
        }
    }

    export class GatewayData {
        protected gatewayPhysicalId: string;
        protected datas: {
            [dataSourceId: string]: DataSourceData
        } = {}

        constructor(gatewayPhysicalId: string) {
            this.gatewayPhysicalId = gatewayPhysicalId
        }

        newDataSourceData(dataSourceId: string): DataSourceData {
            this.datas[dataSourceId] = new DataSourceData(dataSourceId)
            return this.datas[dataSourceId]
        }

        toMetricDatas(): IMetricData[] {
            return Object.keys(this.datas).map((dataSourceId) => this.datas[dataSourceId].toMetricData())
        }

        getGatewayPhysicalId(): string { return this.gatewayPhysicalId }
    }

    export class DataSourceData {
        protected value?: number;
        protected values: number[] = [];
        protected counts: number[] = [];
        protected dimentions: IDimension[] = []
        protected timestamp?: Date;

        constructor(dataSourceId: string) {
            this.setDataSourceId(dataSourceId)
        }

        public setValue(val: number, frequence?: number): void {
            if (frequence) {
                this.values.push(val)
                this.counts.push(frequence)
            } else {
                if (this.values) {
                    this.values = []
                    this.counts = []
                }
                this.value = val
            }
        }

        setProperty(name: string, value: string) {
            if (name === "" || value === "") {
                throw new Error("name or value shoud not be empty")
            }

            this.dimentions.push({
                Name: name,
                Value: value
            })
        }

        setDataSourceId(did: string) {
            this.setProperty('DataSourceId', did)
        }

        setTimestamp(t: Date) {
            this.timestamp = t
        }

        toMetricData(): IMetricData {
            const { value: Value, values: Values, counts: Counts, timestamp: Timestamp, dimentions: Dimensions } = this
            if (Values && Values.length > 0) {
                return { Values, Counts, Timestamp: Timestamp || new Date(), Dimensions }
            } else {
                return { Value, Timestamp: Timestamp || new Date(), Dimensions }
            }
        }
    }

    export type IReportDataFull = Required<IReportData>

    export interface IReportData {
        Version?: string; // Data Schema Version
        ScadaAppId?: string;
        Timestamp?: Date;
        Secret?: string;
        GatewayId?: string; // Optional Iot Gatewat UniqueId
        GatewayPhysicalId?: string;
    }

    export interface IGatewayReportData extends IReportData {
        InfoData?: IInfoData;
        ErrorData?: IGatewayErrorData;
        MetricData?: IMetricData[];
    }

    export enum IInfoName {
        REGISTER = "REGISTER"
    }

    export interface IInfoData {
        Name?: string | IInfoName;
        Message: string
    }

    export interface IGatewayErrorData extends IInfoData { }

    export type Unit = "Count"

    export interface IStatisticalValue {
        Max: number;
        Min: number;
        SampleCount: number;
        Sum: number;
    }

    export interface IDimension {
        Name: string;
        Value: string
    }

    export interface IMetricData {
        Value?: number;
        Values?: number[]
        Counts?: number[];
        Unit?: Unit;
        StatisticalValue?: IStatisticalValue;
        Timestamp: Date;
        Dimensions?: IDimension[];
    }
}


function httpPost(url: string, rdata: any): Promise<any> {
    return new Promise(function (resolve, reject) {
        const urlObject = new URL(url)
        const data = JSON.stringify(rdata)
        console.log(urlObject.hostname)

        const options = {
            hostname: urlObject.hostname,
            port: urlObject.port,
            path: urlObject.pathname,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        }

        const req = https.request(options, (res: any) => {
            console.log(`statusCode: ${res.statusCode}`)

            // if (res.statusCode > 300 && res.statusCode < 400 && res.headers.location) {
            //     return httpPost(res.headers.location, rdata)       
            // }
            // cumulate data
            var body: any = [];

            res.on('data', function (chunk: any) {
                body.push(chunk);
            });

            res.on('end', function () {
                try {
                    body = body.join()
                } catch (e) {
                    reject(e);
                }
                resolve(body);
            });
        })

        req.on('error', error => {
            reject(error);
        })

        req.write(data)
        req.end()
    })
}