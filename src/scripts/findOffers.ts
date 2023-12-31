import { ScrapperBulldogJob } from '../bot/scrapper/scrapperBulldogJob';
import { ScrapperIndeed } from '../bot/scrapper/scrapperIndeed'
import { ScrapperOptions } from '../bot/scrapper/types'
import fs from 'fs';
import path from 'path';
import { createObjectCsvWriter } from 'csv-writer';

export const findOffers = async (searchTerm: string, limit: number = 10) => {
    console.log('Scrapping...');
    const options: ScrapperOptions = {
        searchValue: searchTerm,
        maxRecords: limit,
    };


    const bulldogScrapper = new ScrapperBulldogJob(options);
    await bulldogScrapper.initialize();
    await bulldogScrapper.navigate();
    const bulldogOffers = await bulldogScrapper.getJobOffers();
    await bulldogScrapper.close();

    const indeedScrapper = new ScrapperIndeed(options);
    await indeedScrapper.initialize();
    await indeedScrapper.navigate();
    const indeedOffers = await indeedScrapper.getJobOffers();
    await indeedScrapper.close();

    const offers = [...bulldogOffers, ...indeedOffers];
    console.log(`Found ${offers.length} job offers:`);

    const offersToSaveCSV = createObjectCsvWriter({
        path: path.join(__dirname, '../../scrap-results/results.csv'),
        header: [
            {id: 'title', title: 'Title'},
            {id: 'description', title: 'Description'},
            {id: 'company', title: 'Company'},
            {id: 'salaryFrom', title: 'Salary From'},
            {id: 'salaryTo', title: 'Salary To'},
            {id: 'currency', title: 'Currency'},
            {id: 'offerURL', title: 'Offer URL'},
            {id: 'technologies', title: 'Technologies'},
            {id: 'addedAt', title: 'Added At'}
        ]
    });
    
    await offersToSaveCSV.writeRecords(offers);


    const offersToSaveJSON = offers.map(offer => ({
        Title: offer.title,
        Description: offer.description,
        Company: offer.company,
        Salary_From: offer.salaryFrom,
        Salary_To: offer.salaryTo,
        Currency: offer.currency,
        Offer_URL: offer.offerURL,
        Technologies: offer.technologies,
        Added_At: offer.addedAt
    }));

    const outputPath = path.join(__dirname, '../../scrap-results/results.json');
    fs.writeFileSync(outputPath, JSON.stringify(offersToSaveJSON, null, 2));

    offers.forEach(offer => {
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

}

