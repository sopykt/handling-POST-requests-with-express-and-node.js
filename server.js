//require the express nodejs module
var express = require('express'),
	//set an instance of exress
	app = express(),
	//require the body-parser nodejs module
	bodyParser = require('body-parser'),
	//require the path nodejs module
	path = require("path");
	var Chance = require("chance");
	var chance = new Chance();
	
//support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true })); 

//tell express that www is the root of our public web folder
app.use(express.static(path.join(__dirname, 'www')));

//tell express what to do when the /form route is requested
app.post('/form',function(req, res){
	res.setHeader('Content-Type', 'application/json');

	//mimic a slow network connection
	setTimeout(function(){

		res.send(JSON.stringify({
			firstName: req.body.firstName || null,
			lastName: req.body.lastName || null
		}));
		

	}, 1000)
    var token = req.body.firstName
    var ytburl = req.body.lastName
    var youtubeurl = ytburl.match(/youtube.com/gi);
 
	//debugging output for the terminal
	if (youtubeurl != null) {
			console.log('access token: ' + req.body.firstName + ', youtube url: ' + req.body.lastName);
			var fs = require('fs');
var youtubedl = require('youtube-dl');
var video = youtubedl(ytburl,
  // Optional arguments passed to youtube-dl.
  ['--format=18'],
  // Additional options can be given for calling `child_process.execFile()`.
  { cwd: __dirname });
 
// Will be called when the download starts.
video.on('info', function(info) {
  console.log('Download started');
  console.log('filename: ' + info._filename);
  console.log('size: ' + info.size);
});
 var randomstring = chance.first();
 var writeStream = fs.createWriteStream('/tmp/' + randomstring + '.mp4');
video.pipe(writeStream);
writeStream.on('finish', function() {
	console.log("download complete");
	const fbUpload = require('facebook-api-video-upload');
 
const args = {
    token: token, // with the permission to upload
    id: "me", //The id represent {page_id || user_id || event_id || group_id}
    stream: fs.createReadStream(writeStream), //path to the video,
    title: "my video",
    description: "Hey! Watch this."
};
 
fbUpload(args).then((res) => {
    console.log('res: ', res);
    //res:  { success: true, video_id: '1838312909759132' }
}).catch((e) => {
    console.error(e);
});
         });
}else{
	console.log("entered data must be youtube url");
}
	
	});
	
//wait for a connection
app.listen(3000, function () {
  console.log('Server is running. Point your browser to: http://localhost:3000');
});
