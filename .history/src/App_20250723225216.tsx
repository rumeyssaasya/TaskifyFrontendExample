import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginForm from './pages/Login/login';  
import RegisterForm from './pages/Register/register';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RegisterForm />} />
         <Route path="/auth/login" element={<LoginForm/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
