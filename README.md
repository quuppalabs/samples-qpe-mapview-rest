# qpe-mapview-rest

The classic map view using Quuppa Positioning Engine REST API

## Getting started

The exactly same map view implementation using Quuppa APIs is packaged into the classic QPE and can be run against the new, dockerized version QPE as well. First, clone this repository to your local machine. Then, you must create a "bind mount", i.e. map one of the folders in your host operating system to /var/qpe-ext folder inside QPE docker instance. The files in this folder are available at the URL path /ext. For example, configuring the docker instance with  `--mount type=bind,source=<home.dir>/qpe-mapview-rest/src/main/resources,target=/var/qpe-ext` the whole **map** folder would be available at http://localhost:3000/ext/map/.

There's one more thing to do. In the classic QPE, the map is available at URL path /map/ and the API endpoints "one level up", i.e. at "../". With the dockerized version, you'd typically publish the map at path **/ext/map/** and the API is available at **/v2/**. Therefore, the *relative path* from the map path to the api is **../../v2/**. You'll need to set this path to the end of map/index.html to tell the map implementation where the API endpoints are, like this:
```
  $(document).ready(start('../../v2/'));
```


## Contributing
State if you are open to contributions and what your requirements are for accepting them.

For people who want to make changes to your project, it's helpful to have some documentation on how to get started. Perhaps there is a script that they should run or some environment variables that they need to set. Make these steps explicit. These instructions could also be useful to your future self.

You can also document commands to lint the code or run tests. These steps help to ensure high code quality and reduce the likelihood that the changes inadvertently break something. Having instructions for running tests is especially helpful if it requires external setup, such as starting a Selenium server for testing in a browser.

## Authors and acknowledgment
Show your appreciation to those who have contributed to the project.

## License

All of the JavaScript and HTML files in this repository are licensed under Apache License 2.0.

## Project status
If you have run out of energy or time for your project, put a note at the top of the README saying that development has slowed down or stopped completely. Someone may choose to fork your project or volunteer to step in as a maintainer or owner, allowing your project to keep going. You can also make an explicit request for maintainers.
