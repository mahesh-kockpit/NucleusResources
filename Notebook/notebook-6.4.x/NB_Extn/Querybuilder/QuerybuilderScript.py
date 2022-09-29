
from asyncio.windows_events import NULL


def SparkDef(PropList, ValueList):
    temp_sync = 'conf =SparkConf()'
    for i in range(0, len(PropList)):
        temp_sync = temp_sync + '.set("' + PropList[i] + '","' + ValueList[i] + '")'
    temp_sync = temp_sync + '\nsc = SparkContext(conf = conf)\nsqlctx = SQLContext(sc)\nspark = sqlctx.sparkSession'
    return temp_sync


def SparkDefStr():
    temp_sync = 'conf =SparkConf().set("spark.app.name","").set("spark.master","local[*]")\nsc = SparkContext(conf = conf)\nsqlctx = SQLContext(sc)\nspark = sqlctx.sparkSession'
    # spark=SparkConf().set("spark.app.name","SparkApp").set("spark.master","local[2]"
    return temp_sync


def search_string_in_file(file_name, string_to_search):
    """Search for the given string in file and return lines containing that string,
    along with line numbers"""
    line_number = 0
    list_of_results = []
    # Open the file in read only mode
    with open(file_name, 'r') as read_obj:
        # Read all lines in the file one by one
        for line in read_obj:
            # For each line, check if line contains the string
            line_number += 1
            if string_to_search in line:
                # If yes, then add the line number & line as a tuple in the list
                list_of_results.append((line_number, line.rstrip()))
    # Return list of tuples containing line numbers and lines where string is found
    return list_of_results


def AppendFunc(file_name, FindText, FindNestElem):
    import re, os
    def find_only_whole_word(search_string, input_string):
        raw_search_string = r"\b" + search_string + r"\b"

        match_output = re.search(raw_search_string, input_string)
        no_match_was_found = (match_output is None)
        if no_match_was_found:
            return False
        else:
            return True
            # file_name=file_name.replace('\\','\\\\')

    # file_name="C:\\KockpitStudio\\ETLJobs\\NBK_20220427112855.ipynb"
    try:
        # opening and reading the file
        file_read = open(file_name, "r")

        lines = file_read.readlines()
        new_list = []
        idx = 0
        for line in lines:
            if FindText.casefold() in line.casefold():
                new_list.insert(idx, line)
                idx += 1
        file_read.close()
        if os.stat(file_name).st_size == 0:
            return None
        elif len(new_list) == 0:
            return None
        else:
            lineLen = len(new_list)
            matched_lines = search_string_in_file(file_name, FindText)
            last_elem_list = []
            matched_line = []
            if len(matched_lines) > 0:

                if FindNestElem == '*':
                    Output = [item for item in matched_lines if
                              FindNestElem in (item[-1].strip()) and not ((item[-1].strip()).startswith('"#'))]
                else:

                    Output = [item for item in matched_lines if
                              find_only_whole_word(FindNestElem, item[-1].strip()) == True and not (
                                  (item[-1].strip()).startswith('"#')) and '*' not in item[-1].strip()]
                if len(Output) > 0:
                    return Output[-1][0]
                else:
                    return None
            else:
                return None

    except Exception as e:
        print(e)


def DefSparkSession(file_name, Sparktext):
    try:

        # opening and reading the file
        file_read = open(file_name, "r")
        lines = file_read.readlines()
        new_list = []
        idx = 0
        for line in lines:
            if Sparktext.casefold() in line.casefold():
                new_list.insert(idx, line)
                idx += 1
        file_read.close()
        if len(new_list) == 0:
            return None
        else:
            # if sparksession is found
            lineLen = len(new_list)
            var_list = []
            # find = before sparksession
            if any("=" in s for s in new_list):
                for i in range(lineLen):
                    var_list.append(str(new_list[i].strip()))

            var_l = [item for item in var_list if not item.startswith('"#')]
            if len(var_l) > 0:
                var = var_l[-1].strip()
                # check if that line is commented

                if not var.startswith('"#') and '=' in var:
                    result = var.find('=')
                    if result > 0:
                        substring = var[1:result].strip()
                    return substring
                else:
                    return None
            else:
                return None


    except Exception as e:
        print(e)


