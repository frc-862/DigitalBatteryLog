#!/bin/bash

if [ "$EUID" -eq 0 ] ; then
    echo "Installer must be run as root!"
    exit 1
fi

#ensure some important directories exist
mkdir -p "config/auth"

# checks if .env exists. If it doesn't, then prompts user for contents and creates one
if [[ ! -f ".env" ]]; then   
    echo ".env does not exist, creating it now"
    echo "In minutes how often do you want to sync data with google sheets?"
    echo "Please enter an integer"
    read -r syncTime
    echo "# the interval at which the program will attempt to sync any database changes to google sheets." > ".env"
    echo "syncInterval=$syncTime " > ".env"
    echo "please enter the link to the google sheets you are logging your data in"
    read -r sheetLink
    echo "#full url of the google sheet you are logging data on"> ".env"
    echo "sheetURL=$sheetLink" > ".env"
    echo "#mongoDB Database address"
    echo "databaseAddress=mongodb://localhost:27017/test" > ".env"
    echo "#permissions for google OAuth2" > ".env"
    echo "scopes=[\"https://www.googleapis.com/auth/spreadsheets\"]" > ".env"

fi

# checks if nvm is installed, then installs it if it is not. 
nvmVersion=$(nvm --version)
if [[ $nvmVersion == "v0.39.1" ]]; then
    echo "nvm is installed"
else 
    touch ~/.bash_profile
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh
    source ~/.bashrc
fi 

# checks if nodejs is installed, then installs it if not (with nvm)
nodeVersion=$(node --version)
if [[ ! $nodeVersion == "v16.14.2" ]]; then
    echo "node is not installed"
else 
    nvm install node v16.14.2
fi 

#installs npm dependencies 
npm install