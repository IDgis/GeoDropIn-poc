# GeoDropIn-poc
GeoDropIn onderzoek naar diverse concepten met meteor (unzip, ogr2ogr, oracle)

## Algemeen
In de code wordt geprobeerd ogr2ogr aan te spreken en verbinding te maken met Oracle via meteor collections.    
Verschillende meteor packages dienen te zijn  geinstalleerd (zie main.html voor url's).   

Installeer lokaal:   
- ogr2ogr (via Gdal installatie, zorg hier dat de Oracle OCI driver meekomt)
- oracle instant client 32 bits (http://www.oracle.com/technetwork/topics/winsoft-085727.html)
- sqlplus en plsql-developer tbv oracle 

lokaal draait een docker container met oracle-express database engine

start GeoDropIn met ``meteor --port=3010`` of een andere vrije poort

## GeoDropIn met meteor en oracle

### Oracle Expresss met docker-machine
Zie : https://github.com/wnameless/docker-oracle-xe-11g

1. Open DOS command prompt

```
docker-machine  create --driver=virtualbox --virtualbox-memory=2048 --virtualbox-cpu-count=2 oracle-xe
docker-machine env oracle-xe
@FOR /f "tokens=*" %i IN ('docker-machine env oracle-xe') DO @%i
docker pull wnameless/oracle-xe-11g
docker run -d -p 49160:22 -p 49161:1521  --name oracle-xec wnameless/oracle-xe-11g 
docker ps
```

### test oracle 

In Windows: 

1. installeer 32-bits (!!) instant-client http://www.oracle.com/technetwork/topics/winsoft-085727.html
1. env var:  
TNS_ADMIN='C:\Programs\instantclient_11_2\network\admin'
ORACLE_HOME=C:\Programs\instantclient_11_2
LD_LIBRARY_PATH=C:\Programs\instantclient_11_2
1. voeg toe aan PATH: 'C:\Programs\instantclient_11_2'
1. voeg toe aan 'C:\Programs\instantclient_11_2\network\admin' een file tnsnames.ora met connection strings:    
IP adres 192.168.99.100 komt uit  ``docker-machine env oracle-xe``     
```
 ORACLE-XEC =
  (DESCRIPTION =
    (ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.99.100)(PORT = 49161))
    (CONNECT_DATA =
      (SERVER = DEDICATED)
      (SID = XE)
    )
  )

``` 

#### SQLPLUS
``sqlplus system/oracle@oracle-xec``

met sqlplus eerst tabel dummy aanmaken
``
create table dummy as (select * from dual);
``

Maak gebruiker(s) aan (password == username):

```
-- Create the user 
create user GEOPUBLISHER identified by GEOPUBLISHER
  default tablespace USERS
  temporary tablespace TEMP
  profile DEFAULT
  password expire;
-- Grant/Revoke role privileges 
grant connect to GEOPUBLISHER;
grant resource to GEOPUBLISHER;
-- Grant/Revoke system privileges 
grant unlimited tablespace to GEOPUBLISHER;

create user meteor identified by meteor
  default tablespace USERS
  temporary tablespace TEMP
  profile DEFAULT
  password expire;
-- Grant/Revoke role privileges 
grant connect to meteor;
grant resource to meteor;
```

tabel dummy gebruiken in connectie string:

``ogr2ogr -progress -f OCI OCI:"system/oracle@oracle-xec:dummy" duurzaam_ondernemen_ijsselstein.shp``

vervolgens wordt de tabel "DUURZAAM_ONDERNEMEN_IJSSELSTEI" gemaakt:
``select * from DUURZAAM_ONDERNEMEN_IJSSELSTEI;``
De output van deze select is lastig te lezen, maar inhoud is terug te vinden in pgAdmin (via bijv een postgres docker container).

Waarom tabellen dummy en DUURZAAM_ONDERNEMEN_IJSSELSTEI ?:
dummy is handig omdat *ogr2ogr* anders een full table scan doet wat lang kan duren.

#### PLSQL

PLSQL opstarten met
``"C:\Programs\PLSQL Developer\plsqldev" TNS_ADMIN=C:\Programs\instantclient_11_2\network\admin``
Kies uit lijst databases "ORACLE-XEC"


## Wat is nodig voor de ogr2ogr en oracle testen
**test ogr2db**
``meteor npm install --save ogr2ogr``

*gisPath*: C:\Users\Rob\Documents\Gis\data\shp_sampledata\duurzaam_ondernemen_ijsselstein.shp
*dbDriver*: PostgreSQL
*dbConn*: PG:dbname=gdaltest host=192.168.99.100 port=6544 user=postgres password=postgres

**test oracle**
``meteor add metstrike:meteor-oracle``

!! *werkt alleen nog onder linux* !! 

test met oracle driver en knex
npm install knex --save - http://knexjs.org/
npm install oracledb --save - https://github.com/oracle/node-oracledb
npm install strong-oracle --save - https://github.com/strongloop/strong-oracle
