import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import RegisterForm from './pages/Register/register';

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
