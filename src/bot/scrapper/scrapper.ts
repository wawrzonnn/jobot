import puppeteer, { Browser, Page } from 'puppeteer'
import { ScrapperOptions, JobOffer } from './types'

export class Scrapper {
	browser: Browser | null = null
	page: Page | null = null
	options: ScrapperOptions

	constructor(options: ScrapperOptions) {
		this.options = options
	}
	async initialize(): Promise<void> {
		this.browser = await puppeteer.launch({ headless: false, defaultViewport: null })
		this.page = await this.browser.newPage()
	}

	async navigate(): Promise<void> {
		if (!this.page) {
			throw new Error('Page has not been initialized. Please call initialize() first.')
		}
		const url = `https://www.indeed.com/q-${this.options.searchValue}-jobs.html`
		await this.page.goto(url)
	}

	async extractFromElement(element: any | null, selector: string, attribute?: string): Promise<string> {
		if (!this.page || !element) return ''
		const childElement = await element.$(selector)
		if (!childElement) return ''

		if (attribute) {
			return await this.page.evaluate((el, attribute) => el.getAttribute(attribute), childElement, attribute) // get attribute value if need
		} else {
			return await this.page.evaluate(el => el.textContent.trim(), childElement) //get element content
		}
	}
	async extractTechStack(element: any | null, selector: string): Promise<string[]> {
		if (!this.page || !element) return []
		const childElements = await element.$$(selector)
		return await Promise.all(childElements.map(el => this.page!.evaluate(el => el.textContent.trim(), el)))
	}

	//Parses the salary string from the job offer.
	//Extracts the minimum salary, maximum salary, and currency.
	//If the salary information is not found, it returns 'unknown'.
	async parseSalary(salaryText: string): Promise<{ salaryFrom: string; salaryTo: string; currency: string }> {
		const regex = /Estimated ([\$€£¥])?([\d\.]+[KMB]?) - ([\$€£¥])?([\d\.]+[KMB]?)/
		const match = salaryText.match(regex)

		if (match) {
			const currency = match[1] || match[3]
			const salaryFrom = match[2]
			const salaryTo = match[4]

			return { salaryFrom, salaryTo, currency }
		}
		return { salaryFrom: 'unknown', salaryTo: 'unknown', currency: 'unknown' }
	}

	async getJobOffers(): Promise<JobOffer[]> {
		if (!this.page) {
			throw new Error('Page has not been initialized. Please call initialize() first.')
		}

		const jobOffersLiElements = await this.page.$$('.jobsearch-ResultsList li')
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
					tech: await this.extractTechStack(offer, '.tech-stack'),
					addedAt: postedDate.toISOString().split('T')[0],
				}
			})
		)

		return offers
			.filter(offer => offer && offer.title && offer.description && offer.company)
			.slice(0, this.options.maxRecords)
	}

	async close(): Promise<void> {
		if (this.browser) {
			await this.browser.close()
		}
	}
}
