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
        console.log(response.data);
        return response.data;
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    })
    
    return json;
    }

module.exports = {
    getAllParking
};