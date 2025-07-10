"use strict";
//---- Importando as funções associadas à autenticação (Versão 11.5.0 do Firebase) ----//
import { signOut } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import ViwerCurso from "../view/ViewerCurso.js";
import CursoDAO from '../model/DAO/CursoDAO.js';
import InstrutorDAO from '../model/DAO/InstrutorDAO.js'
import Curso from "../model/Curso.js";
import Instrutor from "../model/Instrutor.js";
import Status from "../view/Status.js";
import CursoDTO from '../model/DTO/CursoDTO.js';

export default class CtrlManterCursos {
  #viewer;
  #daoInstrutor;
  #daoCurso;
  #status;
  #posAtual;
  #usuarioLogado;

  constructor(usuario) {
    this.#usuarioLogado = usuario
    this.#viewer = new ViwerCurso(this);
    this.#daoInstrutor = new InstrutorDAO()
    this.#daoCurso = new CursoDAO()
    this.#atualizarContextoNavegacao()
    this.#posAtual = 1;
  }

  //-----------------------------------------------------------------------------------------//

  async obterInstrutoresDTO() {
    return await this.#daoInstrutor.obterInstrutores(true);
  }
  
  //-----------------------------------------------------------------------------------------//
  
  // falta implementar uma lógica melhor
  async #atualizarContextoNavegacao() {
    this.#viewer.statusEdicao(Status.NAVEGANDO); 
    // Determina ao viewer que ele está apresentando ds dado 
    this.#viewer.statusApresentacao();
    
    this.#viewer.exibirUsuario(this.#usuarioLogado.email)
    let conjCursos = await this.#daoCurso.obterCursos();

    if(conjCursos.length == 0) {

      this.#posAtual = 0;
      this.#viewer.aprensentarCursos(0, 0, [])
    }else{
      if(this.#posAtual == 0 || this.#posAtual > conjCursos.length)
        this.#posAtual = 1;
        this.#viewer.aprensentarCursos(conjCursos.length, this.#posAtual, new CursoDTO(conjCursos[this.#posAtual - 1]))
    }
  }
  
  //-----------------------------------------------------------------------------------------//
  
  iniciarAlterar() {
    this.status = Status.ALTERANDO;
    this.#viewer.statusEdicao(Status.ALTERANDO); 
    
    this.efetivar = this.incluir;
  }
  
  //-----------------------------------------------------------------------------------------//
  
  iniciarAlterar() {
    this.status = Status.ALTERANDO;
    this.#viewer.statusEdicao(Status.ALTERANDO); 
    
    this.efetivar = this.alterar;
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

  atualizarContextoNavegacao(position){
      this.#posAtual = position
  }

  iniciarAlterar(){
      this.#status = Status.ALTERANDO
      this.#viewer.statusEdicao(this.#status)
      this.efetivar = this.alterar;
  }

  iniciarIncluir(){
    this.#status = Status.INCLUINDO
    this.#viewer.statusEdicao(this.#status) 
    this.efetivar = this.incluir;
  }
  
  //-----------------------------------------------------------------------------------------//
  
  iniciarExcluir() {
    this.#status = Status.EXCLUINDO;
    this.#viewer.statusEdicao(Status.EXCLUINDO);
    this.efetivar = this.excluir;
  }

  //-----------------------------------------------------------------------------------------//


  async incluir(sigla, nome, descricao, cargaHoraria, categoria, instrutorEmail) {
    try {
      console.log(cargaHoraria);
      
      const instrutorExiste = await this.#daoInstrutor.obterInstrutorPeloEmail(instrutorEmail)
      
      if(instrutorExiste == null){
        alert('Instrutor não encontrado!')
        return;
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
      alert("Erro: " + error);
    }
  }

  //-----------------------------------------------------------------------------------------//

  async alterar(sigla, nome, descricao, cargaHoraria, categoria, instrutorEmail) {
    try {
      const instrutorExiste = await this.#daoInstrutor.obterInstrutorPeloEmail(instrutorEmail)
      
      if(instrutorExiste == null){
        alert('Instrutor não encontrado!')
          return;
      }
      const instrutor = new Instrutor(instrutorExiste.nome, instrutorExiste.email, instrutorExiste.fone)
      const cursoExiste = await this.#daoCurso.obterCursoPelaSigla(sigla)
      
      if(cursoExiste){
        const curso = new Curso(sigla, nome, descricao, cargaHoraria, categoria, instrutor)
        const cursoAlterado = await this.#daoCurso.alterar(curso)
        
        if(cursoAlterado){
          alert('Curso Alterado com sucesso!')
        }

      }else{
        alert('Curso não encontrado')
      }

      this.#atualizarContextoNavegacao()
      
    } catch (error) { 
      alert("Erro: " + error);
    }
  }

  //-----------------------------------------------------------------------------------------//

  async excluir(sigla, nome, descricao, cargaHoraria, categoria, instrutorEmail) {
    try {
      console.log('excluindo... ' + sigla, instrutorEmail);
      
      const instrutorExiste = await this.#daoInstrutor.obterInstrutorPeloEmail(instrutorEmail)
      
      if(instrutorExiste == null){
        alert('Instrutor não encontrado!')
        return;
      }
      const instrutor = new Instrutor(instrutorExiste.nome, instrutorExiste.email, instrutorExiste.fone)
      const cursoExiste = await this.#daoCurso.obterCursoPelaSigla(sigla)
      
      if(cursoExiste){
        const curso = new Curso(sigla, nome, descricao, cargaHoraria, categoria, instrutor)
        const cursoExcluido = await this.#daoCurso.excluir(curso)
        
        if(cursoExcluido){
          alert('Curso Excluido com sucesso!')
          this.#atualizarContextoNavegacao()
        }
      }else{
        alert('Este curso a não existe!')
      }
     
      
    } catch (error) { 
      alert("Erro: " + error);
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

  cancelar() {
    this.#atualizarContextoNavegacao();
  }

}
