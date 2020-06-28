export function debug(message: any) {
    if (process.env.DEBUG) {
        console.log(message)
    }
}