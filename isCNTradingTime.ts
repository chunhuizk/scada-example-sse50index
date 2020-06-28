import { DateTime, Interval } from 'luxon'

export default function isCNTradingTime(date: Date = new Date()): boolean {
    if (process.env.PASS_TRADING_TIME_DETECT) {
        return true
    }
    const currentDate = DateTime.fromJSDate(date).setZone("UTC+8") // Beijing TimeZone
    const weekday = currentDate.weekday

    if (weekday > 5 || weekday < 1) {
        // weekend
        return false
    }

    const morningTradingStartTime = currentDate.set({hour: 9, minute: 30, second: 0, millisecond: 0})
    const morningTradingEndTime = currentDate.set({hour: 11, minute: 30, second: 0, millisecond: 0})
    const morningTradingInterval = Interval.fromDateTimes(morningTradingStartTime, morningTradingEndTime)

    const afternoonTradingStartTime = currentDate.set({hour: 13, minute: 0, second: 0, millisecond: 0})
    const afternoonTradingEndTime = currentDate.set({hour: 15, minute: 0, second: 0, millisecond: 0})
    const afternoonTradingInterval = Interval.fromDateTimes(afternoonTradingStartTime, afternoonTradingEndTime)

    if (morningTradingInterval.contains(currentDate) || afternoonTradingInterval.contains(currentDate)) {
        return true
    }


    return false
}