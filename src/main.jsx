import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import '@/i18n';
import { App as AntApp } from "antd";
import AppInitializer from "./AppInitializer";
import { store } from '@/store';
import App from '@/App.jsx';
import '@/index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AntApp>
      <AppInitializer>
        <Provider store={store}>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#1677ff',
                borderRadius: 6,
              },
            }}
          >
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </ConfigProvider>
        </Provider>
      </AppInitializer>
    </AntApp>
  </StrictMode>
);
