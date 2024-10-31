// CustomHtmlReporter.mjs
import Reporter from '@wdio/reporter';
import fs from 'fs';
import path from 'path';

class CustomHtmlReporter extends Reporter {
    constructor(options) {
        super(options);
        this.scenarioResults = [];
        this.summary = {
            totalScenarios: 0,
            passedScenarios: 0,
            failedScenarios: 0,
        };
    }

    // Treat each scenario as a suite
    onSuiteStart(suite) {
        // Ignore the feature-level suite (e.g., "Saucedemo website") and only track scenarios
        if (!suite.parent) return; // Skip the root feature

        this.summary.totalScenarios += 1;
        this.scenarioResults.push({
            title: suite.title,
            start: Date.now(),
            state: 'running',
        });
    }

    // Track each scenario's pass/fail status
    onSuiteEnd(suite) {
        if (!suite.parent) return; // Skip the root feature

        const scenario = this.scenarioResults.find(s => s.title === suite.title);
        scenario.duration = Date.now() - scenario.start;

        // Check if any test within the scenario suite failed
        const hasFailures = suite.tests.some(test => test.state === 'failed');
        scenario.state = hasFailures ? 'failed' : 'passed';

        if (scenario.state === 'passed') {
            this.summary.passedScenarios += 1;
        } else {
            this.summary.failedScenarios += 1;
        }
    }

    // Generate HTML report on complete
    onRunnerEnd() {
        const htmlContent = this.generateHtml();
        const outputPath = path.join(this.options.outputDir || './', 'html-report.html');

        fs.writeFileSync(outputPath, htmlContent);
        console.log(`\n[CustomHtmlReporter] Report saved at ${outputPath}`);
    }

    // HTML structure for the report
    generateHtml() {
        return `
            <!DOCTYPE html>
            <html>
            <p>Hi! This email contains an overview of the test results. Please download the attachment and open it in any browser to view the complete report.</p>
            <head>
                <title>WebdriverIO Test Execution Report</title>
                <style>
                    .summary-table {
                        width: 100%;
                        max-width: 500px;
                        margin-bottom: 20px;
                        border-collapse: separate;
                        border-spacing: 4px;
                        background-color: #fafafa;
                        border-radius: 8px;
                        overflow: hidden;
                        font-family: Arial, sans-serif;
                    }
                    .summary-table th{
                        padding: 12px 15px;
                        text-align: left;
                        font-size: 1em;
                        font-weight: bold;
                        background-color: #111111;
                        text-transform: uppercase;
                        border-bottom: 3px solid #000000;
                        border-right: 3px solid #000000;
                    }
                    .summary-table td{
                        padding: 12px 15px;
                        text-align: center;
                        font-size: 1em;
                        font-weight: bold;
                        background-color: #ededed;
                        border-bottom: 3px solid #e0e0e0;
                        border-right: 3px solid #e0e0e0;
                    }
                    .summary-table tr:last-child td {
                        border-bottom: none;
                    }
                    /* Passed and Failed header colors */
                    .summary-table .passed-header {
                        background-color: #28a745; /* Green for passed */
                        border-bottom: 3px solid #228f3b;
                        border-right: 3px solid #228f3b;
                        color: #ffffff;
                    }
                    .summary-table .failed-header {
                        background-color: #dc3545; /* Red for failed */
                        border-bottom: 3px solid #b02835;
                        border-right: 3px solid #b02835;
                        color: #ffffff;
                    }

                    body { font-family: Arial, sans-serif; background-color: #f3f4f6; color: #333; }
                    .summary { margin-bottom: 20px; font-size: 1.1em; }
                    .passed { color: #28a745; font-weight: bold; }
                    .failed { color: #dc3545; font-weight: bold; }

                    /* Table Styling */
                    table { 
                        width: 100%; 
                        border-collapse: separate; 
                        border-spacing: 8px; /* Space between cells for shadow effect */
                        background-color: #fafafa;
                    }
                    /* Header Cell Styling */
                    th { 
                        padding: 15px; 
                        background-color: #0b2e5c; 
                        color: #ffffff; 
                        font-weight: bold; 
                        text-transform: uppercase;
                        border-radius: 4px;
                        border-bottom: 3px solid #061b36;
                        border-right: 3px solid #061b36;
                    }
                    /* Data Cell Styling */
                    td { 
                        padding: 15px; 
                        text-align: center; 
                        background-color: #ededed;
                        border-radius: 4px;
                        border-bottom: 3px solid #e0e0e0;
                        border-right: 3px solid #e0e0e0;
                    }
                    .suite-title {
                        text-align: left;
                    }
                </style>
            </head>
            <body>
                <h1>Test Execution Report</h1>
                <table class="summary-table">
                    <tr>
                        <th>Total Test Suites</th>
                        <td>${this.summary.totalScenarios}</td>
                    </tr>
                    <tr>
                        <th class="passed-header">Passed Test Suites</th>
                        <td class="passed">${this.summary.passedScenarios}</td>
                    </tr>
                    <tr>
                        <th class="failed-header">Failed Test Suites</th>
                        <td class="failed">${this.summary.failedScenarios}</td>
                    </tr>
                </table>
                <table>
                    <tr>
                        <th>Suite Name</th>
                        <th>Status</th>
                        <th>Duration (ms)</th>
                    </tr>
                    ${this.scenarioResults.map((scenario) => `
                        <tr>
                            <td class="suite-title">${scenario.title}</td>
                            <td class="${scenario.state}">${scenario.state}</td>
                            <td>${scenario.duration || 'N/A'}</td>
                        </tr>
                    `).join('')}
                </table>
            </body>
            </html>
        `;
    }
}

export default CustomHtmlReporter;
