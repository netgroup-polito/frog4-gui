# How to install the Virtualized Network Services GUI

This document presents how to install the Virtualized Network Services GUI.

* Required Python 2.7 and `pip`

```sh
        $ sudo apt-get install python2.7 python-pip
```

* Required Django Framwork

```sh
        $ sudo pip install Django
```

* Required Jsonschema and Json-schema-validator 2.3.1

```sh
        $ sudo pip install jsonschema json-schema-validator requests
```

* Required libraries to manage the NF-FG and the NF templates

```sh
        $ cd [fg-gui]
        $ git submodule update --init --recursive
```

* Required JS library,CSS,Font: you can find them in ./nfg/static


* Create DataBase for Django.

```sh
        $ cd [fg-gui]
        $ python manage.py migrate
```
