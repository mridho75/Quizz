import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import BioData from './components/quiz/BioData';
import Quiz from './components/quiz/Quiz';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import './index.css';
import './App.css';

function RequireAdmin({ children }) {
  const isAdmin = sessionStorage.getItem('admin_logged_in') === 'true';
  return isAdmin ? children : <Navigate to="/admin/login" replace />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/biodata" element={<BioData />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <RequireAdmin>
              <AdminDashboard />
            </RequireAdmin>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
