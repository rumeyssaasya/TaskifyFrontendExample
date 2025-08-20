import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginForm from './pages/Login/login';  
import RegisterForm from './pages/Register/register';
import Projects from './pages/Projects/projects';
import ProtectedRoute from './api/ProtectedRoute';
import Tasks from './pages/Tasks/tasks';
import Landing from './pages/Landing/landing';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth/register" element={<RegisterForm />} />
         <Route path="/auth/login" element={<LoginForm/>} />
        <Route path="/auth/forgot-password" element={<LoginForm />} />
        <Route path="/auth/reset-password/:token" element={<LoginForm />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/projects" element={<Projects />} />
          <Route path="/tasks" element={<Tasks />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
