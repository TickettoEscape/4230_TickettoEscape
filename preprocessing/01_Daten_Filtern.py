import os
import pandas as pd
import geopandas as gpd
from sqlalchemy import create_engine
import geoalchemy2

# Verbindung zur Datenbank relevant ab Zeile 75
# db_connection_url = "postgresql+psycopg2://postgres:postgres@localhost:5432/ticket_to_escape"
# engine = create_engine(db_connection_url)

input_folder = 'gtfs'#Daten müssen in gtfs Ordner liegen. und richtig benannt sein.
output_folder = 'filtered_gtfs_data'

routes_df = pd.read_csv(os.path.join(input_folder, 'routes.txt'), header=0, delimiter=',')
trips_df = pd.read_csv(os.path.join(input_folder, 'trips.txt'), header=0, delimiter=',')
stop_times_df = pd.read_csv(os.path.join(input_folder, 'stop_times.txt'), header=0, delimiter=',')
stops_df = pd.read_csv(os.path.join(input_folder, 'stops.txt'), header=0, delimiter=',')
calendar_df = pd.read_csv(os.path.join(input_folder, 'calendar.txt'), header=0, delimiter=',')
calendatr_dates_df = pd.read_csv(os.path.join(input_folder, 'calendar_dates.txt'), header=0, delimiter=',')

# Filtert für Zuglinien (IC, IR, S-Bahn, usw.) da iin Datensatz sonst Buse, Tram, schiffe, usw...
allowed_route_types = [109, 106, 103, 102] #Quelle opentransport Cookbook zur Tabelle Routes.

filtered_routes_df = routes_df[routes_df['route_type'].isin(allowed_route_types)]
filtered_trips_df = trips_df[trips_df['route_id'].isin(filtered_routes_df['route_id'])]
filtered_stop_times_df = stop_times_df[stop_times_df['trip_id'].isin(filtered_trips_df['trip_id'])]
filtered_stops_df = stops_df[stops_df['stop_id'].isin(filtered_stop_times_df['stop_id'])]
filtered_parent_stops_df = stops_df[stops_df['stop_id'].isin(filtered_stops_df['parent_station'])] #Neue Tabelle für einfachere Handhabung von Bahhöfen. sonst Stops beihnalten auch die einzelnen gleise.
filtered_calendar_df = calendar_df[calendar_df['service_id'].isin(filtered_trips_df['service_id'])]
filtered_calendar_df = calendar_df[calendar_df['service_id'].isin(filtered_trips_df['service_id'])]
filtered_calendar_dates_df = calendatr_dates_df[calendatr_dates_df['service_id'].isin(filtered_calendar_df['service_id'])]

# Convert arrival_time and departure_time to timedelta
stop_times_df['arrival_time'] = pd.to_timedelta(stop_times_df['arrival_time'], errors='coerce')
stop_times_df['departure_time'] = pd.to_timedelta(stop_times_df['departure_time'], errors='coerce')
max_time = pd.to_timedelta('1 days')  # Exactly 24:00:00 muss definiert werden sonst 25:07:00 --> 1 day + 01:07:00

filtered_stop_times_df = stop_times_df[
    stop_times_df['stop_id'].isin(filtered_stops_df['stop_id']) &
    (stop_times_df['arrival_time'] >= pd.to_timedelta('0:00:00')) &
    (stop_times_df['arrival_time'] < max_time) &
    (stop_times_df['departure_time'] >= pd.to_timedelta('0:00:00')) &
    (stop_times_df['departure_time'] < max_time)
]

# Geometry-Spalte erstellen für parent stops
filtered_parent_stops_df = gpd.GeoDataFrame(
    filtered_parent_stops_df,
    geometry=gpd.points_from_xy(
        filtered_parent_stops_df["stop_lon"],
        filtered_parent_stops_df["stop_lat"]
    ),
    crs="EPSG:4326",
)

# Relevante Spalten auswählen
filtered_routes_df = filtered_routes_df[['route_id', 'route_short_name', 'route_long_name', 'route_desc', 'route_type']]
filtered_trips_df = filtered_trips_df[['trip_id', 'route_id', 'service_id', 'trip_headsign', 'trip_short_name', 'direction_id', 'block_id', 'original_trip_id', 'hints']]
filtered_parent_stops_df = filtered_parent_stops_df[['stop_id', 'stop_name', 'location_type', 'geometry']]
filtered_stops_df = filtered_stops_df[['stop_id', 'location_type', 'parent_station']]
filtered_stop_times_df = filtered_stop_times_df[['trip_id', 'arrival_time', 'departure_time', 'stop_id', 'stop_sequence', 'pickup_type', 'drop_off_type']]

# schreibt gefilterte df in einzelne csv/txt Dateien
filtered_routes_df.to_csv(os.path.join(output_folder, 'routes.txt'), index=False)
filtered_trips_df.to_csv(os.path.join(output_folder, 'trips.txt'), index=False)
filtered_stop_times_df.to_csv(os.path.join(output_folder, 'stop_times.txt'), index=False)
filtered_stops_df.to_csv(os.path.join(output_folder, 'stops.txt'), index=False)
filtered_parent_stops_df.to_csv(os.path.join(output_folder, 'stops_parent.txt'), index=False)
filtered_calendar_df.to_csv(os.path.join(output_folder, 'calendar.txt'), index=False)
filtered_calendar_dates_df.to_csv(os.path.join(output_folder, 'calendar_dates.txt'), index=False)


# # # Tabellen in PostGIS schreiben ENV problem Engine funktioniert nicht.

# filtered_routes_df.to_sql('routes', engine, if_exists='append', index=False)
# filtered_trips_df.to_sql('trips', engine, if_exists='append', index=False)
# filtered_parent_stops_df.to_postgis('stops_parent', engine, if_exists='append', index=False)
# filtered_stops_df.to_sql('stops', engine, if_exists='append', index=False)
# filtered_stop_times_df.to_sql('stop_times', engine, if_exists='append', index=False)


print("Gefilterte Daten wurden erfolgreich in die PostGIS-Datenbank/ txt geschrieben.")