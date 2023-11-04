const axios = require('axios').default;
function getAllParking() {
    const url = 'https://hackathon.kojikukac.com/api/ParkingSpot/getAll';
    // call api from another server and auth using token
    const json = axios.get(url, {
        headers: {
            'Api-Key': process.env.API_TOKEN
        }
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