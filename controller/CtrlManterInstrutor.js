"use strict";
import {
  signOut
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import ViewerInstrutor from "../viewer/ViewerInstrutor.js";
import CursoDAO from '../model/DAO/CursoDAO.js';
import InstrutorDAO from '../model/DAO/InstrutorDAO.js'
import Curso from "../model/Curso.js";
import Instrutor from "../model/Instrutor.js";
import Status from "../viewer/Status.js";
import CursoDTO from '../model/DTO/CursoDTO.js';
import Aula from "../model/Aula.js";
import AulaDAO from "../model/DAO/AulaDAO.js";

export default class CtrlManterInstrutores {
  #auth;
  #viewer;
  #daoInstrutor;
  #daoCurso;
  #daoAula;
  #status;
  #posAtualCurso;
  #posAtualAulas;
  #usuarioLogado;

  constructor(usuario) {
    this.#usuarioLogado = usuario
    this.#viewer = new ViewerInstrutor(this);
    this.#daoInstrutor = new InstrutorDAO()
    this.#daoCurso = new CursoDAO()
    this.#daoAula = new AulaDAO()
    this.#posAtualCurso = 1; 
    this.#posAtualAulas = 1;
    this.#atualizarContextoNavegacao()
  }

  //-----------------------------------------------------------------------------------------//

  getAuth() {
    return this.#auth;
  }

  //-----------------------------------------------------------------------------------------//

  async #atualizarContextoNavegacao() {

    this.#viewer.statusEdicao(Status.NAVEGANDO)
    this.#viewer.statusApresentacao()

    const conjCursos = await this.#daoCurso.obterTodosCursosDoInstrutor(this.#usuarioLogado.uid)
    this.#viewer.exibirUsuario(this.#usuarioLogado.email)  
    
    if(!conjCursos || conjCursos.length == 0){
      this.#posAtualCurso = 0;
      this.#viewer.renderizarCursos(null)

      this.#viewer.apresentarCursos(null)
      this.#apresentarAulasDoCurso(null)
    }else{
      if(this.#posAtualCurso == 0 || this.#posAtualCurso > conjCursos.length)
        this.#posAtualCurso = 1;
        
        this.#viewer.renderizarCursos(conjCursos)
        this.#apresentarAulasDoCurso(conjCursos[this.#posAtualCurso - 1].getSigla())
        this.#viewer.apresentarCursos(conjCursos.length, this.#posAtualCurso, new CursoDTO(conjCursos[this.#posAtualCurso - 1]))
    }
  }
  
  //-----------------------------------------------------------------------------------------//

  async #apresentarAulasDoCurso(sigla) {

    if (sigla == null) {
      this.#posAtualAulas = 0;
      this.#viewer.apresentarAulas(0, 0, null);
      return;
    }
    
    const conjAulas = await  this.#daoAula.obterAulasPelaSiglaDoCurso(sigla)
    
    if (conjAulas.length == 0) {
      this.#posAtualAulas = 0;
      this.#viewer.apresentarAulas(0,0, null)
    } else {
      if (this.#posAtualAulas == 0 || this.#posAtualAulas > conjAulas.length) {
        this.#posAtualAulas = 1;
      }

      const aulaAtual = conjAulas[this.#posAtualAulas - 1]
      this.#viewer.apresentarAulas(conjAulas.length, this.#posAtualAulas, aulaAtual)
    }
  }

  // APRESENTAR  CURsOS
  //-----------------------------------------------------------------------------------------//

  async apresentarProximoCurso(){
    let conjCursos = await this.#daoCurso.obterTodosCursosDoInstrutor(this.#usuarioLogado.uid)
      if(this.#posAtualCurso < conjCursos.length) this.#posAtualCurso++ 
        this.#atualizarContextoNavegacao()  
  }

  // APRESENTAR  CURsOS
  //-----------------------------------------------------------------------------------------//
  
  async apresentarCursoAnterior(){
    if(this.#posAtualCurso > 1) this.#posAtualCurso--     
    this.#atualizarContextoNavegacao()  

  }

  // APRESENTAR  AULAS
  //-----------------------------------------------------------------------------------------//

  async apresentarProximaAula() {
    const conjCursos = await this.#daoCurso.obterTodosCursosDoInstrutor(this.#usuarioLogado.uid);

    if (conjCursos.length > 0) {
      const cursoAtual = conjCursos[this.#posAtualCurso - 1];
      const conjAulas = await this.#daoAula.obterAulasPelaSiglaDoCurso(cursoAtual.getSigla());

      if (this.#posAtualAulas < conjAulas.length) {
        this.#posAtualAulas++;
      }

      this.#apresentarAulasDoCurso(cursoAtual.getSigla());
    }
  }

  // APRESENTAR  AULAS
  //-----------------------------------------------------------------------------------------//
  
  async apresentarAulaAnterior() {
    if (this.#posAtualAulas > 1) {
      this.#posAtualAulas--;
    }
    const conjCursos = await this.#daoCurso.obterTodosCursosDoInstrutor(this.#usuarioLogado.uid);
    
    if (conjCursos.length > 0) {
      const cursoAtual = conjCursos[this.#posAtualCurso - 1];
      this.#apresentarAulasDoCurso(cursoAtual.getSigla());
    }

  }


  //-----------------------------------------------------------------------------------------//
  
  iniciarAlterar() {
    this.#status = Status.ALTERANDO;
    this.#viewer.statusEdicao(Status.ALTERANDO); 
    
    this.efetivar = this.alterar;
  }
  
  //-----------------------------------------------------------------------------------------//
  
  cancelar() {
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  iniciarIncluir(){
    this.#status = Status.INCLUINDO
    this.#viewer.statusEdicao(this.#status) 
    this.efetivar = this.incluir;
  }
  
  //-----------------------------------------------------------------------------------------//

  async incluir(conteudo, siglaCurso) {
    if(this.#status == Status.INCLUINDO){
      try { 
        const curso = await this.#daoCurso.obterCursoPelaSigla(siglaCurso)

        if(curso == null){
          alert('Curso não encontrado!')
          this.#atualizarContextoNavegacao()
          return;
        }

        const numOrdemAtual = await this.#daoAula.obterAulasPelaSiglaDoCurso(siglaCurso)
        const instrutor = await curso.getInstrutor();

        // uso o length pois as aulas começam no indice 0
        const aula = new Aula(parseInt(numOrdemAtual.length), conteudo, curso, instrutor)
        const salvarAula = await this.#daoAula.incluir(aula)
  
        if(salvarAula){
          alert("Aula salva com sucesso!")
          this.#posAtualAulas++
        }else{
          alert("Aula não foi salva!")
        }
        
        this.#atualizarContextoNavegacao()
  
      } catch (error) { 
        alert("Erro: " + error);
      }
    }
  }

  //----------------------------------------------------------------------------------------//

  async alterar(conteudo, siglaCurso) {
    if(this.#status == Status.ALTERANDO){
      try {     

        if(this.#posAtualAulas === 0){
          alert('Nenhuma aula encontrada!')
          this.#atualizarContextoNavegacao()
          return
        }
        const aula = await this.#daoAula.obterAulaPeloNumOrdem(siglaCurso, this.#posAtualAulas - 1)
        
        if(aula){
          aula.setConteudo(conteudo)
          await this.#daoAula.alterar(aula)
          alert("Aula Alterada com sucesso!")

        }else{
          alert(`Aula número ${this.#posAtualAulas} não encontrada!`);
        }

        this.#atualizarContextoNavegacao()

      } catch (error) { 
        alert("Erro: " + error);
      }
    }
    
  }

  //-------------------------------------------------------------------------------------------//

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