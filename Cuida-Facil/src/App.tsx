import { Outlet } from "react-router-dom";
import Rodape from "./components/Rodape/Rodape";
import PainelAcessibilidade from "./components/Acessiblidade/PainelAcessibilidade";
import { NotificationProvider } from "./components/Notificacao/NotificationContainer";
import { useConsultaNotification } from './hooks/useConsultaNotification';

function NotificationWrapper({ children }: { children: React.ReactNode }) {

  useConsultaNotification();
  
  return <>{children}</>;
}

export default function App(){
  return(
    <div className="app-container">
       <NotificationProvider>
        <Outlet/>
        <Rodape/>
        <PainelAcessibilidade />
      </NotificationProvider>
    </div>
  );
}