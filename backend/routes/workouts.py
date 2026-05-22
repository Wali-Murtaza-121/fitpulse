import json
import psycopg2
from db import get_connection

def handle_workouts(method, path, body, send_response):
    """
    GET  /api/workouts       → list all workouts
    POST /api/workouts       → create workout
    """
    conn = None
    try:
        conn = get_connection()
        cur = conn.cursor()

        if method == "GET":
            cur.execute("""
                SELECT id, title, category, duration_minutes, calories_burned,
                       notes, workout_date::text, created_at::text
                FROM workouts
                ORDER BY workout_date DESC, created_at DESC
                LIMIT 50;
            """)
            rows = cur.fetchall()
            data = [
                {
                    "id": r[0],
                    "title": r[1],
                    "category": r[2],
                    "duration_minutes": r[3],
                    "calories_burned": r[4],
                    "notes": r[5],
                    "workout_date": r[6],
                    "created_at": r[7],
                }
                for r in rows
            ]
            send_response(200, data)

        elif method == "POST":
            if not body:
                send_response(400, {"error": "Request body required"})
                return
            payload = json.loads(body)
            required = ["title", "category", "duration_minutes", "calories_burned", "workout_date"]
            for field in required:
                if field not in payload:
                    send_response(400, {"error": f"Missing field: {field}"})
                    return

            cur.execute("""
                INSERT INTO workouts (title, category, duration_minutes, calories_burned, notes, workout_date)
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING id, title, category, duration_minutes, calories_burned, notes, workout_date::text, created_at::text;
            """, (
                payload["title"],
                payload["category"],
                int(payload["duration_minutes"]),
                int(payload["calories_burned"]),
                payload.get("notes", ""),
                payload["workout_date"],
            ))
            conn.commit()
            row = cur.fetchone()
            send_response(201, {
                "id": row[0], "title": row[1], "category": row[2],
                "duration_minutes": row[3], "calories_burned": row[4],
                "notes": row[5], "workout_date": row[6], "created_at": row[7],
            })
        else:
            send_response(405, {"error": "Method not allowed"})

    except json.JSONDecodeError:
        send_response(400, {"error": "Invalid JSON"})
    except psycopg2.Error as e:
        send_response(500, {"error": str(e)})
    finally:
        if conn:
            conn.close()