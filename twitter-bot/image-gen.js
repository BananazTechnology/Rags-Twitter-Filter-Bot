const { createCanvas, loadImage } = require('canvas')
const fs = require('fs');
const client = require('https');


async function addFilters(url, team) {
    url = url.replace("_normal","")
    await downloadImage(url, './downloadedimage/temp.png').then(console.log).catch(console.error)

    var urls = ['downloadedimage/temp.png'];
    if(team == 1) {
        urls.push(pickOne(['twitter-bot/filters/MEATDEMON/DEMON_1.png','twitter-bot/filters/MEATDEMON/DEMON_2.png','twitter-bot/filters/MEATDEMON/DEMON_3.png']));
    } else if(team == 2 ) {
        urls.push(pickOne(['twitter-bot/filters/SwagSaint/SAINT_1.png', 'twitter-bot/filters/SwagSaint/SAINT_2.png', 'twitter-bot/filters/SwagSaint/SAINT_3.png']));
    } else {
    }

    const canvas = createCanvas(1500,1500);
    var context = canvas.getContext('2d');
    context.canvas.width = 1500;
    context.canvas.height = 1500;
    context.fillStyle = 'black';
    context.fillRect(0,0,1500,1500);
    
    urls.forEach(async (url) => { 
        const image = await loadImage(url)
        //console.log(image)
        context.drawImage(image,0,0,1500,1500)
        fs.writeFileSync(`test.png`, canvas.toBuffer("image/png"));
    })

    

}

async function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        client.get(url, (res) => {
            if (res.statusCode === 200) {
                res.pipe(fs.createWriteStream(filepath))
                    .on('error', reject)
                    .once('close', () => resolve(filepath));
            } else {
                res.resume();
                reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));
            }
        });
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

exports.addFilters = addFilters

