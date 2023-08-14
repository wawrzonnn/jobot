import { Scrapper } from '../bot/scrapper/scrapper'
import { ScrapperOptions } from '../bot/scrapper/types'

const findOffers = async () => {
	console.log('Scrapping...')
	const options: ScrapperOptions = {
		searchValue: 'front-end-developer',
		maxRecords: 10,
	}

	const scrapper = new Scrapper(options)

	await scrapper.initialize()
	await scrapper.navigate()

	const offers = await scrapper.getJobOffers()
	console.log(`Found ${offers.length} job offers:`)
	offers.forEach(offer => {
		console.log('Title:', offer.title)
		console.log('Description:', offer.description)
		console.log('Company:', offer.company)
		console.log('Salary From:', offer.salaryFrom)
		console.log('SalaryTo:', offer.salaryTo)
		console.log('Currency:', offer.currency)
		console.log('OfferURL:', offer.offerURL)
		console.log('tech:', offer.tech)
		console.log('addedAt:', offer.addedAt)
		console.log('----------')
	})

	await scrapper.close()
}

findOffers()
