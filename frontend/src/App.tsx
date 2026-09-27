import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import TrainingSession from './pages/TrainingSession';
import AdminBuilder from './pages/AdminBuilder';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/training/:id" element={<TrainingSession />} />
        <Route path="/admin" element={<AdminBuilder />} />
      </Routes>
    </BrowserRouter>
  )
}
