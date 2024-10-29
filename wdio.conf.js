import allure from 'allure-commandline';
import fs, { open } from 'fs';
import path from 'path';
import { fileURLToPath, URL } from 'url';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import HtmlReporter, { ReportAggregator, ReportGenerator } from 'wdio-html-nice-reporter';

// Get __dirname equivalent for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let retryCount = 0;
const maxRetries = 1;

//let reportAggregator = new ReportAggregator();

export const config = {
   
  runner: 'local',
  specs: [
      './features/**/*.feature'
  ],
  exclude: [
      // 'path/to/excluded/files'
  ],
  maxInstances: 10,
  capabilities: [
      {
        maxInstances: 1,
        browserName: 'chrome',
        'goog:chromeOptions': {
          args: [
            // Additional options you want to set
          ],
          excludeSwitches: [
            'enable-logging',
            'enable-bidi-mapper'  // This disables the BiDi CDP Mapper
          ]
        }
      }
    ],
  logLevel: 'info',
  bail: 0,
  waitforTimeout: 1000000,
  connectionRetryTimeout: 12000000,
  connectionRetryCount: 3,
  services: ['visual'],
  framework: 'cucumber',
  reporters: [ 'spec',
    /*
    [HtmlReporter, {
        outputDir: './reports/html-reports/',  // Directory where the HTML report will be saved
        filename: 'report.html',        // Name of the generated report file
        reportTitle: 'Test Execution Report',     // Title for the HTML report
        browserName: 'chrome',
        // Optional configurations
        showInBrowser: true,                   // Automatically opens the report in the browser
        collapseTests: true,                   // Collapse tests in the report for easier navigation
        useOnAfterCommandForScreenshot: false, // Use screenshots (set to false if not needed)
        linkScreenshots: true,                 // If screenshots are taken, link them in the report
    }],
    */
    ['allure', {
      outputDir: './allure-results',
      disableWebdriverStepsReporting: false,
      disableWebdriverScreenshotsReporting: false,
      useCucumberStepReporter: true
      }], 
  ],

  // If you are using Cucumber you need to specify the location of your step definitions.
  cucumberOpts: {
      // <string[]> (file/dir) require files before executing features
      require: ['./features/step_definitions/*.js'], 

      format: ['json:./reports/html-reports/json-output/cucumber_report.json'], 
      // <boolean> show full backtrace for errors
      backtrace: false,
      // <string[]> ("extension:module") require files with the given EXTENSION after requiring MODULE (repeatable)
      requireModule: [],
      // <boolean> invoke formatters without executing steps
      dryRun: false,
      // <boolean> abort the run on first failure
      failFast: false,
      // <string[]> Only execute the scenarios with name matching the expression (repeatable).
      name: [],
      // <boolean> hide step definition snippets for pending steps
      snippets: true,
      // <boolean> hide source uris
      source: true,
      // <boolean> fail if there are any undefined or pending steps
      strict: false,
      // <string> (expression) only execute the features or scenarios with tags matching the expression
      tagExpression: '',
      // <number> timeout for step definitions
      timeout: 60000,
      // <boolean> Enable this config to treat undefined definitions as warnings.
      ignoreUndefinedDefinitions: false
  },

  onPrepare: function (config, capabilities) {
    console.log('Clearing old test results and reports...');
    
    // Path to your results and reports directories
    const allureResultsDir = path.join(__dirname, 'allure-results');
    const allureReportDir = path.join(__dirname, 'allure-report');
    const reportsDir = path.join(__dirname, 'reports')
    
    // Function to clean up directories
    const cleanDirectory = (dirPath) => {
        if (fs.existsSync(dirPath)) {
            fs.readdirSync(dirPath).forEach((file) => {
                const currentPath = path.join(dirPath, file);
                if (fs.lstatSync(currentPath).isDirectory()) {
                    cleanDirectory(currentPath); // Recursively delete subdirectories
                } else {
                    fs.unlinkSync(currentPath); // Delete files
                }
            });
            console.log(`Cleared directory: ${dirPath}`);
        }
    };

    cleanDirectory(allureResultsDir);
    cleanDirectory(allureReportDir);
    cleanDirectory(reportsDir);
  },

  afterStep: async function (step, scenario, { error, duration, passed }, context) {
    if (error) {
      await browser.takeScreenshot();
      var date = Date.now();
      await browser.saveScreenshot("./reports/html-reports/screenshots/Chrome-" + date + ".png")
    }
  },

  afterScenario: async function(scenario) {
    if (scenario.result.status === 'FAILED') {
      retryCount++;
      if (retryCount <= maxRetries) {
          console.log(`Retrying scenario: ${scenario.pickle.name} (Attempt ${retryCount})`);
          await browser.reloadSession(); // Optionally reload the session
          await browser.call(() => this.runScenario(scenario.pickle.name));
      } else {
          console.log(`Scenario failed after ${maxRetries} attempts: ${scenario.pickle.name}`);
          retryCount = 0; // Reset the count after exceeding the max retries
        }
    } else {
        retryCount = 0; // Reset on success
    }
  },

  after: async function (result, capabilities, specs) {
    const reportError = new Error('Could not generate Allure report')
    const generation = allure(['generate', '--single-file', 'allure-results', '--clean'])
    return new Promise((resolve, reject) => {
        const generationTimeout = setTimeout(
            () => reject(reportError),
            10000)

        generation.on('exit', function(exitCode) {
            clearTimeout(generationTimeout)

            console.log(`Allure CLI process exited with code: ${exitCode}`);

            if (exitCode !== 0) {
                return reject(reportError)
            }

            console.log('Allure report successfully generated')
            resolve()
        })
    })
  },
};