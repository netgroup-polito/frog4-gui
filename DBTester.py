import sqlite3
import sys


def main():
    if len(sys.argv) != 2:
        print "Wrong parameters, use python DBTester <username> for retrieve all the user FG"
        return
    username = sys.argv[1]
    conn = sqlite3.connect("db.sqlite3")
    cursor = conn.cursor()
    query = 'SELECT fgname,fg FROM users_graphs WHERE username=? or username = "pubblic"'
    try:
        c = cursor.execute(query, (username,))
        conn.commit()
        for row in c:
            print row
        return
    except Exception as err:
        print("Something went wrong: {}".format(err))
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    main()
