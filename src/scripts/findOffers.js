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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOffers = void 0;
var scrapperBulldogJob_1 = require("../bot/scrapper/scrapperBulldogJob");
var scrapperIndeed_1 = require("../bot/scrapper/scrapperIndeed");
var fs_1 = require("fs");
var path_1 = require("path");
var csv_writer_1 = require("csv-writer");
var findOffers = function (searchTerm, limit) {
    if (limit === void 0) { limit = 10; }
    return __awaiter(void 0, void 0, void 0, function () {
        var options, bulldogScrapper, bulldogOffers, indeedScrapper, indeedOffers, offers, offersToSaveCSV, offersToSaveJSON, outputPath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Scrapping...');
                    options = {
                        searchValue: searchTerm,
                        maxRecords: limit,
                    };
                    bulldogScrapper = new scrapperBulldogJob_1.ScrapperBulldogJob(options);
                    return [4 /*yield*/, bulldogScrapper.initialize()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, bulldogScrapper.navigate()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, bulldogScrapper.getJobOffers()];
                case 3:
                    bulldogOffers = _a.sent();
                    return [4 /*yield*/, bulldogScrapper.close()];
                case 4:
                    _a.sent();
                    indeedScrapper = new scrapperIndeed_1.ScrapperIndeed(options);
                    return [4 /*yield*/, indeedScrapper.initialize()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, indeedScrapper.navigate()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, indeedScrapper.getJobOffers()];
                case 7:
                    indeedOffers = _a.sent();
                    return [4 /*yield*/, indeedScrapper.close()];
                case 8:
                    _a.sent();
                    offers = __spreadArray(__spreadArray([], bulldogOffers, true), indeedOffers, true);
                    console.log("Found ".concat(offers.length, " job offers:"));
                    offersToSaveCSV = (0, csv_writer_1.createObjectCsvWriter)({
                        path: path_1.default.join(__dirname, '../../scrap-results/results.csv'),
                        header: [
                            { id: 'title', title: 'Title' },
                            { id: 'description', title: 'Description' },
                            { id: 'company', title: 'Company' },
                            { id: 'salaryFrom', title: 'Salary From' },
                            { id: 'salaryTo', title: 'Salary To' },
                            { id: 'currency', title: 'Currency' },
                            { id: 'offerURL', title: 'Offer URL' },
                            { id: 'technologies', title: 'Technologies' },
                            { id: 'addedAt', title: 'Added At' }
                        ]
                    });
                    return [4 /*yield*/, offersToSaveCSV.writeRecords(offers)];
                case 9:
                    _a.sent();
                    offersToSaveJSON = offers.map(function (offer) { return ({
                        Title: offer.title,
                        Description: offer.description,
                        Company: offer.company,
                        Salary_From: offer.salaryFrom,
                        Salary_To: offer.salaryTo,
                        Currency: offer.currency,
                        Offer_URL: offer.offerURL,
                        Technologies: offer.technologies,
                        Added_At: offer.addedAt
                    }); });
                    outputPath = path_1.default.join(__dirname, '../../scrap-results/results.json');
                    fs_1.default.writeFileSync(outputPath, JSON.stringify(offersToSaveJSON, null, 2));
                    offers.forEach(function (offer) {
                        console.log('Title:', offer.title);
                        console.log('Description:', offer.description);
                        console.log('Company:', offer.company);
                        console.log('Salary From:', offer.salaryFrom);
                        console.log('SalaryTo:', offer.salaryTo);
                        console.log('Currency:', offer.currency);
                        console.log('OfferURL:', offer.offerURL);
                        console.log('technologies:', offer.technologies);
                        console.log('addedAt:', offer.addedAt);
                        console.log('----------');
                    });
                    return [2 /*return*/];
            }
        });
    });
};
exports.findOffers = findOffers;
