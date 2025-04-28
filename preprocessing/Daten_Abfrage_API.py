from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine
import pandas as pd
from datetime import datetime, timedelta
from pydantic import BaseModel
from typing import List
import uuid

app = FastAPI()

# Optional: allow frontend access (localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection
db_connection_url = "postgresql+psycopg2://postgres:postgres@localhost:5432/ticket_to_escape_Demo"
engine = create_engine(db_connection_url)

# Pydantic model for stop time response
class StopTime(BaseModel):
    trip_id: str
    stop_name: str
    departure_time: str
    stop_sequence: int
    platform: str

@app.get("/api/departures")
def get_departures(stop_name: str = Query(..., description="Name of the stop (e.g. 'Basel SBB')")):
    print(f"✅ Received stop_name: {stop_name}")  # log input

    try:
        time_from_dt = datetime.now()
        time_to_dt = time_from_dt + timedelta(hours=1)

        Combined_Query = f"""
        WITH valid_services AS (
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

            SELECT service_id FROM calendar_dates
            WHERE date = CURRENT_DATE AND exception_type = 1
        ),
        excluded_services AS (
            SELECT service_id FROM calendar_dates
            WHERE date = CURRENT_DATE AND exception_type = 2
        ),
        final_services AS (
            SELECT vs.service_id
            FROM valid_services vs
            LEFT JOIN excluded_services es ON vs.service_id = es.service_id
            WHERE es.service_id IS NULL
        )

        SELECT 
            r.route_short_name AS line,
            r.route_id,
            t.trip_id,
            t.service_id,
            st.departure_time,
            st.stop_id,
            t.trip_headsign AS destination

        FROM routes r
        JOIN trips t ON r.route_id = t.route_id
        JOIN final_services fs ON t.service_id = fs.service_id
        JOIN stop_times st ON t.trip_id = st.trip_id

        WHERE st.departure_time BETWEEN '{time_from_dt.strftime('%H:%M:%S')}' AND '{time_to_dt.strftime('%H:%M:%S')}'
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

        # Execute the SQL query and load the result into a DataFrame
        df = pd.read_sql_query(Combined_Query, engine)
        print(f"✅ Query executed, rows returned: {len(df)}")
        print(df.head())

        # Ensure the columns are strings and handle NaN values
        df['platform'] = df['stop_id'].fillna('').astype(str).str.split(':').str[-1]
        df['time'] = df['departure_time'].fillna('').astype(str).str.slice(0, 5)

        # Rename trip_id to tripId
        df.rename(columns={"trip_id": "tripId"}, inplace=True)

        # Drop unwanted columns
        df = df.drop(columns=['stop_id', 'departure_time', 'route_id', 'service_id'])

        # Remove duplicates
        df = df.drop_duplicates()

        # Return the data as a list of dictionaries
        return df.to_dict(orient='records')

    except Exception as e:
        print("❌ Error during query or processing:", str(e))
        return {"error": str(e)}


@app.get("/api/departures_details")
def get_departure_details(trip_id: str = Query(..., description="Trip ID for which to fetch full stop details")):
    print(f"📦 Fetching stop times for trip_id: {trip_id}")
    try:
        query = f"""
        SELECT 
            st.trip_id,
            sp.stop_name,
            st.departure_time,
            st.stop_sequence,
            st.stop_id
        FROM stop_times st
        JOIN stops s ON st.stop_id = s.stop_id
        JOIN stops_parent sp ON sp.stop_id = s.parent_station
        WHERE st.trip_id = '{trip_id}'
        ORDER BY st.stop_sequence;
        """

        df = pd.read_sql_query(query, engine)

        # Add platform info from stop_id
        df['platform'] = df['stop_id'].fillna('').astype(str).str.split(':').str[-1]

        # Optional: Clean up stop_id from response if not needed
        df = df.drop(columns=['stop_id'])

        # Return as JSON
        return df.to_dict(orient="records")

    except Exception as e:
        print("❌ Error during query:", str(e))
        return {"error": str(e)}



# Create Game
@app.post("/api/create_game")
def create_game(duration: int = Query(...), police_count: int = Query(...)):
    try:
        count_query = "SELECT COUNT (*) FROM games"
        row_count = pd.read_sql_query(count_query, engine)

        # Generate the game_id as row_count + 1
        game_id = str(row_count + 1)

        # Insert the new game into the database
        query = f"""
        INSERT INTO games (game_id, duration, police_count)
        VALUES ('{game_id}', {duration}, {police_count})
        """
        with engine.begin() as conn:
            conn.execute(query)

        return {"gameId": game_id}
    except Exception as e:
        return {"error": str(e)}

# Join Game (Add Player)
@app.post("/api/join_game")
def join_game(game_id: str = Query(...), group_name: str = Query(...), role: str = Query(...)):
    try:
        query = f"""
        INSERT INTO players (game_id, group_name, role)
        VALUES ('{game_id}', '{group_name}', '{role}')
        """
        with engine.begin() as conn:
            conn.execute(query)
        return {"message": "Player joined successfully"}
    except Exception as e:
        return {"error": str(e)}

# Get Players by Game
@app.get("/api/games/{game_id}/players")
def get_players(game_id: str):
    try:
        query = f"""
        SELECT group_name, role
        FROM players
        WHERE game_id = '{game_id}'
        """
        df = pd.read_sql_query(query, engine)

        if df.empty:
            raise HTTPException(status_code=404, detail="No players found for this game ID")

        # Return as list of dicts
        return df.to_dict(orient="records")

    except Exception as e:
        print(f"❌ Error in get_players: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
