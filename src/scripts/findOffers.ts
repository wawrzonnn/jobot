import { ScrapperBulldogJob } from '../bot/scrapper/scrapperBulldogJob';
import { ScrapperIndeed } from '../bot/scrapper/scrapperIndeed'
import { ScrapperOptions } from '../bot/scrapper/types'

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