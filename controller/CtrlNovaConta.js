import app from "../firebase/config.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  // RecaptchaVerifier,
  sendEmailVerification,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import Usuario from "../model/Usuario.js";
import Aluno from "../model/Aluno.js";
import DaoUsuario from "../model/DAO/UsuarioDAO.js";
import DaoAluno from "../model/DAO/AlunoDAO.js";
import ViewerCriarNovaConta from "../viewer/ViewerCriarNovaConta.js";
import Instrutor from "../model/Instrutor.js";
import InstrutorDAO from "../model/DAO/InstrutorDAO.js";

export default class CtrlCriarNovaConta {
  #auth;
  #viewer;

  constructor() {
    this.#auth = getAuth(app);
    this.#viewer = new ViewerCriarNovaConta(this);
    
  }

  getAuth() {
    return this.#auth;
  }

  async criarNovaConta(nome, conta, senha, telefone, funcao) {
    createUserWithEmailAndPassword(this.#auth, conta, senha)
      .then(async credencial => {
        let user = credencial.user;

        await sendEmailVerification(user);
        alert(
          "Conta criada. Verifique sua caixa de email para confirmação da conta"
        );

        let novoUsuario = new Usuario(conta, user.uid, funcao);
        let daoUsuario = new DaoUsuario();
        await daoUsuario.incluir(novoUsuario);

        console.log(novoUsuario, funcao);
        
        if (funcao == "ALUNO") {
          let novoAluno = new Aluno(nome, conta, telefone);
          console.log(novoAluno);
          let daoAluno = new DaoAluno();
          await daoAluno.incluir(novoAluno, user.uid);

        } else if (funcao == "INSTRUTOR") {
          let novoInstrutor = new Instrutor(nome, conta, telefone);
          let daoInstrutor = new InstrutorDAO();
          await daoInstrutor.incluir(novoInstrutor, user.uid);
          
        }

        this.#viewer.voltar();

      })
      .catch(error => {
        let errorCode = error.code;
        let errorMessage = error.message;
        alert("Erro na criação da conta: " + errorCode + " - " + errorMessage);
      });
  }

  cancelar() {
    this.#viewer.voltar();
  }
}

new CtrlCriarNovaConta();
