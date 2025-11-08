import { Outlet } from "react-router-dom";
import Rodape from "./components/Rodape/Rodape";
import PainelAcessibilidade from "./components/Acessiblidade/PainelAcessibilidade";

export default function App(){
  return(
    <div className="app-container">
      <Outlet/>
      <Rodape/>
      <PainelAcessibilidade />
    </div>
  );
}