# How to start the Virtualized Network Services GUI

To run the application with the default settings:
```sh
        $ python manage.py runserver
```

To run the application with a custom settings file:
```sh
        $ python manage.py runserver --d <configuration file>
```

To connect to application write http://[IP]:[Port]/ on the url of the browser.

To run application permanent on the server easy way is:
```sh
        $ screen
        $ python manage.py runserver
        $ screen -d
```