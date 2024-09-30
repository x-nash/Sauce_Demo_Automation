# Swag Labs Automation

This project contains the automation script for testing four end-to-end scenarios in the [Swag Labs](https://www.saucedemo.com) website. 

## Pre-requisites

You have to have a few things installed on your system for successful completion of the test
+ [Chrome Browser](https://support.google.com/chrome/answer/95346?hl=en&co=GENIE.Platform%3DDesktop#zippy=)
+ [Node.js](https://nodejs.org/en/download/prebuilt-installer)
+ Any IDE (I use [VS Code](https://code.visualstudio.com/download))

## Steps to execute the test

1. Clone the repository to your local machine.
2. Run `npm install` on the terminal of the project folder. You can see a new `node_modules` folder popping up in the folder.
3. Run `npx wdio run ./wdio.conf.js`
