import puppeteer, { Browser, Page } from 'puppeteer';

export interface ScrapperOptions {
   searchValue: string;
   maxRecords: number;
}

export class Scrapper {
    private browser: Browser | null = null;
    private page: Page | null = null;

    constructor(private options: ScrapperOptions) {}

    async initialize(): Promise<void> {
        this.browser = await puppeteer.launch({ headless: false });
        this.page = await this.browser.newPage();
    }

    async navigate(url: string): Promise<void> {
        if (!this.page) {
            throw new Error('Page has not been initialized. Please call initialize() first.');
        }
        await this.page.goto(url);
    }

    async getText(selector: string): Promise<string> {
        if (!this.page) {
            throw new Error('Page has not been initialized. Please call initialize() first.');
        }
        return this.page.$eval(selector, el => el.textContent || '');
    }

    async close(): Promise<void> {
        if (this.browser) {
            await this.browser.close();
        }
    }
}