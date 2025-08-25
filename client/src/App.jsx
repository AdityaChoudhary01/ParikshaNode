import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout and Route Components
import Layout from './components/layout/Layout';
import PrivateRoute from './components/routes/PrivateRoute';
import AdminRoute from './components/routes/AdminRoute';

// Core Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import QuizPage from './pages/QuizPage';
import ResultsPage from './pages/ResultsPage';
import HistoryPage from './pages/HistoryPage';
import LeaderboardPage from './pages/LeaderboardPage';
import NotFoundPage from './pages/NotFoundPage';
import AboutPage from './pages/AboutPage';
import DonatePage from './pages/DonatePage';
import ContactPage from './pages/ContactPage';
import ProfilePage from './pages/ProfilePage';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminQuizListPage from './pages/admin/AdminQuizListPage';
import AdminQuizFormPage from './pages/admin/AdminQuizFormPage';
import AdminUserListPage from './pages/admin/AdminUserListPage';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public Routes */}
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="leaderboard/:quizId" element={<LeaderboardPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="donate" element={<DonatePage />} />
          <Route path="contact" element={<ContactPage />} />
          
          {/* Protected User Routes */}
          <Route path="" element={<PrivateRoute />}>
            <Route path="profile" element={<ProfilePage />} />
            <Route path="quiz/:id" element={<QuizPage />} />
            <Route path="results/:id" element={<ResultsPage />} />
            <Route path="history" element={<HistoryPage />} />
          </Route>

          {/* Protected Admin Routes */}
          <Route path="admin" element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="quizzes" element={<AdminQuizListPage />} />
              <Route path="quizzes/new" element={<AdminQuizFormPage />} />
              <Route path="quizzes/edit/:id" element={<AdminQuizFormPage />} />
              <Route path="users" element={<AdminUserListPage />} />
            </Route>
          </Route>

          {/* Not Found Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} theme="colored" />
    </>
  );
}

export default App;