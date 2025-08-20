import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Projects from './pages/Projects/projects';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Projects />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
