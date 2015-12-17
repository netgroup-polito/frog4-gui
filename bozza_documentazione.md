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

* Create a new User in Database with python shell

```sh
        $ python manage.py shell
```
```python
        >> from django.contrib.auth import authenticate
        >> from django.contrib.auth.models import User
        >> u = User.object.create_use("username","email","password")
        >> u.save()
```
In the directory nfg/users/ create a new directory **upload@[username]** where [username] is the username of new user.
In this new directory, you must create a directory **/pos/**.

The struct of directories must be like as follows:
```sh
    /nfg/
     |---/users/
            |---/upload@user1/
            |       |---/pos/
            |---/upload@user2/
            |       |---/pos/
```

# How to start the Virtualized Network Services GUI

To run application:
```sh
        $ python manage.py runserver 0.0.0.0:8080
```

To connect to application write http://[IP]:8080/nfg/ on the url of the browser.


