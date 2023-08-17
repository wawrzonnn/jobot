import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Browser, Page } from 'puppeteer';

puppeteer.use(StealthPlugin());

export abstract class ScrapperBase {
  protected browser: Browser | null = null;
  protected page: Page | null = null;

  async initialize(): Promise<void> {
    this.browser = await puppeteer.launch({ headless: false, defaultViewport: null });
    this.page = await this.browser.newPage();
  }

  abstract navigate(): Promise<void>;
  abstract getJobOffers(): Promise<any>;

  async extractFromElement(element: any | null, selector: string, attribute?: string): Promise<string> {
    if (!this.page || !element) return '';
    const childElement = await element.$(selector);
    if (!childElement) return '';
    
    if (attribute) {
        return await this.page.evaluate((el, attribute) => el.getAttribute(attribute), childElement, attribute);
    } else {
        return await this.page.evaluate(el => el.textContent.trim(), childElement);
    }
}

async extractTechStackFromOffer(element: any | null, selector: string): Promise<string[]> {
    if (!this.page || !element) return [];
    const childElements = await element.$$(selector);
    return await Promise.all(childElements.map(el => this.page!.evaluate(el => el.textContent.trim(), el)));
}

async close(): Promise<void> {
  if (this.browser) {
    await this.browser.close();
  }
}
}