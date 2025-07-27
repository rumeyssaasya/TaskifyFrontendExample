import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginForm from './pages/Login/login';  
import RegisterForm from './pages/Register/register';
import Projects from './pages/Projects/projects';
import ProtectedRoute from './api/ProtectedRoute';
import TaskList from './component/TaskList/taskList';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RegisterForm />} />
         <Route path="/auth/login" element={<LoginForm/>} />
        <Route element={<ProtectedRoute />}>
          <Route path="/projects" element={<Projects />} />
          <Route path="/tasks" element={<TaskList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
