const { addFilters } = require("./image-gen")
require("dotenv").config();
const twit = require("./twit");
const fs = require("fs");
const path = require("path");
const paramsPath = path.join(__dirname, "params.json");

function writeParams(data) {
  console.log("We are writing the params file ...", data);
  return fs.writeFileSync(paramsPath, JSON.stringify(data));
}

function readParams() {
  console.log("We are reading the params file ...");
  const data = fs.readFileSync(paramsPath);
  return JSON.parse(data.toString());
}

function getTweets(since_id) {
  return new Promise((resolve, reject) => {
    let params = {
      q: "@bot_zucker",
      count: 10,
    };
    if (since_id) {
      params.since_id = since_id;
    }
    console.log("We are getting the tweets ...", params);
    twit.get("search/tweets", params, (err, data) => {
      if (err) {
        return reject(err);
      }
      return resolve(data);
    });
  });
}

function postTweet(tweet) {
  return new Promise(async (resolve, reject) => {
    const team = determineTeam(tweet.text)
    await addFilters(tweet.user.profile_image_url_https, team);
    var b64content = fs.readFileSync('./test.png', { encoding: 'base64' })

    twit.post('media/upload', { media_data: b64content }, function (err, data, response) {
      var mediaIdStr = data.media_id_string
      var altText = "Your pfp... zuckafied"
      var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }
     
      twit.post('media/metadata/create', meta_params, function (err, data, response) {
        if (!err) {
          // now we can reference the media and post a tweet (media will attach to the tweet)
          var params = { status: `@${tweet.user.screen_name} ${determineMessage(team)}`, media_ids: [mediaIdStr] }
     
          twit.post('statuses/update', params, function (err, data, response) {
            if(err) {
              return reject(err)
            } else {
              //console.log(data)
              return resolve(data)
            }
          })
        }
      })
    })
  });
}

function pickOne(arr) {
  const randomIndex = Math.floor(Math.random() * arr.length);
  const item = arr[randomIndex];
  // console.log(`Firing pickOne
  // choices: ${arr}
  // selected result: ${randomIndex}- ${arr[randomIndex]}`)
  return item;
}

function determineMessage(team) {
  if(team == 1 ) {
    return pickOne([
      'Meat Demon',
      'Meat Demon',
      'Meat Demon'
    ])
  } else if(team == 2) {
    return pickOne([
      'Swag Saint',
      'Swag Saint',
      'Swag Saint'
    ])

  } else {
    pickOne([
      'It does not look like you did this correct... smh big Z is ashamed', 'needs2?'
    ])
  }

}

function determineTeam(text) {
  text = text.toLowerCase()
    if(text.includes('meatdemon') || text.includes('meat demon')) {
      return 1
    } else if(text.includes('swagsaint') || text.includes('swag saint')) {
      return 2
    } else {
      return 0
    }
}

async function main() {
  try {
    const params = readParams();
    const data = await getTweets(params.since_id);
    const tweets = data.statuses;
    tweets.sort((a,b) => {
      if(a.id_str < b.id_str) {
        return -1;
      }
      if(a.id_str > b.id_str) {
        return 1
      }
      return 0;
    })
    console.log("We got the tweets", tweets.length);
    for await (let tweet of tweets) {
      try {
        await postTweet(tweet);
        console.log("Successful tweet " + tweet.id_str);
      } catch (e) {
        console.log(e)
        console.log("Unsuccessful tweet " + tweet.id_str);
      }
      params.since_id = tweet.id_str;
    }
    writeParams(params);
  } catch (e) {
    console.error(e);
  }
}

console.log("Starting the twitter bot ...");

setInterval(main, 10000);
