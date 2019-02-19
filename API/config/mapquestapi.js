'use strict';


//todo exemple here
// e.g : https://developer.mapquest.com/documentation/open/geocoding-api/address/get/

const mapquestapi = {
    "endpoint_geocoding": "http://open.mapquestapi.com/geocoding/v1/address?",
    "api_key": "key=XHhhkJgPcQYKEMYyjKiKvf19SXx9wjzH",
    "param_location": "&location=",
    "geocoding_uri": `http://open.mapquestapi.com/geocoding/v1/address?key=XHhhkJgPcQYKEMYyjKiKvf19SXx9wjzH&location=`,
};


module.exports.mapquestapi = mapquestapi;