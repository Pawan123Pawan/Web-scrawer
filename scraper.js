const puppeteer = require("puppeteer");
const fs = require("fs");
const { parse } = require("json2csv");
const companyData = require("./companyData");

// Function to scrape company data
async function scrapeCompanyData(companyName) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // Navigate to LinkedIn search page
    await page.goto("https://www.linkedin.com/search/results/companies/", {
      waitUntil: "networkidle2",
    });

    // Wait for the input field to be available
    await page.waitForSelector('input[role="combobox"]');

    // Type company name in search input
    await page.type('input[role="combobox"]', companyName);

    // Click search button
    await page.click('button[aria-label="Search"]');

    // Wait for search results to load
    await page.waitForSelector(".search-results__list");

    // Click on the first search result (assuming it's the company page)
    await page.click(".search-result__info a");

    // Wait for company page to load
    await page.waitForSelector(".org-top-card-primary-actions");

    // Extract company website
    const website = await page.$eval(
      ".org-top-card-primary-actions a",
      (a) => a.href
    );

    // Extract company LinkedIn URL
    const linkedinUrl = page.url();

    // Extract contact information of key personnel (assuming it's in a specific format)
    const contactInfo = await page.evaluate(() => {
      const ceo = document
        .querySelector('div[data-control-name="topcard_view_all_positions"]')
        .textContent.trim();
      // Extract more contact info as needed
      return { ceo };
    });

    return { website, linkedinUrl, ...contactInfo };
  } catch (error) {
    console.error(`Error scraping data for ${companyName}: ${error}`);
    return { website: "", linkedinUrl: "", ceo: "" }; // Return empty data in case of error
  } finally {
    await browser.close();
  }
}

// Function to scrape data for multiple companies
async function scrapeCompanies(companies) {
  const scrapedData = [];
  for (const company of companies) {
    const data = await scrapeCompanyData(company);
    scrapedData.push({ company, ...data });
  }
  return scrapedData;
}

// Main function to initiate scraping
async function main() {
  // Scrape data for the companies
  const scrapedData = await scrapeCompanies(companyData);

  // Convert scraped data to CSV
  const csv = parse(scrapedData, {
    fields: ["company", "website", "linkedinUrl", "ceo"],
  });

  // Write CSV to file
  fs.writeFileSync("scraped_data.csv", csv, "utf-8");
}

main(); // Execute the main function
