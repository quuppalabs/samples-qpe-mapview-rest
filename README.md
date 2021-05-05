# mapview-rest
Sample map-view implementations using Quuppa Positioning Engine REST APIs.

## Overview
This project aims to demonstrate sample implementations of map-view APIs of Quuppa Positioning Engine (QPE). Currently, it contains a JavaScript implementation.

## Usage
The dockerized QPE service can load files from the container's directory `/var/qpe-ext`. Therefore, if the map-view implementation files are present in this container's directory, then they can be served by the QPE instance.

### Step 1
Copy the specific implementation files from this repo and keep it in a local directory. For example, for JavaScript files, copy the files from the `samples-mapview-rest/javascript/` directory.

### Step 2
Mount this local directory, containing the implementation files, as a Docker volume `/var/qpe-ext` while launching the container. Example:

```
docker run -d -p 127.0.0.1:3000:3000 -p 22114:22114/udp -p 22116:22116 -p 22100:22100/udp -p 22107:22107/udp -v $PWD/data:/data -v $PWD:/var/qpe-ext --name <qpe-instance-name> quuppa/qpe-boot:latest -t <config-token> -d /data
```

This example command assumes that the map-view files are in the working directory. Else an absolute path of the directory can be provided in the place of `$PWD`.

### Step 3
Once the QPE instance is up and running, load a project to it. This is a pre-requisite to make the QPE APIs work, as each API request checks if a valid project has been loaded.

### Step 4
Visit http://localhost:3000/ext/map/index.html to see the loaded sample.
