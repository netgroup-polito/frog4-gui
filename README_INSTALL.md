# How to install the Virtualized Network Services GUI

This document presents how to install the Virtualized Network Services GUI.

* Required Python 2.7 and `pip`

```sh
        $ sudo apt-get install python2.7 python-pip
```

* Required Django Framwork

```sh
        $ pip install Django
```

* Required Json-schema-validator 2.3.1

```sh
        $ pip install json-schema-validator
```

* Required NFFG_library 

  The last version of this library is included in the project.

* Required JS library,CSS,Font

    You can find all the used library in the "contrib" folder.
    This is the archive content currently usage
   * ##### angular
    ```
        ./nfg/static
        +-- js
            +-- libs
                +-- angular.js
                +-- angular-message.js
                +-- angular-mocks.js
                +-- angular-route.js
                +-- angular-sanitize.js
    ```
   * ##### Bootstrap
    ```
        ./nfg/static
        +-- css
        |   +-- bootstrap.css
        +-- fonts
        |   +-- < All the fonts contained into the archive >
        +-- js
            +-- libs
                +-- bootstrap
                    +-- bootstrap.min.js
    ```
   * ##### bootstrap-filestyle
    ```
        ./nfg/static
        +-- js
            +-- bootstrap
                +-- bootstrap-filestyle.min.js
    ```
   * ##### d3
    ```
        ./nfg/static
        +-- js
            +-- libs
                +-- d3
                    +-- d3.min.js
    ```
   * ##### dialog
    ```
        ./nfg/static
        +-- css
        |   +-- dialog.css
        +-- js
            +-- libs
                +-- dialog.js
    ```
   * ##### font-awesome
    ```
        ./nfg/static
        +-- css
        |   +-- font-awesome.css
        +-- fonts
            +-- < All the fonts contained into the archive >
    ```
   * ##### jquery
    ```
        ./nfg/static
        +-- js
            +-- libs
                +-- jquery
                    +-- jquery.min.js
    ```
   * ##### ui-bootstrap-tpls
    ```
        ./nfg/static
        +-- js
            +-- bootstrap
                +-- ui-bootstrap-tpls.min.js
    ```
   * ##### underscore
    ```
        ./nfg/static
        +-- js
            +-- underscore-min.js
    ```

* Create DataBase for Django.

```sh
        $ python manage.py migrate
```
