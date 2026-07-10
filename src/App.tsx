
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';

// Public Pages
import { Intro } from './pages/Intro';
import { Survey } from './pages/Survey';
import { Success } from './pages/Success';

// Admin Pages
import { Login } from './pages/admin/Login';
import NotFound from './components/NotFound';
import { AdminLayout } from './components/AdminLayout';
import { Dashboard } from './pages/admin/Dashboard';
import { Responses } from './pages/admin/Responses';
import { Analysis } from './pages/admin/Analysis';
import { Reports } from './pages/admin/Reports';
import { Users } from './pages/admin/Users';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Intro />} />
            <Route path="/survey" element={<Survey />} />
            <Route path="/success" element={<Success />} />

            {/* Admin Auth Route */}
            <Route path="/admin/login" element={<Login />} />

            {/* Protected Admin Routes */}
            <Route path="/admin/*" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="responses" element={<Responses />} />
              <Route path="analysis" element={<Analysis />} />
              <Route path="reports" element={<Reports />} />
              <Route path="users" element={<Users />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
