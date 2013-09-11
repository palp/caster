var appId = 'caster';

function cast(url) {
    var cast_api, cv_activity;

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
        request.parameters = "url=" + url;
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
        } else if (activity.status == "error") {
            cv_activity = null;
        }
    };

}