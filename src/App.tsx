import { Route, Routes } from 'react-router-dom';
import Home from './routes/Home.tsx';
import Map from './routes/Map.tsx';

function App() {
  return (
    <div className="app-layout">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<Map />} />
      </Routes>
    </div>
  );
}

export default App;
