# Digital Battery Sign-out Sheet

## Introduction
Hello! The purpose of this program is to digitally log Battery sign-outs, including the the battery number, time signed out/in, and battery stats (rint and state of charge) before and after use.

## Use
To log in or log out a battery, press the A button on the keypad. From there, follow the prompts on the screen to log in a battery or to log out a battery. When you first enter the battery number, the program will search the database to see if the battery is currently signed out and will adjust the prompts accordingly; no need to specify whether you are signing a battery in and out. The battery number can be any number or floating point number to meet a variety of labeling standards. If you need to make modifications to this, please change the line `batteryNumber: Number,` in batterySchema.js to `batteryNumber: String,`. After following the prompts, the information you entered will be presented back to you so you can confirm its accuracy. Please note, at this time it is **Not Possible** to revert any changes to a log in/log out so please be sure the information you entered is correct. The log will be saved to a local MongoDB database. If a the Raspberry Pi is connected to the internet, it will sync any changes made to the database with google sheets. 

## Hardware

#### hardware required: 
1. Raspberry Pi with wifi
2. 4x4 keypad 
3. 16x4 I2C LCD Display
4. power adapter

## Software


### dependencies:

#### Software Required:
* python
* node js 
* mongoDb

#### Node Dependencies:
* mongoose
* node-cron
* google-apis 

#### Accounts Required:
* google account (for google cloud)   

### Setup
* check to see if python3.6 is installed. On a clean install of Raspbian, it should be preinstalled. Check to see if its installed and what version you are running with `python3 --version`.
* 

