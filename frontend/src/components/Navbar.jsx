import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const activeLinkClass = 'bg-indigo-700 text-white';
  const inactiveLinkClass = 'text-gray-300 hover:bg-indigo-700 hover:text-white';
  const linkBaseClass = 'rounded-md px-3 py-2 text-sm font-medium';

  return (
    <nav className="bg-indigo-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-white font-bold text-xl">FleetLink</span>
            </div>
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink
                to="/"
                className={({ isActive }) => `${linkBaseClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}
              >
                Search & Book
              </NavLink>
              <NavLink
                to="/add-vehicle"
                className={({ isActive }) => `${linkBaseClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}
              >
                Add Vehicle
              </NavLink>
              <NavLink
                to="/bookings"
                className={({ isActive }) => `${linkBaseClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}
              >
                Bookings
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;