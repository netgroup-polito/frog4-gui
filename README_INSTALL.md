# How to install the FROGv4 GUI

This document presents how to install the FROGv4 GUI.

## Install dependencies 

```sh
        $ sudo apt-get install python2.7 python-pip git
        $ sudo pip install Django jsonschema json-schema-validator requests
```

## Clone the code

```sh     
        $ git clone https://github.com/netgroup-polito/fg-gui.git
        $ cd fg-gui
        $ git submodule update --init --recursive
```
## Set up the SQL database

```sh
        $ python manage.py migrate
```

## The FROGv4 Datastore

The [Datastore](https://github.com/netgroup-polito/frog4-datastore/) can be used by the GUI to store service descriptions, NF templates and NF images. To install this component, follow the instructions provided in the [Datastore repository](https://github.com/netgroup-polito/frog4-datastore/blob/master/README.md).

## Configuration file

In order to properly configure the GUI, edit its [configuration file](https://github.com/netgroup-polito/fg-gui/blob/master/config/default-config.ini). Particularly, in this file you have to set the TCP port to be used to interact with the GUI, the IP address and TCP port of the orchestrator with which the GUI has to interact (e.g., to deploy service graphs).
Moreover, you have to set the IP address and TCP port of the repositories used to load/store NF templates and images, NF-FG, NF configuration; usually all this data is stored in a single place, the [FROG4 datastore](https://github.com/netgroup-polito/frog4-datastore).
