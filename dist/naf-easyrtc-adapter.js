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

    this.mediaStreams = {};
    this.pendingMediaRequest = {};

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
      this.easyrtc.enableDebug(false);
      this.easyrtc.enableDataChannels(options.datachannel);

      this.easyrtc.enableVideo(options.video);
      this.easyrtc.enableAudio(options.audio);

      this.easyrtc.enableVideoReceive(true);
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
    key: "connect",
    value: function connect() {
      var _this2 = this;

      Promise.all([this.updateTimeOffset(), new Promise(function (resolve, reject) {
        _this2._connect(_this2.easyrtc.audioEnabled || _this2.easyrtc.videoEnabled, resolve, reject);
      })]).then(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            _ = _ref2[0],
            clientId = _ref2[1];

        _this2._storeMediaStream(_this2.easyrtc.myEasyrtcid, _this2.easyrtc.getLocalStream());

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
      if (this.mediaStreams[clientId]) {
        NAF.log.write("Already had media for " + clientId);
        return Promise.resolve(this.mediaStreams[clientId]);
      } else {
        NAF.log.write("Waiting on media for " + clientId);
        return new Promise(function (resolve) {
          that.pendingMediaRequest[clientId] = resolve;
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
    key: "_storeMediaStream",
    value: function _storeMediaStream(easyrtcid, stream) {
      this.mediaStreams[easyrtcid] = stream;
      if (this.pendingMediaRequest[easyrtcid]) {
        NAF.log.write("got pending media for " + easyrtcid);
        this.pendingMediaRequest[easyrtcid](stream);
        delete this.pendingMediaRequest[easyrtcid](stream);
      }
    }
  }, {
    key: "_connect",
    value: function _connect(mediaEnabled, connectSuccess, connectFailure) {
      var that = this;

      this.easyrtc.setStreamAcceptor(this._storeMediaStream.bind(this));

      this.easyrtc.setOnStreamClosed(function (easyrtcid) {
        delete that.mediaStreams[easyrtcid];
      });

      if (mediaEnabled) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNTYxZmQwNGQwNWU1NjBkNTMzMDgiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbIkVhc3lSdGNBZGFwdGVyIiwiZWFzeXJ0YyIsIndpbmRvdyIsImFwcCIsInJvb20iLCJtZWRpYVN0cmVhbXMiLCJwZW5kaW5nTWVkaWFSZXF1ZXN0Iiwic2VydmVyVGltZVJlcXVlc3RzIiwidGltZU9mZnNldHMiLCJhdmdUaW1lT2Zmc2V0IiwidXJsIiwic2V0U29ja2V0VXJsIiwiYXBwTmFtZSIsInJvb21OYW1lIiwiam9pblJvb20iLCJvcHRpb25zIiwiZW5hYmxlRGVidWciLCJlbmFibGVEYXRhQ2hhbm5lbHMiLCJkYXRhY2hhbm5lbCIsImVuYWJsZVZpZGVvIiwidmlkZW8iLCJlbmFibGVBdWRpbyIsImF1ZGlvIiwiZW5hYmxlVmlkZW9SZWNlaXZlIiwiZW5hYmxlQXVkaW9SZWNlaXZlIiwic3VjY2Vzc0xpc3RlbmVyIiwiZmFpbHVyZUxpc3RlbmVyIiwiY29ubmVjdFN1Y2Nlc3MiLCJjb25uZWN0RmFpbHVyZSIsIm9jY3VwYW50TGlzdGVuZXIiLCJzZXRSb29tT2NjdXBhbnRMaXN0ZW5lciIsIm9jY3VwYW50cyIsInByaW1hcnkiLCJvcGVuTGlzdGVuZXIiLCJjbG9zZWRMaXN0ZW5lciIsIm1lc3NhZ2VMaXN0ZW5lciIsInNldERhdGFDaGFubmVsT3Blbkxpc3RlbmVyIiwic2V0RGF0YUNoYW5uZWxDbG9zZUxpc3RlbmVyIiwic2V0UGVlckxpc3RlbmVyIiwiY2xpZW50U2VudFRpbWUiLCJEYXRlIiwibm93IiwiZmV0Y2giLCJkb2N1bWVudCIsImxvY2F0aW9uIiwiaHJlZiIsIm1ldGhvZCIsImNhY2hlIiwidGhlbiIsInByZWNpc2lvbiIsInNlcnZlclJlY2VpdmVkVGltZSIsInJlcyIsImhlYWRlcnMiLCJnZXQiLCJnZXRUaW1lIiwiY2xpZW50UmVjZWl2ZWRUaW1lIiwic2VydmVyVGltZSIsInRpbWVPZmZzZXQiLCJwdXNoIiwicmVkdWNlIiwiYWNjIiwib2Zmc2V0IiwibGVuZ3RoIiwic2V0VGltZW91dCIsInVwZGF0ZVRpbWVPZmZzZXQiLCJQcm9taXNlIiwiYWxsIiwicmVzb2x2ZSIsInJlamVjdCIsIl9jb25uZWN0IiwiYXVkaW9FbmFibGVkIiwidmlkZW9FbmFibGVkIiwiXyIsImNsaWVudElkIiwiX3N0b3JlTWVkaWFTdHJlYW0iLCJteUVhc3lydGNpZCIsImdldExvY2FsU3RyZWFtIiwiX215Um9vbUpvaW5UaW1lIiwiX2dldFJvb21Kb2luVGltZSIsImNhdGNoIiwiY2xpZW50Iiwicm9vbUpvaW5UaW1lIiwiY2FsbCIsImNhbGxlciIsIm1lZGlhIiwiTkFGIiwibG9nIiwid3JpdGUiLCJlcnJvckNvZGUiLCJlcnJvclRleHQiLCJlcnJvciIsIndhc0FjY2VwdGVkIiwiZGF0YVR5cGUiLCJkYXRhIiwic2VuZERhdGEiLCJzZW5kRGF0YVdTIiwicm9vbU9jY3VwYW50cyIsImdldFJvb21PY2N1cGFudHNBc01hcCIsInJvb21PY2N1cGFudCIsImRlc3RpbmF0aW9uIiwidGFyZ2V0Um9vbSIsInN0YXR1cyIsImdldENvbm5lY3RTdGF0dXMiLCJJU19DT05ORUNURUQiLCJhZGFwdGVycyIsIk5PVF9DT05ORUNURUQiLCJDT05ORUNUSU5HIiwidGhhdCIsImRpc2Nvbm5lY3QiLCJlYXN5cnRjaWQiLCJzdHJlYW0iLCJtZWRpYUVuYWJsZWQiLCJzZXRTdHJlYW1BY2NlcHRvciIsImJpbmQiLCJzZXRPblN0cmVhbUNsb3NlZCIsImluaXRNZWRpYVNvdXJjZSIsImNvbm5lY3QiLCJlcnJtZXNnIiwibXlSb29tSWQiLCJqb2luVGltZSIsInJlZ2lzdGVyIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FB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Q0QsU0FISCxFQUlFLFVBQVM0RCxTQUFULEVBQW9CNkIsT0FBcEIsRUFBNkI7QUFDM0JoQyxjQUFJQyxHQUFKLENBQVFJLEtBQVIsQ0FBY0YsU0FBZCxFQUF5QjZCLE9BQXpCO0FBQ0QsU0FOSDtBQVFELE9BVEQsTUFTTztBQUNMVixhQUFLMUcsT0FBTCxDQUFhbUgsT0FBYixDQUFxQlQsS0FBS3hHLEdBQTFCLEVBQStCd0IsY0FBL0IsRUFBK0NDLGNBQS9DO0FBQ0Q7QUFDRjs7O3FDQUVnQjZDLFEsRUFBVTtBQUN6QixVQUFJNkMsV0FBV2pDLElBQUlqRixJQUFuQjtBQUNBLFVBQUltSCxXQUFXLEtBQUt0SCxPQUFMLENBQWFnRyxxQkFBYixDQUFtQ3FCLFFBQW5DLEVBQTZDN0MsUUFBN0MsRUFDWlEsWUFESDtBQUVBLGFBQU9zQyxRQUFQO0FBQ0Q7OztvQ0FFZTtBQUNkLGFBQU8vRSxLQUFLQyxHQUFMLEtBQWEsS0FBS2hDLGFBQXpCO0FBQ0Q7Ozs7OztBQUdINEUsSUFBSW1CLFFBQUosQ0FBYWdCLFFBQWIsQ0FBc0IsU0FBdEIsRUFBaUN4SCxjQUFqQzs7QUFFQXlILE9BQU9DLE9BQVAsR0FBaUIxSCxjQUFqQixDIiwiZmlsZSI6Im5hZi1lYXN5cnRjLWFkYXB0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA1NjFmZDA0ZDA1ZTU2MGQ1MzMwOCIsIi8qIGdsb2JhbCBOQUYgKi9cblxuY2xhc3MgRWFzeVJ0Y0FkYXB0ZXIge1xuXG4gIGNvbnN0cnVjdG9yKGVhc3lydGMpIHtcbiAgICB0aGlzLmVhc3lydGMgPSBlYXN5cnRjIHx8IHdpbmRvdy5lYXN5cnRjO1xuICAgIHRoaXMuYXBwID0gXCJkZWZhdWx0XCI7XG4gICAgdGhpcy5yb29tID0gXCJkZWZhdWx0XCI7XG5cbiAgICB0aGlzLm1lZGlhU3RyZWFtcyA9IHt9O1xuICAgIHRoaXMucGVuZGluZ01lZGlhUmVxdWVzdCA9IHt9O1xuXG4gICAgdGhpcy5zZXJ2ZXJUaW1lUmVxdWVzdHMgPSAwO1xuICAgIHRoaXMudGltZU9mZnNldHMgPSBbXTtcbiAgICB0aGlzLmF2Z1RpbWVPZmZzZXQgPSAwO1xuICB9XG5cbiAgc2V0U2VydmVyVXJsKHVybCkge1xuICAgIHRoaXMuZWFzeXJ0Yy5zZXRTb2NrZXRVcmwodXJsKTtcbiAgfVxuXG4gIHNldEFwcChhcHBOYW1lKSB7XG4gICAgdGhpcy5hcHAgPSBhcHBOYW1lO1xuICB9XG5cbiAgc2V0Um9vbShyb29tTmFtZSkge1xuICAgIHRoaXMucm9vbSA9IHJvb21OYW1lO1xuICAgIHRoaXMuZWFzeXJ0Yy5qb2luUm9vbShyb29tTmFtZSwgbnVsbCk7XG4gIH1cblxuICAvLyBvcHRpb25zOiB7IGRhdGFjaGFubmVsOiBib29sLCBhdWRpbzogYm9vbCB9XG4gIHNldFdlYlJ0Y09wdGlvbnMob3B0aW9ucykge1xuICAgIHRoaXMuZWFzeXJ0Yy5lbmFibGVEZWJ1ZyhmYWxzZSk7XG4gICAgdGhpcy5lYXN5cnRjLmVuYWJsZURhdGFDaGFubmVscyhvcHRpb25zLmRhdGFjaGFubmVsKTtcblxuICAgIHRoaXMuZWFzeXJ0Yy5lbmFibGVWaWRlbyhvcHRpb25zLnZpZGVvKTtcbiAgICB0aGlzLmVhc3lydGMuZW5hYmxlQXVkaW8ob3B0aW9ucy5hdWRpbyk7XG5cbiAgICB0aGlzLmVhc3lydGMuZW5hYmxlVmlkZW9SZWNlaXZlKHRydWUpO1xuICAgIHRoaXMuZWFzeXJ0Yy5lbmFibGVBdWRpb1JlY2VpdmUodHJ1ZSk7XG4gIH1cblxuICBzZXRTZXJ2ZXJDb25uZWN0TGlzdGVuZXJzKHN1Y2Nlc3NMaXN0ZW5lciwgZmFpbHVyZUxpc3RlbmVyKSB7XG4gICAgdGhpcy5jb25uZWN0U3VjY2VzcyA9IHN1Y2Nlc3NMaXN0ZW5lcjtcbiAgICB0aGlzLmNvbm5lY3RGYWlsdXJlID0gZmFpbHVyZUxpc3RlbmVyO1xuICB9XG5cbiAgc2V0Um9vbU9jY3VwYW50TGlzdGVuZXIob2NjdXBhbnRMaXN0ZW5lcikge1xuICAgIHRoaXMuZWFzeXJ0Yy5zZXRSb29tT2NjdXBhbnRMaXN0ZW5lcihmdW5jdGlvbihcbiAgICAgIHJvb21OYW1lLFxuICAgICAgb2NjdXBhbnRzLFxuICAgICAgcHJpbWFyeVxuICAgICkge1xuICAgICAgb2NjdXBhbnRMaXN0ZW5lcihvY2N1cGFudHMpO1xuICAgIH0pO1xuICB9XG5cbiAgc2V0RGF0YUNoYW5uZWxMaXN0ZW5lcnMob3Blbkxpc3RlbmVyLCBjbG9zZWRMaXN0ZW5lciwgbWVzc2FnZUxpc3RlbmVyKSB7XG4gICAgdGhpcy5lYXN5cnRjLnNldERhdGFDaGFubmVsT3Blbkxpc3RlbmVyKG9wZW5MaXN0ZW5lcik7XG4gICAgdGhpcy5lYXN5cnRjLnNldERhdGFDaGFubmVsQ2xvc2VMaXN0ZW5lcihjbG9zZWRMaXN0ZW5lcik7XG4gICAgdGhpcy5lYXN5cnRjLnNldFBlZXJMaXN0ZW5lcihtZXNzYWdlTGlzdGVuZXIpO1xuICB9XG5cbiAgdXBkYXRlVGltZU9mZnNldCgpIHtcbiAgICBjb25zdCBjbGllbnRTZW50VGltZSA9IERhdGUubm93KCkgKyB0aGlzLmF2Z1RpbWVPZmZzZXQ7XG5cbiAgICByZXR1cm4gZmV0Y2goZG9jdW1lbnQubG9jYXRpb24uaHJlZiwgeyBtZXRob2Q6IFwiSEVBRFwiLCBjYWNoZTogXCJuby1jYWNoZVwiIH0pXG4gICAgICAudGhlbihyZXMgPT4ge1xuICAgICAgICB2YXIgcHJlY2lzaW9uID0gMTAwMDtcbiAgICAgICAgdmFyIHNlcnZlclJlY2VpdmVkVGltZSA9IG5ldyBEYXRlKHJlcy5oZWFkZXJzLmdldChcIkRhdGVcIikpLmdldFRpbWUoKSArIChwcmVjaXNpb24gLyAyKTtcbiAgICAgICAgdmFyIGNsaWVudFJlY2VpdmVkVGltZSA9IERhdGUubm93KCk7XG4gICAgICAgIHZhciBzZXJ2ZXJUaW1lID0gc2VydmVyUmVjZWl2ZWRUaW1lICsgKChjbGllbnRSZWNlaXZlZFRpbWUgLSBjbGllbnRTZW50VGltZSkgLyAyKTtcbiAgICAgICAgdmFyIHRpbWVPZmZzZXQgPSBzZXJ2ZXJUaW1lIC0gY2xpZW50UmVjZWl2ZWRUaW1lO1xuXG4gICAgICAgIHRoaXMuc2VydmVyVGltZVJlcXVlc3RzKys7XG5cbiAgICAgICAgaWYgKHRoaXMuc2VydmVyVGltZVJlcXVlc3RzIDw9IDEwKSB7XG4gICAgICAgICAgdGhpcy50aW1lT2Zmc2V0cy5wdXNoKHRpbWVPZmZzZXQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMudGltZU9mZnNldHNbdGhpcy5zZXJ2ZXJUaW1lUmVxdWVzdHMgJSAxMF0gPSB0aW1lT2Zmc2V0O1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5hdmdUaW1lT2Zmc2V0ID0gdGhpcy50aW1lT2Zmc2V0cy5yZWR1Y2UoKGFjYywgb2Zmc2V0KSA9PiBhY2MgKz0gb2Zmc2V0LCAwKSAvIHRoaXMudGltZU9mZnNldHMubGVuZ3RoO1xuXG4gICAgICAgIGlmICh0aGlzLnNlcnZlclRpbWVSZXF1ZXN0cyA+IDEwKSB7XG4gICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLnVwZGF0ZVRpbWVPZmZzZXQoKSwgNSAqIDYwICogMTAwMCk7IC8vIFN5bmMgY2xvY2sgZXZlcnkgNSBtaW51dGVzLlxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMudXBkYXRlVGltZU9mZnNldCgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfVxuXG4gIGNvbm5lY3QoKSB7XG4gICAgUHJvbWlzZS5hbGwoW1xuICAgICAgdGhpcy51cGRhdGVUaW1lT2Zmc2V0KCksXG4gICAgICBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIHRoaXMuX2Nvbm5lY3QodGhpcy5lYXN5cnRjLmF1ZGlvRW5hYmxlZCB8fCB0aGlzLmVhc3lydGMudmlkZW9FbmFibGVkLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgfSlcbiAgICBdKVxuICAgIC50aGVuKChbXywgY2xpZW50SWRdKSA9PiB7XG4gICAgICB0aGlzLl9zdG9yZU1lZGlhU3RyZWFtKFxuICAgICAgICB0aGlzLmVhc3lydGMubXlFYXN5cnRjaWQsXG4gICAgICAgIHRoaXMuZWFzeXJ0Yy5nZXRMb2NhbFN0cmVhbSgpXG4gICAgICApO1xuXG4gICAgICB0aGlzLl9teVJvb21Kb2luVGltZSA9IHRoaXMuX2dldFJvb21Kb2luVGltZShjbGllbnRJZCk7XG4gICAgICB0aGlzLmNvbm5lY3RTdWNjZXNzKGNsaWVudElkKTtcbiAgICB9KVxuICAgIC5jYXRjaCh0aGlzLmNvbm5lY3RGYWlsdXJlKTtcbiAgfVxuXG4gIHNob3VsZFN0YXJ0Q29ubmVjdGlvblRvKGNsaWVudCkge1xuICAgIHJldHVybiB0aGlzLl9teVJvb21Kb2luVGltZSA8PSBjbGllbnQucm9vbUpvaW5UaW1lO1xuICB9XG5cbiAgc3RhcnRTdHJlYW1Db25uZWN0aW9uKGNsaWVudElkKSB7XG4gICAgdGhpcy5lYXN5cnRjLmNhbGwoXG4gICAgICBjbGllbnRJZCxcbiAgICAgIGZ1bmN0aW9uKGNhbGxlciwgbWVkaWEpIHtcbiAgICAgICAgaWYgKG1lZGlhID09PSBcImRhdGFjaGFubmVsXCIpIHtcbiAgICAgICAgICBOQUYubG9nLndyaXRlKFwiU3VjY2Vzc2Z1bGx5IHN0YXJ0ZWQgZGF0YWNoYW5uZWwgdG8gXCIsIGNhbGxlcik7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBmdW5jdGlvbihlcnJvckNvZGUsIGVycm9yVGV4dCkge1xuICAgICAgICBOQUYubG9nLmVycm9yKGVycm9yQ29kZSwgZXJyb3JUZXh0KTtcbiAgICAgIH0sXG4gICAgICBmdW5jdGlvbih3YXNBY2NlcHRlZCkge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIndhcyBhY2NlcHRlZD1cIiArIHdhc0FjY2VwdGVkKTtcbiAgICAgIH1cbiAgICApO1xuICB9XG5cbiAgY2xvc2VTdHJlYW1Db25uZWN0aW9uKGNsaWVudElkKSB7XG4gICAgLy8gSGFuZGxlZCBieSBlYXN5cnRjXG4gIH1cblxuICBzZW5kRGF0YShjbGllbnRJZCwgZGF0YVR5cGUsIGRhdGEpIHtcbiAgICAvLyBzZW5kIHZpYSB3ZWJydGMgb3RoZXJ3aXNlIGZhbGxiYWNrIHRvIHdlYnNvY2tldHNcbiAgICB0aGlzLmVhc3lydGMuc2VuZERhdGEoY2xpZW50SWQsIGRhdGFUeXBlLCBkYXRhKTtcbiAgfVxuXG4gIHNlbmREYXRhR3VhcmFudGVlZChjbGllbnRJZCwgZGF0YVR5cGUsIGRhdGEpIHtcbiAgICB0aGlzLmVhc3lydGMuc2VuZERhdGFXUyhjbGllbnRJZCwgZGF0YVR5cGUsIGRhdGEpO1xuICB9XG5cbiAgYnJvYWRjYXN0RGF0YShkYXRhVHlwZSwgZGF0YSkge1xuICAgIHZhciByb29tT2NjdXBhbnRzID0gdGhpcy5lYXN5cnRjLmdldFJvb21PY2N1cGFudHNBc01hcCh0aGlzLnJvb20pO1xuXG4gICAgLy8gSXRlcmF0ZSBvdmVyIHRoZSBrZXlzIG9mIHRoZSBlYXN5cnRjIHJvb20gb2NjdXBhbnRzIG1hcC5cbiAgICAvLyBnZXRSb29tT2NjdXBhbnRzQXNBcnJheSB1c2VzIE9iamVjdC5rZXlzIHdoaWNoIGFsbG9jYXRlcyBtZW1vcnkuXG4gICAgZm9yICh2YXIgcm9vbU9jY3VwYW50IGluIHJvb21PY2N1cGFudHMpIHtcbiAgICAgIGlmIChcbiAgICAgICAgcm9vbU9jY3VwYW50c1tyb29tT2NjdXBhbnRdICYmXG4gICAgICAgIHJvb21PY2N1cGFudCAhPT0gdGhpcy5lYXN5cnRjLm15RWFzeXJ0Y2lkXG4gICAgICApIHtcbiAgICAgICAgLy8gc2VuZCB2aWEgd2VicnRjIG90aGVyd2lzZSBmYWxsYmFjayB0byB3ZWJzb2NrZXRzXG4gICAgICAgIHRoaXMuZWFzeXJ0Yy5zZW5kRGF0YShyb29tT2NjdXBhbnQsIGRhdGFUeXBlLCBkYXRhKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBicm9hZGNhc3REYXRhR3VhcmFudGVlZChkYXRhVHlwZSwgZGF0YSkge1xuICAgIHZhciBkZXN0aW5hdGlvbiA9IHsgdGFyZ2V0Um9vbTogdGhpcy5yb29tIH07XG4gICAgdGhpcy5lYXN5cnRjLnNlbmREYXRhV1MoZGVzdGluYXRpb24sIGRhdGFUeXBlLCBkYXRhKTtcbiAgfVxuXG4gIGdldENvbm5lY3RTdGF0dXMoY2xpZW50SWQpIHtcbiAgICB2YXIgc3RhdHVzID0gdGhpcy5lYXN5cnRjLmdldENvbm5lY3RTdGF0dXMoY2xpZW50SWQpO1xuXG4gICAgaWYgKHN0YXR1cyA9PSB0aGlzLmVhc3lydGMuSVNfQ09OTkVDVEVEKSB7XG4gICAgICByZXR1cm4gTkFGLmFkYXB0ZXJzLklTX0NPTk5FQ1RFRDtcbiAgICB9IGVsc2UgaWYgKHN0YXR1cyA9PSB0aGlzLmVhc3lydGMuTk9UX0NPTk5FQ1RFRCkge1xuICAgICAgcmV0dXJuIE5BRi5hZGFwdGVycy5OT1RfQ09OTkVDVEVEO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gTkFGLmFkYXB0ZXJzLkNPTk5FQ1RJTkc7XG4gICAgfVxuICB9XG5cbiAgZ2V0TWVkaWFTdHJlYW0oY2xpZW50SWQpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgaWYgKHRoaXMubWVkaWFTdHJlYW1zW2NsaWVudElkXSkge1xuICAgICAgTkFGLmxvZy53cml0ZShcIkFscmVhZHkgaGFkIG1lZGlhIGZvciBcIiArIGNsaWVudElkKTtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5tZWRpYVN0cmVhbXNbY2xpZW50SWRdKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBOQUYubG9nLndyaXRlKFwiV2FpdGluZyBvbiBtZWRpYSBmb3IgXCIgKyBjbGllbnRJZCk7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuICAgICAgICB0aGF0LnBlbmRpbmdNZWRpYVJlcXVlc3RbY2xpZW50SWRdID0gcmVzb2x2ZTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG5cbiAgZGlzY29ubmVjdCgpIHtcbiAgICB0aGlzLmVhc3lydGMuZGlzY29ubmVjdCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFByaXZhdGVzXG4gICAqL1xuXG4gIF9zdG9yZU1lZGlhU3RyZWFtKGVhc3lydGNpZCwgc3RyZWFtKSB7XG4gICAgdGhpcy5tZWRpYVN0cmVhbXNbZWFzeXJ0Y2lkXSA9IHN0cmVhbTtcbiAgICBpZiAodGhpcy5wZW5kaW5nTWVkaWFSZXF1ZXN0W2Vhc3lydGNpZF0pIHtcbiAgICAgIE5BRi5sb2cud3JpdGUoXCJnb3QgcGVuZGluZyBtZWRpYSBmb3IgXCIgKyBlYXN5cnRjaWQpO1xuICAgICAgdGhpcy5wZW5kaW5nTWVkaWFSZXF1ZXN0W2Vhc3lydGNpZF0oc3RyZWFtKTtcbiAgICAgIGRlbGV0ZSB0aGlzLnBlbmRpbmdNZWRpYVJlcXVlc3RbZWFzeXJ0Y2lkXShzdHJlYW0pO1xuICAgIH1cbiAgfVxuXG4gIF9jb25uZWN0KG1lZGlhRW5hYmxlZCwgY29ubmVjdFN1Y2Nlc3MsIGNvbm5lY3RGYWlsdXJlKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuXG4gICAgdGhpcy5lYXN5cnRjLnNldFN0cmVhbUFjY2VwdG9yKHRoaXMuX3N0b3JlTWVkaWFTdHJlYW0uYmluZCh0aGlzKSk7XG5cbiAgICB0aGlzLmVhc3lydGMuc2V0T25TdHJlYW1DbG9zZWQoZnVuY3Rpb24oZWFzeXJ0Y2lkKSB7XG4gICAgICBkZWxldGUgdGhhdC5tZWRpYVN0cmVhbXNbZWFzeXJ0Y2lkXTtcbiAgICB9KTtcblxuICAgIGlmIChtZWRpYUVuYWJsZWQpIHtcbiAgICAgIHRoaXMuZWFzeXJ0Yy5pbml0TWVkaWFTb3VyY2UoXG4gICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRoYXQuZWFzeXJ0Yy5jb25uZWN0KHRoYXQuYXBwLCBjb25uZWN0U3VjY2VzcywgY29ubmVjdEZhaWx1cmUpO1xuICAgICAgICB9LFxuICAgICAgICBmdW5jdGlvbihlcnJvckNvZGUsIGVycm1lc2cpIHtcbiAgICAgICAgICBOQUYubG9nLmVycm9yKGVycm9yQ29kZSwgZXJybWVzZyk7XG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoYXQuZWFzeXJ0Yy5jb25uZWN0KHRoYXQuYXBwLCBjb25uZWN0U3VjY2VzcywgY29ubmVjdEZhaWx1cmUpO1xuICAgIH1cbiAgfVxuXG4gIF9nZXRSb29tSm9pblRpbWUoY2xpZW50SWQpIHtcbiAgICB2YXIgbXlSb29tSWQgPSBOQUYucm9vbTtcbiAgICB2YXIgam9pblRpbWUgPSB0aGlzLmVhc3lydGMuZ2V0Um9vbU9jY3VwYW50c0FzTWFwKG15Um9vbUlkKVtjbGllbnRJZF1cbiAgICAgIC5yb29tSm9pblRpbWU7XG4gICAgcmV0dXJuIGpvaW5UaW1lO1xuICB9XG5cbiAgZ2V0U2VydmVyVGltZSgpIHtcbiAgICByZXR1cm4gRGF0ZS5ub3coKSArIHRoaXMuYXZnVGltZU9mZnNldDtcbiAgfVxufVxuXG5OQUYuYWRhcHRlcnMucmVnaXN0ZXIoXCJlYXN5cnRjXCIsIEVhc3lSdGNBZGFwdGVyKTtcblxubW9kdWxlLmV4cG9ydHMgPSBFYXN5UnRjQWRhcHRlcjtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvaW5kZXguanMiXSwic291cmNlUm9vdCI6IiJ9