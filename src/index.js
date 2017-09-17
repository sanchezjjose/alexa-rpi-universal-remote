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
        const mode = slots.mode.value || 'dry';
        const speed = slots.speed.value || 'auto';
        const temp = slots.temperature.value || '72';
        
        const query = `?mode=${mode}&temp=${temp}&speed=${speed}`;
        const requestUrl = SERVER_URL + '/on' + query;
        
        handleRequest.call(this, requestUrl);
    },

    'SetTemperatureIntent': function () {
        console.log('Called SetTemperatureIntent');

        const slots = this.event.request.intent.slots;
        const mode = slots.mode.value || 'dry';
        const speed = slots.speed.value || 'auto';
        const temp = slots.temperature.value || '72';

        const query = `?mode=${mode}&temp=${temp}&speed=${speed}`;
        const requestUrl = SERVER_URL + '/set' + query;
        
        handleRequest.call(this, requestUrl);
    }
};

function handleRequest (url) {
    request(url, (error, response, body) => {
        const data = JSON.parse(body);
        const mode = data.settings.mode;
        const speed = data.settings.speed;
        const temp = data.settings.temp;

        const outputSpeech = data.isOn ? 
            `Your unit is set to ${mode} on ${speed}, at ${temp} degrees.` : 
            'Your unit is off';
    
        if (!error && response.statusCode === 200) {
            this.emit(':tell', outputSpeech);

        } else {
            console.log('Request error: ', err);
            this.emit(':tell', 'Something went wrong. Please try again later.');
        }
    });
};
