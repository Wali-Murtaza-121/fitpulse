import psycopg2
import os

def get_connection():
    return psycopg2.connect(
        host=os.environ.get("DB_HOST", "localhost"),
        port=os.environ.get("DB_PORT", "5432"),
        dbname=os.environ.get("DB_NAME", "fitpulse"),
        user=os.environ.get("DB_USER", "postgres"),
        password=os.environ.get("DB_PASSWORD", "postgres"),
    )

def init_db():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS workouts (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            category VARCHAR(100) NOT NULL,
            duration_minutes INTEGER NOT NULL,
            calories_burned INTEGER NOT NULL,
            notes TEXT,
            workout_date DATE NOT NULL DEFAULT CURRENT_DATE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)
    # Seed data if empty
    cur.execute("SELECT COUNT(*) FROM workouts;")
    count = cur.fetchone()[0]
    if count == 0:
        cur.execute("""
            INSERT INTO workouts (title, category, duration_minutes, calories_burned, notes, workout_date) VALUES
            ('Morning Run', 'Cardio', 45, 420, 'Easy pace, felt great', '2025-05-20'),
            ('Upper Body Strength', 'Strength', 60, 380, 'Bench press PR: 100kg', '2025-05-19'),
            ('Yoga Flow', 'Flexibility', 30, 150, 'Evening session', '2025-05-18'),
            ('HIIT Circuit', 'Cardio', 25, 310, 'Intense but worth it', '2025-05-17'),
            ('Leg Day', 'Strength', 55, 450, 'Squats + deadlifts', '2025-05-16');
        """)
    conn.commit()
    cur.close()
    conn.close()
    print("✅ Database initialized")