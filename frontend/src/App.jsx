import { Navigate, Route, Routes } from 'react-router-dom'
import { HomePage, LoginPage, NotFoundPage, RegisterPage } from "./pages";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<HomePage />} />

      {/* Protected routes — redirect to /login if not authenticated */}
      <Route path="/dashboard" element={<ProtectedRoute><div className="p-8 text-gray-900 dark:text-white">Dashboard (coming soon)</div></ProtectedRoute>} />
      <Route path="/history" element={<ProtectedRoute><div className="p-8 text-gray-900 dark:text-white">Watch History (coming soon)</div></ProtectedRoute>} />
      <Route path="/subscriptions" element={<ProtectedRoute><div className="p-8 text-gray-900 dark:text-white">Subscriptions (coming soon)</div></ProtectedRoute>} />
      <Route path="/tweets" element={<ProtectedRoute><div className="p-8 text-gray-900 dark:text-white">Tweets (coming soon)</div></ProtectedRoute>} />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