def JOIN(newdf, df1, df2, how):
    try:
        values = dict()
        if how != 'CROSS':
            values['output'] = '' + newdf + '=' + df1 + '.join(' + df2 + ',on=,how="' + how + '")'
            values['sample'] = '#newdf=empDF.join(deptDF,on=empDF.emp_dept_id ==  deptDF.dept_id,how="left")'
            return values
        else:
            values['output'] = '' + newdf + '=' + df1 + '.join(' + df2 + ')'
            values['sample'] = '#newdf=empDF.join(deptDF)'
            return values
    except Exception as e:
        print(e)


def ADDCOLUMN(NEWDF, SEP, COLLIST, CONSTANT, TYPE, NEWCOLNAME, DFNAME, Location):
    try:
        values = dict()
        Lib = ''
        if TYPE == 'CONDITION':
            VarLoc = AppendFunc(Location, "from pyspark.sql.functions import", "when")

            if VarLoc == None:
                Lib = 'from pyspark.sql.functions import when'
                values[
                    'output'] = '' + Lib + '\n' + NEWDF + '=' + DFNAME + '.withColumn("' + NEWCOLNAME + '",when().otherwise())'
                values[
                    'sample'] = '#NewDF=df.withColumn("grade",when((df.salary < 4000), lit("A")).when((df.salary >= 4000) & (df.salary <= 5000), lit("B")).otherwise(lit("C"))'
            else:
                values[
                    'output'] = NEWDF + '=' + DFNAME + '.withColumn("' + NEWCOLNAME + '",when().otherwise())'
                values[
                    'sample'] = '#NewDF=df.withColumn("grade",when((df.salary < 4000), lit("A")).when((df.salary >= 4000) & (df.salary <= 5000), lit("B")).otherwise(lit("C"))'
            
            return values

        elif TYPE == 'EXPRESSION':
            values['output'] = '' + NEWDF + '=' + DFNAME + '.withColumn("' + NEWCOLNAME + '",)'
            values['sample'] = '#NewDF=df.withColumn("bonus", df.salary+(df.salary/3))'
            return values
        elif TYPE == 'CONSTANT':

            VarLoc = AppendFunc(Location, "from pyspark.sql.functions import", "lit")

            if CONSTANT.isdigit() != True:
                CONSTANT = '\"' + CONSTANT + '\"'
            if VarLoc == None:
                Lib = 'from pyspark.sql.functions import lit'
                values[
                    'output'] = '' + Lib + '\n' + NEWDF + '=' + DFNAME + '.withColumn("' + NEWCOLNAME + '",lit(' + CONSTANT + '))'
                values['sample'] = '#NewDF=df.withColumn("Age", lit(25))'
            else:
                values[
                    'output'] = NEWDF + '=' + DFNAME + '.withColumn("' + NEWCOLNAME + '",lit(' + CONSTANT + '))'
                values['sample'] = '#NewDF=df.withColumn("Age", lit(25))'
            return values
        elif TYPE == 'CONCAT':
            if SEP == '0':
                VarLoc = AppendFunc(Location, "from pyspark.sql.functions import", "concat")
                if VarLoc == None:
                    Lib = 'from pyspark.sql.functions import concat'
                    temp_sync = '' + Lib + '\n' + NEWDF + '=' + DFNAME + '.withColumn("' + NEWCOLNAME + '",concat('
                else:
                    temp_sync = NEWDF + '=' + DFNAME + '.withColumn("' + NEWCOLNAME + '",concat('
                for i in range(0, len(COLLIST)):
                    if i == len(COLLIST) - 1:
                        temp_sync = temp_sync + '"' + COLLIST[i] + '"' + '))'
                    else:
                        temp_sync = temp_sync + '"' + COLLIST[i] + '"' + ','
                values['output'] = temp_sync
                values['sample'] = '#NewDF=df.withColumn("name",concat("firstname","lastname"))'
                return values
            else:
                VarLoc = AppendFunc(Location, "from pyspark.sql.functions import", "concat_ws")
                if VarLoc == None:
                    Lib = 'from pyspark.sql.functions import concat_ws'
                    temp_sync = '' + Lib + '\n' + NEWDF + '=' + DFNAME + '.withColumn("' + NEWCOLNAME + '",concat_ws("' + SEP + '",'
                else:
                    temp_sync = NEWDF + '=' + DFNAME + '.withColumn("' + NEWCOLNAME + '",concat_ws("' + SEP + '",'
                for i in range(0, len(COLLIST)):
                    if i == len(COLLIST) - 1:
                        temp_sync = temp_sync + '"' + COLLIST[i] + '"' + '))'
                    else:
                        temp_sync = temp_sync + '"' + COLLIST[i] + '"' + ','
                values['output'] = temp_sync
                values['sample'] = '#NewDF=df.withColumn("name", concat_ws(",","firstname","lastname"))'
                return values
    except Exception as e:
        print(e)


