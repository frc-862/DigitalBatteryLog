#!/bin/bash

# Screen defaults
ADAFRUIT_SCREEN_SIZE="2.8"
ADAFRUIT_TOUCH_ENABLED=false
ADAFRUIT_TOUCH_RESISTIVE=true

while [[ $# -gt 0 ]]; do
  case $1 in
    -t|--touch)
      SEARCHPATH="$2"
      shift # past argument
      ;;
    --toggle-touch-type )
      SEARCHPATH="$2"
      shift # past arg
      ;;
    --screen-size)
      EXTENSION="$2"
      shift # past argument
      shift # past value
      ;;
    -*|--*)
      echo "Unknown option $1"
      exit 1
      ;;
    *)
      POSITIONAL_ARGS+=("$1") # save positional arg
      shift # past argument
      ;;
  esac
done

set -- "${POSITIONAL_ARGS[@]}" # restore positional parameters

#ensure some important directories exist
mkdir -p "config/auth"

# checks if .env exists. If it doesn't, then prompts user for contents and creates one
if [[ ! -f ".env" ]]; then   
    echo ".env does not exist, creating it now"
    echo "In minutes how often do you want to sync data with google sheets?"
    read -r syncTime
    echo "# the interval at which the program will attempt to sync any database changes to google sheets." > ".env"
    echo "syncInterval=$syncTime " > ".env"
    echo "please enter the link to the google sheets you are logging your data in"
    read -r sheetLink
    echo "#full url of the google sheet you are logging data on"> ".env"
    echo "sheetURL=$sheetLink" > ".env"
    echo "#mongoDB Database address"
    echo "databaseAddress=mongodb://localhost:27017/batteryLogs" > ".env"
    echo "#permissions for google OAuth2" > ".env"
    echo "scopes=[\"https://www.googleapis.com/auth/spreadsheets\"]" > ".env"

fi

# checks if nvm is installed, then installs it if it is not. 
# requires source ~/.profile to be run to ensure nvm is available
export NVM_DIR=$HOME/.nvm
source $NVM_DIR/nvm.sh
if [[ $(nvm --version) == "0.39.1" ]]; then
    echo "NVM is installed, continuing..."
else 
    wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
    source ~/.profile
fi 

# checks if nodejs is installed, then installs it if not (with nvm)
if [[ $(node --version) == "v16.14.2" ]]; then
    echo "Node is installed, continuing..."
else 
    nvm install 16.14.2
fi 

#installs npm dependencies 
npm install