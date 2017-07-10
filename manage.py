#!/usr/bin/env python
import os
import sys
from django.core.management import execute_from_command_line
import logging
from ConfigParser import SafeConfigParser

version = 1.5

if __name__ == "__main__":

    # if sys.argv[1] == "runserver":
    i = 1
    confFile = None
    for param in sys.argv:
        if param == "--d":
            if len(sys.argv) > i:
                confFile = sys.argv[i]
                break
            else:
                print("Wrong params usage --d [conf-file]")
                sys.exit(1)
        i += 1

    parser = SafeConfigParser()
    if confFile is not None:
        parser.read(confFile)
    else:
        confFile = "config/default-config.ini"
        parser.read(confFile)

    os.environ.setdefault("FG-GUI_CONF", confFile)

    logging.basicConfig(filename=parser.get('logging', 'filename'), format='%(asctime)s %(levelname)s:%(message)s',
                        level=parser.get('logging', 'level'))

    params = [sys.argv[0], sys.argv[1]]
    if sys.argv[1] == "runserver":
        addr = parser.get('fg-gui', 'address')
        port = parser.get('fg-gui', 'port')
        params.append(addr + ":" + str(port))

    logging.info('Running FG-GUI with version %s', version)
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "django_setting.settings")
    execute_from_command_line(params)

else:

    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "django_setting.settings")
    execute_from_command_line(sys.argv)
