import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from "@/components/theme-provider"
import { LoginProvider } from './service/LoginContext.tsx'
import { ClientUIProvider } from './service/ClientUIContext.tsx';
import { SocketProvider } from './service/SocketContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <SocketProvider>
      <LoginProvider>
        <ClientUIProvider>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <App />
          </ThemeProvider>
        </ClientUIProvider>
      </LoginProvider>
    </SocketProvider>
  </BrowserRouter>
)
