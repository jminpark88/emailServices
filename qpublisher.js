'use strict';

const amqplib = require('amqplib/callback_api');
const config = require('./qconfig');

var fs = require('fs');

function readFiles(dirname, onFileContent, onError) {
  fs.readdir(dirname, function(err, filenames) {
    if (err) {
      onError(err);
      return;
    }
    filenames.forEach(function(filename) {
      fs.readFile(dirname + filename, 'utf-8', function(err, content) {
        if (err) {
          onError(err);
          return;
        }
        onFileContent(filename, content);
      });
    });
  });
}


// read files from emailFiles subfolder and send them to Queue

amqplib.connect(config.amqp, (err, connection) => {
    if (err) {
        console.error(err.stack);
        return process.exit(1);
    }

    connection.createChannel((err, channel) => {
        if (err) {
            console.error(err.stack);
            return process.exit(1);
        }

        channel.assertQueue(config.queue, {
            durable: true
        }, err => {
            if (err) {
                console.error(err.stack);
                return process.exit(1);
            }

            let sender = (content, next) => {
                let sent = channel.sendToQueue(config.queue, content);
                if (sent) {
                    return next();
                } else {
                    channel.once('drain', () => next());
                }
            };

            
            readFiles('emailfiles/', function(filename, content) {
                sender(content, sendNext);

                }, function(err) {
                    throw err;
            });

            channel.close(() => connection.close());


        });
    });
});
