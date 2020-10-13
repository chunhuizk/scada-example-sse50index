// await axios.get(`http://hq.sinajs.cn/list=sh${stockCode}`, { responseType: 'arraybuffer' }).then(function (response) {
//             return { data: iconv.decode(response.data, 'gbk') }
//         });
import axios from 'axios'
import iconv from 'iconv-lite';
import bluebird from 'bluebird'

interface IStockQuote {
    name: string;
    stockCode: string;
    value: number;
}

type GetStockQuoteResponse = IStockQuote[]

export default async function getStockQuotes(stockCodes: string[]): Promise<GetStockQuoteResponse> {
    return bluebird.map(stockCodes, async (stockCode) => {
        try {
            const response = await axios.get(`http://hq.sinajs.cn/list=sh${stockCode}`, { responseType: 'arraybuffer' });
            const decodedData = iconv.decode(response.data, 'gbk')
            let { name, value } = extract(decodedData);
            return {
                name,
                stockCode,
                value
            };
        } catch (error) {
            console.error(error)
            throw error
        }
    }, { concurrency: 10 })
}

function extract(str: string): { name: string, value: number } {
    let arrayStr = str.split("=\"")[1]

    return {
        name: arrayStr.split(",")[0],
        value: parseFloat(arrayStr.split(",")[3])
    }
}