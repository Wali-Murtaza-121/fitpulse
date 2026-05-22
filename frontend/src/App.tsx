import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import WorkoutLog from './pages/WorkoutLog';

export default function App() {
  return (
    <BrowserRouter>
      <div className="page-wrapper">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/workouts" element={<WorkoutLog />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}