import { useState } from 'react';
import Logo from '../../components/Logo/Logo';
import CabecalhoMenu from '../../components/Cabecalho/CabecalhoMenu';

const ContactPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  return (
    <main>
    <Logo/>
    <CabecalhoMenu/>
      <h1>Fale Conosco</h1>
      <form action="https://formsubmit.co/facilcuida@gmail.com" method="POST">
        <input 
          type="text" 
          name="name" 
          placeholder="Nome" 
          required 
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input 
          type="email" 
          name="email" 
          placeholder="E-mail" 
          required 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <textarea 
          name="message" 
          placeholder="Mensagem" 
          rows={5} 
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
        <button type="submit">Enviar</button>
      </form>
    </main>
  );
};

export default ContactPage;