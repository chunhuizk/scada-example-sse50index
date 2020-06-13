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
Object.defineProperty(exports, "__esModule", { value: true });
exports.report = exports.register = void 0;
var cloud_1 = require("@chunhuizk/cloud");
var scada = new cloud_1.Scada();
scada.setScadaId("5edd4d9ebaaae50007a5cb69");
scada.setSecret("secret");
var dataSourceIds = ['abc', 'def', 'ghi', 'jkl'];
var gatewayPhysicalId = 'SCADA-EXAMPLE-RANDOM-READING';
function register() {
    return __awaiter(this, void 0, void 0, function () {
        var gatewayData, _i, dataSourceIds_1, dataSourceId, dataSource, randomValue;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    gatewayData = scada.newGatewayData(gatewayPhysicalId);
                    for (_i = 0, dataSourceIds_1 = dataSourceIds; _i < dataSourceIds_1.length; _i++) {
                        dataSourceId = dataSourceIds_1[_i];
                        dataSource = gatewayData.newDataSourceData(dataSourceId);
                        randomValue = randomReading();
                        dataSource.setValue(randomValue);
                    }
                    return [4 /*yield*/, scada.register(gatewayData)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.register = register;
function report() {
    return __awaiter(this, void 0, void 0, function () {
        var gatewayData, _i, dataSourceIds_2, dataSourceId, dataSource, randomValue;
        return __generator(this, function (_a) {
            gatewayData = scada.newGatewayData(gatewayPhysicalId);
            for (_i = 0, dataSourceIds_2 = dataSourceIds; _i < dataSourceIds_2.length; _i++) {
                dataSourceId = dataSourceIds_2[_i];
                dataSource = gatewayData.newDataSourceData(dataSourceId);
                randomValue = randomReading();
                dataSource.setValue(randomValue);
            }
            console.log(gatewayPhysicalId, "report");
            scada.send(gatewayData).then(function (res) {
                console.log(JSON.stringify(gatewayData.toMetricDatas()));
            });
            return [2 /*return*/];
        });
    });
}
exports.report = report;
function randomReading(errChance) {
    if (errChance === void 0) { errChance = 0.05; }
    var weighted = function () { return Math.pow(Math.random(), errChance); };
    return Math.floor(weighted() * (100 - 0 + 1)) + 0;
}
