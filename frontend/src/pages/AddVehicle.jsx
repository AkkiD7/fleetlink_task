import React, { useState } from 'react';
import { addVehicle } from '../api/api';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';

const AddVehicle = () => {
  const [formData, setFormData] = useState({ name: '', capacityKg: '', tyres: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const data = {
        name: formData.name,
        capacityKg: parseInt(formData.capacityKg, 10),
        tyres: parseInt(formData.tyres, 10),
      };
      const response = await addVehicle(data);
      setMessage({ type: 'success', text: response.message || 'Vehicle added successfully!' });
      setFormData({ name: '', capacityKg: '', tyres: '' });
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to add vehicle.';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Vehicle</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Vehicle Name</label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">Capacity (KG)</label>
          <input
            type="number"
            name="capacityKg"
            id="capacityKg"
            value={formData.capacityKg}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="tyres" className="block text-sm font-medium text-gray-700">Number of Tyres</label>
          <input
            type="number"
            name="tyres"
            id="tyres"
            value={formData.tyres}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        
        {message.text && <Alert type={message.type} message={message.text} />}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
        >
          {isLoading ? <Spinner /> : 'Add Vehicle'}
        </button>
      </form>
    </div>
  );
};

export default AddVehicle;