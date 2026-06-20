import { Navigate, Route, Routes } from 'react-router-dom'
import { HomePage, LoginPage, NotFoundPage } from "./pages";

function App() {

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<HomePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
