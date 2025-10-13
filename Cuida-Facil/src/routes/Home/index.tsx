import Cabecalho from "../../components/Cabecalho/Cabecalho";
import CardsContainer from "../../components/Cards/CardContainter";
import Logo from "../../components/Logo/Logo";

export default function Home(){
    return(
        <main>
            <Logo/>
            <Cabecalho/>
             <CardsContainer />
        </main>
    );
}