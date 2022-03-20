#!/bin/bash

if [[ $USER != "root" ]]; then
    echo "Installer must be run as root!"
    exit 1
fi

if [[ ! -d "config/constants"]]; then
    echo "constants folder doesn't exist, making one now"
    mkdir -p "config/constants"
fi 

if [[ ! -d "config/auth"]]; then
    echo "auth folder doesn't exist, making one now"
    mkdir -p "config/auth"
fi 
