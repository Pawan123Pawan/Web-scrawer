<h1>WEB SCRAWER</h2>
# LinkedIn Company Data Scraper

## Overview

This project is a web scraper built with Node.js and Puppeteer to extract company data from LinkedIn, including company websites, LinkedIn URLs, and CEO information.

## Setup

To use this scraper, follow these steps:

1. Clone the repository: `git clone <repository_url>`
2. Install dependencies: `npm install`
3. Run the scraper: `node scrawer.js`

Make sure you have Node.js and npm installed on your system before proceeding.

## Usage

After running the scraper, it will scrape data for the companies listed in the `companyData.js` file and save the results in a CSV file named `scraped_data.csv`.

## Dependencies

- Puppeteer: For controlling headless Chrome browser
- fs: For file system operations
- json2csv: For converting JSON data to CSV format
