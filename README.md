# geophoto

Make a copy of /config/config.default.json named config.json (in the same directory)

Get your user credentials for Flickr and enter everything in config.json

Add at least one Flickr user id in config.json

run
```
node download.js
```

If all goes well, you should have a data directory with data for the Flickr user. Now you can start the application

```
npm start
```

Open your browser at localhost:8080 and you should see a map with markers. When you click these markers, a photo with information should show.
