import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout and Route Components
import Layout from './components/layout/Layout';
import PrivateRoute from './components/routes/PrivateRoute';
import AdminRoute from './components/routes/AdminRoute';

// Pages
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import QuizPage from '@/pages/QuizPage';
import ResultsPage from '@/pages/ResultsPage';
import QuizDetailsPage from '@/pages/QuizDetailsPage';
import SharedQuizHandler from '@/pages/SharedQuizHandler';
import NotFoundPage from '@/pages/NotFoundPage';
import MyQuizzesPage from './pages/MyQuizzesPage';
import QuizReportPage from './pages/QuizReportPage';
import HistoryPage from './pages/HistoryPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import DonatePage from './pages/DonatePage';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminQuizListPage from './pages/admin/AdminQuizListPage';
import AdminUserListPage from './pages/admin/AdminUserListPage';
import ProfilePage from './pages/ProfilePage';
import QuizFormPage from './pages/QuizFormPage';
import LeaderboardPage from './pages/LeaderboardPage';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public Routes */}
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="donate" element={<DonatePage />} />
          <Route path="leaderboard/:quizId" element={<LeaderboardPage />} />
          
          {/* Shared Quiz Redirect */}
          <Route path="quiz/:id" element={<SharedQuizHandler />} />
          {/* Quiz Details */}
          <Route path="quiz/details/:id" element={<QuizDetailsPage />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="quiz/:id/start" element={<QuizPage />} />
            <Route path="results/:id" element={<ResultsPage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="my-quizzes" element={<MyQuizzesPage />} />
            <Route path="quiz/new" element={<QuizFormPage />} />
            <Route path="quiz/edit/:id" element={<QuizFormPage />} />
            <Route path="quiz/report/:quizId" element={<QuizReportPage />} />
          </Route>

          {/* Admin Routes */}
          <Route path="admin" element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="quizzes" element={<AdminQuizListPage />} />
              <Route path="users" element={<AdminUserListPage />} />
            </Route>
          </Route>

          {/* Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        theme="colored"
      />
    </>
  );
}

export default App;
