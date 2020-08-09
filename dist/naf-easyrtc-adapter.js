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
      displayMediaOptions = {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYTk3ODdlNDRhYmE4YzhkOTg1MGYiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbIkVhc3lSdGNBZGFwdGVyIiwiZWFzeXJ0YyIsIndpbmRvdyIsImFwcCIsInJvb20iLCJhdWRpb1N0cmVhbXMiLCJwZW5kaW5nQXVkaW9SZXF1ZXN0Iiwic2VydmVyVGltZVJlcXVlc3RzIiwidGltZU9mZnNldHMiLCJhdmdUaW1lT2Zmc2V0IiwidXJsIiwic2V0U29ja2V0VXJsIiwiYXBwTmFtZSIsInJvb21OYW1lIiwiam9pblJvb20iLCJvcHRpb25zIiwiZW5hYmxlRGF0YUNoYW5uZWxzIiwiZGF0YWNoYW5uZWwiLCJlbmFibGVWaWRlbyIsImVuYWJsZUF1ZGlvIiwiYXVkaW8iLCJlbmFibGVWaWRlb1JlY2VpdmUiLCJlbmFibGVBdWRpb1JlY2VpdmUiLCJzdWNjZXNzTGlzdGVuZXIiLCJmYWlsdXJlTGlzdGVuZXIiLCJjb25uZWN0U3VjY2VzcyIsImNvbm5lY3RGYWlsdXJlIiwib2NjdXBhbnRMaXN0ZW5lciIsInNldFJvb21PY2N1cGFudExpc3RlbmVyIiwib2NjdXBhbnRzIiwicHJpbWFyeSIsIm9wZW5MaXN0ZW5lciIsImNsb3NlZExpc3RlbmVyIiwibWVzc2FnZUxpc3RlbmVyIiwic2V0RGF0YUNoYW5uZWxPcGVuTGlzdGVuZXIiLCJzZXREYXRhQ2hhbm5lbENsb3NlTGlzdGVuZXIiLCJzZXRQZWVyTGlzdGVuZXIiLCJjbGllbnRTZW50VGltZSIsIkRhdGUiLCJub3ciLCJmZXRjaCIsImRvY3VtZW50IiwibG9jYXRpb24iLCJocmVmIiwibWV0aG9kIiwiY2FjaGUiLCJ0aGVuIiwicHJlY2lzaW9uIiwic2VydmVyUmVjZWl2ZWRUaW1lIiwicmVzIiwiaGVhZGVycyIsImdldCIsImdldFRpbWUiLCJjbGllbnRSZWNlaXZlZFRpbWUiLCJzZXJ2ZXJUaW1lIiwidGltZU9mZnNldCIsInB1c2giLCJyZWR1Y2UiLCJhY2MiLCJvZmZzZXQiLCJsZW5ndGgiLCJzZXRUaW1lb3V0IiwidXBkYXRlVGltZU9mZnNldCIsImNvbnNvbGUiLCJ3YXJuIiwiZGlzcGxheU1lZGlhT3B0aW9ucyIsImF1dG9HYWluQ29udHJvbCIsImVjaG9DYW5jZWxsYXRpb24iLCJnb29nQXV0b0dhaW5Db250cm9sIiwibm9pc2VTdXBwcmVzc2lvbiIsInNhbXBsZVJhdGUiLCJ2aWRlbyIsInN0cmVhbSIsIm5hdmlnYXRvciIsIm1lZGlhRGV2aWNlcyIsImdldERpc3BsYXlNZWRpYSIsImNhdGNoIiwiTkFGIiwibG9nIiwiZXJyb3IiLCJlcnIiLCJhdWRpb1RyYWNrIiwiZ2V0QXVkaW9UcmFja3MiLCJuZXdTdHJlYW0iLCJNZWRpYVN0cmVhbSIsImFkZFRyYWNrIiwiUHJvbWlzZSIsImFsbCIsInJlc29sdmUiLCJyZWplY3QiLCJfY29ubmVjdCIsImF1ZGlvRW5hYmxlZCIsImdldERpc3BsYXlNZWRpYVN0cmVhbSIsIl8iLCJjbGllbnRJZCIsImRpc3BsYXlNZWRpYVN0cmVhbSIsIl9zdG9yZUF1ZGlvU3RyZWFtIiwibXlFYXN5cnRjaWQiLCJmaWx0ZXJTdHJlYW1Ub0F1ZGlvT25seSIsIl9teVJvb21Kb2luVGltZSIsIl9nZXRSb29tSm9pblRpbWUiLCJjbGllbnQiLCJyb29tSm9pblRpbWUiLCJjYWxsIiwiY2FsbGVyIiwibWVkaWEiLCJ3cml0ZSIsImVycm9yQ29kZSIsImVycm9yVGV4dCIsIndhc0FjY2VwdGVkIiwiZGF0YVR5cGUiLCJkYXRhIiwic2VuZERhdGEiLCJzZW5kRGF0YVdTIiwicm9vbU9jY3VwYW50cyIsImdldFJvb21PY2N1cGFudHNBc01hcCIsInJvb21PY2N1cGFudCIsImRlc3RpbmF0aW9uIiwidGFyZ2V0Um9vbSIsInN0YXR1cyIsImdldENvbm5lY3RTdGF0dXMiLCJJU19DT05ORUNURUQiLCJhZGFwdGVycyIsIk5PVF9DT05ORUNURUQiLCJDT05ORUNUSU5HIiwidGhhdCIsImRpc2Nvbm5lY3QiLCJlYXN5cnRjaWQiLCJzZXRTdHJlYW1BY2NlcHRvciIsImJpbmQiLCJzZXRPblN0cmVhbUNsb3NlZCIsImluaXRNZWRpYVNvdXJjZSIsImNvbm5lY3QiLCJlcnJtZXNnIiwibXlSb29tSWQiLCJqb2luVGltZSIsInJlZ2lzdGVyIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxLQUFLO1FBQ0w7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7UUFFQTtRQUNBOzs7Ozs7Ozs7Ozs7Ozs7O0FDN0RBOztJQUVNQSxjO0FBRUosMEJBQVlDLE9BQVosRUFBcUI7QUFBQTs7QUFDbkIsU0FBS0EsT0FBTCxHQUFlQSxXQUFXQyxPQUFPRCxPQUFqQztBQUNBLFNBQUtFLEdBQUwsR0FBVyxTQUFYO0FBQ0EsU0FBS0MsSUFBTCxHQUFZLFNBQVo7O0FBRUEsU0FBS0MsWUFBTCxHQUFvQixFQUFwQjtBQUNBLFNBQUtDLG1CQUFMLEdBQTJCLEVBQTNCOztBQUVBLFNBQUtDLGtCQUFMLEdBQTBCLENBQTFCO0FBQ0EsU0FBS0MsV0FBTCxHQUFtQixFQUFuQjtBQUNBLFNBQUtDLGFBQUwsR0FBcUIsQ0FBckI7QUFDRDs7OztpQ0FFWUMsRyxFQUFLO0FBQ2hCLFdBQUtULE9BQUwsQ0FBYVUsWUFBYixDQUEwQkQsR0FBMUI7QUFDRDs7OzJCQUVNRSxPLEVBQVM7QUFDZCxXQUFLVCxHQUFMLEdBQVdTLE9BQVg7QUFDRDs7OzRCQUVPQyxRLEVBQVU7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SSxPQUFiLENBQXFCUCxLQUFLMUgsR0FBMUIsRUFBK0JzQixjQUEvQixFQUErQ0MsY0FBL0M7QUFDRCxTQUhILEVBSUUsVUFBU2lGLFNBQVQsRUFBb0IwQixPQUFwQixFQUE2QjtBQUMzQnhELGNBQUlDLEdBQUosQ0FBUUMsS0FBUixDQUFjNEIsU0FBZCxFQUF5QjBCLE9BQXpCO0FBQ0QsU0FOSDtBQVFELE9BVEQsTUFTTztBQUNMUixhQUFLNUgsT0FBTCxDQUFhbUksT0FBYixDQUFxQlAsS0FBSzFILEdBQTFCLEVBQStCc0IsY0FBL0IsRUFBK0NDLGNBQS9DO0FBQ0Q7QUFDRjs7O3FDQUVnQm9FLFEsRUFBVTtBQUN6QixVQUFJd0MsV0FBV3pELElBQUl6RSxJQUFuQjtBQUNBLFVBQUltSSxXQUFXLEtBQUt0SSxPQUFMLENBQWFrSCxxQkFBYixDQUFtQ21CLFFBQW5DLEVBQTZDeEMsUUFBN0MsRUFDWlEsWUFESDtBQUVBLGFBQU9pQyxRQUFQO0FBQ0Q7OztvQ0FFZTtBQUNkLGFBQU9qRyxLQUFLQyxHQUFMLEtBQWEsS0FBSzlCLGFBQXpCO0FBQ0Q7Ozs7OztBQUdIb0UsSUFBSTZDLFFBQUosQ0FBYWMsUUFBYixDQUFzQixTQUF0QixFQUFpQ3hJLGNBQWpDOztBQUVBeUksT0FBT0MsT0FBUCxHQUFpQjFJLGNBQWpCLEMiLCJmaWxlIjoibmFmLWVhc3lydGMtYWRhcHRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGE5Nzg3ZTQ0YWJhOGM4ZDk4NTBmIiwiLyogZ2xvYmFsIE5BRiAqL1xuXG5jbGFzcyBFYXN5UnRjQWRhcHRlciB7XG5cbiAgY29uc3RydWN0b3IoZWFzeXJ0Yykge1xuICAgIHRoaXMuZWFzeXJ0YyA9IGVhc3lydGMgfHwgd2luZG93LmVhc3lydGM7XG4gICAgdGhpcy5hcHAgPSBcImRlZmF1bHRcIjtcbiAgICB0aGlzLnJvb20gPSBcImRlZmF1bHRcIjtcblxuICAgIHRoaXMuYXVkaW9TdHJlYW1zID0ge307XG4gICAgdGhpcy5wZW5kaW5nQXVkaW9SZXF1ZXN0ID0ge307XG5cbiAgICB0aGlzLnNlcnZlclRpbWVSZXF1ZXN0cyA9IDA7XG4gICAgdGhpcy50aW1lT2Zmc2V0cyA9IFtdO1xuICAgIHRoaXMuYXZnVGltZU9mZnNldCA9IDA7XG4gIH1cblxuICBzZXRTZXJ2ZXJVcmwodXJsKSB7XG4gICAgdGhpcy5lYXN5cnRjLnNldFNvY2tldFVybCh1cmwpO1xuICB9XG5cbiAgc2V0QXBwKGFwcE5hbWUpIHtcbiAgICB0aGlzLmFwcCA9IGFwcE5hbWU7XG4gIH1cblxuICBzZXRSb29tKHJvb21OYW1lKSB7XG4gICAgdGhpcy5yb29tID0gcm9vbU5hbWU7XG4gICAgdGhpcy5lYXN5cnRjLmpvaW5Sb29tKHJvb21OYW1lLCBudWxsKTtcbiAgfVxuXG4gIC8vIG9wdGlvbnM6IHsgZGF0YWNoYW5uZWw6IGJvb2wsIGF1ZGlvOiBib29sIH1cbiAgc2V0V2ViUnRjT3B0aW9ucyhvcHRpb25zKSB7XG4gICAgLy8gdGhpcy5lYXN5cnRjLmVuYWJsZURlYnVnKHRydWUpO1xuICAgIHRoaXMuZWFzeXJ0Yy5lbmFibGVEYXRhQ2hhbm5lbHMob3B0aW9ucy5kYXRhY2hhbm5lbCk7XG5cbiAgICB0aGlzLmVhc3lydGMuZW5hYmxlVmlkZW8oZmFsc2UpO1xuICAgIHRoaXMuZWFzeXJ0Yy5lbmFibGVBdWRpbyhvcHRpb25zLmF1ZGlvKTtcblxuICAgIHRoaXMuZWFzeXJ0Yy5lbmFibGVWaWRlb1JlY2VpdmUoZmFsc2UpO1xuICAgIHRoaXMuZWFzeXJ0Yy5lbmFibGVBdWRpb1JlY2VpdmUodHJ1ZSk7XG4gIH1cblxuICBzZXRTZXJ2ZXJDb25uZWN0TGlzdGVuZXJzKHN1Y2Nlc3NMaXN0ZW5lciwgZmFpbHVyZUxpc3RlbmVyKSB7XG4gICAgdGhpcy5jb25uZWN0U3VjY2VzcyA9IHN1Y2Nlc3NMaXN0ZW5lcjtcbiAgICB0aGlzLmNvbm5lY3RGYWlsdXJlID0gZmFpbHVyZUxpc3RlbmVyO1xuICB9XG5cbiAgc2V0Um9vbU9jY3VwYW50TGlzdGVuZXIob2NjdXBhbnRMaXN0ZW5lcikge1xuICAgIHRoaXMuZWFzeXJ0Yy5zZXRSb29tT2NjdXBhbnRMaXN0ZW5lcihmdW5jdGlvbihcbiAgICAgIHJvb21OYW1lLFxuICAgICAgb2NjdXBhbnRzLFxuICAgICAgcHJpbWFyeVxuICAgICkge1xuICAgICAgb2NjdXBhbnRMaXN0ZW5lcihvY2N1cGFudHMpO1xuICAgIH0pO1xuICB9XG5cbiAgc2V0RGF0YUNoYW5uZWxMaXN0ZW5lcnMob3Blbkxpc3RlbmVyLCBjbG9zZWRMaXN0ZW5lciwgbWVzc2FnZUxpc3RlbmVyKSB7XG4gICAgdGhpcy5lYXN5cnRjLnNldERhdGFDaGFubmVsT3Blbkxpc3RlbmVyKG9wZW5MaXN0ZW5lcik7XG4gICAgdGhpcy5lYXN5cnRjLnNldERhdGFDaGFubmVsQ2xvc2VMaXN0ZW5lcihjbG9zZWRMaXN0ZW5lcik7XG4gICAgdGhpcy5lYXN5cnRjLnNldFBlZXJMaXN0ZW5lcihtZXNzYWdlTGlzdGVuZXIpO1xuICB9XG5cbiAgdXBkYXRlVGltZU9mZnNldCgpIHtcbiAgICBjb25zdCBjbGllbnRTZW50VGltZSA9IERhdGUubm93KCkgKyB0aGlzLmF2Z1RpbWVPZmZzZXQ7XG5cbiAgICByZXR1cm4gZmV0Y2goZG9jdW1lbnQubG9jYXRpb24uaHJlZiwgeyBtZXRob2Q6IFwiSEVBRFwiLCBjYWNoZTogXCJuby1jYWNoZVwiIH0pXG4gICAgICAudGhlbihyZXMgPT4ge1xuICAgICAgICB2YXIgcHJlY2lzaW9uID0gMTAwMDtcbiAgICAgICAgdmFyIHNlcnZlclJlY2VpdmVkVGltZSA9IG5ldyBEYXRlKHJlcy5oZWFkZXJzLmdldChcIkRhdGVcIikpLmdldFRpbWUoKSArIChwcmVjaXNpb24gLyAyKTtcbiAgICAgICAgdmFyIGNsaWVudFJlY2VpdmVkVGltZSA9IERhdGUubm93KCk7XG4gICAgICAgIHZhciBzZXJ2ZXJUaW1lID0gc2VydmVyUmVjZWl2ZWRUaW1lICsgKChjbGllbnRSZWNlaXZlZFRpbWUgLSBjbGllbnRTZW50VGltZSkgLyAyKTtcbiAgICAgICAgdmFyIHRpbWVPZmZzZXQgPSBzZXJ2ZXJUaW1lIC0gY2xpZW50UmVjZWl2ZWRUaW1lO1xuXG4gICAgICAgIHRoaXMuc2VydmVyVGltZVJlcXVlc3RzKys7XG5cbiAgICAgICAgaWYgKHRoaXMuc2VydmVyVGltZVJlcXVlc3RzIDw9IDEwKSB7XG4gICAgICAgICAgdGhpcy50aW1lT2Zmc2V0cy5wdXNoKHRpbWVPZmZzZXQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMudGltZU9mZnNldHNbdGhpcy5zZXJ2ZXJUaW1lUmVxdWVzdHMgJSAxMF0gPSB0aW1lT2Zmc2V0O1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5hdmdUaW1lT2Zmc2V0ID0gdGhpcy50aW1lT2Zmc2V0cy5yZWR1Y2UoKGFjYywgb2Zmc2V0KSA9PiBhY2MgKz0gb2Zmc2V0LCAwKSAvIHRoaXMudGltZU9mZnNldHMubGVuZ3RoO1xuXG4gICAgICAgIGlmICh0aGlzLnNlcnZlclRpbWVSZXF1ZXN0cyA+IDEwKSB7XG4gICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLnVwZGF0ZVRpbWVPZmZzZXQoKSwgNSAqIDYwICogMTAwMCk7IC8vIFN5bmMgY2xvY2sgZXZlcnkgNSBtaW51dGVzLlxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMudXBkYXRlVGltZU9mZnNldCgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfVxuXG4gIGdldERpc3BsYXlNZWRpYVN0cmVhbSgpIHtcbiAgICBjb25zb2xlLndhcm4oXCJOQUZPRVJUQzogdXNpbmcgY3VzdG9tIGV4cGVyaW1lbnRhbCBmb3JrIG9mIE5BRiBlYXN5cnRjIGFkYXB0ZXIgdGhhdCBhbGxvd3MgZ2V0dGluZyBkaXNwbGF5bWVkaWEgc3RyZWFtLlwiKVxuICAgIGRpc3BsYXlNZWRpYU9wdGlvbnMgPSB7XG4gICAgICBhdWRpbzovLyB0cnVlLCBcbiAgICAgIHtcbiAgICAgICAgYXV0b0dhaW5Db250cm9sOiBmYWxzZSxcbiAgICAgICAgZWNob0NhbmNlbGxhdGlvbjogZmFsc2UsXG4gICAgICAgIGdvb2dBdXRvR2FpbkNvbnRyb2w6IGZhbHNlLFxuICAgICAgICBub2lzZVN1cHByZXNzaW9uOiBmYWxzZSxcbiAgICAgICAgc2FtcGxlUmF0ZTogNDQxMDAsXG4gICAgICB9LFxuICAgICAgdmlkZW86IHRydWUsIFxuICAgICAgLyoge1xuICAgICAgICBjdXJzb3I6IFwibmV2ZXJcIlxuICAgICAgfSwgKi9cbiAgICB9O1xuXG4gICAgbGV0IHN0cmVhbSA9IG5hdmlnYXRvclxuICAgIC5tZWRpYURldmljZXNcbiAgICAuZ2V0RGlzcGxheU1lZGlhKGRpc3BsYXlNZWRpYU9wdGlvbnMpXG4gICAgLmNhdGNoKGVyciA9PiB7IE5BRi5sb2cuZXJyb3IoXCJOQUZPRVJUQzogRXJyb3IgZ2V0dGluZyBzdHJlYW06XCIsICBlcnIpOyByZXR1cm4gbnVsbDsgfSlcblxuICAgIHJldHVybiBzdHJlYW07XG4gIH1cblxuICBmaWx0ZXJTdHJlYW1Ub0F1ZGlvT25seShzdHJlYW0pIHtcbiAgICBjb25zb2xlLmxvZyhcIk5BRk9FUlRDOiBiZWZvcmUgZmlsdGVyIHRvIGF1ZGlvXCIsIHN0cmVhbSlcbiAgICBsZXQgYXVkaW9UcmFjayA9IHN0cmVhbS5nZXRBdWRpb1RyYWNrcygpWzBdO1xuICAgIGNvbnNvbGUubG9nKFwiTkFGT0VSVEM6IGF1ZGlvIHRyYWNrXCIsIGF1ZGlvVHJhY2spXG5cbiAgICBsZXQgbmV3U3RyZWFtID0gbmV3IE1lZGlhU3RyZWFtKClcbiAgICBuZXdTdHJlYW0uYWRkVHJhY2soYXVkaW9UcmFjaylcbiAgICBjb25zb2xlLmxvZygnTkFGT0VSVEM6IGZpbHRlcmVkIHRvIGF1ZGlvJywgbmV3U3RyZWFtKVxuICAgIHJldHVybiBuZXdTdHJlYW07XG4gIH1cblxuICBjb25uZWN0KCkge1xuICAgIFByb21pc2UuYWxsKFtcbiAgICAgIHRoaXMudXBkYXRlVGltZU9mZnNldCgpLFxuICAgICAgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICB0aGlzLl9jb25uZWN0KHRoaXMuZWFzeXJ0Yy5hdWRpb0VuYWJsZWQsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICB9KSxcbiAgICAgIHRoaXMuZ2V0RGlzcGxheU1lZGlhU3RyZWFtKClcbiAgICBdKS50aGVuKChbXywgY2xpZW50SWQsIGRpc3BsYXlNZWRpYVN0cmVhbV0pID0+IHtcbiAgICAgIGNvbnNvbGUud2FybihcIk5BRk9FUlRDOiBzdHJlYW0gYWZ0ZXIgY29ubmVjdFwiLCBkaXNwbGF5TWVkaWFTdHJlYW0pXG4gICAgICB0aGlzLl9zdG9yZUF1ZGlvU3RyZWFtKFxuICAgICAgICB0aGlzLmVhc3lydGMubXlFYXN5cnRjaWQsXG4gICAgICAgIC8vIHRoaXMuZWFzeXJ0Yy5nZXRMb2NhbFN0cmVhbSgpXG4gICAgICAgIHRoaXMuZmlsdGVyU3RyZWFtVG9BdWRpb09ubHkoZGlzcGxheU1lZGlhU3RyZWFtKVxuICAgICAgKTtcblxuICAgICAgdGhpcy5fbXlSb29tSm9pblRpbWUgPSB0aGlzLl9nZXRSb29tSm9pblRpbWUoY2xpZW50SWQpO1xuICAgICAgdGhpcy5jb25uZWN0U3VjY2VzcyhjbGllbnRJZCk7XG4gICAgfSkuY2F0Y2godGhpcy5jb25uZWN0RmFpbHVyZSk7XG4gIH1cblxuICBzaG91bGRTdGFydENvbm5lY3Rpb25UbyhjbGllbnQpIHtcbiAgICByZXR1cm4gdGhpcy5fbXlSb29tSm9pblRpbWUgPD0gY2xpZW50LnJvb21Kb2luVGltZTtcbiAgfVxuXG4gIHN0YXJ0U3RyZWFtQ29ubmVjdGlvbihjbGllbnRJZCkge1xuICAgIHRoaXMuZWFzeXJ0Yy5jYWxsKFxuICAgICAgY2xpZW50SWQsXG4gICAgICBmdW5jdGlvbihjYWxsZXIsIG1lZGlhKSB7XG4gICAgICAgIGlmIChtZWRpYSA9PT0gXCJkYXRhY2hhbm5lbFwiKSB7XG4gICAgICAgICAgTkFGLmxvZy53cml0ZShcIlN1Y2Nlc3NmdWxseSBzdGFydGVkIGRhdGFjaGFubmVsIHRvIFwiLCBjYWxsZXIpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZnVuY3Rpb24oZXJyb3JDb2RlLCBlcnJvclRleHQpIHtcbiAgICAgICAgTkFGLmxvZy5lcnJvcihlcnJvckNvZGUsIGVycm9yVGV4dCk7XG4gICAgICB9LFxuICAgICAgZnVuY3Rpb24od2FzQWNjZXB0ZWQpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJ3YXMgYWNjZXB0ZWQ9XCIgKyB3YXNBY2NlcHRlZCk7XG4gICAgICB9XG4gICAgKTtcbiAgfVxuXG4gIGNsb3NlU3RyZWFtQ29ubmVjdGlvbihjbGllbnRJZCkge1xuICAgIC8vIEhhbmRsZWQgYnkgZWFzeXJ0Y1xuICB9XG5cbiAgc2VuZERhdGEoY2xpZW50SWQsIGRhdGFUeXBlLCBkYXRhKSB7XG4gICAgLy8gc2VuZCB2aWEgd2VicnRjIG90aGVyd2lzZSBmYWxsYmFjayB0byB3ZWJzb2NrZXRzXG4gICAgdGhpcy5lYXN5cnRjLnNlbmREYXRhKGNsaWVudElkLCBkYXRhVHlwZSwgZGF0YSk7XG4gIH1cblxuICBzZW5kRGF0YUd1YXJhbnRlZWQoY2xpZW50SWQsIGRhdGFUeXBlLCBkYXRhKSB7XG4gICAgdGhpcy5lYXN5cnRjLnNlbmREYXRhV1MoY2xpZW50SWQsIGRhdGFUeXBlLCBkYXRhKTtcbiAgfVxuXG4gIGJyb2FkY2FzdERhdGEoZGF0YVR5cGUsIGRhdGEpIHtcbiAgICB2YXIgcm9vbU9jY3VwYW50cyA9IHRoaXMuZWFzeXJ0Yy5nZXRSb29tT2NjdXBhbnRzQXNNYXAodGhpcy5yb29tKTtcblxuICAgIC8vIEl0ZXJhdGUgb3ZlciB0aGUga2V5cyBvZiB0aGUgZWFzeXJ0YyByb29tIG9jY3VwYW50cyBtYXAuXG4gICAgLy8gZ2V0Um9vbU9jY3VwYW50c0FzQXJyYXkgdXNlcyBPYmplY3Qua2V5cyB3aGljaCBhbGxvY2F0ZXMgbWVtb3J5LlxuICAgIGZvciAodmFyIHJvb21PY2N1cGFudCBpbiByb29tT2NjdXBhbnRzKSB7XG4gICAgICBpZiAoXG4gICAgICAgIHJvb21PY2N1cGFudHNbcm9vbU9jY3VwYW50XSAmJlxuICAgICAgICByb29tT2NjdXBhbnQgIT09IHRoaXMuZWFzeXJ0Yy5teUVhc3lydGNpZFxuICAgICAgKSB7XG4gICAgICAgIC8vIHNlbmQgdmlhIHdlYnJ0YyBvdGhlcndpc2UgZmFsbGJhY2sgdG8gd2Vic29ja2V0c1xuICAgICAgICB0aGlzLmVhc3lydGMuc2VuZERhdGEocm9vbU9jY3VwYW50LCBkYXRhVHlwZSwgZGF0YSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgYnJvYWRjYXN0RGF0YUd1YXJhbnRlZWQoZGF0YVR5cGUsIGRhdGEpIHtcbiAgICB2YXIgZGVzdGluYXRpb24gPSB7IHRhcmdldFJvb206IHRoaXMucm9vbSB9O1xuICAgIHRoaXMuZWFzeXJ0Yy5zZW5kRGF0YVdTKGRlc3RpbmF0aW9uLCBkYXRhVHlwZSwgZGF0YSk7XG4gIH1cblxuICBnZXRDb25uZWN0U3RhdHVzKGNsaWVudElkKSB7XG4gICAgdmFyIHN0YXR1cyA9IHRoaXMuZWFzeXJ0Yy5nZXRDb25uZWN0U3RhdHVzKGNsaWVudElkKTtcblxuICAgIGlmIChzdGF0dXMgPT0gdGhpcy5lYXN5cnRjLklTX0NPTk5FQ1RFRCkge1xuICAgICAgcmV0dXJuIE5BRi5hZGFwdGVycy5JU19DT05ORUNURUQ7XG4gICAgfSBlbHNlIGlmIChzdGF0dXMgPT0gdGhpcy5lYXN5cnRjLk5PVF9DT05ORUNURUQpIHtcbiAgICAgIHJldHVybiBOQUYuYWRhcHRlcnMuTk9UX0NPTk5FQ1RFRDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIE5BRi5hZGFwdGVycy5DT05ORUNUSU5HO1xuICAgIH1cbiAgfVxuXG4gIGdldE1lZGlhU3RyZWFtKGNsaWVudElkKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgIGlmICh0aGlzLmF1ZGlvU3RyZWFtc1tjbGllbnRJZF0pIHtcbiAgICAgIE5BRi5sb2cud3JpdGUoXCJBbHJlYWR5IGhhZCBhdWRpbyBmb3IgXCIgKyBjbGllbnRJZCk7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuYXVkaW9TdHJlYW1zW2NsaWVudElkXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIE5BRi5sb2cud3JpdGUoXCJXYWl0aW5nIG9uIGF1ZGlvIGZvciBcIiArIGNsaWVudElkKTtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlKSB7XG4gICAgICAgIHRoYXQucGVuZGluZ0F1ZGlvUmVxdWVzdFtjbGllbnRJZF0gPSByZXNvbHZlO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgZGlzY29ubmVjdCgpIHtcbiAgICB0aGlzLmVhc3lydGMuZGlzY29ubmVjdCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFByaXZhdGVzXG4gICAqL1xuXG4gIF9zdG9yZUF1ZGlvU3RyZWFtKGVhc3lydGNpZCwgc3RyZWFtKSB7XG4gICAgdGhpcy5hdWRpb1N0cmVhbXNbZWFzeXJ0Y2lkXSA9IHN0cmVhbTtcbiAgICBpZiAodGhpcy5wZW5kaW5nQXVkaW9SZXF1ZXN0W2Vhc3lydGNpZF0pIHtcbiAgICAgIE5BRi5sb2cud3JpdGUoXCJnb3QgcGVuZGluZyBhdWRpbyBmb3IgXCIgKyBlYXN5cnRjaWQpO1xuICAgICAgdGhpcy5wZW5kaW5nQXVkaW9SZXF1ZXN0W2Vhc3lydGNpZF0oc3RyZWFtKTtcbiAgICAgIGRlbGV0ZSB0aGlzLnBlbmRpbmdBdWRpb1JlcXVlc3RbZWFzeXJ0Y2lkXShzdHJlYW0pO1xuICAgIH1cbiAgfVxuXG4gIF9jb25uZWN0KGF1ZGlvRW5hYmxlZCwgY29ubmVjdFN1Y2Nlc3MsIGNvbm5lY3RGYWlsdXJlKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuXG4gICAgdGhpcy5lYXN5cnRjLnNldFN0cmVhbUFjY2VwdG9yKHRoaXMuX3N0b3JlQXVkaW9TdHJlYW0uYmluZCh0aGlzKSk7XG5cbiAgICB0aGlzLmVhc3lydGMuc2V0T25TdHJlYW1DbG9zZWQoZnVuY3Rpb24oZWFzeXJ0Y2lkKSB7XG4gICAgICBkZWxldGUgdGhhdC5hdWRpb1N0cmVhbXNbZWFzeXJ0Y2lkXTtcbiAgICB9KTtcblxuICAgIGlmIChhdWRpb0VuYWJsZWQpIHtcbiAgICAgIHRoaXMuZWFzeXJ0Yy5pbml0TWVkaWFTb3VyY2UoXG4gICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRoYXQuZWFzeXJ0Yy5jb25uZWN0KHRoYXQuYXBwLCBjb25uZWN0U3VjY2VzcywgY29ubmVjdEZhaWx1cmUpO1xuICAgICAgICB9LFxuICAgICAgICBmdW5jdGlvbihlcnJvckNvZGUsIGVycm1lc2cpIHtcbiAgICAgICAgICBOQUYubG9nLmVycm9yKGVycm9yQ29kZSwgZXJybWVzZyk7XG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoYXQuZWFzeXJ0Yy5jb25uZWN0KHRoYXQuYXBwLCBjb25uZWN0U3VjY2VzcywgY29ubmVjdEZhaWx1cmUpO1xuICAgIH1cbiAgfVxuXG4gIF9nZXRSb29tSm9pblRpbWUoY2xpZW50SWQpIHtcbiAgICB2YXIgbXlSb29tSWQgPSBOQUYucm9vbTtcbiAgICB2YXIgam9pblRpbWUgPSB0aGlzLmVhc3lydGMuZ2V0Um9vbU9jY3VwYW50c0FzTWFwKG15Um9vbUlkKVtjbGllbnRJZF1cbiAgICAgIC5yb29tSm9pblRpbWU7XG4gICAgcmV0dXJuIGpvaW5UaW1lO1xuICB9XG5cbiAgZ2V0U2VydmVyVGltZSgpIHtcbiAgICByZXR1cm4gRGF0ZS5ub3coKSArIHRoaXMuYXZnVGltZU9mZnNldDtcbiAgfVxufVxuXG5OQUYuYWRhcHRlcnMucmVnaXN0ZXIoXCJlYXN5cnRjXCIsIEVhc3lSdGNBZGFwdGVyKTtcblxubW9kdWxlLmV4cG9ydHMgPSBFYXN5UnRjQWRhcHRlcjtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvaW5kZXguanMiXSwic291cmNlUm9vdCI6IiJ9