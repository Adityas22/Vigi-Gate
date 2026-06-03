import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Registration from './pages/Registration';
import History from './pages/History';
import Report from './pages/Report';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="register" element={<Registration />} />
          <Route path="history" element={<History />} />
          <Route path="report" element={<Report />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
