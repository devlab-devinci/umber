const express = require('express');
const router = express.Router();
const errorManager = require('../services/errorManager');
const mongoose = require('mongoose');

const Store = require('../models/Store');

const geolib = require('geolib');
const axios = require('axios');

const mapquestapi = require('../config/mapquestapi').mapquestapi;

/**
 * GET
 * Get stores via current position of device (limit 5000m (5 km around the current position)
 */
router.get('/position/stores/:lat/:lon', function (req, res, next) {
    let current_position_lat = req.params.lat;
    let current_position_lon = req.params.lon;
    console.log("ok", parseFloat(current_position_lat));
    console.log("ok", parseFloat(current_position_lon));

    Store
        .find({})
        .populate('StorePicture')
        .exec(function (err, stores) {
            if (stores) {
                let storesAround = [];

                for (let i in stores) {
                    let distanceMeter = geolib.getDistance(
                        {latitude: parseFloat(current_position_lat), longitude: parseFloat(current_position_lon)},
                        {latitude: parseFloat(stores[i].mapQuestLat), longitude: parseFloat(stores[i].mapQuestLng)}
                    );
                    if (distanceMeter > 5000 /*5km*/) {
                        //do nothing its too far.
                    } else {
                        storesAround.push(stores[i]);
                    }
                }

                if (storesAround.length === 0) {
                    // Aucun magasin trouvés dans les alentour.
                    res
                        .status(200)
                        .json({
                            "data": storesAround,
                            "message": "Aucun magasins à moins de 5km.",
                            "status": 200
                        })
                } else {
                    // send list stores around
                    console.log("STORE AROUNDé", storesAround.length);
                    res
                        .status(200)
                        .json({
                            "data": storesAround,
                            "message": `${storesAround.length} magasins trouvés.`,
                            "status": 200
                        })
                }


            } else {
                errorManager
                    .handler(res, "stores not found", "stores empty")
            }
        })

});


router.get('/geocoding/localisation/:fullAddress/define/localisation', function (req, res, next) {
    //send destinitation from alert and parse to coordonnee lat / lon pour etre ensuite utilisé dans la route au dessus
    let localisation = req.params.fullAddress;
    axios
        .get(`${mapquestapi.geocoding_uri}${encodeURIComponent(localisation).trim()}`)
        .then(function (response) {
            if (response.data.results) {
                console.log("API localisation", `${mapquestapi.geocoding_uri}${encodeURIComponent(localisation).trim()}`)
                let mapLat = response.data.results[0].locations[0].latLng.lat.toString();
                let mapLong = response.data.results[0].locations[0].latLng.lng.toString();
                console.log("API", mapLat)
                console.log("API", mapLong)
                res.status(200)
                    .json({
                        "mapLat": mapLat,
                        "mapLon": mapLong,
                        "status": 200
                    })
            } else {
                errorManager.handler(res, response, "Destination non trouvée")
            }

        }).catch(function (err) {
        errorManager.handler(res, err, "map quest error")
    });
});


module.exports = router;


