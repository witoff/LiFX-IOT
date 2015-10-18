var querystring = require('querystring'),
    https = require("https");
var TOKEN = '<your token here>';

exports.handler = function(event, context) {
    
    var clickType = '';
    if (event.Records)
        clickType = JSON.parse(event.Records[0].Sns.Message).clickType;
 
    var path, data, method;   
    switch(clickType) {
        case 'DOUBLE':
            path = '/v1/lights/all/state'
            data = {"power": "on", "brightness": 0.1, "duration": 3}
            method = 'PUT'
            break;
        case 'LONG':
            path = '/v1/lights/all/state'
            data = {"power": "on", "brightness": 1.0, "duration": 3}
            method = 'PUT'
            break;
        default:
            path = '/v1/lights/all/toggle'
            data = {}
            method = 'POST'
    }
    
    var postData = JSON.stringify(data);
    var options = {
    	hostname: 'api.lifx.com',  
    	port: 443,  
    	path: path,
    	method: method,  
    	headers: {      
    		'Authorization': 'Bearer ' + TOKEN,
    		'Accept': '*/*',
    		'content-type': 'application/json',
    		'content-length': postData.length
    		
    	}
    };
    
    var req = https.request(options, function(res) {
    	res.setEncoding('utf8');  
    	res.on('data', function (body) {  
    		console.log('Body: ' + body);
    		context.succeed();  
    	});
    });
    
    req.on('error', function(e) {
    	console.log('problem with request: ' + e.message);
    	context.done(null, 'Failed');  
    });
    
    req.write(postData);
    req.end();
}
