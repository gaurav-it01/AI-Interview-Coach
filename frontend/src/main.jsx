import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css';
import App from './App.jsx';

const rawGoogleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const googleClientId = rawGoogleClientId
const app = <App />;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      {googleClientId ? (
        <GoogleOAuthProvider clientId={googleClientId}>{app}</GoogleOAuthProvider>
      ) : (
        app
      )}
    </Provider>
  </StrictMode>,
);
