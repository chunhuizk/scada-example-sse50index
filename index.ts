import * as SSE50MOCK from './sse50Gateway'
import * as RANDOMMOCK from './randomReadingGateway'


SSE50MOCK.register().then(() => {
    setInterval(SSE50MOCK.report, 30000); // Time in milliseconds
})

RANDOMMOCK.register().then(() => {
    setInterval(RANDOMMOCK.report, 5000); // Time in milliseconds
})