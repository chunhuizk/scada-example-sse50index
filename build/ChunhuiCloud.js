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
exports.ChunhuiCloud = void 0;
var https_1 = __importDefault(require("https"));
var ChunhuiCloud;
(function (ChunhuiCloud) {
    var Scada = /** @class */ (function () {
        function Scada(apiVersion, endpoint) {
            this.apiVersion = "20200519";
            this.endpoint = "https://{scadaId}.scada.chunhuicloud.com";
            this.apiVersion = apiVersion || this.apiVersion;
            this.endpoint = endpoint || this.endpoint;
        }
        Scada.prototype.newGatewayData = function (gatewayPhysicalId) {
            return new ChunhuiCloud.GatewayData(gatewayPhysicalId);
        };
        Scada.prototype.setScadaId = function (scadaAppId) {
            this.scadaAppId = scadaAppId;
            this.endpoint = this.endpoint.replace('{scadaId}', scadaAppId);
        };
        Scada.prototype.setSecret = function (secret) {
            this.secret = secret;
        };
        Scada.prototype.valid = function () {
            if (this.scadaAppId === undefined) {
                return Promise.reject("scadaId is undefined");
            }
            if (this.secret === undefined) {
                return Promise.reject("secret is undefined");
            }
            return Promise.resolve(true);
        };
        Scada.prototype.register = function (reportData) {
            return __awaiter(this, void 0, void 0, function () {
                var metricDatas, gatewatReportData, res, err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            this.valid();
                            metricDatas = reportData.toMetricDatas();
                            gatewatReportData = {
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
                            };
                            return [4 /*yield*/, httpPost(this.endpoint + "/gateway", gatewatReportData)];
                        case 1:
                            res = _a.sent();
                            return [2 /*return*/, Promise.resolve(res)];
                        case 2:
                            err_1 = _a.sent();
                            return [2 /*return*/, Promise.reject(err_1)];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        Scada.prototype.send = function (reportData) {
            return __awaiter(this, void 0, void 0, function () {
                var metricDatas, gatewatReportData, res, err_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            this.valid();
                            metricDatas = reportData.toMetricDatas();
                            gatewatReportData = {
                                Version: this.apiVersion,
                                ScadaAppId: this.scadaAppId,
                                Timestamp: new Date(),
                                GatewayPhysicalId: reportData.getGatewayPhysicalId(),
                                Secret: this.secret,
                                MetricData: metricDatas
                            };
                            return [4 /*yield*/, httpPost(this.endpoint + "/gateway", gatewatReportData)];
                        case 1:
                            res = _a.sent();
                            return [2 /*return*/, Promise.resolve(res)];
                        case 2:
                            err_2 = _a.sent();
                            return [2 /*return*/, Promise.reject(err_2)];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        return Scada;
    }());
    ChunhuiCloud.Scada = Scada;
    var GatewayData = /** @class */ (function () {
        function GatewayData(gatewayPhysicalId) {
            this.datas = {};
            this.gatewayPhysicalId = gatewayPhysicalId;
        }
        GatewayData.prototype.newDataSourceData = function (dataSourceId) {
            this.datas[dataSourceId] = new DataSourceData(dataSourceId);
            return this.datas[dataSourceId];
        };
        GatewayData.prototype.toMetricDatas = function () {
            var _this = this;
            return Object.keys(this.datas).map(function (dataSourceId) { return _this.datas[dataSourceId].toMetricData(); });
        };
        GatewayData.prototype.getGatewayPhysicalId = function () { return this.gatewayPhysicalId; };
        return GatewayData;
    }());
    ChunhuiCloud.GatewayData = GatewayData;
    var DataSourceData = /** @class */ (function () {
        function DataSourceData(dataSourceId) {
            this.values = [];
            this.counts = [];
            this.dimentions = [];
            this.setDataSourceId(dataSourceId);
        }
        DataSourceData.prototype.setValue = function (val, frequence) {
            if (frequence) {
                this.values.push(val);
                this.counts.push(frequence);
            }
            else {
                if (this.values) {
                    this.values = [];
                    this.counts = [];
                }
                this.value = val;
            }
        };
        DataSourceData.prototype.setProperty = function (name, value) {
            if (name === "" || value === "") {
                throw new Error("name or value shoud not be empty");
            }
            this.dimentions.push({
                Name: name,
                Value: value
            });
        };
        DataSourceData.prototype.setDataSourceId = function (did) {
            this.setProperty('DataSourceId', did);
        };
        DataSourceData.prototype.setTimestamp = function (t) {
            this.timestamp = t;
        };
        DataSourceData.prototype.toMetricData = function () {
            var _a = this, Value = _a.value, Values = _a.values, Counts = _a.counts, Timestamp = _a.timestamp, Dimensions = _a.dimentions;
            if (Values && Values.length > 0) {
                return { Values: Values, Counts: Counts, Timestamp: Timestamp || new Date(), Dimensions: Dimensions };
            }
            else {
                return { Value: Value, Timestamp: Timestamp || new Date(), Dimensions: Dimensions };
            }
        };
        return DataSourceData;
    }());
    ChunhuiCloud.DataSourceData = DataSourceData;
    var IInfoName;
    (function (IInfoName) {
        IInfoName["REGISTER"] = "REGISTER";
    })(IInfoName = ChunhuiCloud.IInfoName || (ChunhuiCloud.IInfoName = {}));
})(ChunhuiCloud = exports.ChunhuiCloud || (exports.ChunhuiCloud = {}));
function httpPost(url, rdata) {
    return new Promise(function (resolve, reject) {
        var urlObject = new URL(url);
        var data = JSON.stringify(rdata);
        console.log(urlObject.hostname);
        var options = {
            hostname: urlObject.hostname,
            port: urlObject.port,
            path: urlObject.pathname,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };
        var req = https_1.default.request(options, function (res) {
            console.log("statusCode: " + res.statusCode);
            // if (res.statusCode > 300 && res.statusCode < 400 && res.headers.location) {
            //     return httpPost(res.headers.location, rdata)       
            // }
            // cumulate data
            var body = [];
            res.on('data', function (chunk) {
                body.push(chunk);
            });
            res.on('end', function () {
                try {
                    body = body.join();
                }
                catch (e) {
                    reject(e);
                }
                resolve(body);
            });
        });
        req.on('error', function (error) {
            reject(error);
        });
        req.write(data);
        req.end();
    });
}
