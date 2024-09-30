# Swag Labs Automation

This project contains the automation script for testing four end-to-end scenarios in the [Swag Labs](https://www.saucedemo.com) website. 

## Pre-requisites

You have to have a few things installed on your system for successful completion of the test
+ [Chrome Browser](https://support.google.com/chrome/answer/95346?hl=en&co=GENIE.Platform%3DDesktop#zippy=)
+ [Node.js](https://nodejs.org/en/download/prebuilt-installer)
+ Any IDE (I use [VS Code](https://code.visualstudio.com/download))

## Steps to run the project

1. Clone the repository to your local machine.
2. Open the folder in your IDE.
3. Open the terminal here and run the command `npm install`. You can see a new `node_modules` folder popping up in your project folder.
4. Run `npx wdio run ./wdio.conf.js`
