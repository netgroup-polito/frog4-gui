####################################################
#               DataBase Manager Class             #
#                                                  #
# This class enables you to connect to DB sqlite3  #  
####################################################


import sqlite3
import json
import logging
import os
from ConfigParser import SafeConfigParser
# from django.db.backends import mysql
# from create_logging import Mylogging

parser = SafeConfigParser()
parser.read(os.environ["FG-GUI_CONF"])
logging.basicConfig(filename=parser.get('logging', 'filename'), format='%(asctime)s %(levelname)s:%(message)s',
                    level=parser.get('logging', 'level'))


class DBManager:
    def __init__(self, filename):
        self.db_filename = filename

    # This method returns all forwarding-graphs of a user and 
    # eventually public forwarding-graphs.

    def getUserFG(self, username):
        conn = sqlite3.connect(self.db_filename)
        cursor = conn.cursor()
        query = 'SELECT fgname FROM users_graphs WHERE username=? or username = "public"'
        try:
            c = cursor.execute(query, (username,))
            ris = c.fetchall()
            return ris
        except Exception as err:
            logging.error("Something went wrong: {}".format(err))
        finally:
            conn.commit()
            conn.close()
            return ris

    # This method returns a forwarding-graph of a user, 
    # that has a specific name (nameFG) 

    def getFGByName(self, username, nameFG):
        conn = sqlite3.connect(self.db_filename)
        cursor = conn.cursor()
        query = 'SELECT fg, fgpos FROM users_graphs WHERE (username=? or username = "public") AND fgname=?'
        try:
            c = cursor.execute(query, (username, nameFG))
            ris = c.fetchone()
            logging.debug(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
            logging.debug(ris[0])
            return ris
        except Exception as err:
            logging.error("Something went wrong: {}".format(err))
        finally:
            conn.commit()
            conn.close()

    # This method insert a new forwarding-graph of user into Database

    def insertFGInUser(self, username, fgName, fg, fgPos):
        fgId = fg['forwarding-graph']['id']
        logging.debug(fgId)

        conn = sqlite3.connect(self.db_filename)
        cursor = conn.cursor()

        if fgPos == None:
            par = (username, fgName, fgId, json.dumps(fg), None)
        else:
            par = (username, fgName, fgId, json.dumps(fg), json.dumps(fgPos))

        query = 'INSERT INTO users_graphs VALUES (?,?,?,?,?)'
        cursor.execute(query, par)

        conn.commit()
        conn.close()
        return

    # This method delete a forwarding-graph of user

    def deleteFGByName(self, username, fgname):
        conn = sqlite3.connect(self.db_filename)
        cursor = conn.cursor()

        query = 'DELETE FROM users_graphs WHERE username=? AND fgname=?'
        c = cursor.execute(query, (username, fgname))

        logging.debug(c)

        conn.commit()
        conn.close()
        return c
