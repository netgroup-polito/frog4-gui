# How to start the Virtualized Network Services GUI

To run the application with the default settings:
```sh
        $ cd [fg-gui]
        $ python manage.py runserver
```

To run the application with a custom settings file:
```sh
        $ cd [fg-gui]
        $ python manage.py runserver --d <configuration file>
```
An example of configuration file is available [here](./config/default-config.ini).

To connect to application write http://[IP]:[Port]/ on the url of the browser.

To run application permanent on the server easy way is:
```sh
        $ cd [fg-gui]
        $ screen
        $ python manage.py runserver &
        $ screen -d
```
