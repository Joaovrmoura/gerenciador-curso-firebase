"use strict";
//---- Importando as funções associadas à autenticação (Versão 11.5.0 do Firebase) ----//
import { signOut } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import ViewerCurso from "../viewer/ViewerCurso.js";
import CursoDAO from '../model/DAO/CursoDAO.js';
import InstrutorDAO from '../model/DAO/InstrutorDAO.js'
import Curso from "../model/Curso.js";
import Instrutor from "../model/Instrutor.js";
import Status from "../viewer/Status.js";
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
    this.#viewer = new ViewerCurso(this);
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
    // Determina ao viewer que ele está apresentando ds dado 
    this.#viewer.statusApresentacao();
    
    this.#viewer.exibirUsuario(this.#usuarioLogado.email)
    let conjCursos = await this.#daoCurso.obterCursos();
    
    if(conjCursos.length == 0) {
      
      this.#viewer.renderizarCursos(null)
      this.#posAtual = 0;
      this.#viewer.apresentarCursos(0, 0, null)
    }else{
      if(this.#posAtual == 0 || this.#posAtual > conjCursos.length)
        this.#posAtual = 1;
        this.#viewer.renderizarCursos(conjCursos)
        this.#viewer.apresentarCursos(conjCursos.length, this.#posAtual, new CursoDTO(conjCursos[this.#posAtual - 1]))
    }
  }
  
  //-----------------------------------------------------------------------------------------//
  
  async apresentarProximo(){
    let conjCursos = await this.#daoCurso.obterCursos()
    if(this.#posAtual < conjCursos.length) this.#posAtual++ 
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

  iniciarIncluir(){
    this.#status = Status.INCLUINDO
    this.#viewer.statusEdicao(this.#status) 

    this.efetivar = this.incluir;
  }
  
  //-----------------------------------------------------------------------------------------//
  
  iniciarAlterar() {
    this.#status = Status.ALTERANDO;
    this.#viewer.statusEdicao(Status.ALTERANDO); 
    
    this.efetivar = this.alterar;
  }
  
  //-----------------------------------------------------------------------------------------//

  
  iniciarExcluir() {
    this.#status = Status.EXCLUINDO;
    this.#viewer.statusEdicao(Status.EXCLUINDO);

    this.efetivar = this.excluir;
  }

  //-----------------------------------------------------------------------------------------//


  async incluir(sigla, nome, descricao, cargaHoraria, categoria, instrutorEmail) {

    if(this.#status == Status.INCLUINDO){
      try {
        const instrutorExiste = await this.#daoInstrutor.obterInstrutorPeloEmail(instrutorEmail)
        
        if(instrutorExiste == null){
          alert('Instrutor não encontrado!')
          return;
        }
        const instrutor = new Instrutor(instrutorExiste.nome, instrutorExiste.email, instrutorExiste.fone)
        const cursoExiste = await this.#daoCurso.obterCursoPelaSigla(sigla)
        
        if(!cursoExiste){
          const curso = new Curso(sigla, nome, descricao, cargaHoraria, categoria, instrutor)
          const cursoAdicionado = await this.#daoCurso.incluir(curso)
          
          if(cursoAdicionado){
            alert('Curso criado com sucesso!')
            this.#atualizarContextoNavegacao()
          }else {
            alert('Falha ao criar o curso!');
          }

        }else{
          alert('Curso com a sigla ' + sigla + ' já existe! ')
        }
        
      } catch (error) { 
        alert("Erro: " + error);
      }

    }
  }

  //-----------------------------------------------------------------------------------------//

  async alterar(sigla, nome, descricao, cargaHoraria, categoria, instrutorEmail) {
    if(this.#status == Status.ALTERANDO){
      try {
        const instrutorExiste = await this.#daoInstrutor.obterInstrutorPeloEmail(instrutorEmail)
        
        if(instrutorExiste == null){
          alert('Instrutor não encontrado!')
            return;
        }
        const instrutor = new Instrutor(instrutorExiste.nome, instrutorExiste.email, instrutorExiste.fone)
        const curso = await this.#daoCurso.obterCursoPelaSigla(sigla)
        
        if(curso){
          curso.setNome(nome)
          curso.setDescricao(descricao)
          curso.setCargaHoraria(cargaHoraria)
          curso.setCategoria(categoria)
          curso.setInstrutor(instrutor)
          
          const cursoAlterado = await this.#daoCurso.alterar(curso)
          
        if(cursoAlterado === true){
          alert('Curso alterado com sucesso!');
        } else {
          alert('Falha ao alterar o curso!');
        }
          
        }else{
          alert('Curso não encontrado')
        }
  
        this.#atualizarContextoNavegacao()
        
      } catch (error) { 
        alert("Erro: " + error);
      } 
    }
  }

  //-----------------------------------------------------------------------------------------//

  async excluir(sigla) {
    if(this.#status == Status.EXCLUINDO){
      try {
        const curso = await this.#daoCurso.obterCursoPelaSigla(sigla)
      
        if(curso){
          const cursoExcluido = await this.#daoCurso.excluir(curso)
          if(cursoExcluido){
            alert('Curso Excluido com sucesso!')
          }
        }else{
          alert('Este curso não existe!')
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
