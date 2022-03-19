#!/bin/bash

if [[ $USER != "root" ]]; then
    echo "Installer must be run as root!"
    exit 1
fi