# Networked-AFrame EasyRTC Adapter

Network adapter for [networked-aframe](https://github.com/networked-aframe/networked-aframe) that uses EasyRTC for the WebRTC framework. This is deprecated, and should be updated to open-easyrtc if you intend to use it; see pull requests/issues.

## Running the Example

```
git clone https://github.com/networked-aframe/naf-easyrtc-adapter
cd naf-easyrtc-adapter
npm install # or use yarn
npm run dev # Start the local development server
```

With the server running, browse the example at http://localhost:8080. Open another browser tab and point it to the same URL to see the other client.

Note that the demo is extremely out of date and uses an ancient version of aframe (0.7) and an ancient version of NAF (0.3, custom version to allow registering components).

### Running on Glitch.com

[![Remix on Glitch](https://glitch.com/edit/#!/networked-aframe-audio)
[(Or try the proposed open-easyrtc implementation)](https://glitch.com/edit/#!/join/ee19387d-eaad-4ff3-8353-be62ac4945b0)

### Running your own server

You can deploy the included websocket server to Heroku using the button below.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

Then include and configure `naf-easyrtc-adapter`.

```html
<html>
<head>
  <script src="https://aframe.io/releases/1.0.3/aframe.min.js"></script>
  <script src="https://unpkg.com/networked-aframe/dist/networked-aframe.min.js"></script>
  <!-- Include naf-easyrtc-adapter *after* networked-aframe -->
  <script src="https://unpkg.com/naf-easyrtc-adapter/dist/naf-easyrtc-adapter.min.js"></script> 
</head>
<body>
    <!-- Set adapter to easyrtc and serverURL to the url of your Heroku server. -->
   <a-scene networked-scene="
        adapter: easyrtc;
        serverURL: ws://localhost:8080;
    ">
  </a-scene>
</body>
</html>
```
