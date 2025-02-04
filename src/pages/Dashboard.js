import React from 'react';

const Dashboard = ({ setAuth }) => (
  <div>
    <h2>Dashboard</h2>
    <button onClick={() => setAuth(false)}>Logout</button>
  </div>
);

export default Dashboard;