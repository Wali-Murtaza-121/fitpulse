import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

export interface Workout {
  id: number;
  title: string;
  category: string;
  duration_minutes: number;
  calories_burned: number;
  notes?: string;
  workout_date: string;
  created_at: string;
}

export interface WorkoutCreate {
  title: string;
  category: string;
  duration_minutes: number;
  calories_burned: number;
  notes?: string;
  workout_date: string;
}

export interface Stats {
  total_workouts: number;
  total_minutes: number;
  total_calories: number;
  avg_duration: number;
  by_category: { category: string; count: number; calories: number }[];
  weekly_activity: { date: string; workouts: number; calories: number }[];
}

export const getWorkouts = () => api.get<Workout[]>('/api/workouts');
export const createWorkout = (data: WorkoutCreate) => api.post<Workout>('/api/workouts', data);
export const getStats = () => api.get<Stats>('/api/stats');