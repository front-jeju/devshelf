import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import { MainPage } from './pages/MainPage';
import { ShelfPage } from './pages/ShelfPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { CreatePortfolioPage } from './pages/CreatePortfolioPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/shelf" element={<ShelfPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/portfolio/new" element={<CreatePortfolioPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
