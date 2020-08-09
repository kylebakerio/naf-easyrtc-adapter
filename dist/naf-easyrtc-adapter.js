/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* global NAF */

var EasyRtcAdapter = function () {
  function EasyRtcAdapter(easyrtc) {
    _classCallCheck(this, EasyRtcAdapter);

    this.easyrtc = easyrtc || window.easyrtc;
    this.app = "default";
    this.room = "default";

    this.audioStreams = {};
    this.pendingAudioRequest = {};

    this.serverTimeRequests = 0;
    this.timeOffsets = [];
    this.avgTimeOffset = 0;
  }

  _createClass(EasyRtcAdapter, [{
    key: "setServerUrl",
    value: function setServerUrl(url) {
      this.easyrtc.setSocketUrl(url);
    }
  }, {
    key: "setApp",
    value: function setApp(appName) {
      this.app = appName;
    }
  }, {
    key: "setRoom",
    value: function setRoom(roomName) {
      this.room = roomName;
      this.easyrtc.joinRoom(roomName, null);
    }

    // options: { datachannel: bool, audio: bool }

  }, {
    key: "setWebRtcOptions",
    value: function setWebRtcOptions(options) {
      // this.easyrtc.enableDebug(true);
      this.easyrtc.enableDataChannels(options.datachannel);

      this.easyrtc.enableVideo(false);
      this.easyrtc.enableAudio(options.audio);

      this.easyrtc.enableVideoReceive(false);
      this.easyrtc.enableAudioReceive(true);
    }
  }, {
    key: "setServerConnectListeners",
    value: function setServerConnectListeners(successListener, failureListener) {
      this.connectSuccess = successListener;
      this.connectFailure = failureListener;
    }
  }, {
    key: "setRoomOccupantListener",
    value: function setRoomOccupantListener(occupantListener) {
      this.easyrtc.setRoomOccupantListener(function (roomName, occupants, primary) {
        occupantListener(occupants);
      });
    }
  }, {
    key: "setDataChannelListeners",
    value: function setDataChannelListeners(openListener, closedListener, messageListener) {
      this.easyrtc.setDataChannelOpenListener(openListener);
      this.easyrtc.setDataChannelCloseListener(closedListener);
      this.easyrtc.setPeerListener(messageListener);
    }
  }, {
    key: "updateTimeOffset",
    value: function updateTimeOffset() {
      var _this = this;

      var clientSentTime = Date.now() + this.avgTimeOffset;

      return fetch(document.location.href, { method: "HEAD", cache: "no-cache" }).then(function (res) {
        var precision = 1000;
        var serverReceivedTime = new Date(res.headers.get("Date")).getTime() + precision / 2;
        var clientReceivedTime = Date.now();
        var serverTime = serverReceivedTime + (clientReceivedTime - clientSentTime) / 2;
        var timeOffset = serverTime - clientReceivedTime;

        _this.serverTimeRequests++;

        if (_this.serverTimeRequests <= 10) {
          _this.timeOffsets.push(timeOffset);
        } else {
          _this.timeOffsets[_this.serverTimeRequests % 10] = timeOffset;
        }

        _this.avgTimeOffset = _this.timeOffsets.reduce(function (acc, offset) {
          return acc += offset;
        }, 0) / _this.timeOffsets.length;

        if (_this.serverTimeRequests > 10) {
          setTimeout(function () {
            return _this.updateTimeOffset();
          }, 5 * 60 * 1000); // Sync clock every 5 minutes.
        } else {
          _this.updateTimeOffset();
        }
      });
    }
  }, {
    key: "getDisplayMediaStream",
    value: function getDisplayMediaStream() {
      console.warn("NAFOERTC: using custom experimental fork of NAF easyrtc adapter that allows getting displaymedia stream.");
      var displayMediaOptions = {
        audio: // true, 
        {
          autoGainControl: false,
          echoCancellation: false,
          googAutoGainControl: false,
          noiseSuppression: false,
          sampleRate: 44100
        },
        video: true
        /* {
          cursor: "never"
        }, */
      };

      var stream = navigator.mediaDevices.getDisplayMedia(displayMediaOptions).catch(function (err) {
        NAF.log.error("NAFOERTC: Error getting stream:", err);return null;
      });

      return stream;
    }
  }, {
    key: "filterStreamToAudioOnly",
    value: function filterStreamToAudioOnly(stream) {
      console.log("NAFOERTC: before filter to audio", stream);
      var audioTrack = stream.getAudioTracks()[0];
      console.log("NAFOERTC: audio track", audioTrack);

      var newStream = new MediaStream();
      newStream.addTrack(audioTrack);
      console.log('NAFOERTC: filtered to audio', newStream);
      return newStream;
    }
  }, {
    key: "connect",
    value: function connect() {
      var _this2 = this;

      Promise.all([this.updateTimeOffset(), new Promise(function (resolve, reject) {
        _this2._connect(_this2.easyrtc.audioEnabled, resolve, reject);
      }), this.getDisplayMediaStream()]).then(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 3),
            _ = _ref2[0],
            clientId = _ref2[1],
            displayMediaStream = _ref2[2];

        console.warn("NAFOERTC: stream after connect", displayMediaStream);
        easyrtc.register3rdPartyLocalMediaStream(_this2.filterStreamToAudioOnly(displayMediaStream), 'default' /* 'displayMedia-stream' */);
        console.warn("NAFOERTC: attempted to filter to audio and register--result:");
        console.warn("NAFOERTC:", _this2.easyrtc.getLocalStream('default' /* 'displayMedia-stream' */));
        _this2._storeAudioStream(_this2.easyrtc.myEasyrtcid,
        // this.easyrtc.getLocalStream()
        // this.filterStreamToAudioOnly(displayMediaStream)
        _this2.easyrtc.getLocalStream('default' /* 'displayMedia-stream' */));

        _this2._myRoomJoinTime = _this2._getRoomJoinTime(clientId);
        _this2.connectSuccess(clientId);
      }).catch(this.connectFailure);
    }
  }, {
    key: "shouldStartConnectionTo",
    value: function shouldStartConnectionTo(client) {
      return this._myRoomJoinTime <= client.roomJoinTime;
    }
  }, {
    key: "startStreamConnection",
    value: function startStreamConnection(clientId) {
      this.easyrtc.call(clientId, function (caller, media) {
        if (media === "datachannel") {
          NAF.log.write("Successfully started datachannel to ", caller);
        }
      }, function (errorCode, errorText) {
        NAF.log.error(errorCode, errorText);
      }, function (wasAccepted) {
        // console.log("was accepted=" + wasAccepted);
      });
    }
  }, {
    key: "closeStreamConnection",
    value: function closeStreamConnection(clientId) {
      // Handled by easyrtc
    }
  }, {
    key: "sendData",
    value: function sendData(clientId, dataType, data) {
      // send via webrtc otherwise fallback to websockets
      this.easyrtc.sendData(clientId, dataType, data);
    }
  }, {
    key: "sendDataGuaranteed",
    value: function sendDataGuaranteed(clientId, dataType, data) {
      this.easyrtc.sendDataWS(clientId, dataType, data);
    }
  }, {
    key: "broadcastData",
    value: function broadcastData(dataType, data) {
      var roomOccupants = this.easyrtc.getRoomOccupantsAsMap(this.room);

      // Iterate over the keys of the easyrtc room occupants map.
      // getRoomOccupantsAsArray uses Object.keys which allocates memory.
      for (var roomOccupant in roomOccupants) {
        if (roomOccupants[roomOccupant] && roomOccupant !== this.easyrtc.myEasyrtcid) {
          // send via webrtc otherwise fallback to websockets
          this.easyrtc.sendData(roomOccupant, dataType, data);
        }
      }
    }
  }, {
    key: "broadcastDataGuaranteed",
    value: function broadcastDataGuaranteed(dataType, data) {
      var destination = { targetRoom: this.room };
      this.easyrtc.sendDataWS(destination, dataType, data);
    }
  }, {
    key: "getConnectStatus",
    value: function getConnectStatus(clientId) {
      var status = this.easyrtc.getConnectStatus(clientId);

      if (status == this.easyrtc.IS_CONNECTED) {
        return NAF.adapters.IS_CONNECTED;
      } else if (status == this.easyrtc.NOT_CONNECTED) {
        return NAF.adapters.NOT_CONNECTED;
      } else {
        return NAF.adapters.CONNECTING;
      }
    }
  }, {
    key: "getMediaStream",
    value: function getMediaStream(clientId) {
      var that = this;
      if (this.audioStreams[clientId]) {
        NAF.log.write("Already had audio for " + clientId);
        return Promise.resolve(this.audioStreams[clientId]);
      } else {
        NAF.log.write("Waiting on audio for " + clientId);
        return new Promise(function (resolve) {
          that.pendingAudioRequest[clientId] = resolve;
        });
      }
    }
  }, {
    key: "disconnect",
    value: function disconnect() {
      this.easyrtc.disconnect();
    }

    /**
     * Privates
     */

  }, {
    key: "_storeAudioStream",
    value: function _storeAudioStream(easyrtcid, stream) {
      this.audioStreams[easyrtcid] = stream;
      if (this.pendingAudioRequest[easyrtcid]) {
        NAF.log.write("got pending audio for " + easyrtcid);
        this.pendingAudioRequest[easyrtcid](stream);
        delete this.pendingAudioRequest[easyrtcid](stream);
      }
    }
  }, {
    key: "_connect",
    value: function _connect(audioEnabled, connectSuccess, connectFailure) {
      var that = this;

      this.easyrtc.setStreamAcceptor(this._storeAudioStream.bind(this));

      this.easyrtc.setOnStreamClosed(function (easyrtcid) {
        delete that.audioStreams[easyrtcid];
      });

      if (audioEnabled) {
        this.easyrtc.initMediaSource(function () {
          that.easyrtc.connect(that.app, connectSuccess, connectFailure);
        }, function (errorCode, errmesg) {
          NAF.log.error(errorCode, errmesg);
        });
      } else {
        that.easyrtc.connect(that.app, connectSuccess, connectFailure);
      }
    }
  }, {
    key: "_getRoomJoinTime",
    value: function _getRoomJoinTime(clientId) {
      var myRoomId = NAF.room;
      var joinTime = this.easyrtc.getRoomOccupantsAsMap(myRoomId)[clientId].roomJoinTime;
      return joinTime;
    }
  }, {
    key: "getServerTime",
    value: function getServerTime() {
      return Date.now() + this.avgTimeOffset;
    }
  }]);

  return EasyRtcAdapter;
}();

