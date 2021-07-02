/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */

const request = require("request");


const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API

  request('https://api.ipify.org/?format=json', (error, response, body) => {
    
    if (error) return callback(error, null);

    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      return callback(`Status Code ${response.statusCode} when fetching IP. Response: ${body}`, null);
    }
  
    const data = JSON.parse(body)['ip'];
    callback(null, data);
    
  });
};


const fetchCoordsByIP = function(ip, callback) {
  // use request to find latitude and longitude coordinates, based on IP address

  request(`https://freegeoip.app/json/${ip}`, (error, response, body) => {
  
    if (error) return callback(error, null);
  
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      return callback(`Status Code ${response.statusCode} when fetching coordinates for IP. Response: ${body}`, null);
    }
  
    const { latitude, longitude } = JSON.parse(body);
  
  
    callback(null, { latitude, longitude });
  
  });
};


const fetchISSFlyOverTimes = function(coords, callback) {

  request(`http://api.open-notify.org/iss/v1/?lat=${coords['latitude']}&lon=${coords['longitude']}`, (error, status, body) => {
  
    if (error) return callback(error, null);
  
    // if non-200 status, assume server error
    if (status.statusCode !== 200) {
      return callback(`Status Code ${status.statusCode} when fetching ISS fly-over times. Response: ${body}`, null);
    }
  
    const { response } = JSON.parse(body);
  
  
    callback(null, { response });

  });


};





module.exports = {
  fetchMyIP,
  fetchCoordsByIP,
  fetchISSFlyOverTimes
};
