import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AddVehicle from './pages/AddVehicle';
import SearchAndBook from './pages/SearchAndBook';
import Bookings from './pages/Bookings';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<SearchAndBook />} />
          <Route path="add-vehicle" element={<AddVehicle />} />
          <Route path="bookings" element={<Bookings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;