var Botkit = require('botkit')
//var config = require('./config')

var slack_token = process.env.SLACK_TOKEN
var wit_token = process.env.WIT_TOKEN

//var wit = require('botkit-middleware-witai')({
//    token: wit_token
//})

var Witbot = require('witbot')
var witbot = Witbot(wit_token)
var wit_req = require('./wit');

var controller = Botkit.slackbot({
  // reconnect to Slack RTM when connection goes bad
  retry: Infinity,
  debug: false
})

if (slack_token) {
  controller.spawn({
    token: slack_token,
    retry: Infinity
  }).startRTM(function (err, bot, payload) {
    if (err) {
      throw new Error(err)
    }

    console.log('Connected to Slack RTM')
  })
} 

controller.on('bot_channel_join', function (bot, message) {
  bot.reply(message, "I'm in!")
})



controller.hears('.*', 'direct_message,direct_mention', function (bot, message) {
  var wit = witbot.process(message.text, bot, message)
  //console.log(message.text)
  var wit_request = wit_req.request_wit(message.text);
  wit_request.when(function (err, wit) {
        //res.end(JSON.stringify(wit));
        if (err) console.log(err);//Manage Error here
        var outcome = wit.outcomes[0];
        var intent = outcome.entities.intent[0].value;
        //console.log(intent)
        switch(intent){
          case 'greeting':
              bot.reply(message, 'Hello to you too.')
              break
          case 'status':
              var text = 'OCADO BOT.'
              var attachments = [{
                fallback: text,
                pretext: 'Best online supermarket. :sunglasses: :thumbsup:',
                title: 'Ocado',
                image_url: 'http://www.ocadogroup.com/~/media/Images/O/Ocado-Group/image-gallery/ocado-logos/large-images/ocado-the-online%20supermarket.jpg',
                title_link: 'http://ocado.com/',
                text: text,
                color: '#39e600'
              }]

              bot.reply(message, {
                attachments: attachments
              }, function (error, resp) {
                console.log(error, resp)
              })
              break
          default:
              bot.reply(message, 'I do not understand what you mean')
              break
        }
  })
  
})