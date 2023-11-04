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
        console.log(response.data[1]);
        // handle success
       for (let i = 0; i < response.data.length; i++) {
            switch (response.data[i].parkingSpotZone) {
                case "Zone1":
                    response.data[i].parkingSpotZone = 1;
                    break;
                case "Zone2":
                    response.data[i].parkingSpotZone = 2;
                    break;
                case "Zone3":
                    response.data[i].parkingSpotZone = 3;
                    break;
                case "Zone4":
                    response.data[i].parkingSpotZone = 4;
                    break;
                default:
                    response.data[i].parkingSpotZone = 1;
                    break;
            }
            switch (response.data[i].occupied) {
                case true:
                    response.data[i].occupied = 1;
                    break;
                case false:
                    response.data[i].occupied = 0;
                    break;
                default:
                    response.data[i].occupied = 0;
                    break;
            }
           let stringValue = 0;
           for (let j = 0; j < response.data[i].id.length; j++) {
               stringValue += response.data[i].id.charCodeAt(j);
           }

           let type;

           if (stringValue%20 === 1) {
               type = 2;
           } else if (remainder === 2) {
               type = 3;
           } else {
               type = 1;
           }

            db.run(parkingSpaces.addParkingSpace, [response.data[i].id, response.data[i].latitude, response.data[i].longitude, response.data[i].parkingSpotZone, type, response.data[i].occupied, response.data[i].occupiedTimestamp], (err) => {
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