# Swag Labs Automation

This project contains the automation script for testing four end-to-end scenarios in the [Swag Labs](https://www.saucedemo.com) website. 

## Pre-requisites

You have to have a few things installed on your system for successful completion of the test
+ [Chrome Browser](https://support.google.com/chrome/answer/95346?hl=en&co=GENIE.Platform%3DDesktop#zippy=)
+ [Node.js](https://nodejs.org/en/download/prebuilt-installer)
+ Any IDE (I use [VS Code](https://code.visualstudio.com/download))
+ [Java](https://www.oracle.com/in/java/technologies/downloads/#jdk21-windows) (To generate Allure report)

## Steps to run the project

1. Clone the repository to your local machine.
2. Open the folder in your IDE.
3. Open the terminal here and run the command `npm install`. You can see a new `node_modules` folder popping up in your project folder.
4. Create folders named "allure-results" and "html-report" in the project folder. (This step is required only if you want the test reports to be genrated and saved into these folders)
5. Run `npm run wdio`. You can see the automated tests being executed.

<blockquote>    
 [!TIP]
 
 If you want the tests to be sent via gmail to any email account, add the following code inside the `config` object in the `wdio.conf.js` file before running the tests:

 ```
   onComplete: async function(exitCode, config, capabilities, results) {
    const OAuth2 = google.auth.OAuth2;
     
    const oauth2Client = new OAuth2(
      'YOUR_CLIENT_ID', // Replace with your client ID     
      'YOUR_CLIENT_SECRET', // Replace with your client secret 
      'https://developers.google.com/oauthplayground' 
    );

    // Set your refresh token here
    oauth2Client.setCredentials({
      refresh_token: 'YOUR_REFRESH_TOKEN', // Replace with your refresh token
    });

    async function sendEmail() {
      try {
        const accessToken = await oauth2Client.getAccessToken();

       const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            type: 'OAuth2',
            user: 'your_email@gmail.com', // Replace with your Gmail address
            clientId: 'YOUR_CLIENT_ID', // Replace with your client ID
            clientSecret: 'YOUR_CLIENT_SECRET', // Replace with your client secret 
            refreshToken: 'YOUR_REFRESH_TOKEN', // Replace with your refresh token
            accessToken: accessToken.token, 
          },
        });

       const allureReportPath = path.resolve('./allure-report', 'index.html');
        const htmlReportPath = path.resolve('./html-report', 'html-report.html');
        const htmlReportContent = fs.readFileSync(htmlReportPath, { encoding: 'utf8' });;
    
        const mailOptions = {
          from: 'your_email@gmail.com', // Replace with your Gmail address
          to: 'any_mail@gmail.com', // Replace with any mail address you want to send the report to
          subject: 'Swag Labs Automation Test Report',
          html: htmlReportContent,
          attachments: [
            {
                filename: 'allure-report.html',
                path: allureReportPath, 
                contentType: 'text/html'
            }
          ], 
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
  }
  ```

  You can obtain your client ID and client secret by following these steps:
  1. Create a new project in the [Google Cloud Console](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&ved=2ahUKEwiy1vuJ9biJAxVCUGwGHc-OD2wQFnoECAsQAQ&url=https%3A%2F%2Fconsole.cloud.google.com%2F&usg=AOvVaw1GxwHR1WZnDu0xsR-djCrv&opi=89978449) 
  2. Navigate to APIs & Services > Credentials
  3. Click on Create Credentials and get your client ID and client secret

  You can obtain your refresh token by following these steps:
  1. Visit [Oauth 2.0 Playground](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwiZx7nT9riJAxXcXmwGHRcgCCQQFnoECAoQAQ&url=https%3A%2F%2Fdevelopers.google.com%2Foauthplayground%2F&usg=AOvVaw0LyXLRlzKY6XvGSFcXAJD3&opi=89978449)
  2. In the settings select the "Use your own OAuth credentials" checkbox and enter your client ID and client secret
  3. Now on the left side of the screen, in Step 1, scroll to "Gmail API v1" and select `https://mail.google.com/` and click on "Authorize APIs" button
  4. Now in Step 2, click on "Exchange authorization code for tokens" and get your refresh token
</blockquote>

