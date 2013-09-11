var fs = require('fs');
var path = require('path');
var url = require('url');
var _ = require('underscore');
var S = require('string');
var mime = require('mime');
var ffmpeg = require('fluent-ffmpeg');

var home_folder = '/Volumes/video';

exports.browse = function(req, res) {
    var folder = S(path.normalize('/' + req.params[0]));
    fs.stat(home_folder + folder, function (err, stat) {
        if( err ) {
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.end(""+err);
        } else {
            if (stat.isFile()) {
                res.render('play', {
                    title: 'playing ' + folder,
                    url: 'http://' + req.headers.host + url.parse(req.url).pathname + '/stream' + folder});
            } else {
                folder = S(folder).ensureRight('/');
                fs.readdir(home_folder + folder, function(err, files) {
                    var results = _.map(files, function(file) {
                        return {url: "/browse" + folder + file, name: file}
                    });
                    var parent = path.normalize(folder + '..');
                    if (!req.params[0])
                        parent = false;
                    res.render('browse', {title: 'browsing ' + folder, folder: folder, files: results, parent: parent});
                });
            }
        }
    });
}

exports.stream = function (req, res) {
    var folder = S(path.normalize('/' + req.params[0]));

    fs.stat(home_folder + folder, function (err, stat) {
        if (err) {
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.end("" + err);
        } else {
            if (stat.isFile()) {
                res.render('play', {title: 'playing ' + folder, url: folder});
                res.writeHead(200, {
                    'Content-Type': mime.lookup(home_folder + folder),
                    'Content-Length': stat.size});
                var proc = new ffmpeg({ source: home_folder + folder, timeout: 432000, nolog: true})
                    .withVideoCodec('copy')
                    .withAudioBitrate('128k')
                    .withAudioCodec('mp3')
                    .withAudioChannels(2)
                    .toFormat('matroska')
                    .writeToStream(res);//, function(retcode, err) {console.log(err)});
                //var stream = fs.createReadStream(home_folder + folder);
                //stream.pipe(res);
            }
        }
    });
}