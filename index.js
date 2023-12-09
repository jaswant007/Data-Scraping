const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const readline = require('readline');

puppeteer.use(StealthPlugin());

// Create a function to prompt user input in the command line
function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }));
}

// Function to type with random delay to mimic human typing
async function typeWithDelay(page, selector, text, delay = 100) {
    for (let character of text) {
        await page.type(selector, character);
        await page.waitForTimeout(delay + Math.random() * 100); // Random delay
    }
}

async function automateLogin() {
    let browser;
    try {
        // Launch browser in headless mode
        browser = await puppeteer.launch({ 
            headless: true, // Set to false if you need to see the browser UI for debugging
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();

        // Set a custom user agent and viewport
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36');
        await page.setViewport({ width: 1280, height: 800 });

        // Navigate to the website
        await page.goto('https://www.linkedin.com/login?fromSignIn=true&trk=guest_homepage-basic_nav-header-signin');

        // Ask for username and password
        const username = await askQuestion("Enter username: ");
        const password = await askQuestion("Enter password: ");

        // Enter the credentials and login
        await page.waitForTimeout(1000 + Math.random() * 500);
        await typeWithDelay(page, '#username', username);
        await page.waitForTimeout(1000 + Math.random() * 500);
        await typeWithDelay(page, '#password', password);

        // Mimic human-like interactions
        await page.waitForSelector('.btn__primary--large.from__button--floating');
        await page.hover('.btn__primary--large.from__button--floating');
        await page.waitForTimeout(1000 + Math.random() * 500);
        await page.click('.btn__primary--large.from__button--floating');

        // Wait for navigation after login
        await page.waitForNavigation({ waitUntil: 'networkidle0' });

        // Take a screenshot as proof of login
        await page.waitForTimeout(1000 + Math.random() * 500);
        await page.screenshot({ path: 'login-success_1.0.png' });

        console.log('Login successful, screenshot saved.');

    } catch (error) {
        console.error('Error during automation:', error);
    } finally {
        if (browser) await browser.close();
    }
}

automateLogin();

    //await Promise.all([
    //    page.waitForNavigation({ waitUntil: 'networkidle0' }),
    //    await page.click('.search-global-typeahead__collapsed-search-button-text.t-black--light.t-12 t-normal') // Using the class selector
    //]);
 
