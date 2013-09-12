caster
======

A simple media server for Chromecast devices.

This version is a proof of concept and is not intended to be fully functional.

Requires: node.js, ffmpeg

Video must be in a [format supported by Chromecast](https://developers.google.com/cast/supported_media_types).
Chromecast device must be on the same network as the media server. Making the server internet accessible should work but is not recommended due to lack of security and testing.
Audio will be transcoded to MP3.

Instructions:
1. Set up a publically accessible website for the receiver. Only static content will be served from this site.
2. [Get whitelisted](https://developers.google.com/cast/whitelisting). Use the URL for the site above.
3. Configure the base folder for media in routes/caster.js.
4. Set your own AppId in public/javascripts/cast.js and receiver/cast.js.
5. Upload the receiver files to your whitelisted site.
6. Start the node.js application
7. Browse to the application using your internal IP address (i.e. 192.168.0.10:3000). It is important to use an IP that the Chromecast device will be able to reach. Localhost will not work.

Known Issues:
- No UI for Chromecast device selection. The first device found is used.
- There is no security other than locking browsing to the base folder. However, non-media files will not be streamed since ffmpeg fails to process them.

TODO:
- Player controls
- Close window after video completes
- File browser styling
- Configuration
- Hide non-media files
