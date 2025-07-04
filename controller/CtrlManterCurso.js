import app from "../firebase/config.js";
//---- Importando as funções associadas à autenticação (Versão 11.5.0 do Firebase) ----//
import {
  getAuth,
  signOut,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

// import { getAuth, RecaptchaVerifier } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import ViwerCurso from "../view/ViewerCurso.js";
import CursoDAO from '../model/DAO/CursoDAO.js';
import InstrutorDAO from '../model/DAO/InstrutorDAO.js'
import Curso from "../model/Curso.js";
import DaoUsuario from "../model/DAO/UsuarioDAO.js";
import Usuario from "../model/Usuario.js";
import Instrutor from "../model/Instrutor.js";

export default class CtrlManterCursos {
  #auth;
  #viewer;
  #daoInstrutor;
  #daoCurso;
  #posAtual;

  constructor() {
    this.#auth = getAuth(app);
    this.#viewer = new ViwerCurso(this);
    this.#daoInstrutor = new InstrutorDAO()
    this.#daoCurso = new CursoDAO()
    this.#atualizarContextoNavegacao()
  }

  //-----------------------------------------------------------------------------------------//

  getAuth() {
    return this.#auth;
  }

  //-----------------------------------------------------------------------------------------//

  async obterInstrutoresDTO() {
    return await this.#daoInstrutor.obterInstrutores(true);
  }
  
  //-----------------------------------------------------------------------------------------//
  
  // falta melhorar e implementar uma lógica melhor
  async #atualizarContextoNavegacao() {
    // Determina ao viewer que ele está apresentando dos dados 
    let conjCursos = await this.#daoCurso.obterCursos();
    // Se a lista de alunos estiver vazia
    if(conjCursos.length == 0) {
      // Posição Atual igual a zero indica que não há objetos na base
      this.#posAtual = 0;
      this.#viewer.aprensentarCursos([])
    }else{
      this.#viewer.aprensentarCursos(conjCursos)
    }
  }
  
  //-----------------------------------------------------------------------------------------//
  

  async adicionarCurso(sigla, nome, descricao, cargaHoraria, categoria, instrutorEmail) {
    try {
      
      const instrutorExiste = await this.#daoInstrutor.obterInstrutorPeloEmail(instrutorEmail)
      
      if(instrutorExiste == null){
        alert('Instrutor não encontrado!')
        throw new (error)
      }
    
      const instrutor = new Instrutor(instrutorExiste.nome, instrutorExiste.email, instrutorExiste.fone)
      const cursoExiste = await this.#daoCurso.obterCursoPelaSigla(sigla)
      
      if(!cursoExiste){
        const curso = new Curso(sigla, nome, descricao, cargaHoraria, categoria, instrutor)
        const addCurso = await this.#daoCurso.incluir(curso)
        
        if(addCurso){
          alert('Curso criado com sucesso!')
          this.#atualizarContextoNavegacao()
        }
      }else{
        alert('Curso com essa sigla já existe! ')
      }
      
    } catch (error) { 
      alert("Erro: " + error.code + " - " + error.message);
    }
  }

  //-----------------------------------------------------------------------------------------//

  // Função para logout (chame quando o usuário clicar no botão logout)
  async logout() {
    try {
      await signOut(this.#auth);
      alert("Deslogado com sucesso!");
      window.location.href = "login.html"; // Redireciona para login
    } catch (error) {
      alert("Erro ao sair: " + error.message);
    }
  }
 
  //-----------------------------------------------------------------------------------------//

  cancelar() {
    this.#viewer.voltar();
  }
}
