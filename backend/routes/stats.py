import psycopg2
from db import get_connection

def handle_stats(method, path, body, send_response):
    """
    GET /api/stats → aggregated fitness stats
    """
    if method != "GET":
        send_response(405, {"error": "Method not allowed"})
        return

    conn = None
    try:
        conn = get_connection()
        cur = conn.cursor()

        # Total stats
        cur.execute("""
            SELECT
                COUNT(*) as total_workouts,
                COALESCE(SUM(duration_minutes), 0) as total_minutes,
                COALESCE(SUM(calories_burned), 0) as total_calories,
                COALESCE(AVG(duration_minutes), 0) as avg_duration
            FROM workouts;
        """)
        totals = cur.fetchone()

        # Stats by category
        cur.execute("""
            SELECT category, COUNT(*) as count, SUM(calories_burned) as calories
            FROM workouts
            GROUP BY category
            ORDER BY count DESC;
        """)
        by_category = [
            {"category": r[0], "count": r[1], "calories": r[2]}
            for r in cur.fetchall()
        ]

        # Last 7 days activity
        cur.execute("""
            SELECT workout_date::text, COUNT(*) as workouts, SUM(calories_burned) as calories
            FROM workouts
            WHERE workout_date >= CURRENT_DATE - INTERVAL '7 days'
            GROUP BY workout_date
            ORDER BY workout_date ASC;
        """)
        weekly = [
            {"date": r[0], "workouts": r[1], "calories": r[2]}
            for r in cur.fetchall()
        ]

        send_response(200, {
            "total_workouts": totals[0],
            "total_minutes": int(totals[1]),
            "total_calories": int(totals[2]),
            "avg_duration": round(float(totals[3]), 1),
            "by_category": by_category,
            "weekly_activity": weekly,
        })

    except psycopg2.Error as e:
        send_response(500, {"error": str(e)})
    finally:
        if conn:
            conn.close()