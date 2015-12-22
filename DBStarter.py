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

    print "ho passato i 2 return"

    # Set write permissions on the database file
    #new_db_filename = open(db_filename,'w')
    os.chmod(db_filename, 0o666)
    #new_db_filename.close()
    # Read the dump file
    in_file = open(dbdumpfile,"r")
    sqldump = in_file.read()
    if len(sqldump)<1:
        return

    print "sto per creare il db"
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
    query="SELECT * FROM `users_graphs`"
    conn=sqlite3.connect(db_filename)
    cursor = conn.cursor()
    c=cursor.execute(query)
    print c.fetchone()
    conn.commit()
    conn.close()

session_create_database()
queryTest()
