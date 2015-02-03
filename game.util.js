game.util = {
    storage : function (type, key, val) {
        try {
            var storeName = 'LlamaBall',
                oStorage,
                oData;

            switch (type) {
            case 'write':
                oData = {};
                oData[key] = val;
                window.localStorage[storeName] = JSON.stringify(oData);
                break;
            case 'delete':
                oData = JSON.parse(window.localStorage[storeName]);
                delete oData[key];
                window.localStorage[storeName] = JSON.stringify(oData);
                break;
            case 'read':
                oStorage = JSON.parse(window.localStorage[storeName]);
                return oStorage[key];
            }
        } catch (e) {}
    },

    sound: function (filename) {
        var canplayHtmlAudio = function () {
            return !!document.createElement('audio').canPlayType;
        },
        gameMedia;

        try {
        //if (game.storage('read', 'sound') !== 'off') {

            if (canplayHtmlAudio()) {
                document.getElementById(filename).play();
            } else {

                if (navigator.userAgent.indexOf('Android') > -1) {
                    gameMedia = new Media('/android_asset/www/audio/' + filename + '.mp3',
                        function () {
                            //alert('success: ' + filename)
                        },
                        function (err) {
                            //alert('fail: ' + filename)
                        }
                    );
                    gameMedia.play();
                }
            }
        //}
        } catch (e) {
            alert(e);
        }
    },

/*
    sound: function (s) {
	    var audiochannels = [];
	    var channel_max = 2;							// number of channels

	    for (a = 0; a < channel_max; a++) {				// prepare the channels
		    audiochannels[a] = [];
		    audiochannels[a]['channel'] = new Audio();	// create a new audio object
		    audiochannels[a]['finished'] = -1;			// expected end time for this channel
	    }
	    for (a = 0; a < audiochannels.length; a++) {
		    thistime = new Date();
		    if (audiochannels[a]['finished'] < thistime.getTime()) {			// is this channel finished?
			    audiochannels[a]['finished'] = thistime.getTime() + document.getElementById(s).duration*1000;
			    audiochannels[a]['channel'].src = document.getElementById(s).src;
			    audiochannels[a]['channel'].load();
			    audiochannels[a]['channel'].play();
			    break;
		    }
	    }
    },
*/
    randArray: function (alength, arange) {
        var arr = []
        while(arr.length < alength){
            var randomnumber = Math.ceil(Math.random() * arange)
            var found = false;
            for (var i = 0; i < arr.length; i++){
                if (arr[i] === randomnumber) {
                    found = true;
                    break
                }
            }
            if (!found) {
                arr[arr.length] = randomnumber;
            }
        }
        return arr;
    },

    getRandomArbitary: function (min, max) {
        return Math.random() * (max - min) + min;
    },

    shuffle: function (a) {
        var i, j, x;
        for (i = a.length; i; j = parseInt(Math.random() * i), x = a[--i], a[i] = a[j], a[j] = x);
        return a;
    }

};

