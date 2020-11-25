// Library Import
const Twit = require('twit');
const discord = require('./discord.js');
const colors = require('colors');
const {
  consumer_key,
  consumer_secret,
  access_token,
  access_token_secret,
  accounts
} = require('./config');

// Twitter Authentication
const Twitter = new Twit({
  consumer_key: consumer_key,
  consumer_secret: consumer_secret,
  access_token: access_token,
  access_token_secret: access_token_secret
});

// Array For Account ID
const accountIDs = [];

// Account Retireval
const getAccounts = () => {
  return new Promise((resolve, reject) => {
    accounts.forEach((account) => {
      Twitter.get("/users/show", {
        screen_name: account
      }, (err, data, res) => {
        if (err) reject(console.log('Failed To Retrieve Accounts'.red));
        accountIDs.push(data.id_str);
        if (!err && accountIDs.length === accounts.length) resolve(console.log('Accounts Retrieved'.green));
      });
    });
  });
};

// Twitter Monitor
const monitor = () => {

  // Twitter Stream
  const stream = Twitter.stream('statuses/filter', {
    follow: accountIDs
  });

  // Attempt a Connection To Twitter
  stream.on('connect', (request) => {
    console.log('Attempting a connection to Twitter'.yellow);
    // console.log(request);
  });

  // Success Message Once Connected To Twitter
  stream.on('connected', (response) => {
    console.log('Successfully connected to Twitter'.green);
    // console.log(response);
  });

  // Warning Message From Twitter
  stream.on('warning', (warning) => {
    console.log('Twitter is sending a warning'.yellow);
    // console.log(warning);
  });

  // Tweet Withheld Message From Twitter
  stream.on('status_withheld', (withheldMsg) => {
    console.log('An attempted tweet request was withheld in certain countries'.gray);
    // console.log(withheldMsg);
  });

  // User Withheld Message From Twitter
  stream.on('user_withheld', (withheldMsg) => {
    console.log('The user you are trying to monitor is withheld in certain countries'.gray);
    // console.log(withheldMsg);
  });

  // Disconnect Message From Twitter
  stream.on('disconnect', (disconnectMessage) => {
    console.log('The twitter stream has been disconnected'.red);
    // console.log(disconnectMessage);
  });

  // Tweet Stream
  stream.on('tweet', (tweet) => {
    if (accountIDs.includes(tweet.user.id_str)) {
      console.log(`Tweet received from @${tweet.user.screen_name}`)
      discord.sendWebhook(tweet);
    };
  });
};

// Run The Function
getAccounts().then(monitor);