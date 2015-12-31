# How to install the Virtualized Network Services GUI

This document presents how to install the Virtualized Network Services GUI.

* Required Python 2.7

```sh
        $ sudo apt-get install python2.7
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

  The last version of this library is included in the project


* Create DataBase for Django and USERS table

```sh
        $ python manage.py migrate
```

* Create USERS_GRAPHS Table and initialize fields  

```sh
        $ python DBstarter.py
```

* Create a new User in Database with python shell

```sh
        $ python manage.py shell
```
```python
        >> from django.contrib.auth import authenticate
        >> from django.contrib.auth.models import User
        >> u = User.objects.create_user("username","email","password")
        >> u.save()
```


# How to start the Virtualized Network Services GUI

To run application:
```sh
        $ python manage.py runserver 0.0.0.0:8080
```

To connect to application write http://[IP]:[Port]/nfg/ on the url of the browser.

To run application permanent on the server easy way is:
```sh
        $ screen
        $ python manage.py runserver 0.0.0.0:8080
        $ screen -d
```


