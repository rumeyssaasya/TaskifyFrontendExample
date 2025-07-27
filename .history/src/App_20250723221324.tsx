import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Projects from './pages/Projects/projects';
import LoginForm from './pages/Login/login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginForm />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
