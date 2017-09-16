#!/bin/bash

zip -r dist/app.zip src/*

aws --region us-east-1 lambda update-function-code --function-name alexa-rpi-universal-remote --zip-file fileb://dist/app.zip --profile home
