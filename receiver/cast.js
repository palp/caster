var appId = '6b626c8c-55ee-433f-8166-bfbb31b5ef07';

var receiver = new cast.receiver.Receiver(
    appId, [cast.receiver.RemoteMedia.NAMESPACE, "palp"],
    "",
    5);
var remoteMedia = new cast.receiver.RemoteMedia();
var channelHandler = new cast.receiver.ChannelHandler("palp");
remoteMedia.addChannelFactory(
    receiver.createChannelFactory(cast.receiver.RemoteMedia.NAMESPACE));
channelHandler.addChannelFactory(
    receiver.createChannelFactory("palp"));
channelHandler.addEventListener(cast.receiver.Channel.EventType.MESSAGE, onMessage.bind(this));
receiver.start();

window.addEventListener('load', function() {
    var elem = document.getElementById('vid');
    remoteMedia.setMediaElement(elem);
});

function onMessage(event) {
    if (event.message.type == 'media') {
        console.log('event:' + event.message.url);
        var elem = document.getElementById('vid');
        elem.setAttribute('src', event.message.url);
        elem.play();
    }
}