def Port(i):
    switcher = {
        'Postgres': '5432',
        'SQL': '1433'
    }
    return switcher.get(i, '')


def WriteSql(url, port, dbname, userName, password, dfName, tblname, mode):
    try:
        values = dict()
        writesql = "" + dfName + ".write.mode(\"" + mode + "\").format('jdbc') .option('url', f\"jdbc:sqlserver://{'" + url + "'}:{'" + port + "'};databaseName={'" + dbname + "'};\").option('dbtable', '" + tblname + "').option('user', '" + userName + "').option('password', '" + password + "').option('driver', \"com.microsoft.sqlserver.jdbc.SQLServerDriver\").save()"
        values['output'] = writesql
        return values
    except Exception as e:
        print(e)


def ReadSql(dfName, database, url, port, user, password, tableName, Location):
    try:
        values = dict()
        Sparktext = 'SparkSession'
        sparkvar = DefSparkSession(Location, Sparktext)

        SparkSession = AppendFunc(Location, "from pyspark.sql import", "SparkSession")

        SQLContext = AppendFunc(Location, "from pyspark.sql import", "SQLContext")

        SparkConf = AppendFunc(Location, "from pyspark import", "SparkConf")
        SparkContext = AppendFunc(Location, "from pyspark import", "SparkContext")
        SparkSessionLine = ' '
        SQLContextLine = ' '
        SparkConfLine = ' '
        SparkContextLine = ' '
        if SparkSession == None and SQLContext == None:
            SparkSessionLine = 'from pyspark.sql import SparkSession,SQLContext'
        if SparkSession == None and SQLContext != None:
            SparkSessionLine = 'from pyspark.sql import SparkSession'
        if SQLContext == None and SparkSession != None:
            SparkSessionLine = 'from pyspark.sql import SQLContext'
        if SparkConf == None and SparkContext == None:
            SparkConfLine = 'from pyspark import SparkConf,SparkContext'
        if SparkConf == None and SparkContext != None:
            SparkConfLine = 'from pyspark import SparkConf'
        if SparkContext == None and SparkConf != None:
            SparkConfLine = 'from pyspark import SparkContext'
        SparkVar = SparkDefStr()
        if sparkvar == None:
            number_of_variables = 3
            jj = "%s"+"\n%s"*(number_of_variables -1)

            sparkSession = jj%(SparkSessionLine,SparkConfLine,SparkVar)
            sparkSession = sparkSession.replace(" \n","").replace("\n ","")
            #sparkSession = '' + SparkSessionLine + '\n' + SparkConfLine + '\n' + SparkVar + ''
            sparkvar = 'spark'
            Dfname = "" + sparkSession + "\n" + dfName + "=" + sparkvar + ".read.format('jdbc').option('url', f\"jdbc:sqlserver://{'" + url + "'}:{'" + port + "'};databaseName={'" + database + "'}\").option('dbtable', '" + tableName + "').option('user', '" + user + "').option('password', '" + password + "').option('driver', 'com.microsoft.sqlserver.jdbc.SQLServerDriver').load()"
            values['output'] = Dfname
            values['sample'] = ''
        else:
            sparkSession = ''

            Dfname = dfName + "=" + sparkvar + ".read.format('jdbc').option('url', f\"jdbc:sqlserver://{'" + url + "'}:{'" + port + "'};databaseName={'" + database + "'}\").option('dbtable', '" + tableName + "').option('user', '" + user + "').option('password', '" + password + "').option('driver', 'com.microsoft.sqlserver.jdbc.SQLServerDriver').load()"
            values['output'] = Dfname
            values['sample'] = ''
        return values
    except Exception as e:
        print(e)


