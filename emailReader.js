var Imap = require('imap'),
    inspect = require('util').inspect; 
var fs = require('fs'), fileStream; 


var contents = fs.readFileSync("imapConfig.json");
var jsonContent = JSON.parse(contents);

var imap = new Imap({
  user: jsonContent.user, 
  password: jsonContent.password,
  host: jsonContent.host, 
  port: jsonContent.port,
  tls: true
});


 
function openInbox(cb) {
  imap.openBox('INBOX', true, cb);
}

imap.once('ready', function() {

//read unseen emails from inbox and save them to emailFiles subfolder.
openInbox(function(err, box) {
  if (err) throw err;
  imap.search([ 'UNSEEN', ['SINCE', 'November 18, 2018'] ], function(err, results) { 
    if (err) throw err;
    var f = imap.fetch(results, { bodies: '' });

    f.on('message', function(msg, seqno) {
      console.log('Message #%d', seqno);

      var prefix = '(#' + seqno + ') ';
      msg.on('body', function(stream, info) {
        console.log(prefix + 'Body');
        stream.pipe(fs.createWriteStream('emailfiles/msg-' + seqno + '-body.txt'));
      });

      msg.once('attributes', function(attrs) {
        console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
      });

      msg.once('end', function() {
        console.log(prefix + 'Finished');
      });
    });

    f.once('error', function(err) {
      console.log('Fetch error: ' + err);
    });

    f.once('end', function() {
      console.log('Done fetching all messages!');
      imap.end();
    });
  });
});
});

imap.once('error', function(err) {
  console.log(err);
});

imap.once('end', function() {
  console.log('Connection ended');
});

imap.connect(); 
