var fs = require('fs');
var path = require('path');
var url = require('url');
var _ = require('underscore');
var S = require('string');
var mime = require('mime');
var ffmpeg = require('fluent-ffmpeg');
var Metalib = require('fluent-ffmpeg').Metadata;
var winston = require('winston');
var config = require('config').Caster;
var homeFolder = config.homeFolder;

exports.browse = function(req, res) {
    var folder = S(path.normalize('/' + req.params[0]));
    fs.stat(homeFolder + folder, function (err, stat) {
        if( err ) {
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.end(""+err);
        } else {
            if (stat.isFile()) {
                var video_url = 'http://' + req.headers.host + '/stream' + folder;
                var metaObject = new Metalib(homeFolder + folder, function (metadata, err) {
                    res.render('play', {
                        title: 'playing ' + folder,
                        url: video_url,
                        duration: metadata.durationsec});
                })

            } else {
                folder = S(folder).ensureRight('/');
                fs.readdir(homeFolder + folder, function(err, files) {
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
    winston.info("preparing to stream " + homeFolder + folder);
    fs.stat(homeFolder + folder, function (err, stat) {
        if (err) {
            winston.error(err);
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.end("" + err);
        } else {
            if (stat.isFile()) {
                res.writeHead(200, {
                    'Content-Type': mime.lookup(homeFolder + folder),
                    'Accept-Ranges': 'bytes',
                    'Content-Length': stat.size
                });
                var proc = new ffmpeg({ source: homeFolder + folder, timeout: 432000, nolog: true})
                    .withVideoCodec('copy')
                    .withAudioBitrate('128k')
                    .withAudioCodec('mp3')
                    .withAudioChannels(2)
                    .toFormat('matroska')
                    .writeToStream(res, function(retcode, err) {winston.error("ffmpeg error:  " + err)});
            }
            else {
                winston.err("not a file");
            }
        }
    });
}