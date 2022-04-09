# qpe-mapview-rest

The classic map view using Quuppa Positioning Engine REST API

## Getting started

This exactly same map view sample implementation using Quuppa APIs is packaged into the classic QPE. It can also be run against the new, dockerized version QPE as well as on a standalone server connecting to the Quuppa Site Manager provided API endpoint. First, clone this repository to your local machine. 

### For running on the same host as dockerized QPE

You must create a "bind mount", i.e. map one of the folders in your host operating system to /var/qpe-ext folder inside QPE docker instance. The files in this folder are available at the URL path /ext. For example, configuring the docker instance with  `--mount type=bind,source=<home.dir>/qpe-mapview-rest/src/main/resources,target=/var/qpe-ext` the whole **map** folder would be available at http://localhost:3000/ext/map/.

There's one more thing to do. In the classic QPE, the map is available at URL path /map/ and the API endpoints "one level up", i.e. at "../". With the dockerized version, you'd typically publish the map at path **/ext/map/** and the API is available at **/v2/**. Therefore, the *relative path* from the map path to the api is **../../v2/**. You'll need to set this path to the end of map/index.html to tell the map implementation where the API endpoints are, like this:
```
  $(document).ready(start('../../v2/'));
```

### For running on a separate host against the QSM endpoint

Serve the mapview files through a web server. For example, run `python3 -m http.server -d src/main/resources 8080` from the root folder where you cloned this project. Then, create a new API for your QPE endpoint in the QSM. Also, allow requests originating from your development machine, e.g. *http://localhost:8080* for Cross-Origin Resource Sharing (CORS). You can simply pass
the endpoint url and the api token to the mapview as query parameters like this: *http://localhost:8081/map/?apiToken=<token>&apiPathPrefix=https%3A%2F%2Fqsm1.quuppa.com%2Fqpe%2F<qpe-identity>%2Fv2%2F*.  


## License

All of the JavaScript and HTML files in this repository are licensed under Apache License 2.0.