NAF.adapters.register("easyrtc", EasyRtcAdapter);

module.exports = EasyRtcAdapter;

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNDI1OGU2YzQwOTQ3OTJmMTI4ZmIiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbIkVhc3lSdGNBZGFwdGVyIiwiZWFzeXJ0YyIsIndpbmRvdyIsImFwcCIsInJvb20iLCJhdWRpb1N0cmVhbXMiLCJwZW5kaW5nQXVkaW9SZXF1ZXN0Iiwic2VydmVyVGltZVJlcXVlc3RzIiwidGltZU9mZnNldHMiLCJhdmdUaW1lT2Zmc2V0IiwidXJsIiwic2V0U29ja2V0VXJsIiwiYXBwTmFtZSIsInJvb21OYW1lIiwiam9pblJvb20iLCJvcHRpb25zIiwiZW5hYmxlRGF0YUNoYW5uZWxzIiwiZGF0YWNoYW5uZWwiLCJlbmFibGVWaWRlbyIsImVuYWJsZUF1ZGlvIiwiYXVkaW8iLCJlbmFibGVWaWRlb1JlY2VpdmUiLCJlbmFibGVBdWRpb1JlY2VpdmUiLCJzdWNjZXNzTGlzdGVuZXIiLCJmYWlsdXJlTGlzdGVuZXIiLCJjb25uZWN0U3VjY2VzcyIsImNvbm5lY3RGYWlsdXJlIiwib2NjdXBhbnRMaXN0ZW5lciIsInNldFJvb21PY2N1cGFudExpc3RlbmVyIiwib2NjdXBhbnRzIiwicHJpbWFyeSIsIm9wZW5MaXN0ZW5lciIsImNsb3NlZExpc3RlbmVyIiwibWVzc2FnZUxpc3RlbmVyIiwic2V0RGF0YUNoYW5uZWxPcGVuTGlzdGVuZXIiLCJzZXREYXRhQ2hhbm5lbENsb3NlTGlzdGVuZXIiLCJzZXRQZWVyTGlzdGVuZXIiLCJjbGllbnRTZW50VGltZSIsIkRhdGUiLCJub3ciLCJmZXRjaCIsImRvY3VtZW50IiwibG9jYXRpb24iLCJocmVmIiwibWV0aG9kIiwiY2FjaGUiLCJ0aGVuIiwicHJlY2lzaW9uIiwic2VydmVyUmVjZWl2ZWRUaW1lIiwicmVzIiwiaGVhZGVycyIsImdldCIsImdldFRpbWUiLCJjbGllbnRSZWNlaXZlZFRpbWUiLCJzZXJ2ZXJUaW1lIiwidGltZU9mZnNldCIsInB1c2giLCJyZWR1Y2UiLCJhY2MiLCJvZmZzZXQiLCJsZW5ndGgiLCJzZXRUaW1lb3V0IiwidXBkYXRlVGltZU9mZnNldCIsImNvbnNvbGUiLCJ3YXJuIiwiZGlzcGxheU1lZGlhT3B0aW9ucyIsImF1dG9HYWluQ29udHJvbCIsImVjaG9DYW5jZWxsYXRpb24iLCJnb29nQXV0b0dhaW5Db250cm9sIiwibm9pc2VTdXBwcmVzc2lvbiIsInNhbXBsZVJhdGUiLCJ2aWRlbyIsInN0cmVhbSIsIm5hdmlnYXRvciIsIm1lZGlhRGV2aWNlcyIsImdldERpc3BsYXlNZWRpYSIsImNhdGNoIiwiTkFGIiwibG9nIiwiZXJyb3IiLCJlcnIiLCJhdWRpb1RyYWNrIiwiZ2V0QXVkaW9UcmFja3MiLCJuZXdTdHJlYW0iLCJNZWRpYVN0cmVhbSIsImFkZFRyYWNrIiwiUHJvbWlzZSIsImFsbCIsInJlc29sdmUiLCJyZWplY3QiLCJfY29ubmVjdCIsImF1ZGlvRW5hYmxlZCIsImdldERpc3BsYXlNZWRpYVN0cmVhbSIsIl8iLCJjbGllbnRJZCIsImRpc3BsYXlNZWRpYVN0cmVhbSIsInJlZ2lzdGVyM3JkUGFydHlMb2NhbE1lZGlhU3RyZWFtIiwiZmlsdGVyU3RyZWFtVG9BdWRpb09ubHkiLCJnZXRMb2NhbFN0cmVhbSIsIl9zdG9yZUF1ZGlvU3RyZWFtIiwibXlFYXN5cnRjaWQiLCJfbXlSb29tSm9pblRpbWUiLCJfZ2V0Um9vbUpvaW5UaW1lIiwiY2xpZW50Iiwicm9vbUpvaW5UaW1lIiwiY2FsbCIsImNhbGxlciIsIm1lZGlhIiwid3JpdGUiLCJlcnJvckNvZGUiLCJlcnJvclRleHQiLCJ3YXNBY2NlcHRlZCIsImRhdGFUeXBlIiwiZGF0YSIsInNlbmREYXRhIiwic2VuZERhdGFXUyIsInJvb21PY2N1cGFudHMiLCJnZXRSb29tT2NjdXBhbnRzQXNNYXAiLCJyb29tT2NjdXBhbnQiLCJkZXN0aW5hdGlvbiIsInRhcmdldFJvb20iLCJzdGF0dXMiLCJnZXRDb25uZWN0U3RhdHVzIiwiSVNfQ09OTkVDVEVEIiwiYWRhcHRlcnMiLCJOT1RfQ09OTkVDVEVEIiwiQ09OTkVDVElORyIsInRoYXQiLCJkaXNjb25uZWN0IiwiZWFzeXJ0Y2lkIiwic2V0U3RyZWFtQWNjZXB0b3IiLCJiaW5kIiwic2V0T25TdHJlYW1DbG9zZWQiLCJpbml0TWVkaWFTb3VyY2UiLCJjb25uZWN0IiwiZXJybWVzZyIsIm15Um9vbUlkIiwiam9pblRpbWUiLCJyZWdpc3RlciIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsS0FBSztRQUNMO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7O1FBRUE7UUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQzdEQTs7SUFFTUEsYztBQUVKLDBCQUFZQyxPQUFaLEVBQXFCO0FBQUE7O0FBQ25CLFNBQUtBLE9BQUwsR0FBZUEsV0FBV0MsT0FBT0QsT0FBakM7QUFDQSxTQUFLRSxHQUFMLEdBQVcsU0FBWDtBQUNBLFNBQUtDLElBQUwsR0FBWSxTQUFaOztBQUVBLFNBQUtDLFlBQUwsR0FBb0IsRUFBcEI7QUFDQSxTQUFLQyxtQkFBTCxHQUEyQixFQUEzQjs7QUFFQSxTQUFLQyxrQkFBTCxHQUEwQixDQUExQjtBQUNBLFNBQUtDLFdBQUwsR0FBbUIsRUFBbkI7QUFDQSxTQUFLQyxhQUFMLEdBQXFCLENBQXJCO0FBQ0Q7Ozs7aUNBRVlDLEcsRUFBSztBQUNoQixXQUFLVCxPQUFMLENBQWFVLFlBQWIsQ0FBMEJELEdBQTFCO0FBQ0Q7OzsyQkFFTUUsTyxF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Y2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA0MjU4ZTZjNDA5NDc5MmYxMjhmYiIsIi8qIGdsb2JhbCBOQUYgKi9cblxuY2xhc3MgRWFzeVJ0Y0FkYXB0ZXIge1xuXG4gIGNvbnN0cnVjdG9yKGVhc3lydGMpIHtcbiAgICB0aGlzLmVhc3lydGMgPSBlYXN5cnRjIHx8IHdpbmRvdy5lYXN5cnRjO1xuICAgIHRoaXMuYXBwID0gXCJkZWZhdWx0XCI7XG4gICAgdGhpcy5yb29tID0gXCJkZWZhdWx0XCI7XG5cbiAgICB0aGlzLmF1ZGlvU3RyZWFtcyA9IHt9O1xuICAgIHRoaXMucGVuZGluZ0F1ZGlvUmVxdWVzdCA9IHt9O1xuXG4gICAgdGhpcy5zZXJ2ZXJUaW1lUmVxdWVzdHMgPSAwO1xuICAgIHRoaXMudGltZU9mZnNldHMgPSBbXTtcbiAgICB0aGlzLmF2Z1RpbWVPZmZzZXQgPSAwO1xuICB9XG5cbiAgc2V0U2VydmVyVXJsKHVybCkge1xuICAgIHRoaXMuZWFzeXJ0Yy5zZXRTb2NrZXRVcmwodXJsKTtcbiAgfVxuXG4gIHNldEFwcChhcHBOYW1lKSB7XG4gICAgdGhpcy5hcHAgPSBhcHBOYW1lO1xuICB9XG5cbiAgc2V0Um9vbShyb29tTmFtZSkge1xuICAgIHRoaXMucm9vbSA9IHJvb21OYW1lO1xuICAgIHRoaXMuZWFzeXJ0Yy5qb2luUm9vbShyb29tTmFtZSwgbnVsbCk7XG4gIH1cblxuICAvLyBvcHRpb25zOiB7IGRhdGFjaGFubmVsOiBib29sLCBhdWRpbzogYm9vbCB9XG4gIHNldFdlYlJ0Y09wdGlvbnMob3B0aW9ucykge1xuICAgIC8vIHRoaXMuZWFzeXJ0Yy5lbmFibGVEZWJ1Zyh0cnVlKTtcbiAgICB0aGlzLmVhc3lydGMuZW5hYmxlRGF0YUNoYW5uZWxzKG9wdGlvbnMuZGF0YWNoYW5uZWwpO1xuXG4gICAgdGhpcy5lYXN5cnRjLmVuYWJsZVZpZGVvKGZhbHNlKTtcbiAgICB0aGlzLmVhc3lydGMuZW5hYmxlQXVkaW8ob3B0aW9ucy5hdWRpbyk7XG5cbiAgICB0aGlzLmVhc3lydGMuZW5hYmxlVmlkZW9SZWNlaXZlKGZhbHNlKTtcbiAgICB0aGlzLmVhc3lydGMuZW5hYmxlQXVkaW9SZWNlaXZlKHRydWUpO1xuICB9XG5cbiAgc2V0U2VydmVyQ29ubmVjdExpc3RlbmVycyhzdWNjZXNzTGlzdGVuZXIsIGZhaWx1cmVMaXN0ZW5lcikge1xuICAgIHRoaXMuY29ubmVjdFN1Y2Nlc3MgPSBzdWNjZXNzTGlzdGVuZXI7XG4gICAgdGhpcy5jb25uZWN0RmFpbHVyZSA9IGZhaWx1cmVMaXN0ZW5lcjtcbiAgfVxuXG4gIHNldFJvb21PY2N1cGFudExpc3RlbmVyKG9jY3VwYW50TGlzdGVuZXIpIHtcbiAgICB0aGlzLmVhc3lydGMuc2V0Um9vbU9jY3VwYW50TGlzdGVuZXIoZnVuY3Rpb24oXG4gICAgICByb29tTmFtZSxcbiAgICAgIG9jY3VwYW50cyxcbiAgICAgIHByaW1hcnlcbiAgICApIHtcbiAgICAgIG9jY3VwYW50TGlzdGVuZXIob2NjdXBhbnRzKTtcbiAgICB9KTtcbiAgfVxuXG4gIHNldERhdGFDaGFubmVsTGlzdGVuZXJzKG9wZW5MaXN0ZW5lciwgY2xvc2VkTGlzdGVuZXIsIG1lc3NhZ2VMaXN0ZW5lcikge1xuICAgIHRoaXMuZWFzeXJ0Yy5zZXREYXRhQ2hhbm5lbE9wZW5MaXN0ZW5lcihvcGVuTGlzdGVuZXIpO1xuICAgIHRoaXMuZWFzeXJ0Yy5zZXREYXRhQ2hhbm5lbENsb3NlTGlzdGVuZXIoY2xvc2VkTGlzdGVuZXIpO1xuICAgIHRoaXMuZWFzeXJ0Yy5zZXRQZWVyTGlzdGVuZXIobWVzc2FnZUxpc3RlbmVyKTtcbiAgfVxuXG4gIHVwZGF0ZVRpbWVPZmZzZXQoKSB7XG4gICAgY29uc3QgY2xpZW50U2VudFRpbWUgPSBEYXRlLm5vdygpICsgdGhpcy5hdmdUaW1lT2Zmc2V0O1xuXG4gICAgcmV0dXJuIGZldGNoKGRvY3VtZW50LmxvY2F0aW9uLmhyZWYsIHsgbWV0aG9kOiBcIkhFQURcIiwgY2FjaGU6IFwibm8tY2FjaGVcIiB9KVxuICAgICAgLnRoZW4ocmVzID0+IHtcbiAgICAgICAgdmFyIHByZWNpc2lvbiA9IDEwMDA7XG4gICAgICAgIHZhciBzZXJ2ZXJSZWNlaXZlZFRpbWUgPSBuZXcgRGF0ZShyZXMuaGVhZGVycy5nZXQoXCJEYXRlXCIpKS5nZXRUaW1lKCkgKyAocHJlY2lzaW9uIC8gMik7XG4gICAgICAgIHZhciBjbGllbnRSZWNlaXZlZFRpbWUgPSBEYXRlLm5vdygpO1xuICAgICAgICB2YXIgc2VydmVyVGltZSA9IHNlcnZlclJlY2VpdmVkVGltZSArICgoY2xpZW50UmVjZWl2ZWRUaW1lIC0gY2xpZW50U2VudFRpbWUpIC8gMik7XG4gICAgICAgIHZhciB0aW1lT2Zmc2V0ID0gc2VydmVyVGltZSAtIGNsaWVudFJlY2VpdmVkVGltZTtcblxuICAgICAgICB0aGlzLnNlcnZlclRpbWVSZXF1ZXN0cysrO1xuXG4gICAgICAgIGlmICh0aGlzLnNlcnZlclRpbWVSZXF1ZXN0cyA8PSAxMCkge1xuICAgICAgICAgIHRoaXMudGltZU9mZnNldHMucHVzaCh0aW1lT2Zmc2V0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnRpbWVPZmZzZXRzW3RoaXMuc2VydmVyVGltZVJlcXVlc3RzICUgMTBdID0gdGltZU9mZnNldDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYXZnVGltZU9mZnNldCA9IHRoaXMudGltZU9mZnNldHMucmVkdWNlKChhY2MsIG9mZnNldCkgPT4gYWNjICs9IG9mZnNldCwgMCkgLyB0aGlzLnRpbWVPZmZzZXRzLmxlbmd0aDtcblxuICAgICAgICBpZiAodGhpcy5zZXJ2ZXJUaW1lUmVxdWVzdHMgPiAxMCkge1xuICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy51cGRhdGVUaW1lT2Zmc2V0KCksIDUgKiA2MCAqIDEwMDApOyAvLyBTeW5jIGNsb2NrIGV2ZXJ5IDUgbWludXRlcy5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnVwZGF0ZVRpbWVPZmZzZXQoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH1cblxuICBnZXREaXNwbGF5TWVkaWFTdHJlYW0oKSB7XG4gICAgY29uc29sZS53YXJuKFwiTkFGT0VSVEM6IHVzaW5nIGN1c3RvbSBleHBlcmltZW50YWwgZm9yayBvZiBOQUYgZWFzeXJ0YyBhZGFwdGVyIHRoYXQgYWxsb3dzIGdldHRpbmcgZGlzcGxheW1lZGlhIHN0cmVhbS5cIilcbiAgICBsZXQgZGlzcGxheU1lZGlhT3B0aW9ucyA9IHtcbiAgICAgIGF1ZGlvOi8vIHRydWUsIFxuICAgICAge1xuICAgICAgICBhdXRvR2FpbkNvbnRyb2w6IGZhbHNlLFxuICAgICAgICBlY2hvQ2FuY2VsbGF0aW9uOiBmYWxzZSxcbiAgICAgICAgZ29vZ0F1dG9HYWluQ29udHJvbDogZmFsc2UsXG4gICAgICAgIG5vaXNlU3VwcHJlc3Npb246IGZhbHNlLFxuICAgICAgICBzYW1wbGVSYXRlOiA0NDEwMCxcbiAgICAgIH0sXG4gICAgICB2aWRlbzogdHJ1ZSwgXG4gICAgICAvKiB7XG4gICAgICAgIGN1cnNvcjogXCJuZXZlclwiXG4gICAgICB9LCAqL1xuICAgIH07XG5cbiAgICBsZXQgc3RyZWFtID0gbmF2aWdhdG9yXG4gICAgLm1lZGlhRGV2aWNlc1xuICAgIC5nZXREaXNwbGF5TWVkaWEoZGlzcGxheU1lZGlhT3B0aW9ucylcbiAgICAuY2F0Y2goZXJyID0+IHsgTkFGLmxvZy5lcnJvcihcIk5BRk9FUlRDOiBFcnJvciBnZXR0aW5nIHN0cmVhbTpcIiwgIGVycik7IHJldHVybiBudWxsOyB9KVxuXG4gICAgcmV0dXJuIHN0cmVhbTtcbiAgfVxuXG4gIGZpbHRlclN0cmVhbVRvQXVkaW9Pbmx5KHN0cmVhbSkge1xuICAgIGNvbnNvbGUubG9nKFwiTkFGT0VSVEM6IGJlZm9yZSBmaWx0ZXIgdG8gYXVkaW9cIiwgc3RyZWFtKVxuICAgIGxldCBhdWRpb1RyYWNrID0gc3RyZWFtLmdldEF1ZGlvVHJhY2tzKClbMF07XG4gICAgY29uc29sZS5sb2coXCJOQUZPRVJUQzogYXVkaW8gdHJhY2tcIiwgYXVkaW9UcmFjaylcblxuICAgIGxldCBuZXdTdHJlYW0gPSBuZXcgTWVkaWFTdHJlYW0oKVxuICAgIG5ld1N0cmVhbS5hZGRUcmFjayhhdWRpb1RyYWNrKVxuICAgIGNvbnNvbGUubG9nKCdOQUZPRVJUQzogZmlsdGVyZWQgdG8gYXVkaW8nLCBuZXdTdHJlYW0pXG4gICAgcmV0dXJuIG5ld1N0cmVhbTtcbiAgfVxuXG4gIGNvbm5lY3QoKSB7XG4gICAgUHJvbWlzZS5hbGwoW1xuICAgICAgdGhpcy51cGRhdGVUaW1lT2Zmc2V0KCksXG4gICAgICBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIHRoaXMuX2Nvbm5lY3QodGhpcy5lYXN5cnRjLmF1ZGlvRW5hYmxlZCwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgIH0pLFxuICAgICAgdGhpcy5nZXREaXNwbGF5TWVkaWFTdHJlYW0oKVxuICAgIF0pLnRoZW4oKFtfLCBjbGllbnRJZCwgZGlzcGxheU1lZGlhU3RyZWFtXSkgPT4ge1xuICAgICAgY29uc29sZS53YXJuKFwiTkFGT0VSVEM6IHN0cmVhbSBhZnRlciBjb25uZWN0XCIsIGRpc3BsYXlNZWRpYVN0cmVhbSlcbiAgICAgIGVhc3lydGMucmVnaXN0ZXIzcmRQYXJ0eUxvY2FsTWVkaWFTdHJlYW0odGhpcy5maWx0ZXJTdHJlYW1Ub0F1ZGlvT25seShkaXNwbGF5TWVkaWFTdHJlYW0pLCAnZGVmYXVsdCcvKiAnZGlzcGxheU1lZGlhLXN0cmVhbScgKi8pXG4gICAgICBjb25zb2xlLndhcm4oXCJOQUZPRVJUQzogYXR0ZW1wdGVkIHRvIGZpbHRlciB0byBhdWRpbyBhbmQgcmVnaXN0ZXItLXJlc3VsdDpcIilcbiAgICAgIGNvbnNvbGUud2FybihcIk5BRk9FUlRDOlwiLCB0aGlzLmVhc3lydGMuZ2V0TG9jYWxTdHJlYW0oJ2RlZmF1bHQnLyogJ2Rpc3BsYXlNZWRpYS1zdHJlYW0nICovKSlcbiAgICAgIHRoaXMuX3N0b3JlQXVkaW9TdHJlYW0oXG4gICAgICAgIHRoaXMuZWFzeXJ0Yy5teUVhc3lydGNpZCxcbiAgICAgICAgLy8gdGhpcy5lYXN5cnRjLmdldExvY2FsU3RyZWFtKClcbiAgICAgICAgLy8gdGhpcy5maWx0ZXJTdHJlYW1Ub0F1ZGlvT25seShkaXNwbGF5TWVkaWFTdHJlYW0pXG4gICAgICAgIHRoaXMuZWFzeXJ0Yy5nZXRMb2NhbFN0cmVhbSgnZGVmYXVsdCcvKiAnZGlzcGxheU1lZGlhLXN0cmVhbScgKi8pICAgICAgICBcbiAgICAgICk7XG5cbiAgICAgIHRoaXMuX215Um9vbUpvaW5UaW1lID0gdGhpcy5fZ2V0Um9vbUpvaW5UaW1lKGNsaWVudElkKTtcbiAgICAgIHRoaXMuY29ubmVjdFN1Y2Nlc3MoY2xpZW50SWQpO1xuICAgIH0pLmNhdGNoKHRoaXMuY29ubmVjdEZhaWx1cmUpO1xuICB9XG5cbiAgc2hvdWxkU3RhcnRDb25uZWN0aW9uVG8oY2xpZW50KSB7XG4gICAgcmV0dXJuIHRoaXMuX215Um9vbUpvaW5UaW1lIDw9IGNsaWVudC5yb29tSm9pblRpbWU7XG4gIH1cblxuICBzdGFydFN0cmVhbUNvbm5lY3Rpb24oY2xpZW50SWQpIHtcbiAgICB0aGlzLmVhc3lydGMuY2FsbChcbiAgICAgIGNsaWVudElkLFxuICAgICAgZnVuY3Rpb24oY2FsbGVyLCBtZWRpYSkge1xuICAgICAgICBpZiAobWVkaWEgPT09IFwiZGF0YWNoYW5uZWxcIikge1xuICAgICAgICAgIE5BRi5sb2cud3JpdGUoXCJTdWNjZXNzZnVsbHkgc3RhcnRlZCBkYXRhY2hhbm5lbCB0byBcIiwgY2FsbGVyKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGZ1bmN0aW9uKGVycm9yQ29kZSwgZXJyb3JUZXh0KSB7XG4gICAgICAgIE5BRi5sb2cuZXJyb3IoZXJyb3JDb2RlLCBlcnJvclRleHQpO1xuICAgICAgfSxcbiAgICAgIGZ1bmN0aW9uKHdhc0FjY2VwdGVkKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwid2FzIGFjY2VwdGVkPVwiICsgd2FzQWNjZXB0ZWQpO1xuICAgICAgfVxuICAgICk7XG4gIH1cblxuICBjbG9zZVN0cmVhbUNvbm5lY3Rpb24oY2xpZW50SWQpIHtcbiAgICAvLyBIYW5kbGVkIGJ5IGVhc3lydGNcbiAgfVxuXG4gIHNlbmREYXRhKGNsaWVudElkLCBkYXRhVHlwZSwgZGF0YSkge1xuICAgIC8vIHNlbmQgdmlhIHdlYnJ0YyBvdGhlcndpc2UgZmFsbGJhY2sgdG8gd2Vic29ja2V0c1xuICAgIHRoaXMuZWFzeXJ0Yy5zZW5kRGF0YShjbGllbnRJZCwgZGF0YVR5cGUsIGRhdGEpO1xuICB9XG5cbiAgc2VuZERhdGFHdWFyYW50ZWVkKGNsaWVudElkLCBkYXRhVHlwZSwgZGF0YSkge1xuICAgIHRoaXMuZWFzeXJ0Yy5zZW5kRGF0YVdTKGNsaWVudElkLCBkYXRhVHlwZSwgZGF0YSk7XG4gIH1cblxuICBicm9hZGNhc3REYXRhKGRhdGFUeXBlLCBkYXRhKSB7XG4gICAgdmFyIHJvb21PY2N1cGFudHMgPSB0aGlzLmVhc3lydGMuZ2V0Um9vbU9jY3VwYW50c0FzTWFwKHRoaXMucm9vbSk7XG5cbiAgICAvLyBJdGVyYXRlIG92ZXIgdGhlIGtleXMgb2YgdGhlIGVhc3lydGMgcm9vbSBvY2N1cGFudHMgbWFwLlxuICAgIC8vIGdldFJvb21PY2N1cGFudHNBc0FycmF5IHVzZXMgT2JqZWN0LmtleXMgd2hpY2ggYWxsb2NhdGVzIG1lbW9yeS5cbiAgICBmb3IgKHZhciByb29tT2NjdXBhbnQgaW4gcm9vbU9jY3VwYW50cykge1xuICAgICAgaWYgKFxuICAgICAgICByb29tT2NjdXBhbnRzW3Jvb21PY2N1cGFudF0gJiZcbiAgICAgICAgcm9vbU9jY3VwYW50ICE9PSB0aGlzLmVhc3lydGMubXlFYXN5cnRjaWRcbiAgICAgICkge1xuICAgICAgICAvLyBzZW5kIHZpYSB3ZWJydGMgb3RoZXJ3aXNlIGZhbGxiYWNrIHRvIHdlYnNvY2tldHNcbiAgICAgICAgdGhpcy5lYXN5cnRjLnNlbmREYXRhKHJvb21PY2N1cGFudCwgZGF0YVR5cGUsIGRhdGEpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGJyb2FkY2FzdERhdGFHdWFyYW50ZWVkKGRhdGFUeXBlLCBkYXRhKSB7XG4gICAgdmFyIGRlc3RpbmF0aW9uID0geyB0YXJnZXRSb29tOiB0aGlzLnJvb20gfTtcbiAgICB0aGlzLmVhc3lydGMuc2VuZERhdGFXUyhkZXN0aW5hdGlvbiwgZGF0YVR5cGUsIGRhdGEpO1xuICB9XG5cbiAgZ2V0Q29ubmVjdFN0YXR1cyhjbGllbnRJZCkge1xuICAgIHZhciBzdGF0dXMgPSB0aGlzLmVhc3lydGMuZ2V0Q29ubmVjdFN0YXR1cyhjbGllbnRJZCk7XG5cbiAgICBpZiAoc3RhdHVzID09IHRoaXMuZWFzeXJ0Yy5JU19DT05ORUNURUQpIHtcbiAgICAgIHJldHVybiBOQUYuYWRhcHRlcnMuSVNfQ09OTkVDVEVEO1xuICAgIH0gZWxzZSBpZiAoc3RhdHVzID09IHRoaXMuZWFzeXJ0Yy5OT1RfQ09OTkVDVEVEKSB7XG4gICAgICByZXR1cm4gTkFGLmFkYXB0ZXJzLk5PVF9DT05ORUNURUQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBOQUYuYWRhcHRlcnMuQ09OTkVDVElORztcbiAgICB9XG4gIH1cblxuICBnZXRNZWRpYVN0cmVhbShjbGllbnRJZCkge1xuICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICBpZiAodGhpcy5hdWRpb1N0cmVhbXNbY2xpZW50SWRdKSB7XG4gICAgICBOQUYubG9nLndyaXRlKFwiQWxyZWFkeSBoYWQgYXVkaW8gZm9yIFwiICsgY2xpZW50SWQpO1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLmF1ZGlvU3RyZWFtc1tjbGllbnRJZF0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBOQUYubG9nLndyaXRlKFwiV2FpdGluZyBvbiBhdWRpbyBmb3IgXCIgKyBjbGllbnRJZCk7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuICAgICAgICB0aGF0LnBlbmRpbmdBdWRpb1JlcXVlc3RbY2xpZW50SWRdID0gcmVzb2x2ZTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGRpc2Nvbm5lY3QoKSB7XG4gICAgdGhpcy5lYXN5cnRjLmRpc2Nvbm5lY3QoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcml2YXRlc1xuICAgKi9cblxuICBfc3RvcmVBdWRpb1N0cmVhbShlYXN5cnRjaWQsIHN0cmVhbSkge1xuICAgIHRoaXMuYXVkaW9TdHJlYW1zW2Vhc3lydGNpZF0gPSBzdHJlYW07XG4gICAgaWYgKHRoaXMucGVuZGluZ0F1ZGlvUmVxdWVzdFtlYXN5cnRjaWRdKSB7XG4gICAgICBOQUYubG9nLndyaXRlKFwiZ290IHBlbmRpbmcgYXVkaW8gZm9yIFwiICsgZWFzeXJ0Y2lkKTtcbiAgICAgIHRoaXMucGVuZGluZ0F1ZGlvUmVxdWVzdFtlYXN5cnRjaWRdKHN0cmVhbSk7XG4gICAgICBkZWxldGUgdGhpcy5wZW5kaW5nQXVkaW9SZXF1ZXN0W2Vhc3lydGNpZF0oc3RyZWFtKTtcbiAgICB9XG4gIH1cblxuICBfY29ubmVjdChhdWRpb0VuYWJsZWQsIGNvbm5lY3RTdWNjZXNzLCBjb25uZWN0RmFpbHVyZSkge1xuICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgIHRoaXMuZWFzeXJ0Yy5zZXRTdHJlYW1BY2NlcHRvcih0aGlzLl9zdG9yZUF1ZGlvU3RyZWFtLmJpbmQodGhpcykpO1xuXG4gICAgdGhpcy5lYXN5cnRjLnNldE9uU3RyZWFtQ2xvc2VkKGZ1bmN0aW9uKGVhc3lydGNpZCkge1xuICAgICAgZGVsZXRlIHRoYXQuYXVkaW9TdHJlYW1zW2Vhc3lydGNpZF07XG4gICAgfSk7XG5cbiAgICBpZiAoYXVkaW9FbmFibGVkKSB7XG4gICAgICB0aGlzLmVhc3lydGMuaW5pdE1lZGlhU291cmNlKFxuICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICB0aGF0LmVhc3lydGMuY29ubmVjdCh0aGF0LmFwcCwgY29ubmVjdFN1Y2Nlc3MsIGNvbm5lY3RGYWlsdXJlKTtcbiAgICAgICAgfSxcbiAgICAgICAgZnVuY3Rpb24oZXJyb3JDb2RlLCBlcnJtZXNnKSB7XG4gICAgICAgICAgTkFGLmxvZy5lcnJvcihlcnJvckNvZGUsIGVycm1lc2cpO1xuICAgICAgICB9XG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGF0LmVhc3lydGMuY29ubmVjdCh0aGF0LmFwcCwgY29ubmVjdFN1Y2Nlc3MsIGNvbm5lY3RGYWlsdXJlKTtcbiAgICB9XG4gIH1cblxuICBfZ2V0Um9vbUpvaW5UaW1lKGNsaWVudElkKSB7XG4gICAgdmFyIG15Um9vbUlkID0gTkFGLnJvb207XG4gICAgdmFyIGpvaW5UaW1lID0gdGhpcy5lYXN5cnRjLmdldFJvb21PY2N1cGFudHNBc01hcChteVJvb21JZClbY2xpZW50SWRdXG4gICAgICAucm9vbUpvaW5UaW1lO1xuICAgIHJldHVybiBqb2luVGltZTtcbiAgfVxuXG4gIGdldFNlcnZlclRpbWUoKSB7XG4gICAgcmV0dXJuIERhdGUubm93KCkgKyB0aGlzLmF2Z1RpbWVPZmZzZXQ7XG4gIH1cbn1cblxuTkFGLmFkYXB0ZXJzLnJlZ2lzdGVyKFwiZWFzeXJ0Y1wiLCBFYXN5UnRjQWRhcHRlcik7XG5cbm1vZHVsZS5leHBvcnRzID0gRWFzeVJ0Y0FkYXB0ZXI7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2luZGV4LmpzIl0sInNvdXJjZVJvb3QiOiIifQ==