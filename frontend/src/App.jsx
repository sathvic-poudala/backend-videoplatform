import { Navigate, Route, Routes } from 'react-router-dom'
import { HomePage, LoginPage } from "./pages";

function App() {

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<HomePage />} />
    </Routes>
  )
}

export default App
