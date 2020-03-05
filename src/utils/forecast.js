const request = require('request')

const forecast = (lat, long, callback) => {
    const url = 'https://api.darksky.net/forecast/18981b1f9bc4d9e2838e9cf103bc29ba/' + lat + ',' + long
    request({url, json: true}, (error, {body}) => {
        if(error)
            callback('Unable to connect to location service', undefined)
        else if(body.error){
            callback('Unable to fin location try other coordinates', undefined)
        }
        else
            callback(undefined, 
                body.daily.data[0].summary + ' It is currently ' + body.currently.temperature + ' degrees and there is ' + 
                body.currently.precipProbability + ' % of rain'
            )
    })
}

module.exports = forecast