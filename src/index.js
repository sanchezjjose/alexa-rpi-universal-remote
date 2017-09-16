'use strict';

const Alexa = require('alexa-sdk');
const request = require('request');

const SERVER_URL = process.env.SERVER_URL;
const APP_ID = process.env.APP_ID;

exports.handler = function(event, context, callback) {
    const alexa = Alexa.handler(event, context);

    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

const handlers = {

    'LaunchRequest': function () {
        console.log('Called LaunchRequest');
        this.emit('TurnOnIntent');
    },
    
    'TurnOnIntent': function () {
        console.log('Called TurnOnIntent');

        const slots = this.event.request.intent.slots;
        const mode = slots.mode.value || 'dry';
        const speed = slots.speed.value || 'auto';
        const temp = slots.temperature.value || '72';
        
        const query = `?mode=${mode}&temp=${temp}&speed=${speed}`;
        const requestUrl = SERVER_URL + '/on' + query;
        
        return request(requestUrl, (error, response, body) => {
            const outputSpeech = `Your unit is now on, and set to ${mode} on ${speed}, at ${temp} degrees.`;
        
            if (!error && response.statusCode == 200) {
                this.emit(':tell', outputSpeech);

            } else {
                console.log('Request error: ', err);
                this.emit(':tell', 'Something went wrong. Please try again later.');
            }
        });
    },

    'SetTemperatureIntent': function () {
        console.log('Called SetTemperatureIntent');

        const slots = this.event.request.intent.slots;
        const mode = slots.mode.value || 'dry';
        const speed = slots.speed.value || 'auto';
        const temp = slots.temperature.value || '72';

        const query = `?mode=${mode}&temp=${temp}&speed=${speed}`;
        const requestUrl = SERVER_URL + '/set' + query;
        
        return request(requestUrl, (error, response, body) => {
            const outputSpeech = `Your unit is now set to ${mode} on ${speed}, at ${temp} degrees.`;
        
            if (!error && response.statusCode == 200) {
                this.emit(':tell', outputSpeech);

            } else {
                console.log('Request error: ', err);
                this.emit(':tell', 'Something went wrong. Please try again later.');
            }
        });
    },

    'TurnOffIntent': function () {
        console.log('Called TurnOffIntent');

        const requestUrl = SERVER_URL + '/off';

        return request(requestUrl, (error, response, body) => {
        
            if (!error && response.statusCode == 200) {
                this.emit(':tell', 'Your unit is now off.');

            } else {
                console.log('Request error: ', err);
                this.emit(':tell', 'Something went wrong. Please try again later.');
            }
        });
    }
};
