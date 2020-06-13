"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.report = exports.register = void 0;
var cloud_1 = require("@chunhuizk/cloud");
var axios_1 = __importDefault(require("axios"));
var sse50index_list_1 = __importDefault(require("./sse50index-list"));
var iconv_lite_1 = __importDefault(require("iconv-lite"));
var scada = new cloud_1.Scada();
scada.setScadaId("5edd4d9ebaaae50007a5cb69");
scada.setSecret("secret");
var gatewayPhysicalId = "SSE-50-Index";
function register() {
    return __awaiter(this, void 0, void 0, function () {
        var gatewayData, _i, _a, stockCode, dataSource, response, _b, name_1, value;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    gatewayData = scada.newGatewayData(gatewayPhysicalId);
                    _i = 0, _a = (sse50index_list_1.default.slice(0, 10));
                    _c.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    stockCode = _a[_i];
                    dataSource = gatewayData.newDataSourceData("sh" + stockCode);
                    return [4 /*yield*/, axios_1.default.get("http://hq.sinajs.cn/list=sh" + stockCode, { responseType: 'arraybuffer' }).then(function (response) {
                            return { data: iconv_lite_1.default.decode(response.data, 'gbk') };
                        })];
                case 2:
                    response = _c.sent();
                    _b = extract(response.data), name_1 = _b.name, value = _b.value;
                    dataSource.setValue(value);
                    dataSource.setMeta("Name", name_1);
                    _c.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [4 /*yield*/, scada.register(gatewayData)];
                case 5:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.register = register;
function report() {
    return __awaiter(this, void 0, void 0, function () {
        var gatewayData_1, _i, _a, stockCode, dataSource, response, value;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!isTradingTime()) return [3 /*break*/, 5];
                    gatewayData_1 = scada.newGatewayData(gatewayPhysicalId);
                    _i = 0, _a = (sse50index_list_1.default.slice(0, 10));
                    _b.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    stockCode = _a[_i];
                    dataSource = gatewayData_1.newDataSourceData("sh" + stockCode);
                    return [4 /*yield*/, axios_1.default.get("http://hq.sinajs.cn/list=sh" + stockCode, { responseType: 'arraybuffer' }).then(function (response) {
                            return { data: iconv_lite_1.default.decode(response.data, 'gbk') };
                        })];
                case 2:
                    response = _b.sent();
                    value = extract(response.data).value;
                    dataSource.setValue(value);
                    _b.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    console.log(gatewayPhysicalId, "report");
                    scada.send(gatewayData_1).then(function (res) {
                        console.log(JSON.stringify(gatewayData_1.toMetricDatas()));
                    });
                    return [3 /*break*/, 6];
                case 5:
                    console.log(gatewayPhysicalId, "NOT IN TRADING TIME");
                    return [2 /*return*/, Promise.resolve()];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.report = report;
function extract(str) {
    var arrayStr = str.split("=\"")[1];
    return {
        name: arrayStr.split(",")[0],
        value: parseFloat(arrayStr.split(",")[3])
    };
}
function isTradingTime() {
    var currentDate = new Date();
    var day = currentDate.getDay();
    if (day > 5 || day < 1) {
        // weekend
        return false;
    }
    var morningTradingStartTime = new Date();
    morningTradingStartTime.setHours(9, 30, 0);
    var morningTradingEndTime = new Date();
    morningTradingStartTime.setHours(11, 30, 0);
    var afternoonTradingStartTime = new Date();
    morningTradingStartTime.setHours(13, 0, 0);
    var afternoonTradingEndTime = new Date();
    morningTradingStartTime.setHours(15, 0, 0);
    if (currentDate.getTime() < morningTradingStartTime.getTime() || currentDate.getTime() > afternoonTradingEndTime.getTime()) {
        return false;
    }
    if (currentDate.getTime() > morningTradingEndTime.getTime() && currentDate.getTime() < afternoonTradingStartTime.getTime()) {
        return false;
    }
    return true;
}
