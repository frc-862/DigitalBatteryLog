#!/bin/bash

if [ "$EUID" -eq 0 ] ; then
    echo "Installer must be run as root!"
    exit 1
fi

#ensure some important directories exist
mkdir -p "config/constants"
mkdir -p "config/auth"

if [[ ! -f "config/constants/constants.json" ]]; then   
    echo "constants.json does not exist, creating it now"
    echo "In minutes how often do you want to sync data with google sheets?"
    echo "Please enter an integer"
    read -r syncTime
    touch "config/constants/constants.json"
    echo "{ \"SyncIntervalMinutes\": $syncTime }" > "config/constants/constants.json"
fi

if [[ ! -f "config/constants/googleAPIConstants.json" ]]; then   
    echo "googleAPIConstants.json does not exist, creating it now"
    echo "please enter the link to the google sheets you are logging your data in"
    read -r sheetLink
    touch "config/constants/googleAPIConstants.json"
    echo "{ \"scopes\": [\"https://www.googleapis.com/auth/spreadsheets\"], \"sheetURL\": \"$sheetLink\" }" > "config/constants/googleAPIConstants.json"
fi

if [[ ! -f "config/constants/mongoDBConstants.json" ]]; then 
    echo "mongoDBConstants.json does not exist, creating it now"
    touch "config/constants/mongoDBConstants.json"
    echo "{ \"mongoDBAddress\": \"mongodb://localhost:27017/test\" }" > "config/constants/mongoDBConstants.json"
fi

nvmVersion=$(nvm --version)
if [[ $nvmVersion == "v0.39.1" ]]; then
    echo "nvm is installed"
else 
    touch ~/.bash_profile
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
fi 