def WritePostgre(url, port, dbname, userName, password, dfName, Schema, tblname, mode):
    try:
        values = dict()
        writesql = "" + dfName + ".write.mode('" + mode + "').format('jdbc').option('url', f\"jdbc:postgresql://{'" + url + "'}:{'" + port + "'}/{'" + dbname + "'}\") .option('driver', 'org.postgresql.Driver').option('dbtable', '" + Schema + "." + tblname + "').option('user','" + userName + "').option('password','" + password + "').save()"
        values['output'] = writesql
        return values
    except Exception as e:
        print(e)


def ReadPostgre(dfName, database, url, port, user, password, tableName, Location):
    try:
        values = dict()
        Sparktext = 'SparkSession'
        sparkvariable = DefSparkSession(Location, Sparktext)

        SparkSession = AppendFunc(Location, "from pyspark.sql import", "SparkSession")

        SQLContext = AppendFunc(Location, "from pyspark.sql import", "SQLContext")

        SparkConf = AppendFunc(Location, "from pyspark import", "SparkConf")
        SparkContext = AppendFunc(Location, "from pyspark import", "SparkContext")
        SparkSessionLine = ' '
        SQLContextLine = ' '
        SparkConfLine = ' '
        SparkContextLine = ' '
        if SparkSession == None and SQLContext == None:
            SparkSessionLine = 'from pyspark.sql import SparkSession,SQLContext'
        if SparkSession == None and SQLContext != None:
            SparkSessionLine = 'from pyspark.sql import SparkSession'
        if SQLContext == None and SparkSession != None:
            SparkSessionLine = 'from pyspark.sql import SQLContext'
        if SparkConf == None and SparkContext == None:
            SparkConfLine = 'from pyspark import SparkConf,SparkContext'
        if SparkConf == None and SparkContext != None:
            SparkConfLine = 'from pyspark import SparkConf'
        if SparkContext == None and SparkConf != None:
            SparkConfLine = 'from pyspark import SparkContext'
        SparkVar = SparkDefStr()
        if sparkvariable == None:
            number_of_variables = 3
            jj = "%s"+"\n%s"*(number_of_variables -1)

            sparkSession = jj%(SparkSessionLine,SparkConfLine,SparkVar)
            sparkSession = sparkSession.replace(" \n","").replace("\n ","")
            #sparkSession = '' + SparkSessionLine + '\n' + SparkConfLine + '\n' + SparkVar + ''
            sparkvar = 'spark'
            Dfname = "" + sparkSession + "\n" + dfName + "=" + sparkvar + ".read.format('jdbc').option('url', f\"jdbc:postgresql://{'" + url + "'}:{'" + port + "'}/{'" + database + "'}\").option('user', '" + user + "').option('password', '" + password + "').option('driver', 'org.postgresql.Driver').option('dbtable','" + tableName + "').load()"
            values['output'] = Dfname
        else:
            sparkSession = ''
            sparkvar = sparkvariable

            Dfname = dfName + "=" + sparkvar + ".read.format('jdbc').option('url', f\"jdbc:postgresql://{'" + url + "'}:{'" + port + "'}/{'" + database + "'}\").option('user', '" + user + "').option('password', '" + password + "').option('driver', 'org.postgresql.Driver').option('dbtable','" + tableName + "').load()"
            values['output'] = Dfname
        return values
    except Exception as e:
        print(e)

