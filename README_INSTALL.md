# How to install the Virtualized Network Services GUI

This document presents how to install the Virtualized Network Services GUI.

## Install dependencies 

```sh
        $ sudo apt-get install python2.7 python-pip
        $ sudo pip install Django
        sudo pip install jsonschema json-schema-validator requests
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
