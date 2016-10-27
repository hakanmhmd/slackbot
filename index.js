
var Botkit = require('botkit')
var config = require('./config')

var slack_token = config.SLACK_TOKEN
var wit_token = config.WIT_TOKEN

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

// Assume single team mode if we have a SLACK_TOKEN
if (slack_token) {
  console.log('Starting in single-team mode')
  controller.spawn({
    token: slack_token,
    retry: Infinity
  }).startRTM(function (err, bot, payload) {
    if (err) {
      throw new Error(err)
    }

    console.log('Connected to Slack RTM')
  })
// Otherwise assume multi-team mode - setup beep boop resourcer connection
} 

controller.on('bot_channel_join', function (bot, message) {
  bot.reply(message, "I'm here!")
})

/**controller.hears(['hello', 'hi'], ['direct_mention', 'direct_message'], function (bot, message) {
  bot.reply(message, 'Hello.')
})


controller.hears('.*', ['mention'], function (bot, message) {
  bot.reply(message, 'You really do care about me. :heart:')
})

controller.hears('help', ['direct_message', 'direct_mention'], function (bot, message) {
  var help = 'I will respond to the following messages: \n' +
      '`bot hi/hello` for a simple message.\n' +
      '`bot attachment` to see a Slack attachment message.\n' +
      '`@<your bot\'s name>` to demonstrate detecting a mention.\n' +
      '`bot help` to see this again.'
  bot.reply(message, help)
})

controller.hears(['attachment'], ['direct_message', 'direct_mention'], function (bot, message) {
  
})

controller.hears('.*', ['direct_message', 'direct_mention'], function (bot, message) {
  bot.reply(message, 'Sorry <@' + message.user + '>, I don\'t understand. \n')
})
**/

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