def DBReadWrite(dbname, Location, dfName, tblname, mode, fntype, schema,_dbhost,_dbport,_dbuser,_database,_dbpassword,_dbschema):
    try:
        import psycopg2
        conn = psycopg2.connect(host=_dbhost,
                                database=_database,
                                user=_dbuser,
                                port=_dbport,
                                password=_dbpassword)
        cur = conn.cursor()
        cur.execute(f"""select * from "{_dbschema}"."tbl_dbconndetails" where connname = '{dbname}'""")
        db_version = cur.fetchone()
        cur.close
        dbtype = db_version[2]
        port = db_version[7]  
        url = db_version[3]
        dbname = db_version[4]
        userName = db_version[5]
        password = db_version[6]
        Schema = schema
        if dbtype == 'Sql Server':
            if fntype == 'write':
                output = WriteSql(url, port, dbname, userName, password, dfName, tblname, mode)
            if fntype == 'read':
                user = userName
                tableName = tblname
                database = dbname
                output = ReadSql(dfName, database, url, port, user, password, tableName, Location)
        if dbtype == 'Postgres':
            if fntype == 'write':
                output = WritePostgre(url, port, dbname, userName, password, dfName, Schema, tblname, mode)
            if fntype == 'read':
                user = userName
                tableName = tblname
                database = dbname
                output = ReadPostgre(dfName, database, url, port, user, password, tableName, Location)
        return output
    except Exception as e:
        print(e)


def GROUPBY(NEWDF, GBDF, GBCOL, AGG, AGGCOL, ALIAS, Location):
    try:
        values = dict()
        Lib = ''
        VarLoc = AppendFunc(Location, "from pyspark.sql.functions import", "*")

        
        GB_temp = '' + NEWDF + '=' + GBDF + '.groupBy('
        for i in range(0, len(GBCOL)):
            if i == len(GBCOL) - 1:
                GB_temp = GB_temp + '"' + GBCOL[i] + '"' + ')'
            else:
                GB_temp = GB_temp + '"' + GBCOL[i] + '"' + ','

        GB_temp = GB_temp + '.agg('
        if len(AGG) == 1:
            for j in range(0, len(AGGCOL)):
                if j == len(AGGCOL) - j:
                    GB_temp = GB_temp + '' + AGG[0] + '("' + AGGCOL[j] + '").alias("' + ALIAS[j] + '"))'
                else:
                    GB_temp = GB_temp + '' + AGG[0] + '("' + AGGCOL[j] + '").alias("' + ALIAS[j] + '"))'
        else:
            for j in range(0, len(AGGCOL)):
            
                if len(AGGCOL)-j==1:#j == len(AGGCOL) - j:
                    GB_temp = GB_temp + '' + AGG[j] + '("' + AGGCOL[j] + '").alias("' + ALIAS[j] + '"))'
                else:
                    GB_temp = GB_temp + '' + AGG[j] + '("' + AGGCOL[j] + '").alias("' + ALIAS[j] + '"),'
        if VarLoc == None:
            Lib = "from pyspark.sql.functions import *"
            values['output'] = Lib + '\n' + GB_temp
            values['sample'] = '#df.groupBy("department").agg(sum("salary").alias("sum_salary"),avg("salary").alias("avg_salary"))'
        else:
            values['output'] = GB_temp
            values['sample'] = '#df.groupBy("department").agg(sum("salary").alias("sum_salary"),avg("salary").alias("avg_salary"))'
        return values
    except Exception as e:
        print(e)


