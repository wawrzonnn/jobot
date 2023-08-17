import { ScrapperOptions, JobOffer } from './types'
import { ScrapperBase } from './scrapperBase'

export class ScrapperBulldogJob extends ScrapperBase {
	options: ScrapperOptions

	constructor(options: ScrapperOptions) {
		super()
		this.options = options
	}

	async navigate(): Promise<void> {
		if (!this.page) {
			throw new Error('Page has not been initialized. Please call initialize() first.')
		}
		const url = `https://bulldogjob.pl/companies/jobs/s/role,${this.options.searchValue}`
		try {
			await this.page.goto(url)
		} catch (error) {
			console.error('Error navigating to the page:', error)
			throw new Error('Failed to navigate to the page.')
		}
	}

	async parseSalary(salaryText: string): Promise<{ salaryFrom: string; salaryTo: string; currency: string }> {
		const regex = /(\d{1,3}(?:[\s]\d{3})*)(?:\s*-\s*)(\d{1,3}(?:[\s]\d{3})*)(?:\s*)([A-Z]+)/
		const match = salaryText.match(regex)

		if (match) {
			const salaryFrom = match[1].replace(/\s/g, '') 
			const salaryTo = match[2].replace(/\s/g, '') 
			const currency = match[3]

			return { salaryFrom, salaryTo, currency }
		}
		return { salaryFrom: 'unknown', salaryTo: 'unknown', currency: 'unknown' }
	}

    async getJobOffers(): Promise<JobOffer[]> {
        if (!this.page) {
            throw new Error('Page has not been initialized. Please call initialize() first.');
        }

//znajdujemy jeden element <a> w klasie .container ( oferta pracy )
        // const elementA = await this.page.$('.container a'); 
        // if (elementA) {
        //     const link = await elementA.evaluate(node => node.getAttribute('href'));
        //     // przechodzimy do linku
        //     await this.page.goto(link, { waitUntil: 'networkidle0' });  // czekamy aż załaduje się cała strona
        //     // pobieramy content z h1
        //     const h1Content = await this.page.$eval('h1', h2 => h2.textContent);
        //     console.log('h1:', h1Content);
        // } else {
        //     console.log('nie znaleziono h1');
        // } // no i to działa pięknie
        

        //teraz spróbujemy znaleźć ich kilka i wyświetlić wszystkie
        const h1Contents = []; 
        const elementyA = await this.page.$$('.container a');
        for (const elemencik of elementyA) {
            const newPage = await this.browser.newPage(); 
            try {
                const link = await elemencik.evaluate(a => a.getAttribute('href'));
                await newPage.goto(link);
                const h1Content = await newPage.$eval('h1', h1 => h1.textContent.trim());
                h1Contents.push(h1Content);
            } catch (error) {
                console.error('dupa kościotrupa:', error);
            } finally {
                await newPage.close(); 
            }
        }


        const jobOffersLiElements = await this.page.$$('.container a');
        const offers = await Promise.all(
            jobOffersLiElements.map(async offer => {
                const [salaryText, title, description, company, technologies, offerURL] = await Promise.all([
                    this.extractFromElement(offer, '.text-dm div'),
                    this.extractFromElement(offer, 'div > h3'),
                    this.extractFromElement(offer, '.job-snippet'),
                    this.extractFromElement(offer, '.text-xxs'),
                    this.extractTechStackFromOffer(offer, 'span.py-2'),
                    offer.evaluate(a => a.getAttribute('href'))
                ]);
    
                const { salaryFrom, salaryTo, currency } = await this.parseSalary(salaryText);
    
                let addedAt = ''; 
                // try {
               
                //     await this.page.goto(offerURL, { waitUntil: 'networkidle0' });
                //     addedAt = await this.page.$eval('h1', h1 => h1.textContent.trim());
                // } catch (error) {
                //     console.error('chujnia z grzybnia:', error);
                // }
    
                return {
                    title,
                    description,
                    company,
                    salaryFrom,
                    salaryTo,
                    currency,
                    offerURL,
                    technologies,
                    addedAt,
                };
            })
        );
    
        return offers.filter(offer => offer && offer.title).slice(0, this.options.maxRecords);
    }
}
