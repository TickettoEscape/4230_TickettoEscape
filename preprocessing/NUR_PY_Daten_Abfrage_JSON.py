import pandas as pd
from sqlalchemy import create_engine
from datetime import datetime, timedelta

# Verbindung zur Datenbank herstellen
db_connection_url = "postgresql+psycopg2://postgres:postgres@localhost:5432/ticket_to_escape"
engine = create_engine(db_connection_url)

# Variablen
stop_name = "Basel SBB"
time_from = datetime.now().strftime("%H:%M:%S")  # Nötig from datetime import datetime

# Zeitumrechnung und +1 Stunde berechnen
time_from_dt = datetime.strptime(time_from, "%H:%M:%S")
time_to_dt = time_from_dt + timedelta(hours=1)

# Zeit zurück in String-Format für SQL
time_from = time_from_dt.strftime("%H:%M:%S")
time_to = time_to_dt.strftime("%H:%M:%S")

# SQL-Abfrage (keine DISTINCT ON für departure_time, keine Filterung auf Uniqueness)
Combined_Query = f"""
WITH valid_services AS (
    -- Regular calendar services
    SELECT service_id
    FROM calendar
    WHERE CURRENT_DATE BETWEEN start_date AND end_date
      AND (
        (EXTRACT(DOW FROM CURRENT_DATE) = 0 AND sunday) OR
        (EXTRACT(DOW FROM CURRENT_DATE) = 1 AND monday) OR
        (EXTRACT(DOW FROM CURRENT_DATE) = 2 AND tuesday) OR
        (EXTRACT(DOW FROM CURRENT_DATE) = 3 AND wednesday) OR
        (EXTRACT(DOW FROM CURRENT_DATE) = 4 AND thursday) OR
        (EXTRACT(DOW FROM CURRENT_DATE) = 5 AND friday) OR
        (EXTRACT(DOW FROM CURRENT_DATE) = 6 AND saturday)
      )
    
    UNION

    -- Added exceptions from calendar_dates
    SELECT service_id
    FROM calendar_dates
    WHERE date = CURRENT_DATE
      AND exception_type = 1
),
excluded_services AS (
    -- Removed exceptions from calendar_dates
    SELECT service_id
    FROM calendar_dates
    WHERE date = CURRENT_DATE
      AND exception_type = 2
),
final_services AS (
    -- Final list of services for today: valid - excluded
    SELECT vs.service_id
    FROM valid_services vs
    LEFT JOIN excluded_services es ON vs.service_id = es.service_id
    WHERE es.service_id IS NULL
)

SELECT 
    r.route_short_name,
    r.route_id,
    t.trip_id,
    t.service_id,
    st.departure_time,
    st.stop_id,
    t.trip_headsign

FROM routes r
JOIN trips t ON r.route_id = t.route_id
JOIN final_services fs ON t.service_id = fs.service_id
JOIN stop_times st ON t.trip_id = st.trip_id

WHERE st.departure_time BETWEEN '{time_from_dt}' AND '{time_to_dt}'
  AND st.stop_id IN (
    SELECT stop_id 
    FROM stops 
    WHERE parent_station = (
        SELECT stop_id 
        FROM stops_parent 
        WHERE stop_name = '{stop_name}'
    )
  )
  AND t.trip_headsign NOT LIKE '{stop_name}'

ORDER BY st.departure_time, r.route_short_name;

"""

# Abfrage ausführen
df = pd.read_sql_query(Combined_Query, engine)

# Manipulation des stop_id (nach dem letzten ":" splitten und extrahieren)
df['Gleis'] = df['stop_id'].str.split(':').str[-1]

# Die Originalspalte stop_id entfernen
df = df.drop(columns=['stop_id'])

# Entfernen von Duplikaten (keine Zeile wiederholt sich)
df = df.drop_duplicates()
# df = df.drop_duplicates(subset=['route_short_name','departure_time'])

# Filtern der Zeilen, in denen trip_headsign den stop_name enthält
df = df[~df['trip_headsign'].str.contains(stop_name, case=False, na=False)]

# Ausgabe anzeigen
print("Gefilterte Daten ohne stop_name im trip_headsign:")
print(df)
