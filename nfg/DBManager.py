import sqlite3
import json

from django.db.backends import mysql


class DBManager:

    def __init__(self, filename):
        self.db_filename = filename

    def getUserFG(self, username):
        conn = sqlite3.connect(self.db_filename)
        cursor = conn.cursor()
        query = 'SELECT fgname FROM users_graphs WHERE username=? or username = "pubblic"'
        try:
            c = cursor.execute(query, (username,))
            ris = c.fetchall()
            return ris
        except Exception as err:
            print("Something went wrong: {}".format(err))
        finally:
            conn.commit()
            conn.close()
            return ris

    def getFGByName(self, username, nameFG):
        print "hellooooooooo"
        conn = sqlite3.connect(self.db_filename)
        print "prova proav pria"
        cursor = conn.cursor()
        query = 'SELECT fg, fgpos FROM users_graphs WHERE (username=? or username = "pubblic") AND fgname=?'
        try:
            c = cursor.execute(query, (username, nameFG))
            ris = c.fetchone()
            print ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
            print ris[0]
            return ris
        except Exception as err:
            print("Something went wrong: {}".format(err))
        finally:
            conn.commit()
            conn.close()

    def insertFGInUser(self, username, fgName, fg, fgPos):
        fgId=fg['forwarding-graph']['id']
        print fgId

        conn = sqlite3.connect(self.db_filename)
        cursor = conn.cursor()

        if fgPos == None:
            par = (username, fgName, fgId, json.dumps(fg),None)
        else:
            par = (username, fgName, fgId, json.dumps(fg),json.dumps(fgPos))

        query = 'INSERT INTO users_graphs VALUES (?,?,?,?,?)'
        cursor.execute(query, par)

        conn.commit()
        conn.close()
        return

    def deleteFGByName(self, username, fgname):
        conn = sqlite3.connect(self.db_filename)
        cursor = conn.cursor()

        query = 'DELETE FROM users_graphs WHERE username=? AND fgname=?'
        c = cursor.execute(query, (username, fgname))

        print c

        conn.commit()
        conn.close()
        return c



'''
def test():
    db=DBManager("../db.sqlite3")
    #db.getUserFG("father")

    print "getFGByName"

    db.getFGByName("father", "default")
    fg={}
    fg['forwarding-graph']={}
    fg['forwarding-graph']['id']='00000001'

    #db.insertFGInUser("father", "test1", fg, None)
    print "mostro tutti:"
    db.getUserFG("father")
    print ""
    print "elimino"
    db.deleteFGByName("father", "test1")
    print "mostro tutti:"
    db.getUserFG("father")
    print "->>>>>"
    print len(db.getFGByName("father", "default"))
    print len(db.getFGByName("fatsdfher", "defauasfdlt"))

test()
'''