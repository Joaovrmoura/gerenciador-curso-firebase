//---- Carregando as definições do nosso projeto no Firebase ----//
import app from "../firebase/config.js";
//---- Importando as funções associadas à autenticação (Versão 10.9.0 do Firebase) ----//
import {
  getAuth,
  signInWithEmailAndPassword,
  browserSessionPersistence,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import ViewerLogin from "../view/ViewerLogin.js";

export default class CtrlAutenticacao {
  #viewer;

  constructor() {
    this.#viewer = new ViewerLogin(this);
  }

  login(conta, senha) {
    const auth = getAuth(app);
    
    auth.setPersistence(browserSessionPersistence)
      .then(() => signInWithEmailAndPassword(auth, conta, senha))
      .then(credencial => {
        if (!credencial.user.emailVerified) {
          return alert("Verifique seu e-mail antes de fazer login");
        }
        // Redirecionar após login bem-sucedido
        window.location.href = "../index.html";
      })
      .catch(error => {
        console.error("Erro no login:", error);
        alert(`Falha no login: ${error.message}`);
      });
  }
}




document.addEventListener('DOMContentLoaded', () => {
  new CtrlAutenticacao();
});
