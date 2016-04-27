import os
import os.path
import sqlite3

db_filename = "db.sqlite3"


def session_create_database():
    # Relative file addresses
    dbdumpfile = "db_dump.sqlite.sql"

    print "entro"

    if os.path.exists(dbdumpfile) == False:
        return

    # Set write permissions on the database file
    os.chmod(db_filename, 0o666)
    # Read the dump file
    in_file = open(dbdumpfile, "r")
    sqldump = in_file.read()
    if len(sqldump) < 1:
        return

    '''
    sqlite3.complete_statement(sql) returns True if the string sql
    contains
    one or more complete SQL statements terminated by semicolons.
    It does not verify that the SQL is syntactically correct, only that
    there are
    no unclosed string literals and the statement is terminated by a
    semicolon.
    This can be used to build a shell for SQLite.
    '''
    if sqlite3.complete_statement(sqldump):
        conn = sqlite3.connect(db_filename)
        cursor = conn.cursor()
        cursor.executescript(sqldump)
        conn.close()

    print "db creato!"
    return


def queryTest():
    query = "SELECT * FROM `users_graphs`"
    conn = sqlite3.connect(db_filename)
    cursor = conn.cursor()
    c = cursor.execute(query)
    conn.commit()
    for row in c:
        print row
    return
    
   
    conn.close()

session_create_database()
queryTest()
