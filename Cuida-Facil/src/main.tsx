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
import ContactPage from './routes/Contanto/index.tsx';

const router = createBrowserRouter([
  {path:"/",element:<App/>,errorElement:<Error/>,children:[
    {path:"/",element:<Home/>},
    {path:"/especialidades",element:<Especialidades/>},
    {path:"/unidades",element:<Unidades/>},
    {path:"/consulta",element:<Consulta/>},
    {path:"/integrantes",element:<Integrantes/>},
    {path:"/faq",element:<FaqPage/>},
    {path:"/ajuda",element:<AjudaPage/>},
    {path:"/contato",element:<ContactPage/>}
  ]}
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)