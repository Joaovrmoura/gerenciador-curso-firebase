import ViewerError from "./ViewerError.js"
import Status from "./Status.js"

export default class ViwerInstrutor {
  #ctrl
  constructor(ctrl) {
    this.#ctrl = ctrl
    this.divSigla = this.obterElemento('divSigla')
    this.qtdAulas = this.obterElemento('divNumOrdem')
    this.tfConteudo = this.obterElemento('tfConteudo')
    this.divNomeCurso = this.obterElemento('divNomeCurso')
    this.divCargaHorariaCurso = this.obterElemento('divCargaHorariaCurso')
    this.divCategoria = this.obterElemento('divCategoria')
    this.divDescricao = this.obterElemento('divDescricao')

    this.btnEditar = this.obterElemento('btnEdit')
    this.btnIncluir = this.obterElemento('btnAdd')
    this.btnCancelar = this.obterElemento('btnCancel')
    this.btnConfirmar = this.obterElemento('btnConfirme')
    this.divBtnIniciarAcao = this.obterElemento('divBtnIniciarAcao')
    this.divBtnConfirmarAcao = this.obterElemento('divBtnConfirmarAcao')
    this.divTotalCurso = this.obterElemento('divTotalCurso')
    this.divPaginacaoAula = this.obterElemento('divPaginacaoAula')
    this.btPerfil = this.obterElemento('btPerfil')
    this.btLogout = this.obterElemento('btLogout')

    this.divNavAulas = this.obterElemento('divNavAulas')
    this.divNavCursos = this.obterElemento('divNavCursos')
    // navegar pelos cursos
    this.btnProximaCurso = this.obterElemento('btnProximaCurso')
    this.btnCursoAnterior = this.obterElemento('btnCursoAnterior')
    this.divPaginacaoCurso = this.obterElemento('divPaginacaoCurso')

    this.btnProximaAula = this.obterElemento('btnProximaAula')
    this.btnAulaAnterior = this.obterElemento('btnAulaAnterior')

    this.btnAulaAnterior.onclick = fnBAulaAnterior
    this.btnProximaAula.onclick = fnBProximaAula

    this.btLogout.onclick = fnBLogout
    this.btnCursoAnterior.onclick = fnBProximoCurso
    this.btnProximaCurso.onclick = fnBCuroAnterior
    this.btnIncluir.onclick = fnBIncluir
    this.btnEditar.onclick = fnBAlterar
    this.btnCancelar.onclick = fnBCancelar
    this.btnConfirmar.onclick = fnBtOk

  }

  //------------------------------------------------------------------------//

  statusEdicao(status) {
    
    if(status === Status.EXCLUINDO){
      this.divBtnIniciarAcao.classList.add('hidden')
      this.divBtnConfirmarAcao.classList.remove('hidden')
      this.divNavAulas.classList.add('hidden')
      this.divNavCursos.classList.add('hidden')
    }
    
    if (status === Status.NAVEGANDO) {
        this.divBtnConfirmarAcao.classList.add('hidden')
        this.divBtnIniciarAcao.classList.remove('hidden')
        this.divNavAulas.classList.remove('hidden')
        this.divNavCursos.classList.remove('hidden')

    } else if (status === Status.ALTERANDO || status === Status.INCLUINDO) {
        this.tfConteudo.disabled = false;
        this.divBtnIniciarAcao.classList.add('hidden')
        this.divNavAulas.classList.add('hidden')
        this.divNavCursos.classList.add('hidden')

      if (status === Status.INCLUINDO) {
        this.tfConteudo.value = ""
        this.divBtnConfirmarAcao.classList.remove('hidden')
      }
      if(status == Status.ALTERANDO){
        this.divBtnConfirmarAcao.classList.remove('hidden')
  
      }
    }
  }
  
  //------------------------------------------------------------------------//

  exibirUsuario(nomeUsuario){
    this.btPerfil.textContent = nomeUsuario
  }

  //------------------------------------------------------------------------//

  async aprensentarCursos(qtdCursos, posicaoAtual, curso) {
    if (!curso) {
      console.log('Nenhum curso disponível.')
      this.divTotalCurso.textContent = 0
    } else {
      this.divTotalCurso.textContent = qtdCursos
      this.divSigla.textContent = curso.getSigla()
      this.divNomeCurso.textContent = curso.getNome()
      this.divCargaHorariaCurso.textContent = curso.getCargaHoraria()
      this.divCategoria.textContent = curso.getCategoria()
      this.divDescricao.textContent = curso.getDescricao()
      if (curso.getInstrutor() instanceof Promise) {
       curso.instrutor = await curso.getInstrutor();
      }

    }
    this.atualizarPaginacao(qtdCursos, posicaoAtual)
   
  }

  //------------------------------------------------------------------------//  

  async apresentarAulas(qtdAulas, posicaoAtual, aula){
    this.tfConteudo.value = ""
    
    if(qtdAulas){  
      this.qtdAulas.textContent = qtdAulas
      this.tfConteudo.value = aula.conteudo
      this.divPaginacaoAula.textContent = `${posicaoAtual} / ${qtdAulas}`
    }else{
      this.qtdAulas.textContent = 0
      this.divPaginacaoAula.textContent = `${0} / ${0}`
    }
  }

  //------------------------------------------------------------------------//
  
  atualizarPaginacao(qtdTotalCursos, posicaoAtual) {
    this.divPaginacaoCurso.textContent = ''
    const div = document.createElement('div')

    if(qtdTotalCursos.lenght > 0){
      div.innerHTML = `${posicaoAtual} / ${qtdTotalCursos}`
    }else{
        div.innerHTML = `0 / 0`
    }
    this.divPaginacaoCurso.appendChild(div)
  }

  //------------------------------------------------------------------------// 

  statusApresentacao() {
    this.tfConteudo.disabled = true;
  }


  
  getCtrl() {
    return this.#ctrl
  }
  
  //------------------------------------------------------------------------//

  obterElemento(idElemento) {
    let elemento = document.getElementById(idElemento);
    if (elemento == null)
      // Se elemento é null, é porque eu escrevi o 'id' erroneamente
      throw new ViewerError(
        "Não encontrei um elemento com id '" + idElemento + "'"
      );

    elemento.viewer = this;
    return elemento;
  }

  //------------------------------------------------------------------------//
  
}


// CALLBAKCS CURSOS
//------------------------------------------------------------------------//

function fnBProximoCurso() {
  this.viewer.getCtrl().apresentarProximoCurso()
}

//------------------------------------------------------------------------//

function fnBCuroAnterior() {
  this.viewer.getCtrl().apresentarCursoAnterior()
}


// CALLBAKCS AULAS
//------------------------------------------------------------------------//
function fnBProximaAula() {
  this.viewer.getCtrl().apresentarProximaAula()
}

//------------------------------------------------------------------------//

function fnBAulaAnterior() {
  this.viewer.getCtrl().apresentarAulaAnterior()
}

//------------------------------------------------------------------------//

function fnBIncluir() {
  this.viewer.getCtrl().iniciarIncluir()
}

//------------------------------------------------------------------------//

function fnBAlterar() {
  this.viewer.getCtrl().iniciarAlterar()
}


function fnBCancelar() {
  this.viewer.getCtrl().cancelar()
}

//------------------------------------------------------------------------//

function fnBtOk() {
  const sigla = this.viewer.divSigla.textContent
  const conteudo = this.viewer.tfConteudo.value
  
  this.viewer.getCtrl().efetivar(conteudo, sigla)
}


//------------------------------------------------------------------------//

function fnBLogout() {
  this.viewer.getCtrl().logout()
}

//------------------------------------------------------------------------//