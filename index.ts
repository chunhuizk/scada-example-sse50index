import * as SSE50MOCK from './sse50Gateway'
import * as RANDOMMOCK from './randomReadingGateway'

if (process.env.DEBUG) {
    SSE50MOCK.register().then(() => {
        setInterval(SSE50MOCK.report, 3000); // Time in milliseconds
    })
    
    RANDOMMOCK.register().then(() => {
        setInterval(RANDOMMOCK.report, 5000); // Time in milliseconds
    })
} else {
    console.log("Production Mode")
    SSE50MOCK.register().then(() => {
        console.log("Start Reporting SSE50MOCK")
        setInterval(SSE50MOCK.report, 30000); // Time in milliseconds
    })
    
    RANDOMMOCK.register().then(() => {
        console.log("Start Reporting RANDOMMOCK")
        setInterval(RANDOMMOCK.report, 5000); // Time in milliseconds
    })
}