def DROP(resultDF, dropDF, dropCol):
    try:
        values = dict()
        GB_temp = '' + resultDF + '=' + dropDF + '.drop('
        for i in range(0, len(dropCol)):
            if i == len(dropCol) - 1:
                GB_temp = GB_temp + '"' + dropCol[i] + '"' + ')'
            else:
                GB_temp = GB_temp + '"' + dropCol[i] + '"' + ','
        values['output'] = GB_temp
        values['sample'] = '#df.drop("firstname","middlename","lastname")'
        return values
    except Exception as e:
        print(e)


def CONCATENATE(resultDF, df1, df2, un):
    try:
        values = dict()
        if un == "unionByName":
            values['output'] = "" + resultDF + "=" + df1 + "." + un + "(" + df2 + ",allowMissingColumns = True)"
            values['sample'] = '#df1.unionByName(df2,allowMissingColumns = True)'
            return values

        else:
            values['output'] = "" + resultDF + "=" + df1 + "." + un + "(" + df2 + ")"
            values['sample'] = '#df1.union(df2)'
            return values
    except Exception as e:
        print(e)


def FillDb(_dbhost,_dbport,_dbuser,_database,_dbpassword,_dbschema):
    import psycopg2
    conn = None
    try:
        conn = psycopg2.connect(host=_dbhost,
                                database=_database,
                                user=_dbuser,
                                password=_dbpassword,port=_dbport)
        cur = conn.cursor()
        db = []
        cur.execute('select connname,dbtype from "'+_dbschema+'"."tbl_dbconndetails"')
        db_version = cur.fetchall()
        for i in db_version:
            db.append(i[0])
        cur.close()
        return db
    except Exception as error:
        print(error)


def ADDSCHEMA(conname,_dbhost,_dbport,_dbuser,_database,_dbpassword,_dbschema):
    import psycopg2
    try:
        conn = psycopg2.connect(host=_dbhost,
                                database=_database,
                                user=_dbuser,
                                port=_dbport,
                                password=_dbpassword)
        cur = conn.cursor()
        cur.execute(f"""select * from "{_dbschema}"."tbl_dbconndetails" where connname = '{conname}'""")
        db_version = cur.fetchone()
        dbname = db_version[4]
        dbhost=db_version[3]
        dbuser=db_version[5]
        dbpassword=db_version[6]
        dbport=db_version[7]
        dbtype = db_version[2]
        if dbtype == 'Postgres':        
            db = []
            cur.execute(f"""select distinct tblname from "{_dbschema}"."tbl_dbdetails" where name = '{conname}'""")
            #cur.execute(f"""select schema_name from information_schema.schemata where catalog_name = '{dbname}'""")
            tables = [i[0] for i in cur.fetchall()]  # A list() of tables.
            conn = psycopg2.connect(host=dbhost,
                                    database=dbname,
                                    user=dbuser,
                                    password=dbpassword,port=dbport)            
            cur = conn.cursor()
            cur.execute(f"""select distinct schema_name from information_schema.schemata where catalog_name = '{dbname}'""")
            schemalist = [i[0] for i in cur.fetchall()]  # A list() of tables.
            matching=[e for e in schemalist if e in '\n'.join(tables)]
            
            #matching = [item for item in tables if any(x in item for x in schemalist)]
            #tables= tables.__contains__(schemalist)
            return matching
        return None     
    except (Exception, psycopg2.DatabaseError) as error:
        return error


def ADDTABLE(conname,_dbhost,_dbport,_dbuser,_database,_dbpassword,_dbschema):
    import psycopg2
    conn = None
    try:
        conn = psycopg2.connect(host=_dbhost,
                                database=_database,
                                user=_dbuser,
                                port=_dbport,
                                password=_dbpassword)
        cur = conn.cursor()
        db = []
        dbname = 'PsqlDb'
        cur.execute(f"""select distinct tblname from "{_dbschema}"."tbl_dbdetails" where name = '{conname}'""")
        tables = [i[0] for i in cur.fetchall()]  # A list() of tables.
        return tables
    except (Exception, psycopg2.DatabaseError) as error:
        return error

