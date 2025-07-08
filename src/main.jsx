
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css';
import './index.css'
import App from './App.jsx'

import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux';
import store, { persistor } from './redux/store'; 
import { PersistGate } from 'redux-persist/integration/react';

if (import.meta.env.DEV) {
  const cleared = localStorage.getItem('persistCleared');
  if (!cleared) {
    localStorage.clear();
    localStorage.setItem('persistCleared', 'true');
    console.log(' Cleared Redux persist on first dev load');
  }
}

createRoot(document.getElementById('root')).render(
 
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider> 
);