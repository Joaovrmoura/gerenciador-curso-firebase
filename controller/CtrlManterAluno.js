"use strict";
//---- Importando as funções associadas à autenticação (Versão 11.5.0 do Firebase) ----//
import { signOut } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import ViewerAluno from "../viewer/ViewerAluno.js";
import CursoDAO from '../model/DAO/CursoDAO.js';
import InstrutorDAO from '../model/DAO/InstrutorDAO.js'
import Status from "../viewer/Status.js";
import CursoDTO from '../model/DTO/CursoDTO.js';

export default class CtrlManterAlunos {
  #viewer;
  #daoInstrutor;
  #daoCurso;
  #status;
  #posAtual;
  #usuarioLogado;

  constructor(usuario) {
    this.#usuarioLogado = usuario
    this.#viewer = new ViewerAluno(this);
    this.#daoInstrutor = new InstrutorDAO()
    this.#daoCurso = new CursoDAO()
    this.#posAtual = 1;
    this.#atualizarContextoNavegacao()
  }

  //-----------------------------------------------------------------------------------------//

  async obterInstrutoresDTO() {
    return await this.#daoInstrutor.obterInstrutores(true);
  }
  
  //-----------------------------------------------------------------------------------------//
  
  // falta implementar uma lógica melhor
  async #atualizarContextoNavegacao() {
    this.#viewer.statusEdicao(Status.NAVEGANDO); 
    
    this.#viewer.exibirUsuario(this.#usuarioLogado.email)
    let conjCursos = await this.#daoCurso.obterCursos();
    console.log(conjCursos);
    
    if(conjCursos.length == 0) {
      
      this.#viewer.renderizarCursos(null)
      this.#posAtual = 0;
      // this.#viewer.apresentarCursos(0, 0, null)
    }else{
      if(this.#posAtual == 0 || this.#posAtual > conjCursos.length)
        this.#posAtual = 1;
        this.#viewer.renderizarCursos(conjCursos)
        this.#viewer.apresentarCursos(conjCursos.length, this.#posAtual, new CursoDTO(conjCursos[this.#posAtual - 1]))
    }
  }
  
  //-----------------------------------------------------------------------------------------//
  
  async apresentarProximo(){
    let conjAlunos = await this.#daoCurso.obterCursos()
    if(this.#posAtual < conjAlunos.length) this.#posAtual++ 
    this.#atualizarContextoNavegacao()  
  }
  
  //-----------------------------------------------------------------------------------------//
  
  async apresentarAnterior(){
      if(this.#posAtual > 1) this.#posAtual--     
      this.#atualizarContextoNavegacao()  
  }

  
  //-----------------------------------------------------------------------------------------//
  
  cancelar() {
    this.#atualizarContextoNavegacao();
  }
  
  //-----------------------------------------------------------------------------------------//

  async logout() {
    try {
      await signOut(this.#usuarioLogado.auth);
      alert("Deslogado com sucesso!");
      window.location.href = "login.html"; 
    } catch (error) {
      alert("Erro ao sair: " + error);
    }
  }
 
  //-----------------------------------------------------------------------------------------//

}

