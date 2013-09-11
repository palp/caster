caster
======

A simple media server for Chromecast devices.

Requires: node.js, ffmpeg

Video must be in a [format supported by Chromecast](https://developers.google.com/cast/supported_media_types).
Audio will be transcoded to MP3.

Configure the base folder for media in routes/caster.js.

Known Issues:
- Casting not working yet, pending whitelisting by Google.
- There is no security other than locking browsing to the base folder. However, non-media files will not be streamed since ffmpeg fails to process them.

TODO:
- Player controls
- Close window after video completes
- File browser styling
- Actual configuration
- Hide non-media files
