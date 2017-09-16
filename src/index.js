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

    'GetStatusIntent': () => {
        console.log('Called GetStatusIntent');

        return handleRequest(SERVER_URL + '/status', this);
    },

    'TurnOffIntent': () => {
        console.log('Called TurnOffIntent');

        return handleRequest(SERVER_URL + '/off', this);
    },
    
    'TurnOnIntent': () => {
        console.log('Called TurnOnIntent');

        const slots = this.event.request.intent.slots;
        const mode = slots.mode.value || 'dry';
        const speed = slots.speed.value || 'auto';
        const temp = slots.temperature.value || '72';
        
        const query = `?mode=${mode}&temp=${temp}&speed=${speed}`;
        const requestUrl = SERVER_URL + '/on' + query;
        
        return handleRequest(requestUrl, this);
    },

    'SetTemperatureIntent': () => {
        console.log('Called SetTemperatureIntent');

        const slots = this.event.request.intent.slots;
        const mode = slots.mode.value || 'dry';
        const speed = slots.speed.value || 'auto';
        const temp = slots.temperature.value || '72';

        const query = `?mode=${mode}&temp=${temp}&speed=${speed}`;
        const requestUrl = SERVER_URL + '/set' + query;
        
        return handleRequest(requestUrl, this);
    }
};

function handleRequest (url, context) {
    return request(url, (error, response, body) => {
        console.log(body);
    
        if (!error && response.statusCode === 200) {
            context.emit(':tell', body);

        } else {
            console.log('Request error: ', err);
            context.emit(':tell', 'Something went wrong. Please try again later.');
        }
    });
};
