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
        _this2._storeAudioStream(_this2.easyrtc.myEasyrtcid,
        // this.easyrtc.getLocalStream()
        _this2.filterStreamToAudioOnly(displayMediaStream));

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgM2Q2OTI1YTNkZjA0NWY1MTYzZjciLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbIkVhc3lSdGNBZGFwdGVyIiwiZWFzeXJ0YyIsIndpbmRvdyIsImFwcCIsInJvb20iLCJhdWRpb1N0cmVhbXMiLCJwZW5kaW5nQXVkaW9SZXF1ZXN0Iiwic2VydmVyVGltZVJlcXVlc3RzIiwidGltZU9mZnNldHMiLCJhdmdUaW1lT2Zmc2V0IiwidXJsIiwic2V0U29ja2V0VXJsIiwiYXBwTmFtZSIsInJvb21OYW1lIiwiam9pblJvb20iLCJvcHRpb25zIiwiZW5hYmxlRGF0YUNoYW5uZWxzIiwiZGF0YWNoYW5uZWwiLCJlbmFibGVWaWRlbyIsImVuYWJsZUF1ZGlvIiwiYXVkaW8iLCJlbmFibGVWaWRlb1JlY2VpdmUiLCJlbmFibGVBdWRpb1JlY2VpdmUiLCJzdWNjZXNzTGlzdGVuZXIiLCJmYWlsdXJlTGlzdGVuZXIiLCJjb25uZWN0U3VjY2VzcyIsImNvbm5lY3RGYWlsdXJlIiwib2NjdXBhbnRMaXN0ZW5lciIsInNldFJvb21PY2N1cGFudExpc3RlbmVyIiwib2NjdXBhbnRzIiwicHJpbWFyeSIsIm9wZW5MaXN0ZW5lciIsImNsb3NlZExpc3RlbmVyIiwibWVzc2FnZUxpc3RlbmVyIiwic2V0RGF0YUNoYW5uZWxPcGVuTGlzdGVuZXIiLCJzZXREYXRhQ2hhbm5lbENsb3NlTGlzdGVuZXIiLCJzZXRQZWVyTGlzdGVuZXIiLCJjbGllbnRTZW50VGltZSIsIkRhdGUiLCJub3ciLCJmZXRjaCIsImRvY3VtZW50IiwibG9jYXRpb24iLCJocmVmIiwibWV0aG9kIiwiY2FjaGUiLCJ0aGVuIiwicHJlY2lzaW9uIiwic2VydmVyUmVjZWl2ZWRUaW1lIiwicmVzIiwiaGVhZGVycyIsImdldCIsImdldFRpbWUiLCJjbGllbnRSZWNlaXZlZFRpbWUiLCJzZXJ2ZXJUaW1lIiwidGltZU9mZnNldCIsInB1c2giLCJyZWR1Y2UiLCJhY2MiLCJvZmZzZXQiLCJsZW5ndGgiLCJzZXRUaW1lb3V0IiwidXBkYXRlVGltZU9mZnNldCIsImNvbnNvbGUiLCJ3YXJuIiwiZGlzcGxheU1lZGlhT3B0aW9ucyIsImF1dG9HYWluQ29udHJvbCIsImVjaG9DYW5jZWxsYXRpb24iLCJnb29nQXV0b0dhaW5Db250cm9sIiwibm9pc2VTdXBwcmVzc2lvbiIsInNhbXBsZVJhdGUiLCJ2aWRlbyIsInN0cmVhbSIsIm5hdmlnYXRvciIsIm1lZGlhRGV2aWNlcyIsImdldERpc3BsYXlNZWRpYSIsImNhdGNoIiwiTkFGIiwibG9nIiwiZXJyb3IiLCJlcnIiLCJhdWRpb1RyYWNrIiwiZ2V0QXVkaW9UcmFja3MiLCJuZXdTdHJlYW0iLCJNZWRpYVN0cmVhbSIsImFkZFRyYWNrIiwiUHJvbWlzZSIsImFsbCIsInJlc29sdmUiLCJyZWplY3QiLCJfY29ubmVjdCIsImF1ZGlvRW5hYmxlZCIsImdldERpc3BsYXlNZWRpYVN0cmVhbSIsIl8iLCJjbGllbnRJZCIsImRpc3BsYXlNZWRpYVN0cmVhbSIsIl9zdG9yZUF1ZGlvU3RyZWFtIiwibXlFYXN5cnRjaWQiLCJmaWx0ZXJTdHJlYW1Ub0F1ZGlvT25seSIsIl9teVJvb21Kb2luVGltZSIsIl9nZXRSb29tSm9pblRpbWUiLCJjbGllbnQiLCJyb29tSm9pblRpbWUiLCJjYWxsIiwiY2FsbGVyIiwibWVkaWEiLCJ3cml0ZSIsImVycm9yQ29kZSIsImVycm9yVGV4dCIsIndhc0FjY2VwdGVkIiwiZGF0YVR5cGUiLCJkYXRhIiwic2VuZERhdGEiLCJzZW5kRGF0YVdTIiwicm9vbU9jY3VwYW50cyIsImdldFJvb21PY2N1cGFudHNBc01hcCIsInJvb21PY2N1cGFudCIsImRlc3RpbmF0aW9uIiwidGFyZ2V0Um9vbSIsInN0YXR1cyIsImdldENvbm5lY3RTdGF0dXMiLCJJU19DT05ORUNURUQiLCJhZGFwdGVycyIsIk5PVF9DT05ORUNURUQiLCJDT05ORUNUSU5HIiwidGhhdCIsImRpc2Nvbm5lY3QiLCJlYXN5cnRjaWQiLCJzZXRTdHJlYW1BY2NlcHRvciIsImJpbmQiLCJzZXRPblN0cmVhbUNsb3NlZCIsImluaXRNZWRpYVNvdXJjZSIsImNvbm5lY3QiLCJlcnJtZXNnIiwibXlSb29tSWQiLCJqb2luVGltZSIsInJlZ2lzdGVyIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxLQUFLO1FBQ0w7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7UUFFQTtRQUNBOzs7Ozs7Ozs7Ozs7Ozs7O0FDN0RBOztJQUVNQSxjO0FBRUosMEJBQVlDLE9BQVosRUFBcUI7QUFBQTs7QUFDbkIsU0FBS0EsT0FBTCxHQUFlQSxXQUFXQyxPQUFPRCxPQUFqQztBQUNBLFNBQUtFLEdBQUwsR0FBVyxTQUFYO0FBQ0EsU0FBS0MsSUFBTCxHQUFZLFNBQVo7O0FBRUEsU0FBS0MsWUFBTCxHQUFvQixFQUFwQjtBQUNBLFNBQUtDLG1CQUFMLEdBQTJCLEVBQTNCOztBQUVBLFNBQUtDLGtCQUFMLEdBQTBCLENBQTFCO0FBQ0EsU0FBS0MsV0FBTCxHQUFtQixFQUFuQjtBQUNBLFNBQUtDLGFBQUwsR0FBcUIsQ0FBckI7QUFDRDs7OztpQ0FFWUMsRyxFQUFLO0FBQ2hCLFdBQUtULE9BQUwsQ0FBYVUsWUFBYixDQUEwQkQsR0FBMUI7QUFDRDs7OzJCQUVNRSxPLEVBQVM7QUFDZCxXQUFLVCxHQUFMLEdBQVdTLE9BQVg7QUFDRDs7OzRCQUVPQyxRLEVBQVU7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Q0FBYW1JLE9BQWIsQ0FBcUJQLEtBQUsxSCxHQUExQixFQUErQnNCLGNBQS9CLEVBQStDQyxjQUEvQztBQUNELFNBSEgsRUFJRSxVQUFTaUYsU0FBVCxFQUFvQjBCLE9BQXBCLEVBQTZCO0FBQzNCeEQsY0FBSUMsR0FBSixDQUFRQyxLQUFSLENBQWM0QixTQUFkLEVBQXlCMEIsT0FBekI7QUFDRCxTQU5IO0FBUUQsT0FURCxNQVNPO0FBQ0xSLGFBQUs1SCxPQUFMLENBQWFtSSxPQUFiLENBQXFCUCxLQUFLMUgsR0FBMUIsRUFBK0JzQixjQUEvQixFQUErQ0MsY0FBL0M7QUFDRDtBQUNGOzs7cUNBRWdCb0UsUSxFQUFVO0FBQ3pCLFVBQUl3QyxXQUFXekQsSUFBSXpFLElBQW5CO0FBQ0EsVUFBSW1JLFdBQVcsS0FBS3RJLE9BQUwsQ0FBYWtILHFCQUFiLENBQW1DbUIsUUFBbkMsRUFBNkN4QyxRQUE3QyxFQUNaUSxZQURIO0FBRUEsYUFBT2lDLFFBQVA7QUFDRDs7O29DQUVlO0FBQ2QsYUFBT2pHLEtBQUtDLEdBQUwsS0FBYSxLQUFLOUIsYUFBekI7QUFDRDs7Ozs7O0FBR0hvRSxJQUFJNkMsUUFBSixDQUFhYyxRQUFiLENBQXNCLFNBQXRCLEVBQWlDeEksY0FBakM7O0FBRUF5SSxPQUFPQyxPQUFQLEdBQWlCMUksY0FBakIsQyIsImZpbGUiOiJuYWYtZWFzeXJ0Yy1hZGFwdGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgM2Q2OTI1YTNkZjA0NWY1MTYzZjciLCIvKiBnbG9iYWwgTkFGICovXG5cbmNsYXNzIEVhc3lSdGNBZGFwdGVyIHtcblxuICBjb25zdHJ1Y3RvcihlYXN5cnRjKSB7XG4gICAgdGhpcy5lYXN5cnRjID0gZWFzeXJ0YyB8fCB3aW5kb3cuZWFzeXJ0YztcbiAgICB0aGlzLmFwcCA9IFwiZGVmYXVsdFwiO1xuICAgIHRoaXMucm9vbSA9IFwiZGVmYXVsdFwiO1xuXG4gICAgdGhpcy5hdWRpb1N0cmVhbXMgPSB7fTtcbiAgICB0aGlzLnBlbmRpbmdBdWRpb1JlcXVlc3QgPSB7fTtcblxuICAgIHRoaXMuc2VydmVyVGltZVJlcXVlc3RzID0gMDtcbiAgICB0aGlzLnRpbWVPZmZzZXRzID0gW107XG4gICAgdGhpcy5hdmdUaW1lT2Zmc2V0ID0gMDtcbiAgfVxuXG4gIHNldFNlcnZlclVybCh1cmwpIHtcbiAgICB0aGlzLmVhc3lydGMuc2V0U29ja2V0VXJsKHVybCk7XG4gIH1cblxuICBzZXRBcHAoYXBwTmFtZSkge1xuICAgIHRoaXMuYXBwID0gYXBwTmFtZTtcbiAgfVxuXG4gIHNldFJvb20ocm9vbU5hbWUpIHtcbiAgICB0aGlzLnJvb20gPSByb29tTmFtZTtcbiAgICB0aGlzLmVhc3lydGMuam9pblJvb20ocm9vbU5hbWUsIG51bGwpO1xuICB9XG5cbiAgLy8gb3B0aW9uczogeyBkYXRhY2hhbm5lbDogYm9vbCwgYXVkaW86IGJvb2wgfVxuICBzZXRXZWJSdGNPcHRpb25zKG9wdGlvbnMpIHtcbiAgICAvLyB0aGlzLmVhc3lydGMuZW5hYmxlRGVidWcodHJ1ZSk7XG4gICAgdGhpcy5lYXN5cnRjLmVuYWJsZURhdGFDaGFubmVscyhvcHRpb25zLmRhdGFjaGFubmVsKTtcblxuICAgIHRoaXMuZWFzeXJ0Yy5lbmFibGVWaWRlbyhmYWxzZSk7XG4gICAgdGhpcy5lYXN5cnRjLmVuYWJsZUF1ZGlvKG9wdGlvbnMuYXVkaW8pO1xuXG4gICAgdGhpcy5lYXN5cnRjLmVuYWJsZVZpZGVvUmVjZWl2ZShmYWxzZSk7XG4gICAgdGhpcy5lYXN5cnRjLmVuYWJsZUF1ZGlvUmVjZWl2ZSh0cnVlKTtcbiAgfVxuXG4gIHNldFNlcnZlckNvbm5lY3RMaXN0ZW5lcnMoc3VjY2Vzc0xpc3RlbmVyLCBmYWlsdXJlTGlzdGVuZXIpIHtcbiAgICB0aGlzLmNvbm5lY3RTdWNjZXNzID0gc3VjY2Vzc0xpc3RlbmVyO1xuICAgIHRoaXMuY29ubmVjdEZhaWx1cmUgPSBmYWlsdXJlTGlzdGVuZXI7XG4gIH1cblxuICBzZXRSb29tT2NjdXBhbnRMaXN0ZW5lcihvY2N1cGFudExpc3RlbmVyKSB7XG4gICAgdGhpcy5lYXN5cnRjLnNldFJvb21PY2N1cGFudExpc3RlbmVyKGZ1bmN0aW9uKFxuICAgICAgcm9vbU5hbWUsXG4gICAgICBvY2N1cGFudHMsXG4gICAgICBwcmltYXJ5XG4gICAgKSB7XG4gICAgICBvY2N1cGFudExpc3RlbmVyKG9jY3VwYW50cyk7XG4gICAgfSk7XG4gIH1cblxuICBzZXREYXRhQ2hhbm5lbExpc3RlbmVycyhvcGVuTGlzdGVuZXIsIGNsb3NlZExpc3RlbmVyLCBtZXNzYWdlTGlzdGVuZXIpIHtcbiAgICB0aGlzLmVhc3lydGMuc2V0RGF0YUNoYW5uZWxPcGVuTGlzdGVuZXIob3Blbkxpc3RlbmVyKTtcbiAgICB0aGlzLmVhc3lydGMuc2V0RGF0YUNoYW5uZWxDbG9zZUxpc3RlbmVyKGNsb3NlZExpc3RlbmVyKTtcbiAgICB0aGlzLmVhc3lydGMuc2V0UGVlckxpc3RlbmVyKG1lc3NhZ2VMaXN0ZW5lcik7XG4gIH1cblxuICB1cGRhdGVUaW1lT2Zmc2V0KCkge1xuICAgIGNvbnN0IGNsaWVudFNlbnRUaW1lID0gRGF0ZS5ub3coKSArIHRoaXMuYXZnVGltZU9mZnNldDtcblxuICAgIHJldHVybiBmZXRjaChkb2N1bWVudC5sb2NhdGlvbi5ocmVmLCB7IG1ldGhvZDogXCJIRUFEXCIsIGNhY2hlOiBcIm5vLWNhY2hlXCIgfSlcbiAgICAgIC50aGVuKHJlcyA9PiB7XG4gICAgICAgIHZhciBwcmVjaXNpb24gPSAxMDAwO1xuICAgICAgICB2YXIgc2VydmVyUmVjZWl2ZWRUaW1lID0gbmV3IERhdGUocmVzLmhlYWRlcnMuZ2V0KFwiRGF0ZVwiKSkuZ2V0VGltZSgpICsgKHByZWNpc2lvbiAvIDIpO1xuICAgICAgICB2YXIgY2xpZW50UmVjZWl2ZWRUaW1lID0gRGF0ZS5ub3coKTtcbiAgICAgICAgdmFyIHNlcnZlclRpbWUgPSBzZXJ2ZXJSZWNlaXZlZFRpbWUgKyAoKGNsaWVudFJlY2VpdmVkVGltZSAtIGNsaWVudFNlbnRUaW1lKSAvIDIpO1xuICAgICAgICB2YXIgdGltZU9mZnNldCA9IHNlcnZlclRpbWUgLSBjbGllbnRSZWNlaXZlZFRpbWU7XG5cbiAgICAgICAgdGhpcy5zZXJ2ZXJUaW1lUmVxdWVzdHMrKztcblxuICAgICAgICBpZiAodGhpcy5zZXJ2ZXJUaW1lUmVxdWVzdHMgPD0gMTApIHtcbiAgICAgICAgICB0aGlzLnRpbWVPZmZzZXRzLnB1c2godGltZU9mZnNldCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy50aW1lT2Zmc2V0c1t0aGlzLnNlcnZlclRpbWVSZXF1ZXN0cyAlIDEwXSA9IHRpbWVPZmZzZXQ7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmF2Z1RpbWVPZmZzZXQgPSB0aGlzLnRpbWVPZmZzZXRzLnJlZHVjZSgoYWNjLCBvZmZzZXQpID0+IGFjYyArPSBvZmZzZXQsIDApIC8gdGhpcy50aW1lT2Zmc2V0cy5sZW5ndGg7XG5cbiAgICAgICAgaWYgKHRoaXMuc2VydmVyVGltZVJlcXVlc3RzID4gMTApIHtcbiAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMudXBkYXRlVGltZU9mZnNldCgpLCA1ICogNjAgKiAxMDAwKTsgLy8gU3luYyBjbG9jayBldmVyeSA1IG1pbnV0ZXMuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy51cGRhdGVUaW1lT2Zmc2V0KCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9XG5cbiAgZ2V0RGlzcGxheU1lZGlhU3RyZWFtKCkge1xuICAgIGNvbnNvbGUud2FybihcIk5BRk9FUlRDOiB1c2luZyBjdXN0b20gZXhwZXJpbWVudGFsIGZvcmsgb2YgTkFGIGVhc3lydGMgYWRhcHRlciB0aGF0IGFsbG93cyBnZXR0aW5nIGRpc3BsYXltZWRpYSBzdHJlYW0uXCIpXG4gICAgbGV0IGRpc3BsYXlNZWRpYU9wdGlvbnMgPSB7XG4gICAgICBhdWRpbzovLyB0cnVlLCBcbiAgICAgIHtcbiAgICAgICAgYXV0b0dhaW5Db250cm9sOiBmYWxzZSxcbiAgICAgICAgZWNob0NhbmNlbGxhdGlvbjogZmFsc2UsXG4gICAgICAgIGdvb2dBdXRvR2FpbkNvbnRyb2w6IGZhbHNlLFxuICAgICAgICBub2lzZVN1cHByZXNzaW9uOiBmYWxzZSxcbiAgICAgICAgc2FtcGxlUmF0ZTogNDQxMDAsXG4gICAgICB9LFxuICAgICAgdmlkZW86IHRydWUsIFxuICAgICAgLyoge1xuICAgICAgICBjdXJzb3I6IFwibmV2ZXJcIlxuICAgICAgfSwgKi9cbiAgICB9O1xuXG4gICAgbGV0IHN0cmVhbSA9IG5hdmlnYXRvclxuICAgIC5tZWRpYURldmljZXNcbiAgICAuZ2V0RGlzcGxheU1lZGlhKGRpc3BsYXlNZWRpYU9wdGlvbnMpXG4gICAgLmNhdGNoKGVyciA9PiB7IE5BRi5sb2cuZXJyb3IoXCJOQUZPRVJUQzogRXJyb3IgZ2V0dGluZyBzdHJlYW06XCIsICBlcnIpOyByZXR1cm4gbnVsbDsgfSlcblxuICAgIHJldHVybiBzdHJlYW07XG4gIH1cblxuICBmaWx0ZXJTdHJlYW1Ub0F1ZGlvT25seShzdHJlYW0pIHtcbiAgICBjb25zb2xlLmxvZyhcIk5BRk9FUlRDOiBiZWZvcmUgZmlsdGVyIHRvIGF1ZGlvXCIsIHN0cmVhbSlcbiAgICBsZXQgYXVkaW9UcmFjayA9IHN0cmVhbS5nZXRBdWRpb1RyYWNrcygpWzBdO1xuICAgIGNvbnNvbGUubG9nKFwiTkFGT0VSVEM6IGF1ZGlvIHRyYWNrXCIsIGF1ZGlvVHJhY2spXG5cbiAgICBsZXQgbmV3U3RyZWFtID0gbmV3IE1lZGlhU3RyZWFtKClcbiAgICBuZXdTdHJlYW0uYWRkVHJhY2soYXVkaW9UcmFjaylcbiAgICBjb25zb2xlLmxvZygnTkFGT0VSVEM6IGZpbHRlcmVkIHRvIGF1ZGlvJywgbmV3U3RyZWFtKVxuICAgIHJldHVybiBuZXdTdHJlYW07XG4gIH1cblxuICBjb25uZWN0KCkge1xuICAgIFByb21pc2UuYWxsKFtcbiAgICAgIHRoaXMudXBkYXRlVGltZU9mZnNldCgpLFxuICAgICAgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICB0aGlzLl9jb25uZWN0KHRoaXMuZWFzeXJ0Yy5hdWRpb0VuYWJsZWQsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICB9KSxcbiAgICAgIHRoaXMuZ2V0RGlzcGxheU1lZGlhU3RyZWFtKClcbiAgICBdKS50aGVuKChbXywgY2xpZW50SWQsIGRpc3BsYXlNZWRpYVN0cmVhbV0pID0+IHtcbiAgICAgIGNvbnNvbGUud2FybihcIk5BRk9FUlRDOiBzdHJlYW0gYWZ0ZXIgY29ubmVjdFwiLCBkaXNwbGF5TWVkaWFTdHJlYW0pXG4gICAgICB0aGlzLl9zdG9yZUF1ZGlvU3RyZWFtKFxuICAgICAgICB0aGlzLmVhc3lydGMubXlFYXN5cnRjaWQsXG4gICAgICAgIC8vIHRoaXMuZWFzeXJ0Yy5nZXRMb2NhbFN0cmVhbSgpXG4gICAgICAgIHRoaXMuZmlsdGVyU3RyZWFtVG9BdWRpb09ubHkoZGlzcGxheU1lZGlhU3RyZWFtKVxuICAgICAgKTtcblxuICAgICAgdGhpcy5fbXlSb29tSm9pblRpbWUgPSB0aGlzLl9nZXRSb29tSm9pblRpbWUoY2xpZW50SWQpO1xuICAgICAgdGhpcy5jb25uZWN0U3VjY2VzcyhjbGllbnRJZCk7XG4gICAgfSkuY2F0Y2godGhpcy5jb25uZWN0RmFpbHVyZSk7XG4gIH1cblxuICBzaG91bGRTdGFydENvbm5lY3Rpb25UbyhjbGllbnQpIHtcbiAgICByZXR1cm4gdGhpcy5fbXlSb29tSm9pblRpbWUgPD0gY2xpZW50LnJvb21Kb2luVGltZTtcbiAgfVxuXG4gIHN0YXJ0U3RyZWFtQ29ubmVjdGlvbihjbGllbnRJZCkge1xuICAgIHRoaXMuZWFzeXJ0Yy5jYWxsKFxuICAgICAgY2xpZW50SWQsXG4gICAgICBmdW5jdGlvbihjYWxsZXIsIG1lZGlhKSB7XG4gICAgICAgIGlmIChtZWRpYSA9PT0gXCJkYXRhY2hhbm5lbFwiKSB7XG4gICAgICAgICAgTkFGLmxvZy53cml0ZShcIlN1Y2Nlc3NmdWxseSBzdGFydGVkIGRhdGFjaGFubmVsIHRvIFwiLCBjYWxsZXIpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZnVuY3Rpb24oZXJyb3JDb2RlLCBlcnJvclRleHQpIHtcbiAgICAgICAgTkFGLmxvZy5lcnJvcihlcnJvckNvZGUsIGVycm9yVGV4dCk7XG4gICAgICB9LFxuICAgICAgZnVuY3Rpb24od2FzQWNjZXB0ZWQpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJ3YXMgYWNjZXB0ZWQ9XCIgKyB3YXNBY2NlcHRlZCk7XG4gICAgICB9XG4gICAgKTtcbiAgfVxuXG4gIGNsb3NlU3RyZWFtQ29ubmVjdGlvbihjbGllbnRJZCkge1xuICAgIC8vIEhhbmRsZWQgYnkgZWFzeXJ0Y1xuICB9XG5cbiAgc2VuZERhdGEoY2xpZW50SWQsIGRhdGFUeXBlLCBkYXRhKSB7XG4gICAgLy8gc2VuZCB2aWEgd2VicnRjIG90aGVyd2lzZSBmYWxsYmFjayB0byB3ZWJzb2NrZXRzXG4gICAgdGhpcy5lYXN5cnRjLnNlbmREYXRhKGNsaWVudElkLCBkYXRhVHlwZSwgZGF0YSk7XG4gIH1cblxuICBzZW5kRGF0YUd1YXJhbnRlZWQoY2xpZW50SWQsIGRhdGFUeXBlLCBkYXRhKSB7XG4gICAgdGhpcy5lYXN5cnRjLnNlbmREYXRhV1MoY2xpZW50SWQsIGRhdGFUeXBlLCBkYXRhKTtcbiAgfVxuXG4gIGJyb2FkY2FzdERhdGEoZGF0YVR5cGUsIGRhdGEpIHtcbiAgICB2YXIgcm9vbU9jY3VwYW50cyA9IHRoaXMuZWFzeXJ0Yy5nZXRSb29tT2NjdXBhbnRzQXNNYXAodGhpcy5yb29tKTtcblxuICAgIC8vIEl0ZXJhdGUgb3ZlciB0aGUga2V5cyBvZiB0aGUgZWFzeXJ0YyByb29tIG9jY3VwYW50cyBtYXAuXG4gICAgLy8gZ2V0Um9vbU9jY3VwYW50c0FzQXJyYXkgdXNlcyBPYmplY3Qua2V5cyB3aGljaCBhbGxvY2F0ZXMgbWVtb3J5LlxuICAgIGZvciAodmFyIHJvb21PY2N1cGFudCBpbiByb29tT2NjdXBhbnRzKSB7XG4gICAgICBpZiAoXG4gICAgICAgIHJvb21PY2N1cGFudHNbcm9vbU9jY3VwYW50XSAmJlxuICAgICAgICByb29tT2NjdXBhbnQgIT09IHRoaXMuZWFzeXJ0Yy5teUVhc3lydGNpZFxuICAgICAgKSB7XG4gICAgICAgIC8vIHNlbmQgdmlhIHdlYnJ0YyBvdGhlcndpc2UgZmFsbGJhY2sgdG8gd2Vic29ja2V0c1xuICAgICAgICB0aGlzLmVhc3lydGMuc2VuZERhdGEocm9vbU9jY3VwYW50LCBkYXRhVHlwZSwgZGF0YSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgYnJvYWRjYXN0RGF0YUd1YXJhbnRlZWQoZGF0YVR5cGUsIGRhdGEpIHtcbiAgICB2YXIgZGVzdGluYXRpb24gPSB7IHRhcmdldFJvb206IHRoaXMucm9vbSB9O1xuICAgIHRoaXMuZWFzeXJ0Yy5zZW5kRGF0YVdTKGRlc3RpbmF0aW9uLCBkYXRhVHlwZSwgZGF0YSk7XG4gIH1cblxuICBnZXRDb25uZWN0U3RhdHVzKGNsaWVudElkKSB7XG4gICAgdmFyIHN0YXR1cyA9IHRoaXMuZWFzeXJ0Yy5nZXRDb25uZWN0U3RhdHVzKGNsaWVudElkKTtcblxuICAgIGlmIChzdGF0dXMgPT0gdGhpcy5lYXN5cnRjLklTX0NPTk5FQ1RFRCkge1xuICAgICAgcmV0dXJuIE5BRi5hZGFwdGVycy5JU19DT05ORUNURUQ7XG4gICAgfSBlbHNlIGlmIChzdGF0dXMgPT0gdGhpcy5lYXN5cnRjLk5PVF9DT05ORUNURUQpIHtcbiAgICAgIHJldHVybiBOQUYuYWRhcHRlcnMuTk9UX0NPTk5FQ1RFRDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIE5BRi5hZGFwdGVycy5DT05ORUNUSU5HO1xuICAgIH1cbiAgfVxuXG4gIGdldE1lZGlhU3RyZWFtKGNsaWVudElkKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgIGlmICh0aGlzLmF1ZGlvU3RyZWFtc1tjbGllbnRJZF0pIHtcbiAgICAgIE5BRi5sb2cud3JpdGUoXCJBbHJlYWR5IGhhZCBhdWRpbyBmb3IgXCIgKyBjbGllbnRJZCk7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuYXVkaW9TdHJlYW1zW2NsaWVudElkXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIE5BRi5sb2cud3JpdGUoXCJXYWl0aW5nIG9uIGF1ZGlvIGZvciBcIiArIGNsaWVudElkKTtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlKSB7XG4gICAgICAgIHRoYXQucGVuZGluZ0F1ZGlvUmVxdWVzdFtjbGllbnRJZF0gPSByZXNvbHZlO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgZGlzY29ubmVjdCgpIHtcbiAgICB0aGlzLmVhc3lydGMuZGlzY29ubmVjdCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFByaXZhdGVzXG4gICAqL1xuXG4gIF9zdG9yZUF1ZGlvU3RyZWFtKGVhc3lydGNpZCwgc3RyZWFtKSB7XG4gICAgdGhpcy5hdWRpb1N0cmVhbXNbZWFzeXJ0Y2lkXSA9IHN0cmVhbTtcbiAgICBpZiAodGhpcy5wZW5kaW5nQXVkaW9SZXF1ZXN0W2Vhc3lydGNpZF0pIHtcbiAgICAgIE5BRi5sb2cud3JpdGUoXCJnb3QgcGVuZGluZyBhdWRpbyBmb3IgXCIgKyBlYXN5cnRjaWQpO1xuICAgICAgdGhpcy5wZW5kaW5nQXVkaW9SZXF1ZXN0W2Vhc3lydGNpZF0oc3RyZWFtKTtcbiAgICAgIGRlbGV0ZSB0aGlzLnBlbmRpbmdBdWRpb1JlcXVlc3RbZWFzeXJ0Y2lkXShzdHJlYW0pO1xuICAgIH1cbiAgfVxuXG4gIF9jb25uZWN0KGF1ZGlvRW5hYmxlZCwgY29ubmVjdFN1Y2Nlc3MsIGNvbm5lY3RGYWlsdXJlKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuXG4gICAgdGhpcy5lYXN5cnRjLnNldFN0cmVhbUFjY2VwdG9yKHRoaXMuX3N0b3JlQXVkaW9TdHJlYW0uYmluZCh0aGlzKSk7XG5cbiAgICB0aGlzLmVhc3lydGMuc2V0T25TdHJlYW1DbG9zZWQoZnVuY3Rpb24oZWFzeXJ0Y2lkKSB7XG4gICAgICBkZWxldGUgdGhhdC5hdWRpb1N0cmVhbXNbZWFzeXJ0Y2lkXTtcbiAgICB9KTtcblxuICAgIGlmIChhdWRpb0VuYWJsZWQpIHtcbiAgICAgIHRoaXMuZWFzeXJ0Yy5pbml0TWVkaWFTb3VyY2UoXG4gICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRoYXQuZWFzeXJ0Yy5jb25uZWN0KHRoYXQuYXBwLCBjb25uZWN0U3VjY2VzcywgY29ubmVjdEZhaWx1cmUpO1xuICAgICAgICB9LFxuICAgICAgICBmdW5jdGlvbihlcnJvckNvZGUsIGVycm1lc2cpIHtcbiAgICAgICAgICBOQUYubG9nLmVycm9yKGVycm9yQ29kZSwgZXJybWVzZyk7XG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoYXQuZWFzeXJ0Yy5jb25uZWN0KHRoYXQuYXBwLCBjb25uZWN0U3VjY2VzcywgY29ubmVjdEZhaWx1cmUpO1xuICAgIH1cbiAgfVxuXG4gIF9nZXRSb29tSm9pblRpbWUoY2xpZW50SWQpIHtcbiAgICB2YXIgbXlSb29tSWQgPSBOQUYucm9vbTtcbiAgICB2YXIgam9pblRpbWUgPSB0aGlzLmVhc3lydGMuZ2V0Um9vbU9jY3VwYW50c0FzTWFwKG15Um9vbUlkKVtjbGllbnRJZF1cbiAgICAgIC5yb29tSm9pblRpbWU7XG4gICAgcmV0dXJuIGpvaW5UaW1lO1xuICB9XG5cbiAgZ2V0U2VydmVyVGltZSgpIHtcbiAgICByZXR1cm4gRGF0ZS5ub3coKSArIHRoaXMuYXZnVGltZU9mZnNldDtcbiAgfVxufVxuXG5OQUYuYWRhcHRlcnMucmVnaXN0ZXIoXCJlYXN5cnRjXCIsIEVhc3lSdGNBZGFwdGVyKTtcblxubW9kdWxlLmV4cG9ydHMgPSBFYXN5UnRjQWRhcHRlcjtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvaW5kZXguanMiXSwic291cmNlUm9vdCI6IiJ9