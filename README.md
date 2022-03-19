# Digital Battery Sign-out Sheet

## Introduction
Hello! The purpose of this program is to digitally log Battery sign-outs, including the the battery number, time signed out/in, and battery stats (rint and state of charge) before and after use.

## Usage


## Hardware

#### hardware required: 
1. Raspberry Pi with wifi
3. RPI TFT 2.4" Hat
4. power adapter

## Software


### dependencies:

#### Software Required:
* node js 
* mongoDb

#### Node Dependencies:
* mongoose
* node-cron
* google-apis 

#### Accounts Required:
* google account (for google cloud)   

### Setup
* Note: These instructions are specifically for a raspberry pi running a plain raspbian install. If you are using another computer or a different distribution of linux, these steps may not be exactly the same.
* First clone the repository with the following commands:

> For SSH: 
```
git clone git@github.com:Mikecerc/DigitalBatteryLog.git
```

> For HTTPS: 
```
git clone https://github.com/Mikecerc/DigitalBatteryLog.git
```
* To install all dependencies and create all json files, run the following to run the install script
```bash
sudo ./install.sh
```
* Next, you must create an app via Google Cloud Platform. Follow the steps below to successfully setup the application, Oauth2 and Google Sheets API
    1. Using internet explorer, navigate to the [Google Cloud Platform]('https://console.cloud.google.com')
    2. agree to the terms of service and continue onto the main dashboard.
    3. click on `IAM & Admin`
    !(https://github.com/mikecerc/DigitalBatteryLog)
    4. Click "create a project"
    5. 


