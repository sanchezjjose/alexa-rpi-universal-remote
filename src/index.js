'use strict';

const Alexa = require('alexa-sdk');
const request = require('request');

const SERVER_URL = process.env.SERVER_URL;
const APP_ID = process.env.APP_ID;

exports.handler = (event, context, callback) => {
    const alexa = Alexa.handler(event, context);

    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

const handlers = {

    'GetStatusIntent': function () {
        console.log('Called GetStatusIntent');
        handleRequest.call(this, SERVER_URL + '/status');
    },

    'TurnOffIntent': function () {
        console.log('Called TurnOffIntent');
        handleRequest.call(this, SERVER_URL + '/off');
    },
    
    'TurnOnIntent': function () {
        console.log('Called TurnOnIntent');

        const slots = this.event.request.intent.slots;
        const mode  = slots.mode.value        || 'dry';
        const speed = slots.speed.value       || 'auto';
        const temp  = slots.temperature.value || '72';
        
        const query = `?mode=${mode}&temp=${temp}&speed=${speed}`;
        const requestUrl = SERVER_URL + '/on' + query;
        
        handleRequest.call(this, requestUrl);
    },

    'SetTemperatureIntent': function () {
        console.log('Called SetTemperatureIntent');

        const slots = this.event.request.intent.slots;
        const mode  = slots.mode.value        || 'dry';
        const speed = slots.speed.value       || 'auto';
        const temp  = slots.temperature.value || '72';

        const query = `?mode=${mode}&temp=${temp}&speed=${speed}`;
        const requestUrl = SERVER_URL + '/set' + query;
        
        handleRequest.call(this, requestUrl);
    },

    'ComfortableIntent': function () {
        console.log('Called ComfortableIntent');
        
        const message = 'Okay, making the room comfortable for you.';
        const query = `?mode=dry&temp=68&speed=auto`;
        const requestUrl = SERVER_URL + '/set' + query;
        
        handleRequest.call(this, requestUrl, message);
    },

    'CoolIntent': function () {
        console.log('Called CoolIntent');

        const message = 'Okay, lets cool it down real smooth.';
        const query = `?mode=cool&temp=68&speed=high`;
        const requestUrl = SERVER_URL + '/set' + query;
        
        handleRequest.call(this, requestUrl, message);
    },

    'WarmIntent': function () {
        console.log('Called WarmIntent');

        const message = 'Okay, time to get cozy. Making it warm for you.';
        const query = `?mode=heat&temp=68&speed=auto`;
        const requestUrl = SERVER_URL + '/set' + query;
        
        handleRequest.call(this, requestUrl, message);
    },

    'HotIntent': function () {
        console.log('Called HotIntent');

        const message = 'Okay, lets make it nice and toasty.';
        const query = `?mode=heat&temp=76&speed=high`;
        const requestUrl = SERVER_URL + '/set' + query;
        
        handleRequest.call(this, requestUrl, message);
    }
};

function handleRequest (url, msg) {
    request(url, (error, response, body) => {
        const data = JSON.parse(body);
        const mode = data.settings.mode;
        const speed = data.settings.speed;
        const temp = data.settings.temp;
        const message = msg || 'Ok';

        const outputSpeech = data.isOn ? 
            `${message}. Your unit is set to ${mode} on ${speed}, at ${temp} degrees.` : 
            'Your unit is off';
    
        if (!error && response.statusCode === 200) {
            this.emit(':tell', outputSpeech);

        } else {
            console.log('Request error: ', err);
            this.emit(':tell', 'Something went wrong. Please try again later.');
        }
    });
};
