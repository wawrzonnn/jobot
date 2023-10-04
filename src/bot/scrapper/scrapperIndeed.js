"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
exports.ScrapperIndeed = void 0;
var scrapperBase_1 = require("./scrapperBase");
var ScrapperIndeed = /** @class */ (function (_super) {
    __extends(ScrapperIndeed, _super);
    function ScrapperIndeed(options) {
        var _this = _super.call(this) || this;
        _this.options = options;
        return _this;
    }
    ScrapperIndeed.prototype.navigate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var url, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.page) {
                            throw new Error('Page has not been initialized. Please call initialize() first.');
                        }
                        url = "https://www.indeed.com/q-".concat(this.options.searchValue, "-jobs.html");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.page.goto(url)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error('Error navigating to the page:', error_1);
                        throw new Error('Failed to navigate to the page.');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ScrapperIndeed.prototype.parseSalary = function (salaryText) {
        return __awaiter(this, void 0, void 0, function () {
            var regex, match, currency, salaryFrom, salaryTo;
            return __generator(this, function (_a) {
                regex = /Estimated ([\$€£¥])?([\d\.]+[KMB]?) - ([\$€£¥])?([\d\.]+[KMB]?)/;
                match = salaryText.match(regex);
                if (match) {
                    currency = match[1] || match[3];
                    salaryFrom = match[2];
                    salaryTo = match[4];
                    return [2 /*return*/, { salaryFrom: salaryFrom, salaryTo: salaryTo, currency: currency }];
                }
                return [2 /*return*/, { salaryFrom: 'unknown', salaryTo: 'unknown', currency: 'unknown' }];
            });
        });
    };
    ScrapperIndeed.prototype.getJobOffers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var jobOffersLiElements, offers;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.page) {
                            throw new Error('Page has not been initialized. Please call initialize() first.');
                        }
                        return [4 /*yield*/, this.page.$$('.css-zu9cdh li')];
                    case 1:
                        jobOffersLiElements = _a.sent();
                        return [4 /*yield*/, Promise.all(jobOffersLiElements.map(function (offer) { return __awaiter(_this, void 0, void 0, function () {
                                var salaryText, _a, salaryFrom, salaryTo, currency, offerURL, _b, addedAtText, daysAgo, match, postedDate;
                                var _c;
                                return __generator(this, function (_d) {
                                    switch (_d.label) {
                                        case 0: return [4 /*yield*/, this.extractFromElement(offer, '.estimated-salary > span')];
                                        case 1:
                                            salaryText = _d.sent();
                                            return [4 /*yield*/, this.parseSalary(salaryText)];
                                        case 2:
                                            _a = _d.sent(), salaryFrom = _a.salaryFrom, salaryTo = _a.salaryTo, currency = _a.currency;
                                            _b = 'https://www.indeed.com';
                                            return [4 /*yield*/, this.extractFromElement(offer, 'h2 > a', 'href')];
                                        case 3:
                                            offerURL = _b + (_d.sent());
                                            return [4 /*yield*/, this.extractFromElement(offer, '.date')];
                                        case 4:
                                            addedAtText = _d.sent();
                                            daysAgo = 0;
                                            match = addedAtText.match(/(\d+|30\+?) days ago/);
                                            if (match) {
                                                if (match[1] === '30+?') {
                                                    daysAgo = 30;
                                                }
                                                else {
                                                    daysAgo = parseInt(match[1]);
                                                }
                                            }
                                            postedDate = new Date();
                                            postedDate.setDate(postedDate.getDate() - daysAgo);
                                            _c = {};
                                            return [4 /*yield*/, this.extractFromElement(offer, 'h2 > a > span')];
                                        case 5:
                                            _c.title = _d.sent();
                                            return [4 /*yield*/, this.extractFromElement(offer, '.job-snippet')];
                                        case 6:
                                            _c.description = _d.sent();
                                            return [4 /*yield*/, this.extractFromElement(offer, '.companyName')];
                                        case 7:
                                            _c.company = _d.sent(),
                                                _c.salaryFrom = salaryFrom,
                                                _c.salaryTo = salaryTo,
                                                _c.currency = currency,
                                                _c.offerURL = offerURL;
                                            return [4 /*yield*/, this.extractTechStackFromOffer(offer, '.tech-stack')];
                                        case 8: return [2 /*return*/, (_c.technologies = _d.sent(),
                                                _c.addedAt = postedDate.toISOString().split('T')[0],
                                                _c)];
                                    }
                                });
                            }); }))];
                    case 2:
                        offers = _a.sent();
                        return [2 /*return*/, offers
                                .filter(function (offer) { return offer && offer.title && offer.description && offer.company; })
                                .slice(0, this.options.maxRecords)];
                }
            });
        });
    };
    return ScrapperIndeed;
}(scrapperBase_1.ScrapperBase));
exports.ScrapperIndeed = ScrapperIndeed;
