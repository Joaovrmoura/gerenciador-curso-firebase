//---- Carregando as definições do nosso projeto no Firebase ----//
import app from "../firebase/config.js";
//---- Importando as funções associadas à autenticação (Versão 10.9.0 do Firebase) ----//
import {
  getAuth,
  signInWithEmailAndPassword,
  browserSessionPersistence,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import DaoUsuario from "../model/DAO/UsuarioDAO.js";
import ViewerEfetuarLogin from "../viewer/ViewerLogin.js";

export default class CtrlEfetuarLogin {
  //
  // Atributos do Controlador
  //
  #auth;
  #viewer;   // Referência para o gerenciador do viewer 
  
  constructor() {
    // Obtendo o objeto que controla o serviço de autenticação do Projeto no Firebase
    this.#auth = getAuth(app);
    this.#viewer = new ViewerEfetuarLogin(this);
  }
  
  //----------------------------------------------------------------------//

  efetuarLogin(conta, senha) {
    // Recuperando o objeto gerenciador de autenticação do Firebase
    this.#auth.setPersistence(browserSessionPersistence);

    // Recuperando as credenciais do usuário (retorna uma Promise)
    signInWithEmailAndPassword(this.#auth, conta, senha)
      // Se a Promise foi "resolved", então a função vinculada ao método then começa a ser executada
      .then(async (credencial) => {
        // Conta e senha estão ok segundo o Firebase
        let usr = credencial.user;
        console.log("Usuário Autenticado: ", usr);

        // Verificando se o usuário já verificou o seu email. Se não, não continuo o processo de autenticação
        if (!usr.emailVerified) {
          this.#viewer.mostrarMenssagem("Email não verificado. Veja sua caixa e confirme sua conta.")
          return;
        }
      
        // Com o usuário autenticado, vou verificar qual é o perfil dele
        let daoUsuario = new DaoUsuario();
        let objUsuario = await daoUsuario.obterUsuarioPeloUID(usr.uid); 
      
        if(objUsuario.getFuncao() == 'ALUNO') {
          // O usuário está com a conta verificada e redireciona para a página inicio.html
          window.location.href = "../docs/initAluno.html";
        } else if(objUsuario.getFuncao() == 'ADMIN') {
          // O usuário está com a conta verificada e redireciona para a página inicio.html
          window.location.href = "../docs/initAdmin.html";

        }else if(objUsuario.getFuncao() == 'INSTRUTOR'){
            console.log(objUsuario.getFuncao());
           window.location.href = "../docs/initInstrutor.html";
        }
    })
    // Se a Promise foi "rejected", então a função vinculada ao método 'catch' começa a ser executada
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      // alert("Erro: " + errorCode + "-" + errorMessage);
      console.log("#------->" + errorMessage + " " + errorCode);
       this.#viewer.mostrarMenssagem(errorCode)
    });
  }

  //----------------------------------------------------------------------//

  irParaCriarConta() {
    window.location.href = "docs/novaconta.html";
  }
}

//----------------------------------------------------------------------//

new CtrlEfetuarLogin();

//
// O código abaixo está relacionado com o deploy do Service Worker. Isso permite que nossa 
// aplicação se torne um App para Dispositivos Mobile
//
/* if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js', {scope: '/'})
  .then(function(reg) {
    // registration worked
    console.log('Registro do Service Worker bem sucedido. O escopo de uso é ' + reg.scope);
  }).catch(function(error) {
    // registration failed
    console.log('Registro do Service Worker com ' + error);
  });
}
*/