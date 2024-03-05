
import axios from "axios";

export async function test_upload() {

    const ACCESS_TOKEN = "e8f8b55685652855"
    axios.post(`https://iot.winhit.cn:8081/api/v1/${ACCESS_TOKEN}/telemetry`, {
        "PH": 7.57,
        "WD": 28.13,
        "YL": 0.68,
        "ZD": 0.28,
        "ORP": 629
    })
}