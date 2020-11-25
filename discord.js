// Library Import
const fetch = require('node-fetch');
const config = require('./config');
const ocr = require('./ocr.js')

// Embed Function
const sendWebhook = (tweet) => {

  // Embed Fields
  const contentField = [];

  // Add Tweet Content To Field
  contentField.push({
    name: 'Tweet Content',
    value: `${tweet.text}`,
    inline: false
  });

  // User Mentions
  if (tweet.entities.user_mentions[0]) {
    let mentions = `[@${tweet.entities.user_mentions[0].screen_name}](https://twitter.com/${tweet.entities.user_mentions[0].screen_name}/)`;
    for (i = 1; i < tweet.entities.user_mentions.length; i++) {
      mentions += `, [@${tweet.entities.user_mentions[i].screen_name}](https://twitter.com/${tweet.entities.user_mentions[i].screen_name}/)`;
    };
    // Add User Mentions To Array
    contentField.push({
      name: "Mentioned Users",
      value: mentions,
      inline: false
    });
  };

  // URLs
  if (tweet.entities.urls[0]) {
    let urls = `[**(t.co)**](${tweet.entities.urls[0].url}) - [${tweet.entities.urls[0].expanded_url}](${tweet.entities.urls[0].expanded_url})`;
    for (i = 1; i < tweet.entities.urls.length; i++) {
      urls += `\n[**(t.co)**](${tweet.entities.urls[i].url}) - [${tweet.entities.urls[i].expanded_url}](${tweet.entities.urls[i].expanded_url})`
    };
    // Add URLs To Array
    contentField.push({
      name: "Detected URLs",
      value: urls,
      inline: false
    });
  };

  // Hashtags
  if (tweet.entities.hashtags[0]) {
    let hashtag = `[#${tweet.entities.hashtags[0].text}](https://twitter.com/hashtag/${tweet.entities.hashtags[0].text}/)`;
    for (i = 1; i < tweet.entities.hashtags.length; i++) {
      hashtag += `\n[#${tweet.entities.hashtags[i].text}](https://twitter.com/hashtag/${tweet.entities.hashtags[i].text}/)`
    };
    // Add Hashtags To Array
    contentField.push({
      name: "Hashtags",
      value: hashtag,
      inline: false
    });
  };

  // Add Useful Links To Array
  contentField.push({
    name: 'Useful Links',
    value: `[**(Profile)**](https://twitter.com/${tweet.user.screen_name}) - [**(Liked Tweets)**](https://twitter.com/${tweet.user.screen_name}/likes) - [**(Following)**](https://twitter.com/${tweet.user.screen_name}/following)`,
    inline: false
  });

  // Image OCR
  const sendImage = () => {
    if ("media" in tweet.entities) {
      const image_data = tweet.entities.media[0].media_url_https;
      ocr.sendOCR(image_data);
    };
  };

  // Embed
  const embedMessage = {
    "username": `Twitter Monitor for @${tweet.user.screen_name}`,
    "avatar_url": `${tweet.user.profile_image_url_https}`,
    "embeds": [{
      "author": {
        "name": `${tweet.user.name} • (${tweet.user.screen_name})`,
        "url": `https://twitter.com/${tweet.user.screen_name}/`,
        "icon_url": `${tweet.user.profile_image_url_https}`
      },
      "title": 'New Tweet!',
      "url": `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`,
      "color": 255,
      "image": {
        "url": tweet.entities.media ? tweet.entities.media[0].media_url : ""
      },
      "fields": contentField,
      "footer": {
        "text": `@fayeezus | NYCAlert`
      }
    }]
  };

  // Send Embed
  (async () => {
    await fetch(config.webhook, {
      method: 'post',
      body: JSON.stringify(embedMessage),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    await sendImage();
    console.log('Webhook Sent!')
  })();
};

// Export Webhook Module
module.exports.sendWebhook = sendWebhook;