

    # FleetLink - Logistics Vehicle Booking System
    
    FleetLink is a full-stack application designed to manage and book logistics vehicles for B2B clients. It features a Node.js backend to handle vehicle management and booking logic, a React frontend for user interaction, and a MongoDB database for data persistence.
    
    The system allows administrators to add vehicles to the fleet and enables users to search for available vehicles based on capacity, route, and time, and then initiate a booking. The core logic ensures that vehicle availability is checked accurately to prevent scheduling conflicts.
    
    
    ## 🚀 Project Structure
    
    This project is a monorepo containing two main packages:
    
    ```
    FLEETLINK/
    ├── backend/      # Node.js, Express API
    └── frontend/     # ReactJS (Vite) client
    ```
    
    
    ## 🛠️ Tech Stack
    
    -   **Backend**: Node.js, Express.js
    -   **Frontend**: React.js (with Vite)
    -   **Database**: MongoDB (with Mongoose)
    -   **Testing**: Vitest
    
    ## 🚀 Getting Started
    
    Follow these instructions to get the project up and running on your local machine.
    
    ### Prerequisites
    -   Node.js (v18 or later)
    -   npm / yarn
    -   MongoDB (running locally or a connection URI)
    
    ### 1. Backend Setup
    
    ```bash
    # Navigate to the backend directory
    cd backend
    
    # Install dependencies
    npm install
    
    # Create a .env file in the backend root and add your variables
    # You can copy the example file
    cp .env.example .env
    
    # Start the server (defaults to port 5000)
    npm start
    ```
    
    **`.env` file for backend:**
    
    ```env
    # Server Port
    PORT=5000
    
    # MongoDB Connection URI
    MONGO_URI=mongodb://127.0.0.1:27017/fleetlink
    ```
    
    ### 2. Frontend Setup
    
    ```bash
    # Open a new terminal and navigate to the frontend directory
    cd frontend
    
    # Install dependencies
    npm install
    
    # Start the React development server (defaults to port 5173)
    npm run dev
    ```
    
    The frontend application should now be running at `http://localhost:5173`.
    
    
    
    ## 📚 API Documentation
    
    The backend server provides the following RESTful API endpoints.
    
    ### 1. Add a New Vehicle
    
    -   **Endpoint**: `POST /api/vehicles`
    -   **Description**: Adds a new vehicle to the fleet.
    -   **Request Body**:
        ```json
        {
          "name": "Tata Ace",
          "capacityKg": 750,
          "tyres": 4
        }
        ```
    -   **Responses**:
        -   `201 Created`: Returns the newly created vehicle object.
        -   `400 Bad Request`: If validation fails (e.g., missing fields, incorrect data types).
    
    ### 2. Find Available Vehicles
    
    -   **Endpoint**: `GET /api/vehicles/available`
    -   **Description**: Searches for vehicles that meet the specified criteria and have no overlapping bookings.
    -   **Query Parameters**:
        -   `capacityRequired` (Number): Minimum carrying capacity required.
        -   `fromPincode` (String): Starting pincode of the route.
        -   `toPincode` (String): Destination pincode of the route.
        -   `startTime` (String): Desired start time in ISO 8601 format (e.g., `2025-10-27T10:00:00Z`).
    -   **Example Request**:
        `/api/vehicles/available?capacityRequired=500&fromPincode=422001&toPincode=400072&startTime=2025-10-27T10:00:00Z`
    -   **Responses**:
        -   `200 OK`: Returns an array of available vehicle objects, each including an `estimatedRideDurationHours` field for the requested route.
            ```json
            [
              {
                "_id": "6508c9f5...",
                "name": "Ashok Leyland Dost",
                "capacityKg": 1250,
                "tyres": 4,
                "estimatedRideDurationHours": 15
              }
            ]
            ```
    
    ### 3. Book a Vehicle
    
    -   **Endpoint**: `POST /api/bookings`
    -   **Description**: Creates a booking for a specific vehicle after re-validating its availability.
    -   **Request Body**:
        ```json
        {
          "vehicleId": "6508c9f5...",
          "fromPincode": "422001",
          "toPincode": "400072",
          "startTime": "2025-10-27T10:00:00Z",
          "customerId": "customer123"
        }
        ```
    -   **Responses**:
        -   `201 Created`: Returns the newly created booking object if successful.
        -   `409 Conflict`: If the vehicle is already booked for an overlapping time slot.
        -   `404 Not Found`: If the `vehicleId` does not exist.
    
    
    
    ## ✅ Running Tests
    
    The backend includes unit tests for critical business logic using Jest.
    
    To run the tests:
    
    ```bash
    # Navigate to the backend directory
    cd backend
    
    # Run the test suite
    npm test
    ```
    
    ***
