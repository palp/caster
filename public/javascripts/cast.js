var appId = '6b626c8c-55ee-433f-8166-bfbb31b5ef07';
var cv_activity = null;
var cast_api;

function cast(url) {

    if (cast && cast.isAvailable) {
        // Cast is known to be available
        initializeApi();
    } else {
        // Wait for API to post a message to us
        window.addEventListener("message", function (event) {
            if (event.source == window && event.data &&
                event.data.source == "CastApi" &&
                event.data.event == "Hello")
                initializeApi();
        });
    }
    ;

    initializeApi = function () {
        cast_api = new cast.Api();
        cast_api.addReceiverListener(appId, onReceiverList);
    };

    onReceiverList = function (list) {
        // If the list is non-empty, show a widget with
        // the friendly names of receivers.
        // When a receiver is picked, invoke doLaunch with the receiver.
        doLaunch(list[0]);
    };

    doLaunch = function (receiver) {
        var request = new cast.LaunchRequest(appId, receiver);
        request.description = new cast.LaunchDescription();
        request.description.text = "palpcast video";
        request.description.url = url;
        cast_api.launch(request, onLaunch);
    };

    onLaunch = function(activity) {
        if (activity.status == "running") {
            cv_activity = activity;
            // update UI to reflect that the receiver has received the
            // launch command and should start video playback.
            cast_api.sendMessage(cv_activity.activityId, "palp", {type: 'media', url: url}, function (err) {
                console.log ('sendmessage' + err)
            });
        } else if (activity.status == "error") {
            cv_activity = null;
        }
        var duration = $('div.progress-bar').attr('aria-valuemax');
        window.setInterval(function() {cast_api.getMediaStatus(cv_activity.activityId, function(status){
            $('div.progress-bar').attr('aria-valuenow', status.status.position);
            $('div.progress-bar').width(((status.status.position / duration) * 100) + '%');
        })}, 1000)

        $('#play').click(function() {
            if (cv_activity) {
                if (isPaused) {
                    cast_api.playMedia(cv_activity.activityId, new cast.MediaPlayRequest());
                    $('#play').html('pause');
                    isPaused = false;
                } else {
                    cast_api.pauseMedia(cv_activity.activityId);
                    $('#play').html('resume');
                    isPaused = true;
                }
            }
        });

        $('div.progress').click(function(e) {
            console.log(e.offsetX);
            var position = e.offsetX / e.target.clientWidth;
            var timePosition = Math.round(duration * position);
            console.log(timePosition);
            cast_api.playMedia(cv_activity.activityId, new cast.MediaPlayRequest(timePosition));
        })
    };
}