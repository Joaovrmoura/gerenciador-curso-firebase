import ViewerError from "./ViewerError.js"
import Status from "./Status.js"

export default class ViewerInstrutor {
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

    this.btEditar = this.obterElemento('btEditar')
    this.btIncluir = this.obterElemento('btIncluir')
    this.btCancelar = this.obterElemento('btCancelar')
    this.btConfirmar = this.obterElemento('btConfirmar')
    this.divbtIniciarAcao = this.obterElemento('divbtIniciarAcao')
    this.divbtConfirmarAcao = this.obterElemento('divbtConfirmarAcao')
    this.divTotalCurso = this.obterElemento('divTotalCurso')
    this.divPaginacaoAula = this.obterElemento('divPaginacaoAula')
    this.divPerfil = this.obterElemento('divPerfil')
    this.btLogout = this.obterElemento('btLogout')
    this.divMostrarCursos = this.obterElemento('divMostrarCursos')

    this.divNavAulas = this.obterElemento('divNavAulas')
    this.divNavCursos = this.obterElemento('divNavCursos')
    // navegar pelos cursos
    this.btProximaCurso = this.obterElemento('btProximaCurso')
    this.btCursoAnterior = this.obterElemento('btCursoAnterior')
    this.divPaginacaoCurso = this.obterElemento('divPaginacaoCurso')

    this.btProximaAula = this.obterElemento('btProximaAula')
    this.btAulaAnterior = this.obterElemento('btAulaAnterior')

    this.btAulaAnterior.onclick = fnBAulaAnterior
    this.btProximaAula.onclick = fnBProximaAula

    this.btLogout.onclick = fnBLogout
    this.btCursoAnterior.onclick = fnBProximoCurso
    this.btProximaCurso.onclick = fnBCursoAnterior
    this.btIncluir.onclick = fnBIncluir
    this.btEditar.onclick = fnBAlterar
    this.btCancelar.onclick = fnBCancelar
    this.btConfirmar.onclick = fnBtOk

  }

  //------------------------------------------------------------------------//

  statusEdicao(status) {
    
    if(status === Status.EXCLUINDO){
      this.divbtIniciarAcao.classList.add('hidden')
      this.divbtConfirmarAcao.classList.remove('hidden')
      this.divNavAulas.classList.add('hidden')
      this.divNavCursos.classList.add('hidden')
    }
    
    if (status === Status.NAVEGANDO) {
        this.divbtConfirmarAcao.classList.add('hidden')
        this.divbtIniciarAcao.classList.remove('hidden')
        this.divNavAulas.classList.remove('hidden')
        this.divNavCursos.classList.remove('hidden')

    } else if (status === Status.ALTERANDO || status === Status.INCLUINDO) {
        this.tfConteudo.disabled = false;
        this.divbtIniciarAcao.classList.add('hidden')
        this.divNavAulas.classList.add('hidden')
        this.divNavCursos.classList.add('hidden')

      if (status === Status.INCLUINDO) {
        this.tfConteudo.value = ""
        this.divbtConfirmarAcao.classList.remove('hidden')
      }
      if(status == Status.ALTERANDO){
        this.divbtConfirmarAcao.classList.remove('hidden')
  
      }
    }
  }
  
  //------------------------------------------------------------------------//

  exibirUsuario(nomeUsuario){
    this.divPerfil.textContent = nomeUsuario
  }

  //------------------------------------------------------------------------//

  async apresentarCursos(qtdCursos, posicaoAtual, curso) {
    if (curso == null) {
      console.log('Nenhum curso disponível.')
      this.divTotalCurso.textContent = 0

    } else {
      this.divTotalCurso.textContent = qtdCursos
      this.divSigla.textContent = curso.getSigla()
      this.divNomeCurso.textContent = curso.getNome()
      this.divCargaHorariaCurso.textContent = curso.getCargaHoraria()
      this.divCategoria.textContent = curso.getCategoria()
      this.divDescricao.textContent = curso.getDescricao()

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

    if(qtdTotalCursos !== null){
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
  
  //------------------------------------------------------------------------// 
  
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

  async renderizarCursos(cursos){
    
    this.divMostrarCursos.innerHTML = "";

   if(cursos == null){
    this.divMostrarCursos.innerHTML = '<h1 class="text-2xl text-slate-600">Nenhum curso adicionado!</h1>';

   }else{

      for(let i = 0; i < cursos.length; i++){
        if (cursos[i].instrutor instanceof Promise) {
          cursos[i].instrutor = await cursos[i].instrutor;
        }
      }
      cursos.forEach(curso => {
        const div = document.createElement('div')
        div.innerHTML = `
        <div class="rounded-xl p-6 card-hover border border-slate-200">
            <div class="flex items-start justify-between mb-4">
                <div class="w-full h-24 bg-cyan-400 rounded-lg flex items-center justify-center">
                    <h3 class="text-xl font-semibold text-gray-900">${curso.getSigla()}</h3>
                </div>
            </div>
            <h3
                class="text-xl font-semibold text-gray-900 mb-2 max-w-md overflow-hidden text-ellipsis">
                 ${curso.getNome()}</h3>
                 
            <div class="mt-2">
                <p class="text-gray-600 text-sm leading-relaxed">
                    <span class="font-semibold text-gray-900">Desc:</span> ${curso.getDescricao()}
                </p>
                <p class="text-gray-600 text-sm leading-relaxed">
                <span class="font-semibold text-gray-900">Categoria:</span> ${curso.getCategoria()}
                </p>
                <p class="text-gray-600 text-sm leading-relaxed">
                <span class="font-semibold text-gray-900">Carga Horária:</span> ${curso.getCargaHoraria()}
                </p>
                <p class="text-gray-600 text-sm leading-relaxed">
                <span class="font-semibold text-gray-900">instrutor:</span>  ${curso.instrutor.getNome()}
                </p>
            </div>

        </div>`;
        this.divMostrarCursos.appendChild(div)
    
    })
   }
  }

  //------------------------------------------------------------------------//
  
}


// CALLBAKCS CURSOS
//------------------------------------------------------------------------//

function fnBProximoCurso() {
  this.viewer.getCtrl().apresentarProximoCurso()
}

//------------------------------------------------------------------------//

function fnBCursoAnterior() {
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
  const sigla = this.viewer.divSigla.textContent.trim()
  const conteudo = this.viewer.tfConteudo.value.trim()

  if (!sigla && sigla.length != 3) {
    alert("Sigla não pode estar vazia! Verifique se existe algum curso!");
    return;
  }

  if (!conteudo) {
    alert("Conteúdo não pode estar vazio!");
    return;
  }

  this.viewer.getCtrl().efetivar(conteudo, sigla)
}


//------------------------------------------------------------------------//

function fnBLogout() {
  this.viewer.getCtrl().logout()
}

//------------------------------------------------------------------------//