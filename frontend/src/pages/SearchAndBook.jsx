import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { findAvailableVehicles, createBooking } from '../api/api';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';

const SearchAndBook = () => {
  const [searchCriteria, setSearchCriteria] = useState({
    capacityRequired: '',
    fromPincode: '',
    toPincode: '',
    startTime: new Date(),
  });
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [bookingStatus, setBookingStatus] = useState({});

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setSearchCriteria(prev => ({ ...prev, startTime: date }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsSearching(true);
    setMessage({ type: '', text: '' });
    setAvailableVehicles([]);
    setBookingStatus({});

    try {
      const params = { ...searchCriteria, startTime: searchCriteria.startTime.toISOString() };
      const { status, message: msg, data } = await findAvailableVehicles(params);
      if (status) {
        setAvailableVehicles(data);
        if (data.length === 0) {
          setMessage({ type: 'info', text: msg });
        }
      } else {
        setMessage({ type: 'error', text: msg });
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Failed to fetch vehicles.';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setIsSearching(false);
    }
  };

  const handleBookNow = async (vehicleId) => {
    setBookingStatus(prev => ({ ...prev, [vehicleId]: { status: 'loading' } }));
    try {
      const bookingData = {
        vehicleId,
        fromPincode: searchCriteria.fromPincode,
        toPincode: searchCriteria.toPincode,
        startTime: searchCriteria.startTime.toISOString(),
        customerId: 'CUST-001',
      };
      const { status, message: msg } = await createBooking(bookingData);

      setBookingStatus(prev => ({
        ...prev,
        [vehicleId]: { status: status ? 'success' : 'error', message: msg }
      }));
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Booking failed.';
      setBookingStatus(prev => ({
        ...prev,
        [vehicleId]: { status: 'error', message: errorMsg }
      }));
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Search & Book a Vehicle</h2>
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-end">
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700">Capacity Required (KG)</label>
            <input
              type="number"
              name="capacityRequired"
              value={searchCriteria.capacityRequired}
              onChange={handleSearchChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700">From Pincode</label>
            <input
              type="text"
              name="fromPincode"
              value={searchCriteria.fromPincode}
              onChange={handleSearchChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700">To Pincode</label>
            <input
              type="text"
              name="toPincode"
              value={searchCriteria.toPincode}
              onChange={handleSearchChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700">Start Date & Time</label>
            <DatePicker
              selected={searchCriteria.startTime}
              onChange={handleDateChange}
              showTimeSelect
              dateFormat="Pp"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={isSearching}
            className="w-full h-10 flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
          >
            {isSearching ? <Spinner /> : 'Search Availability'}
          </button>
        </form>

        {message.text && <Alert type={message.type} message={message.text} />}
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md min-h-[20rem]">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Available Vehicles</h3>
        {isSearching && <Spinner />}
        {!isSearching && availableVehicles.length === 0 && !message.text && (
          <p className="text-gray-500">No vehicles found. Please adjust your search criteria.</p>
        )}

        <div className="space-y-4">
          {availableVehicles.map(vehicle => (
            <div key={vehicle._id} className="p-4 border rounded-lg flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <p className="font-bold text-lg text-indigo-700">{vehicle.name}</p>
                <p className="text-sm text-gray-600">Capacity: {vehicle.capacityKg} KG | Tyres: {vehicle.tyres}</p>
                <p className="text-sm text-gray-600">Estimated Duration: <span className="font-semibold">{vehicle.estimatedRideDurationHours} HR</span></p>
              </div>
              <div className="w-full md:w-auto">
                {bookingStatus[vehicle._id]?.status === 'loading' && <Spinner />}
                {bookingStatus[vehicle._id]?.status === 'success' && <div className="text-green-600 font-semibold">{bookingStatus[vehicle._id]?.message}</div>}
                {bookingStatus[vehicle._id]?.status === 'error' && <div className="text-red-600 font-semibold">{bookingStatus[vehicle._id]?.message}</div>}
                {!bookingStatus[vehicle._id] && (
                  <button
                    onClick={() => handleBookNow(vehicle._id)}
                    className="w-full md:w-auto bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                  >
                    Book Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchAndBook;
