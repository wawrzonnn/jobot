import { ScrapperBulldogJob } from '../bot/scrapper/scrapperBulldogJob';
import { ScrapperIndeed } from '../bot/scrapper/scrapperIndeed'
import { ScrapperOptions } from '../bot/scrapper/types'
import fs from 'fs';
import path from 'path';

export const findOffers = async (searchTerm: string) => {
    console.log('Scrapping...');
    const options: ScrapperOptions = {
        searchValue: searchTerm,
        maxRecords: 10,
    };

    const scrapper = new ScrapperBulldogJob(options);

    await scrapper.initialize();
    await scrapper.navigate();

    const offers = await scrapper.getJobOffers();
    console.log(`Found ${offers.length} job offers:`);

    const offersToSave = offers.map(offer => ({
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
    fs.writeFileSync(outputPath, JSON.stringify(offersToSave, null, 2));

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

    await scrapper.close();
}

const searchTerm = process.argv[2] || 'frontend'; 
findOffers(searchTerm);