from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import List
import pandas as pd
import random

# Initialize app
app = FastAPI()

# Enable CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection
db_connection_url = "postgresql+psycopg2://postgres:postgres@localhost:5432/ticket_to_escape_DEMO"
engine = create_engine(db_connection_url)

# -------------------------
# Models
# -------------------------

class StopTime(BaseModel):
    trip_id: str
    stop_name: str
    departure_time: str
    stop_sequence: int
    platform: str

class GameCreateRequest(BaseModel):
    duration: int
    police_count: int


class GroupCreateRequest(BaseModel):
    game_id: int
    group_name: str
    role: str
# -------------------------
# Game Routes
# -------------------------

@app.post("/api/create_game")
def create_game(data: GameCreateRequest):
    try:
        game_id = random.randint(0, 9999)
        df = pd.DataFrame({
            'game_id': [game_id],
            'duration': [data.duration],
            'police_count': [data.police_count]
        })

        df.to_sql('games', con=engine, if_exists='append', index=False)
        return {"gameId": game_id}
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/waiting")
def get_players(game_id: str = Query(...)):
    try:
        query = f"""
        SELECT group_name, role FROM groups WHERE game_id = {game_id}
        """
        df = pd.read_sql_query(query, engine)
        return df.to_dict(orient="records")
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/checkRauberRole")
def check_rauber_role():
    try:
        # Query to check if any group has selected the 'Räuber' role
        query = "SELECT COUNT(*) FROM groups WHERE role = 'Räuber' AND game_id IS {game_id}"
        result = pd.read_sql_query(query, engine)

        # If the count is greater than 0, it means 'Räuber' has already been chosen
        if result.iloc[0, 0] > 0:
            return {"isRauberTaken": True}
        else:
            return {"isRauberTaken": False}
    except Exception as e:
        return {"error": str(e)}


@app.post("/api/newGroup")
def create_group(data: GroupCreateRequest):
    try:
        group_id = random.randint(0, 9999)

        df = pd.DataFrame({
            'group_id': [group_id],
            'game_id': [data.game_id],
            'group_name': [data.group_name],
            'role': [data.role],
        })

        df.to_sql('groups', con=engine, if_exists='append', index=False)

        return {"groupId": group_id}
    except Exception as e:
        return {"error": str(e)}




# -------------------------
# Departure Routes
# -------------------------

@app.get("/api/departures")
def get_departures(stop_name: str = Query(...)):
    try:
        time_from_dt = datetime.now()
        time_to_dt = time_from_dt + timedelta(hours=1)

        Combined_Query = f"""
        WITH valid_services AS (
            SELECT service_id FROM calendar
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

        df = pd.read_sql_query(Combined_Query, engine)
        df['platform'] = df['stop_id'].fillna('').astype(str).str.split(':').str[-1]
        df['time'] = df['departure_time'].fillna('').astype(str).str.slice(0, 5)

        df.rename(columns={"trip_id": "tripId"}, inplace=True)
        df = df.drop(columns=['stop_id', 'departure_time', 'route_id', 'service_id'])
        df = df.drop_duplicates()

        return df.to_dict(orient='records')

    except Exception as e:
        return {"error": str(e)}

@app.get("/api/departures_details")
def get_departure_details(trip_id: str = Query(...)):
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
        df['platform'] = df['stop_id'].fillna('').astype(str).str.split(':').str[-1]
        df = df.drop(columns=['stop_id'])

        return df.to_dict(orient="records")

    except Exception as e:
        return {"error": str(e)}
