import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginForm from './pages/Login/login';  
import RegisterForm from './pages/Register/register';
import Projects from './pages/Projects/projects';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RegisterForm />} />
         <Route path="/auth/login" element={<LoginForm/>} />
           <Route element={<ProtectedRoute />}>
    <Route path="/projects" element={<Projects />} />
    <Route path="/tasks" element={<Tasks />} />
    <Route path="/profile" element={<Profile />} />
    {/* ne kadar korumak istiyorsan ekle */}
  </Route>
        <Route path="/projects" element={<Projects/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
