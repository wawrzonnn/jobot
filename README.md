<h1 align="center">
  🤖 Jobot
  <p align="center">
    <img src="./docs/jobotLogo.png" alt="Jobot Logo"/>
  </p>
</h1>
<p align="center">
  <a href="#introduction">Introduction</a> •
  <a href="#features">Features</a> •
  <a href="#technologies">Technologies</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#usage">Usage</a>
</p>

<br><br><br>

## Introduction

Jobot is a sophisticated bot created for scraping technology job boards. It combines Node.js and Puppeteer to automate and streamline the process of gathering job listings. This tool is ideal for tech professionals seeking targeted job opportunities and for developers interested in exploring web scraping and automation with Node.js and Puppeteer.
<br><br>

## Features

**·Automated Scraping**: Efficiently scrapes job listings from two selected tech job boards.

**·Search Functionality**: Offers an endpoint to retrieve job offers based on specific search values.

**·CLI Integration**: Enables users to generate a list of job offers using a Command Line Interface.

**·Customizable Results**: Users can specify the number of records to be retrieved.

**·Scheduled Scraping**: Uses node-schedule for regular updates of job listings.

<br><br>

## Technologies

**·Node.js**

**·TypeScript**

**·Puppeteer Extra and Stealth Plugin**

**·CSV-Write**

**·Yargs**

<br><br>

## Getting Started

**1. Clone the Repository**

```bash
https://github.com/wawrzonnn/jobot.git
```

**2. Install Dependencies**

```bash
npm install
```

**3. Run the Application**

```bash
npm run server
```

The application will be running on **http://localhost:4200.**
<br><br>

## Usage

To start scraping job offers, use the CLI command:

```bash
npm run scrap:offers
```

<br><br>

## Credits

Provided by [Nerdbord.io](https://nerdbord.io).
