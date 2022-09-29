import psycopg2
_connst = "Host=localhost;Port=5433;Username=postgres;Password=ks2022;Database=postgres"
_schema="bso.in"
host="localhost"
username="postgres"
password="ks2022"
Database="postgres"
port="5433"
try:
    conn = psycopg2.connect(host=host,
                            database=Database,
                            user=username,
                            password=password,port=port)
    #conn =psycopg2.connect(_connst);
    cur = conn.cursor()
    cur.execute(f"""select * from "{_schema}"."tbl_dbconndetails" where connname = 'DB2'""")
    db_version = cur.fetchone()
    cur.close
    dbname = db_version[4]
    dbhost=db_version[3]
    dbuser=db_version[5]
    dbpassword=db_version[6]
    dbport=db_version[7]
    conn = psycopg2.connect(host=dbhost,
                            database=dbname,
                            user=dbuser,
                            password=dbpassword,port=dbport)
    cur = conn.cursor()
    db = []
    cur.execute(f"""select schema_name from information_schema.schemata where catalog_name = '{dbname}'""")
    tables = [i[0] for i in cur.fetchall()]  # A list() of tables.
    print(tables)
except Exception as error:
    print(error)