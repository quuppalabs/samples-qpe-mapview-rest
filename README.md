# samples-qpe-mapview-rest

A sample map view visualisation that uses the Quuppa REST APIs to pull data from the Quuppa Positioning Engine (QPE). This is the same map view implementation that is used in our *classic* QPE Web Console and made available as a sample when you download the Quuppa software package from the [Quuppa Customer Portal](https://secure.quuppa.com/). It is intended as a client side demo of what can be built on top of the Quuppa technology platform.

This sample is compatible with and can be run against any of the QPE setup options currently offered by Quuppa:
- The classic QPE, running on a local server
- Our new dockerized version of the QPE (codenamed QPE.next), running on a local server
- A standalone server that is connected to API endpoints provided by a remote Quuppa Site Manager (QSM)

The dockerized QPE and the QSM are new tools for simplifying the deployment of Quuppa systems and enabling remote management of sites. They are currently in beta testing and general availability launch is due later in 2022. For more information, please contact us directly.


## Getting Started  

Start by cloning this repository to your to your local machine. Then proceed to the instructions below for the QPE setup that you plan to use. 

### Run against the classic QPE

The map view sample is already packaged into the classic QPE software and so you can get started without any extra steps. The map is available at the URL path /map/ and the API endpoints "one level up", i.e. at "../". 

### Run on the same host as a dockerized QPE

Since the map view sample is not distributed as part of the dockerized QPE package, you'll need to complete the following steps to get started with the map view sample: 

1. Create a "bind mount", i.e. map one of the folders in your host operating system to the /var/qpe-ext folder inside the QPE docker instance. The files in this folder are available at the URL path /ext. For example, when the docker instance is configured to `--mount type=bind,source=<home.dir>/qpe-mapview-rest/src/main/resources,target=/var/qpe-ext` , the whole **map** folder is available at http://localhost:3000/ext/map/.

2. Set up a path to tell the map view implementation where the API endpoints are. In the classic QPE, the map is available at the URL path /map/ and the API endpoints "one level up", i.e. at "../". With the dockerized version, you'd typically publish the map at path **/ext/map/** and the API is available at **/v2/**. Therefore, the *relative path* from the map path to the api is **../../v2/**. You'll need to set this path to the end of map/index.html to tell the map implementation where the API endpoints are, like this:
```
  $(document).ready(start('../../v2/'));
```
You can also supply the apiPathPrefix as a query parameters as noted in the following section.

### Run on a separate host against the QSM endpoint

When you run the map view sample on a spearate host using API endpoints provided by our remote management tool, the Quuppa Site Manager, you'll need to complete the steps below to take the map view into use: 

1. Serve the map view files through a web server. For example, run `python3 -m http.server -d src/main/resources 8080` from the root folder where you cloned this project. 

2. Create a new API for your QPE endpoint in the QSM and allow requests originating from your development machine, e.g. *http://localhost:8080* for Cross-Origin Resource Sharing (CORS). You can pass the endpoint url and the API token to the map view as query parameters like this: *http://localhost:8081/map/?apiToken=<token>&apiPathPrefix=https%3A%2F%2Fqsm1.quuppa.com%2Fqpe%2F<qpe-identity>%2Fv2%2F*.  


## License

All of the JavaScript and HTML files in this repository are licensed under Apache License 2.0.
