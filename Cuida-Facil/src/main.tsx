import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import "./globals.css";

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './routes/Home/index.tsx';
import Especialidades from './routes/Especialidades/index.tsx';
import Error from './routes/Error/index.tsx';
import Unidades from './routes/Unidades/index.tsx';
import Consulta from './routes/Consulta/index.tsx';
import Integrantes from './routes/Integrantes/index.tsx';
import FaqPage from './routes/Faq/index.tsx';
import AjudaPage from './routes/Ajuda/index.tsx';
import Contato from './routes/Contato/index.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import LoginPage from './routes/Login/Login.tsx';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.tsx';

const router = createBrowserRouter([
  {path:"/",element:<App/>,errorElement:<Error/>,children:[
    {path:"/",element:<Home/>},
    {path:"/especialidades",element:<Especialidades/>},
    {path:"/unidades",element:<Unidades/>},
    {path:"/consulta",element:<ProtectedRoute><Consulta/></ProtectedRoute>},
    {path:"/integrantes",element:<Integrantes/>},
    {path:"/faq",element:<FaqPage/>},
    {path:"/ajuda",element:<AjudaPage/>},
    {path:"/contato",element:<Contato/>},
    {path:"/login",element:<LoginPage/>}
  ]}
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
    <RouterProvider router={router}/>
    </AuthProvider>
  </StrictMode>,
)