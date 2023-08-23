import { ScrapperOptions, JobOffer } from './types';
import { ScrapperBase } from './scrapperBase';

export class ScrapperIndeed extends ScrapperBase {
  options: ScrapperOptions;

  constructor(options: ScrapperOptions) {
    super();
    this.options = options;
  }

  async navigate(): Promise<void> {
    if (!this.page) {
      throw new Error('Page has not been initialized. Please call initialize() first.');
    }
    const url = `https://www.indeed.com/q-${this.options.searchValue}-jobs.html`;
    try {
      await this.page.goto(url);
    } catch (error) {
      console.error('Error navigating to the page:', error);
      throw new Error('Failed to navigate to the page.');
    }
  }

  async parseSalary(salaryText: string): Promise<{ salaryFrom: string; salaryTo: string; currency: string }> {
    const regex = /Estimated ([\$€£¥])?([\d\.]+[KMB]?) - ([\$€£¥])?([\d\.]+[KMB]?)/;
    const match = salaryText.match(regex);

    if (match) {
      const currency = match[1] || match[3];
      const salaryFrom = match[2];
      const salaryTo = match[4];

      return { salaryFrom, salaryTo, currency };
    }
    return { salaryFrom: 'unknown', salaryTo: 'unknown', currency: 'unknown' };
  }

  async getJobOffers(): Promise<JobOffer[]> {
		if (!this.page) {
			throw new Error('Page has not been initialized. Please call initialize() first.')
		}
	
const jobOffersLiElements = await this.page.$$('.css-zu9cdh li');
		const offers = await Promise.all(
			jobOffersLiElements.map(async offer => {
				const salaryText = await this.extractFromElement(offer, '.estimated-salary > span')
				const { salaryFrom, salaryTo, currency } = await this.parseSalary(salaryText)
				
				const offerURL = 'https://www.indeed.com' + (await this.extractFromElement(offer, 'h2 > a', 'href'))

				let addedAtText = await this.extractFromElement(offer, '.date')
				let daysAgo = 0
				const match = addedAtText.match(/(\d+|30\+?) days ago/)
				if (match) {
					if (match[1] === '30+?') {
						daysAgo = 30
					} else {
						daysAgo = parseInt(match[1])
					}
				}
				const postedDate = new Date()
				postedDate.setDate(postedDate.getDate() - daysAgo)

				return {
					title: await this.extractFromElement(offer, 'h2 > a > span'),
					description: await this.extractFromElement(offer, '.job-snippet'),
					company: await this.extractFromElement(offer, '.companyName'),
					salaryFrom,
					salaryTo,
					currency,
					offerURL,
					technologies: await this.extractTechStackFromOffer(offer, '.tech-stack'),
					addedAt: postedDate.toISOString().split('T')[0],
				}
			})
		)

		return offers
			.filter(offer => offer && offer.title && offer.description && offer.company)
			.slice(0, this.options.maxRecords)
	}
}
