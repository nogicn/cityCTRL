const db = require('../database/db');
const parkingSpaces = require('../models/parking_space');

const axios = require('axios').default;
function getAllParking() {
    const url = 'https://hackathon.kojikukac.com/api/ParkingSpot/getAll';
    // call api from another server and auth using token
    return axios.get(url, {
        headers: {
            'Api-Key': process.env.API_TOKEN
        }
    })
    .then(function (response) {
        // handle success
       for (let i = 0; i < response.data.length; i++) {
            switch (response.data[i].parkingSpotZone) {
                case "zone1":
                    response.data[i].parkingSpotZone = 1;
                    break;
                case "zone2":
                    response.data[i].parkingSpotZone = 2;
                    break;
                case "zone3":
                    response.data[i].parkingSpotZone = 3;
                    break;
                case "zone4":
                    response.data[i].parkingSpotZone = 4;
                    break;
                default:
                    response.data[i].parkingSpotZone = 1;
                    break;
            }
            switch (response.data[i].isReserved) {
                case "true":
                    response.data[i].isReserved = 1;
                    break;
                case "false":
                    response.data[i].isReserved = 0;
                    break;
                default:
                    response.data[i].isReserved = 0;
                    break;
            }

            db.run(parkingSpaces.addParkingSpace, [response.data[i].id, response.data[i].latitude, response.data[i].longitude, response.data[i].parkingSpotZone, response.data[i].isReserved, response.data[i].reservedUntil, response.data[i].reservedBy], (err) => {
                if (err) {
                    console.log(err.message);
                }
            });
        }
        //console.log(response.data);
        // convert to json
        response.data = JSON.stringify(response.data);
        return response.data;
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    })
    }

function reserveParking(data) {
    const url = 'https://hackathon.kojikukac.com/api/ParkingSpot/reserve';
    // call api from another server and auth using token
    const json = axios.post(url, {
        parkingSpotId: data.parkingSpotId,
        endM: data.endM,
        endH: data.endH
        }, {
        headers: {
            'Api-Key': process.env.API_TOKEN
        },
    })
    .then(function (response) {
        // handle success
        //console.log(response.data);
        // convert to json
        response.data = JSON.stringify(response.data);
        return response.data;
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    })
    }

function addParking(data){
    const url = 'https://hackathon.kojikukac.com/api/ParkingSpot/';
    // call api from another server and auth using token
    const json = axios.post(url, {
        latitude: data.latitude,
        longitude: data.longitude,
        parkingSpotZone: data.parkingSpotZone
        }, {
        headers: {
            'Api-Key': process.env.API_TOKEN
        },
    })
    .then(function (response) {
        // handle success
        //console.log(response.data);
        // convert to json
        response.data = JSON.stringify(response.data);
        return response.data;
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    })
}

function deleteParking(data){
    const url = 'https://hackathon.kojikukac.com/api/ParkingSpot/'+data.parkingSpotId;
    // call api from another server and auth using token
    const json = axios.delete(url, {
        headers: {
            'Api-Key': process.env.API_TOKEN
        },
    })
    .then(function (response) {
        // handle success
        //console.log(response.data);
        // convert to json
        response.data = JSON.stringify(response.data);
        return response.data;
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    })
}


module.exports = {
    getAllParking,
    addParking,
    deleteParking,
    reserveParking
};