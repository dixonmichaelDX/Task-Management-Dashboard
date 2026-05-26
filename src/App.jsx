import React from 'react';
import { Provider } from 'react-redux';
import store from './store';
import TaskDashboard from './components/TaskDashboard';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <TaskDashboard />
      </div>
    </Provider>
  );
}

export default App;
