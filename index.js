'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
const fetch = require('node-fetch');


app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
	res.send('Hello world, I am a chat bot')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
	if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
		res.send(req.query['hub.challenge'])
	}
	res.send('Error, wrong token')
})

// Spin up the server
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
})

 app.post('/webhook/', function (req, res) {
	let messaging_events = req.body.entry[0].messaging
	for (let i = 0; i < messaging_events.length; i++) {
		let event = req.body.entry[0].messaging[i]
		let sender = event.sender.id
		if (event.message && event.message.text) {
			let text = event.message.text
			if (text === 'Generic'){ 
				//console.log("welcome to chatbot")
				sendGenericMessage(sender)
				continue
			}
		    if (text.toLowerCase() === 'hi' || text.toLowerCase() === 'hello'){ 
			sendTextMessage(sender, "How are you doing, I’m Kim! I’m a rehabilitated K-Pop star and nutrition bot in training. Winfred says I don’t know much yet, but I’m learning! My job as virtual nutrition expert is to help you eat right and reduce the amount of uneaten, disposed food. To help you track your eating habits, I need to know a few things about you at the moment. Don’t worry, I pinky swear I won’t tell anyone else.");
			}
		}
		if (event.postback) {
			let text = JSON.stringify(event.postback)
			if(text.payload == '1') healthy(sender)
			continue
		}
	}
	res.sendStatus(200)
})

const token = process.env.FB_PAGE_ACCESS_TOKEN;

//this function sends the start message
function sendTextMessage(sender, text) {
    let messageData = { text:text }
    request({
	    url: 'https://graph.facebook.com/v2.6/me/messages',
	    qs: {access_token:token},
	    method: 'POST',
		json: {
		    recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
		    console.log('Error sending messages: ', error)
		} else if (response.body.error) {
		    console.log('Error: ', response.body.error)
	    }
    })
	sendOptions(sender)
}

//To give the first 2 options - 1. healthier diet; 2. Current diet
function sendOptions(sender) {
    let messageData = {
    "text":"Please choose one of the following:",
    "quick_replies":[
      {
        "content_type":"text",
        "title":"I want a healthier diet",
        "payload":"1"
      },
      {
        "content_type":"text",
        "title":"I like my current diet",
        "payload":"2"
      }
    ]
  }
    request({
	    url: 'https://graph.facebook.com/v2.6/me/messages',
	    qs: {access_token:token},
	    method: 'POST',
		json: {
		    recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
		    console.log('Error sending messages: ', error)
		} else if (response.body.error) {
		    console.log('Error: ', response.body.error)
	    }
    })
}

//healthier diet option
function healthy(sender) {
    let messageData = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"button",
        "text":"That’s simple, only cucumbers and water for you the whole week. Kidding! To help you eat healthy, I would like to suggest homecooked meals for you every week. Would you like meal playlists at the beginning of each week? They’re like music playlists, but for food!",
        "buttons":[
          {
            "type":"postback",
            "title":"Yes",
			"payload":"USER_DEFINED_PAYLOAD"
          },
          {
            "type":"postback",
            "title":"Yes",
            "payload":"USER_DEFINED_PAYLOAD"
          }
        ]
      }
    }
	}
    request({
	    url: 'https://graph.facebook.com/v2.6/me/messages',
	    qs: {access_token:token},
	    method: 'POST',
		json: {
		    recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
		    console.log('Error sending messages: ', error)
		} else if (response.body.error) {
		    console.log('Error: ', response.body.error)
	    }
    })
}

function sendGenericMessage(sender) {
    let messageData = {
	    "attachment": {
		    "type": "template",
		    "payload": {
				"template_type": "list",
				"top_element_style": "compact",
			    "elements": [{
					"title": "First card",
				    "image_url": "http://messengerdemo.parseapp.com/img/rift.png",
				    "buttons": [{
					    "type": "web_url",
					    "url": "https://www.messenger.com",
					    "title": "Random Gif"
				    }, {
					    "type": "postback",
					    "title": "Postback",
					    "payload": "Payload for first element in a generic bubble:",
				    }],
			    }, {
				    "title": "Second card",
				    "buttons": [{
					    "type": "postback",
					    "title": "Postback",
					    "payload": "Payload for second element in a generic bubble",
				    }],
			    }]
		    }
	    }
    }
    request({
	    url: 'https://graph.facebook.com/v2.6/me/messages',
	    qs: {access_token:token},
	    method: 'POST',
	    json: {
		    recipient: {id:sender},
		    message: messageData,
	    }
    }, function(error, response, body) {
	    if (error) {
		    console.log('Error sending messages: ', error)
	    } else if (response.body.error) {
		    console.log('Error: ', response.body.error)
	    }
    })
}

/*
function randomGif(){
	const base_url = 'http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=american+psycho'
	fetch(base_url)
	 .then(function(blob){
		 return blob.json()
	 })
	  .then(function(jsondata){
		  return jsondata['data']['fixed_width_small_url']
	  })
}
*/