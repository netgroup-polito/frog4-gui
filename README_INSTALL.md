# How to install the Virtualized Network Services GUI

This document presents how to install the Virtualized Network Services GUI.

## Install dependencies 

```sh
        $ sudo apt-get install python2.7 python-pip
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
        $ cd [fg-gui]
        $ python manage.py migrate
```
## Configuration file

In order to properly configure the GUI, edit its [configuration file](https://github.com/netgroup-polito/fg-gui/blob/master/config/default-config.ini). Particularly, in this file you have to set the TCP port to be used to interact with the GUI, the IP address and TCP port of the orchestrator with which the GUI has to interact (e.g., to deploy service graphs). Moreover, you have to set the ip address and TCP port of the repository (typically the [FROG4 datastore](https://github.com/netgroup-polito/frog4-datastore) to be used to load/store NF templates and images, NF-FG, NF configuration.
