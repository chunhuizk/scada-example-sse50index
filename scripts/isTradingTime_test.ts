import isCNTradingTime from '../isCNTradingTime'

console.log(isCNTradingTime())

console.log("weekend", isCNTradingTime(new Date(1592153340100)))
console.log("9:29 am", isCNTradingTime(new Date(1592270940755)))
console.log("9:30 am", isCNTradingTime(new Date(1592271000030)))
console.log("10:00 am", isCNTradingTime(new Date(1592272800618)))
console.log("11:29 am", isCNTradingTime(new Date(1592278199501)))
console.log("11:31 am", isCNTradingTime(new Date(1592278260738)))

console.log("12:59 pm", isCNTradingTime(new Date(1592197199943)))
console.log("2:59 am", isCNTradingTime(new Date(1592204399606)))
console.log("3:01 pm", isCNTradingTime(new Date(1592204460193)))