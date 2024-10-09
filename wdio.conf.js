import allure from 'allure-commandline';
import fs, { open } from 'fs';
import path from 'path';
import { fileURLToPath, URL } from 'url';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import archiver from 'archiver';
import HtmlReporter, { ReportAggregator, ReportGenerator } from 'wdio-html-nice-reporter';
import puppeteer from 'puppeteer';
import report, { generate } from "multiple-cucumber-html-reporter";


// Get __dirname equivalent for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let reportAggregator = new ReportAggregator();

export const config = {
    //
    // ====================
    // Runner Configuration
    // ====================
    // WebdriverIO supports running e2e tests as well as unit and component tests.
    runner: 'local',
    //
    // ==================
    // Specify Test Files
    // ==================
    // Define which test specs should run. The pattern is relative to the directory
    // of the configuration file being run.
    //
    // The specs are defined as an array of spec files (optionally using wildcards
    // that will be expanded). The test for each spec file will be run in a separate
    // worker process. In order to have a group of spec files run in the same worker
    // process simply enclose them in an array within the specs array.
    //
    // The path of the spec files will be resolved relative from the directory of
    // of the config file unless it's absolute.
    //
    specs: [
        './features/**/*.feature'
    ],
    // Patterns to exclude.
    exclude: [
        // 'path/to/excluded/files'
    ],
    //
    // ============
    // Capabilities
    // ============
    // Define your capabilities here. WebdriverIO can run multiple capabilities at the same
    // time. Depending on the number of capabilities, WebdriverIO launches several test
    // sessions. Within your capabilities you can overwrite the spec and exclude options in
    // order to group specific specs to a specific capability.
    //
    // First, you can define how many instances should be started at the same time. Let's
    // say you have 3 different capabilities (Chrome, Firefox, and Safari) and you have
    // set maxInstances to 1; wdio will spawn 3 processes. Therefore, if you have 10 spec
    // files and you set maxInstances to 10, all spec files will get tested at the same time
    // and 30 processes will get spawned. The property handles how many capabilities
    // from the same test should run tests.
    //
    maxInstances: 10,
    //
    // If you have trouble getting all important capabilities together, check out the
    // Sauce Labs platform configurator - a great tool to configure your capabilities:
    // https://saucelabs.com/platform/platform-configurator
    //
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

    //
    // ===================
    // Test Configurations
    // ===================
    // Define all options that are relevant for the WebdriverIO instance here
    //
    // Level of logging verbosity: trace | debug | info | warn | error | silent
    logLevel: 'info',
    //
    // Set specific log levels per logger
    // loggers:
    // - webdriver, webdriverio
    // - @wdio/browserstack-service, @wdio/lighthouse-service, @wdio/sauce-service
    // - @wdio/mocha-framework, @wdio/jasmine-framework
    // - @wdio/local-runner
    // - @wdio/sumologic-reporter
    // - @wdio/cli, @wdio/config, @wdio/utils
    // Level of logging verbosity: trace | debug | info | warn | error | silent
    // logLevels: {
    //     webdriver: 'info',
    //     '@wdio/appium-service': 'info'
    // },
    //
    // If you only want to run your tests until a specific amount of tests have failed use
    // bail (default is 0 - don't bail, run all tests).
    bail: 0,
    //
    // Set a base URL in order to shorten url command calls. If your `url` parameter starts
    // with `/`, the base url gets prepended, not including the path portion of your baseUrl.
    // If your `url` parameter starts without a scheme or `/` (like `some/path`), the base url
    // gets prepended directly.
    // baseUrl: 'http://localhost:8080',
    //
    // Default timeout for all waitFor* commands.
    waitforTimeout: 1000000,
    //
    // Default timeout in milliseconds for request
    // if browser driver or grid doesn't send response
    connectionRetryTimeout: 12000000,
    //
    // Default request retries count
    connectionRetryCount: 3,
    //
    // Test runner services
    // Services take over a specific job you don't want to take care of. They enhance
    // your test setup with almost no effort. Unlike plugins, they don't add new
    // commands. Instead, they hook themselves up into the test process.
    services: ['visual'],

    // Framework you want to run your specs with.
    // The following are supported: Mocha, Jasmine, and Cucumber
    // see also: https://webdriver.io/docs/frameworks
    //
    // Make sure you have the wdio adapter package for the specific framework installed
    // before running any tests.
    framework: 'cucumber',
    
    //
    // The number of times to retry the entire specfile when it fails as a whole
    // specFileRetries: 1,
    //
    // Delay in seconds between the spec file retry attempts
    // specFileRetriesDelay: 0,
    //
    // Whether or not retried spec files should be retried immediately or deferred to the end of the queue
    // specFileRetriesDeferred: false,
    //
    // Test reporter for stdout.
    // The only one supported by default is 'dot'
    // see also: https://webdriver.io/docs/dot-reporter
    reporters: [ 'spec', 
      /*
      ['multiple-cucumber-html', {
        htmlReporter: {
          jsonFolder: './reports/html-reports/json-output',
          reportFolder: `./reports/html-reports/`,
      }
      }],
      */
     
      [HtmlReporter, {
          outputDir: './reports/html-reports/',  // Directory where the HTML report will be saved
          filename: 'report.html',        // Name of the generated report file
          reportTitle: 'Test Execution Report',     // Title for the HTML report
          // Optional configurations
          showInBrowser: true,                   // Automatically opens the report in the browser
          collapseTests: true,                   // Collapse tests in the report for easier navigation
          useOnAfterCommandForScreenshot: false, // Use screenshots (set to false if not needed)
          linkScreenshots: true,                 // If screenshots are taken, link them in the report
      }],
      /*
      ['allure', {
        outputDir: './allure-results',
        disableWebdriverStepsReporting: false,
        disableWebdriverScreenshotsReporting: false,
        useCucumberStepReporter: true
        }], 
        */
    ],

    // If you are using Cucumber you need to specify the location of your step definitions.
    cucumberOpts: {
        // <string[]> (file/dir) require files before executing features
        require: ['./features/step_definitions/*.js'], 
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


    //
    // =====
    // Hooks
    // =====
    // WebdriverIO provides several hooks you can use to interfere with the test process in order to enhance
    // it and to build services around it. You can either apply a single function or an array of
    // methods to it. If one of them returns with a promise, WebdriverIO will wait until that promise got
    // resolved to continue.
    /**
     * Gets executed once before all workers get launched.
     * @param {object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     */
    // onPrepare: function (config, capabilities) {
    // },
  //   onPrepare: function (config, capabilities) {
  //     const allureResultsDir = path.join(__dirname, 'allure-results');
  //     // Check if the allure-results folder exists
  //     if (fs.existsSync(allureResultsDir)) {
  //         // Read all files in the directory
  //         fs.readdir(allureResultsDir, (err, files) => {
  //             if (err) throw err;

  //             // Loop through each file and delete it
  //             for (const file of files) {
  //                 fs.unlink(path.join(allureResultsDir, file), err => {
  //                     if (err) throw err;
  //                 });
  //             }
  //             console.log('Cleared previous Allure results');
  //         });
  //     }
  // },

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

      // Clear the Allure results and report directories
      cleanDirectory(allureResultsDir);
      cleanDirectory(allureReportDir);
      cleanDirectory(reportsDir);
      
      reportAggregator = new ReportGenerator({
        outputDir: '.reports/html-reports/',
        filename: 'master-report.html',
        reportTitle: 'Master Report',
        browserName: 'chrome',
        collapseTests: true
      });
      //reportAggregator.clean();
      
  
  },
    /**
     * Gets executed before a worker process is spawned and can be used to initialize specific service
     * for that worker as well as modify runtime environments in an async fashion.
     * @param  {string} cid      capability id (e.g 0-0)
     * @param  {object} caps     object containing capabilities for session that will be spawn in the worker
     * @param  {object} specs    specs to be run in the worker process
     * @param  {object} args     object that will be merged with the main configuration once worker is initialized
     * @param  {object} execArgv list of string arguments passed to the worker process
     */
    // onWorkerStart: function (cid, caps, specs, args, execArgv) {
    // },
    /**
     * Gets executed just after a worker process has exited.
     * @param  {string} cid      capability id (e.g 0-0)
     * @param  {number} exitCode 0 - success, 1 - fail
     * @param  {object} specs    specs to be run in the worker process
     * @param  {number} retries  number of retries used
     */
    // onWorkerEnd: function (cid, exitCode, specs, retries) {
    // },
    /**
     * Gets executed just before initialising the webdriver session and test framework. It allows you
     * to manipulate configurations depending on the capability or spec.
     * @param {object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that are to be run
     * @param {string} cid worker id (e.g. 0-0)
     */
    // beforeSession: function (config, capabilities, specs, cid) {
    // },
    /**
     * Gets executed before test execution begins. At this point you can access to all global
     * variables like `browser`. It is the perfect place to define custom commands.
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs        List of spec file paths that are to be run
     * @param {object}         browser      instance of created browser/device session
     */
    // before: function (capabilities, specs) {
    // },
    /**
     * Runs before a WebdriverIO command gets executed.
     * @param {string} commandName hook command name
     * @param {Array} args arguments that command would receive
     */
    // beforeCommand: function (commandName, args) {
    // },
    /**
     * Cucumber Hooks
     *
     * Runs before a Cucumber Feature.
     * @param {string}                   uri      path to feature file
     * @param {GherkinDocument.IFeature} feature  Cucumber feature object
     */
    // beforeFeature: function (uri, feature) {
    // },
    /**
     *
     * Runs before a Cucumber Scenario.
     * @param {ITestCaseHookParameter} world    world object containing information on pickle and test step
     * @param {object}                 context  Cucumber World object
     */
    // beforeScenario: function (world, context) {
    // },
    /**
     *
     * Runs before a Cucumber Step.
     * @param {Pickle.IPickleStep} step     step data
     * @param {IPickle}            scenario scenario pickle
     * @param {object}             context  Cucumber World object
     */
    // beforeStep: function (step, scenario, context) {
    // },
    /**
     *
     * Runs after a Cucumber Step.
     * @param {Pickle.IPickleStep} step             step data
     * @param {IPickle}            scenario         scenario pickle
     * @param {object}             result           results object containing scenario results
     * @param {boolean}            result.passed    true if scenario has passed
     * @param {string}             result.error     error stack if scenario failed
     * @param {number}             result.duration  duration of scenario in milliseconds
     * @param {object}             context          Cucumber World object
     */
    // afterStep: function (step, scenario, result, context) {
    // },
    afterStep: async function (step, scenario, { error, duration, passed }, context) {
      if (error) {
        await browser.takeScreenshot();
        // var date = Date.now();
        // await browser.saveScreenshot("./allure-results/screenshots/Chrome-" + date + ".png")
      }
    },
    /**
     *
     * Runs after a Cucumber Scenario.
     * @param {ITestCaseHookParameter} world            world object containing information on pickle and test step
     * @param {object}                 result           results object containing scenario results
     * @param {boolean}                result.passed    true if scenario has passed
     * @param {string}                 result.error     error stack if scenario failed
     * @param {number}                 result.duration  duration of scenario in milliseconds
     * @param {object}                 context          Cucumber World object
     */
    // afterScenario: function (world, result, context) {
    // },
    /**
     *
     * Runs after a Cucumber Feature.
     * @param {string}                   uri      path to feature file
     * @param {GherkinDocument.IFeature} feature  Cucumber feature object
     */
    // afterFeature: function (uri, feature) {
    // },
    
    /**
     * Runs after a WebdriverIO command gets executed
     * @param {string} commandName hook command name
     * @param {Array} args arguments that command would receive
     * @param {number} result 0 - command success, 1 - command error
     * @param {object} error error object if any
     */
    // afterCommand: function (commandName, args, result, error) {
    // },
    /**
     * Gets executed after all tests are done. You still have access to all global variables from
     * the test.
     * @param {number} result 0 - test pass, 1 - test fail
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that ran
     */
    // after: function (result, capabilities, specs) {
    // },
    
    after: async function (result, capabilities, specs) {

      /*
      const reportError = new Error('Could not generate Allure report')
      const generation = allure(['generate', 'allure-results', '--clean'])
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
  */
  },


    /**
     * Gets executed right after terminating the webdriver session.
     * @param {object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that ran
     */
    // afterSession: function (config, capabilities, specs) {
    // },
    /**
     * Gets executed after all workers got shut down and the process is about to exit. An error
     * thrown in the onComplete hook will result in the test run failing.
     * @param {object} exitCode 0 - success, 1 - fail
     * @param {object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {<Object>} results object containing test results
     */
    // onComplete: function(exitCode, config, capabilities, results) {
    // },
    onComplete: async function(exitCode, config, capabilities, results) {

      console.log('Results object:', results);
      try {
        await reportAggregator.createReport();
        console.log('Master report generated successfully');
      } catch (error) {
          console.error('Error while generating the master report:', error);
      }
      
      /*
      function zipDirectory(sourceDir, outPath) {
        const archive = archiver('zip', { zlib: { level: 9 } });
        const stream = fs.createWriteStream(outPath);
    
        return new Promise((resolve, reject) => {
            archive
                .directory(sourceDir, false)
                .on('error', err => reject(err))
                .pipe(stream);
    
            stream.on('close', () => resolve());
            archive.finalize();
        });
    }
    zipDirectory('allure-report', 'allure-report.zip')
        .then(() => console.log('Allure report zipped successfully'))
        .catch(err => console.error('Error while zipping the report:', err));
      */
        /*
        async function generatePDF() {
          console.log("INSIDE FUNCTION")
          try {
            console.log("INSIDE TRY BLOCK")
            const browser = await puppeteer.launch({headless: false});
            const page = await browser.newPage();
            console.log("AFTER LAUNCH")
            const reportPath = new URL(`file://${process.cwd()}/allure-report/index.html`);
            const response = await page.goto(reportPath.href, { waitUntil: 'networkidle0' });
            if (!response || !response.ok()) {
              console.error('Failed to load the report page:', response?.status());
              await puppeteerBrowser.close();
              return;
            }
            try {
              await page.pdf({ path: 'C:/Users/DELL/Downloads/Swag-Labs-automation/report.pdf', format: 'A4' });
              console.log('PDF generated successfully!');
              } catch (error) {
                  console.error('Error generating PDF:', error);
              }
            await puppeteerBrowser.close();
          } 
          catch (error) {
              console.error('Error launching Puppeteer:', error);
          }
          
      }

      generatePDF().catch(console.error);
    */

    /*
      () => {
        report.generate({
          jsonDir: "./reports/html-reports/json-output/",
          reportPath: "./reports/html-reports/",
        });
      };
      */


      /*
      const OAuth2 = google.auth.OAuth2;
      
      const oauth2Client = new OAuth2(
        '48578771741-2mr5g8ghr4egrsgbhpjhrmm3uv6oooqd.apps.googleusercontent.com',       
        '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',    
        'https://developers.google.com/oauthplayground' // Redirect URL
      );

      // Set your refresh token here
      oauth2Client.setCredentials({
        refresh_token: '1//04JuL5ORkAf95CgYIARAAGAQSNwF-L9IrKmOPUe6sf7OtIAgpRUjgeibvy6hkv1LpS3iJS67k0JSEey2hSKosWjB3k7Xql_uXUgQ', // Refresh token obtained from OAuth 2.0 Playground
      });

      async function sendEmail() {
        try {
          const accessToken = await oauth2Client.getAccessToken();

          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              type: 'OAuth2',
              user: 'nashita.shameena@gmail.com', // Your Gmail address
              clientId: '48578771741-2mr5g8ghr4egrsgbhpjhrmm3uv6oooqd.apps.googleusercontent.com',
              clientSecret: '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',
              refreshToken: '1//04JuL5ORkAf95CgYIARAAGAQSNwF-L9IrKmOPUe6sf7OtIAgpRUjgeibvy6hkv1LpS3iJS67k0JSEey2hSKosWjB3k7Xql_uXUgQ',
              accessToken: accessToken.token, // Access token generated from OAuth2
            },
          });

          const reportFilePath = path.resolve('./repots/html-reports/', 'master-report-0-0.html');
        
          // Read the test report from the file system
          const reportContent = fs.readFileSync(reportFilePath, 'utf8');

          const mailOptions = {
            from: 'nashita.shameena@gmail.com',
            to: 'nashita.shameena@gmail.com', 
            subject: 'Test Email',
            attachments: [
              {
                  filename: 'master-report-0-0.html',
                  path: reportFilePath, 
                  contentType: 'text/html'
              }
            ],
            text: 'Hello from Node.js with OAuth2! This email contains the test report for the first scenario.',
            html: reportContent,
          };

          const result = await transporter.sendMail(mailOptions);
          console.log('Email sent: ', result);
        } catch (error) {
          console.error('Error sending email: ', error);
        }
      }

      try {
        await sendEmail();
      } 
      catch (error) {
          console.error('Error sending email:', error);
      }
    */
  },
  

    /**
    * Gets executed when a refresh happens.
    * @param {string} oldSessionId session ID of the old session
    * @param {string} newSessionId session ID of the new session
    */
    // onReload: function(oldSessionId, newSessionId) {
    // }
    /**
    * Hook that gets executed before a WebdriverIO assertion happens.
    * @param {object} params information about the assertion to be executed
    */
    // beforeAssertion: function(params) {
    // }
    /**
    * Hook that gets executed after a WebdriverIO assertion happened.
    * @param {object} params information about the assertion that was executed, including its results
    */
    // afterAssertion: function(params) {
    // }
}
