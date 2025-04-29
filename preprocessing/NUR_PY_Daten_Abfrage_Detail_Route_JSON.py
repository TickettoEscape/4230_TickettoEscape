import pandas as pd
from sqlalchemy import create_engine
from datetime import datetime, timedelta

# Verbindung zur Datenbank herstellen
db_connection_url = "postgresql+psycopg2://postgres:postgres@localhost:5432/ticket_to_escape"

engine = create_engine(db_connection_url)

# # Variablen

# #id_Beispiele
# # 2199.TA.91-3-B-j25-1.591.H,
# # 4489.TA.91-3-B-j25-1.1121.R,
# # 351.TA.91-1-B-j25-1.63.H,
# # 1112.TA.91-1-B-j25-1.192.R,
# # 1825.TA.91-3-B-j25-1.436.H ,
# # 4963.TA.91-3-B-j25-1.1263.R,
# # 709.TA.91-1-B-j25-1.98.H

# trip_id = "2215.TA.91-3-B-j25-1.591.H"
# time_from = datetime.now().strftime("%H:%M:%S")  # Nötig from datetime import datetime


# # SQL-Abfrage 
# Combined_Query = f"""
# select 
# st.trip_id,
# st.stop_id,
# sp.stop_name,
# st.departure_time,
# st.stop_sequence
# from stop_times st
# JOIN stops s ON st.stop_id = s.stop_id
# JOIN stops_parent sp ON sp.stop_id = s.parent_station
# Where st.trip_id = '{trip_id}' 
# Order BY st.stop_sequence;

# """

# # Abfrage ausführen
# df = pd.read_sql_query(Combined_Query, engine)

# # Manipulation des stop_id (nach dem letzten ":" splitten und extrahieren)
# df['Gleis'] = df['stop_id'].str.split(':').str[-1]

# # Die Originalspalte stop_id entfernen
# df = df.drop(columns=['stop_id'])


# # Ausgabe anzeigen
# print("Alle Bahnhöfe auf der Route:")
# print(df)


# count_query = "SELECT COUNT (*) FROM games"
# row_count = pd.read_sql_query(count_query, engine)
# print(row_count)




# Assuming engine is already created, for example:
# engine = create_engine('postgresql://username:password@localhost/mydatabase')

# create_game = """INSERT INTO games (duration, police_count) 
# VALUES 
#   (1, 2);"""

# # Executing the query directly via SQLAlchemy engine
# with engine.connect() as connection:
#     connection.execute(create_game)


# import pandas as pd

# # Create a DataFrame with the data you want to insert
# import random
# game_id = random.randint(0, 9999)
# data = {'game_id': [game_id], 'duration': [3], 'police_count': [5]}
# df = pd.DataFrame(data)

# # Assuming engine is already defined
# df.to_sql('games', con=engine, if_exists='append', index=False)

game_id = 9119  # Beispielwert, ersetzen Sie ihn durch den tatsächlichen Wert

query = f"""
            SELECT COUNT(*) as count
            FROM groups
            WHERE role = 'Räuber' AND game_id = '{game_id}'
        """
df = pd.read_sql_query(query, engine, params={"game_id": game_id})
rauber_taken = df.iloc[0]["count"] >= 1

print(rauber_taken)