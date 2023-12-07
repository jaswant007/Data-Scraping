const puppeteer = require('puppeteer');
const readline = require('readline');

// Create a function to prompt user input in the command line
function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }))
}

async function automateLogin() {
    // Launch browser
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // Navigate to the website
    await page.goto('https://www.linkedin.com/login?fromSignIn=true&trk=guest_homepage-basic_nav-header-signin');

    // Ask for username and password
    const username = await askQuestion("Enter username: ");
    const password = await askQuestion("Enter password: ");

    // Enter the credentials and login (selectors should be replaced with actual ones from the website)
    await page.type('#username', username);
    await page.type('#password', password);
    await page.click('#loginButton');

    // Wait for navigation after login
    await page.waitForNavigation();

    // Further actions...
    // Note: Puppeteer cannot directly open the browser's developer tools
}

automateLogin();
