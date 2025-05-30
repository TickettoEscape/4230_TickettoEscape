from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine
from sqlalchemy import text
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import  Optional
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
# db_connection_url = "postgresql+psycopg2://postgres:postgres@localhost:5432/ticket_to_escape"
db_connection_url = "postgresql+psycopg2://postgres:postgres@10.175.14.99:5432/ticket_to_escape"
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


class GroupInputHistory(BaseModel):
    history_id: Optional[int] = None
    group_id: Optional[int] = None
    game_id: Optional[int] = None
    from_stop: Optional[str] = None
    login_time: Optional[str] = None
    logout_time: Optional[str] = None
    departure_time: Optional[str] = None
    trip_id: Optional[str] = None
    to_stop: Optional[str] = None
    arrival_time: Optional[str] = None
    send_stop: Optional[bool] = None
    send_trip: Optional[bool] = None


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
        SELECT group_name, role FROM groups WHERE game_id = '{game_id}'
        """
        df = pd.read_sql_query(query, engine)
        return df.to_dict(orient="records")
    except Exception as e:
        return {"error": str(e)}



@app.get("/api/checkRauberRole")
def check_rauber_taken(game_id: int = Query(...)):
    try:
        query = f"""
            SELECT COUNT(*) as count
            FROM groups
            WHERE role = 'Räuber' AND game_id = '{game_id}'
        """
        df = pd.read_sql_query(query, engine, params={"game_id": game_id})
        rauber_taken = bool(df.iloc[0]["count"])
        
        return rauber_taken
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


@app.post("/api/history/anmelden")
def alter_history(data: GroupInputHistory):
    try:
        anmelden_df = pd.DataFrame({
            'group_id': [data.group_id],
            'game_id': [data.game_id],
            'from_stop': [data.from_stop],
            'login_time': [data.login_time],
            'arrival_time': [data.arrival_time],     
            'send_stop': [data.send_stop]      
        })

        anmelden_df.to_sql('history', con=engine, if_exists='append', index=False)
        
        history_query = f"""
            SELECT * FROM history
            WHERE group_id = '{data.group_id}' AND game_id = '{data.game_id}'
            ORDER BY history_id DESC
            LIMIT 1
        """
             



        result_df = pd.read_sql_query(history_query, engine)
        history_id=int(result_df['history_id'].iloc[0])
        
        return {"historyId": history_id}
    except Exception as e:
        return {"error": str(e)}


@app.post("/api/history/rout_select")
def alter_history(data: GroupInputHistory):
    try:
        
        send_trip = bool(data.send_trip)
        

        update_query = text("""
            UPDATE history
            SET departure_time = :departure_time,
                trip_id = :trip_id,
                send_trip = :send_trip
            WHERE history_id = :history_id
        """)

        with engine.connect() as conn:
            conn.execute(update_query, {
                'departure_time': data.departure_time,
                'trip_id': data.trip_id,
                'history_id': data.history_id, 
                'send_trip': send_trip
            })
            conn.commit()

        return {"status": "success"}

    except Exception as e:
        # Debugging - Print the error
        print("Error:", e)
        return {"error": str(e)}



@app.post("/api/history/abmelden")
def alter_history(data: GroupInputHistory):
    try:
        # Ensure correct boolean type
        send_stop = bool(data.send_stop)

        update_query = text("""
            UPDATE history
            SET logout_time = :logout_time,
                send_stop = :send_stop
            WHERE history_id = :history_id
        """)

        with engine.connect() as conn:
            conn.execute(update_query, {
                'logout_time': data.logout_time,
                'send_stop': send_stop,
                'history_id': data.history_id
            })
            conn.commit()

        return {"status": "success"}

    except Exception as e:
        return {"error": str(e)}


from fastapi.responses import JSONResponse



@app.get("/api/karte")
def map(game_id: int = Query(...), group_id: int = Query(...)):
    try:
        query = f"""
        SELECT
            h.history_id,
            sp.stop_id AS id,
            sp.stop_name AS Name, 
            ST_Y(sp.geometry) AS lat,
            ST_X(sp.geometry) AS lon
        FROM history h
        JOIN stops_parent sp ON sp.stop_name = h.from_stop
        WHERE h.game_id = '{game_id}' AND h.group_id = '{group_id}'
        ORDER BY h.login_time DESC;
        """
        
        df = pd.read_sql_query(query, engine)
        return JSONResponse(content=df.to_dict(orient='records'))
    
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/chat")
def chat(game_id: int = Query(...)):
    try:
        query = f"""
        SELECT * From (
                Select
                    g.group_name,
                    h.group_id, 
                    g.role, 
                    h.departure_time AS time,  -- Ensure this column is named 'time' for consistency
                    h.departure_time || ' ' || r.route_short_name || ' Richtung ' || t.trip_headsign AS Chat_Nachricht
                FROM History h
                JOIN groups g ON h.group_id = g.group_id
                JOIN trips t ON h.trip_id = t.trip_id
                JOIN routes r ON t.route_id = r.route_id
                WHERE h.send_trip = 'true' AND h.game_id = '{game_id}' AND g.role = 'Polizei'
                
                UNION ALL  

                SELECT 
                    g.group_name,
                    h.group_id, 
                    g.role,
                    h.login_time AS time,
                    h.login_time || ' angemeldet an Bahnhof ' || h.from_stop AS Chat_Nachricht
                FROM History h
                JOIN groups g ON h.group_id = g.group_id
                WHERE h.send_stop = 'true' 
                AND h.game_id = '{game_id}'


                UNION ALL

                SELECT 
                    g.group_name,
                    h.group_id, 
                    g.role, 
                    h.logout_time AS time,
                    h.logout_time || ' abgemeldet von Bahnhof ' || h.from_stop AS Chat_Nachricht
                FROM History h
                JOIN groups g ON h.group_id = g.group_id
                WHERE h.game_id = '{game_id}' AND g.role = 'Räuber'
        ) AS combined
        WHERE Chat_Nachricht IS NOT NULL
        ORDER BY time;

        """
        
        df = pd.read_sql_query(query, engine)
        


        return df.to_dict(orient='records')
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
            st.stop_id,
            t.trip_headsign,
            r.route_short_name
        FROM stop_times st
        JOIN stops s ON st.stop_id = s.stop_id
        JOIN stops_parent sp ON sp.stop_id = s.parent_station
        Join trips t ON st.trip_id = t.trip_id
        join routes r ON t.route_id = r.route_id
        WHERE st.trip_id = '{trip_id}'
        ORDER BY st.stop_sequence;
        """
        df = pd.read_sql_query(query, engine)
        df['platform'] = df['stop_id'].fillna('').astype(str).str.split(':').str[-1]
        df = df.drop(columns=['stop_id'])

        return df.to_dict(orient="records")

    except Exception as e:
        return {"error": str(e)}




