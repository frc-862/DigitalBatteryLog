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
* This project is built with nodeJs and is confirmed working on the recommended version `16.14.2 LTS` To install nodeJS use the following commands
```
sudo apt-get update
sudo apt-get upgrade
sudo apt install nodejs
sudo apt install npm
 ```
* Next, clone the repository with the following commands:

> For SSH: 
```
git clone git@github.com:Mikecerc/BatteryLogSheetsUpdater.git
```

> For HTMl: 
```
git clone https://github.com/Mikecerc/BatteryLogSheetsUpdater.git
```
