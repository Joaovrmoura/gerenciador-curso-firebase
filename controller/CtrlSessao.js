"use strict";

//---- Carregando as definições do nosso projeto no Firebase ----//
import app from "../firebase/config.js";
import { getAuth, signInWithRedirect, signInWithPopup, browserSessionPersistence, GoogleAuthProvider, onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

// import CtrlManterAlunos from "/controller/CtrlManterAlunos.js";
// import CtrlManterUsuarios from "/controller/CtrlManterUsuarios.js";
// import CtrlManterCursos from "/controller/CtrlManterCursos.js";

import DaoUsuario from "../model/DAO/UsuarioDAO.js";
import Usuario from "../model/Usuario.js";
import CtrlManterCursos from "./CtrlManterCurso.js";
import CtrlManterInstrutores from "./CtrlManterInstrutor.js";
import CtrlManterAlunos from "./CtrlManterAluno.js";
const swal = new Function("json,th", "swal(json).then(th)");


export default class CtrlSessao {
  
  #daoUsuario;
  
  //-----------------------------------------------------------------------------------------//  
  constructor() {   
    this.init();
  }
  
  //-----------------------------------------------------------------------------------------//  
 
    async init() {    
    try {
      this.usuario = await this.verificandoLogin(); 
      
      // Observe abaixo que temos um problema de ACOPLAMENTO, pois se 
      // precisarmos acrescentar um novo controlador de caso de uso, precisaremos
      // abrir esse arquivo para alteração. O melhor seria implementar um 
      // mecanismo de INJEÇÃO DE DEPENDÊNCIA.     

      if(document.URL.includes("initCursos.html"))
        this.ctrlAtual = new CtrlManterCursos(this.usuario);
      
      else if(document.URL.includes("initInstrutor.html"))
        this.ctrlAtual = new CtrlManterInstrutores(this.usuario)

      else if(document.URL.includes("initAluno.html")) {
        // falta o CTRL do aluno
        // ainda to fzd
        this.ctrlAtual = new CtrlManterAlunos(this.usuario)
      }

    } catch(e) {
      alert(e);
    }
  }
  
  
  //-----------------------------------------------------------------------------------------//  

  async verificandoLogin() {
    return new Promise((resolve,reject) => {
      //const provider = new GoogleAuthProvider();
      //provider.addScope("https://www.googleapis.com/auth/userinfo.email");
      //provider.addScope("https://www.googleapis.com/auth/userinfo.profile");      
      const auth = getAuth(app);
      auth.setPersistence(browserSessionPersistence);
      onAuthStateChanged(auth, async (user) => {
        if (user) {        
          this.#daoUsuario = new DaoUsuario();
          let usrSistema = await this.#daoUsuario.obterUsuarioPeloUID(user.uid);
        
          if(usrSistema == null) {
            await this.#daoUsuario.incluir(new Usuario(user.email, user.uid));
            reject('A conta "' + user.email + '" não foi habilitada para usar este sistema');
          } else {
            if(usrSistema.getFuncao() == 'INABILITADO')
              reject('O Administrador não concedeu à conta "' + user.email + '"(' + user.uid + ') acesso ao sistema');
            resolve(user);
          }
        } else {
          reject('Você não realizou a autenticação via Google');
          window.location.href = 'login.html'
        }
      });
    });
  }
}

//------------------------------------------------------------------------//

//var ctrlUC = document.currentScript.getAttribute('ctrl'); 
new CtrlSessao();

