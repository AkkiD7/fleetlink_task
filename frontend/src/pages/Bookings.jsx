import React, { useEffect, useState } from "react";
import { getBookings, deleteBooking } from "../api/api";
import Spinner from "../components/Spinner";
import Alert from "../components/Alert";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await getBookings();
      setBookings(res.data || []);
    } catch (err) {
      setMessage({ type: "error", text: "Failed to fetch bookings." });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      const res = await deleteBooking(id);
      setBookings((prev) => prev.filter((b) => b._id !== id));
      setMessage({ type: "success", text: res.message || "Booking cancelled successfully!" });
    } catch (err) {
      setMessage({ type: "error", text: "Failed to cancel booking." });
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="bg-white p-8 rounded-lg shadow-md  mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Bookings</h2>

      {message.text && <Alert type={message.type} message={message.text} />}

      {loading ? (
        <div className="flex justify-center py-6">
          <Spinner />
        </div>
      ) : bookings.length === 0 ? (
        <p className="text-gray-600">No bookings found.</p>
      ) : (
        <ul className="space-y-4">
          {bookings.map((b) => (
            <li
              key={b._id}
              className="p-4 border border-gray-200 rounded-md shadow-sm flex justify-between items-start"
            >
              <div>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Vehicle:</span> {b.vehicleId?.name}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">From:</span> {b.fromPincode} →{" "}
                  <span className="font-semibold">To:</span> {b.toPincode}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Start:</span>{" "}
                  {new Date(b.startTime).toLocaleString()}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">End:</span>{" "}
                  {new Date(b.endTime).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => handleCancel(b._id)}
                className="ml-4 bg-red-600 text-white px-4 py-2 rounded-md shadow-sm text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Cancel
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Bookings;
