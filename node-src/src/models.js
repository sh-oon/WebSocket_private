const { nanoid } = require('nanoid');
const redisModule = require('redis');
const redis = redisModule.createClient({
    host: 'dev.modoodesigner.net',
    port:36379,
    user:null,
    password:'designer0118**'
});


redis.on('connect', () => {
    console.log('Connected to RedisGreen Server');
});

redis.on('ready', () => {
    console.log('ready to work with RedisGreen Server');
});

redis.on('error', (err) => {
    console.log('Error occurred while connecting to Redis');
    process.exit(0);
});


function storeURL(url) {
    return new Promise((resolve, reject) => {
        redis.get(url, (err, reply) => {
            if(err) {
                return reject('error occurred during the redis operation');
            }
            if(reply) {
                resolve(reply);
            } else {
                // make new entry
                let id = nanoid(6);
                redis.set(id, url);
                // set URL as a key too for searching
                redis.set(url, id);
                // return
                resolve(id);
            }
        });
    });
}

function findURL(key) {
    return new Promise((resolve, reject) => {
        redis.get(key, (err, reply) => {
            if(err) {
                return reject('error occurred during the redis operation');
            }
            // check if the reply exists
            if(reply === null) {
                resolve(null);
            } else {
                resolve(reply);
            }
        });
    });
}

module.exports = {
    storeURL: storeURL,
    findURL: findURL
};
