import ViewerError from "./ViewerError.js"
import Status from "./Status.js"

export default class ViewerAluno  {
  #ctrl
  constructor(ctrl) {
    this.#ctrl = ctrl

    this.divPerfil = this.obterElemento('divPerfil')
    this.btLogout = this.obterElemento('btLogout')

    this.divMostrarCursos = this.obterElemento('divMostrarCursos')
    this.paginacao = this.obterElemento('divPaginacao')

    this.tfSigla = this.obterElemento('tfSigla')
    this.tfNome = this.obterElemento('tfNome')
    this.tfDescricao = this.obterElemento('tfDescricao')
    this.tfCargaHoraria = this.obterElemento('tfCargaHoraria')
    this.tfCategoria = this.obterElemento('tfCategoria')

    this.btAnterior = this.obterElemento('btAnterior')
    this.btProximo = this.obterElemento('btProximo')
    this.btLogout.onclick = fnBLogout
    this.btProximo.onclick = avancarPaginacao
    this.btAnterior.onclick = voltarPaginacao
  }

  //------------------------------------------------------------------------//

  statusEdicao(status) {
    if (status === Status.EXCLUINDO) {
      // lógica específica se precisar
    }

    if (status === Status.NAVEGANDO) {
  
    } else if (status === Status.ALTERANDO || status === Status.INCLUINDO) {


      if (status === Status.INCLUINDO) {
        this.limparCampos()
      }
      if(status === Status.ALTERANDO){
  
      }
    }
  }

  //------------------------------------------------------------------------//

  exibirUsuario(nomeUsuario){
    this.divPerfil.textContent = nomeUsuario
  }

  //------------------------------------------------------------------------//
  

  atualizarPaginacao(qtdTotalCursos, posicaoAtual) {
    this.paginacao.textContent = ''
    const div = document.createElement('div')

    if(qtdTotalCursos > 0){
      div.innerHTML = `${posicaoAtual} de ${qtdTotalCursos}`
    }else{
      div.innerHTML = 'Nenhum curso Adicionado'
    }
    this.paginacao.appendChild(div)
  }

  //------------------------------------------------------------------------//

  limparCampos() {
    this.tfSigla.textContent = ""
    this.tfNome.textContent = ""
    this.tfDescricao.textContent = ""
    this.tfCargaHoraria.textContent = ""
    this.tfCategoria.textContent = ""
    if (this.cbInstrutor) this.cbInstrutor.textContent = ""
  }

  //------------------------------------------------------------------------//

  async apresentarCursos(qtdCursos, posicaoAtual, curso) {
    console.log(curso.getCargaHoraria(), curso.getCategoria());
    
    if (curso == null) {
      console.log('Nenhum curso disponível.')
      this.divTotalCurso.textContent = 0
      this.limparCampos()
      this.divNumerarCurso.textContent = 0

    } else {

      // this.tfSigla.textContent = curso.getSigla()
      this.tfNome.textContent = curso.getNome()
      this.tfDescricao.textContent = curso.getDescricao()
      this.tfCargaHoraria.textContent = curso.getCargaHoraria()
      this.tfCategoria.textContent = curso.getCategoria()
      this.atualizarPaginacao(qtdCursos, posicaoAtual)
    }

  }

  //------------------------------------------------------------------------//

  async renderizarCursos(cursos){

    this.divMostrarCursos.innerHTML = "";

    if(cursos == null){
      this.divMostrarCursos.innerHTML = '<h1 class="text-2xl text-slate-900">Nenhum curso adicionado!</h1>';
    } else {
      cursos.forEach(curso => {
        const div = document.createElement('div')
        div.innerHTML = `
          <div class="rounded-xl card-hover border border-slate-200 overflow-hidden">
            <div class="flex items-start justify-between mb-4">
                <div class="w-full h-24 bg-cyan-400 flex items-center justify-center">
                    <h3 class="text-xl font-semibold text-gray-900">${curso.getSigla()}</h3>
                </div>
            </div>
 
            <div class="mt-2 px-3">
              <h3 class="text-xl font-semibold text-gray-900 mb-2 max-w-md overflow-hidden text-ellipsis">
                ${curso.getNome()}</h3>
              <p class="text-gray-600 text-sm leading-relaxed">
                <span class="font-semibold text-gray-900">Descrição:</span> ${curso.getDescricao()}</p>
              <p class="text-gray-600 text-sm leading-relaxed">
                <span class="font-semibold text-gray-900">Categoria:</span> ${curso.getCategoria()}
              </p>
              <p class="text-gray-600 text-sm leading-relaxed">
                <span class="font-semibold text-gray-900">Carga Horária:</span> ${curso.getCargaHoraria()}
              </p>

              <button class="py-1 px-2 mt-5 bg-black rounded-md text-white mb-5">Inscrever-se</button>

             </div>
          </div>`;
        this.divMostrarCursos.appendChild(div)
      })
    }
  }

  //------------------------------------------------------------------------//

  getCtrl() {
    return this.#ctrl
  }

  //------------------------------------------------------------------------//

  obterElemento(idElemento) {
    let elemento = document.getElementById(idElemento);
    if (elemento == null)
      throw new ViewerError(
        "Não encontrei um elemento com id '" + idElemento + "'"
      );

    elemento.viewer = this;
    return elemento;
  }
}



// CALLBAKCS
//------------------------------------------------------------------------//

function avancarPaginacao() {
  this.viewer.getCtrl().apresentarProximo()
}

//------------------------------------------------------------------------//

function voltarPaginacao() {
  this.viewer.getCtrl().apresentarAnterior()
}

//------------------------------------------------------------------------//

function fnBIncluir() {
  this.viewer.getCtrl().iniciarIncluir()
}

//------------------------------------------------------------------------//

function fnBAlterar() {
  this.viewer.getCtrl().iniciarAlterar()
}

//------------------------------------------------------------------------//

function fnBExcluir() {
  this.viewer.getCtrl().iniciarExcluir();
}

//------------------------------------------------------------------------//

function fnBCancelar() {
  this.viewer.getCtrl().cancelar()
}

//------------------------------------------------------------------------//

function fnBtOk() {
  const sigla = this.viewer.tfSigla.value
  const nome = this.viewer.tfNome.value
  const descricao = this.viewer.tfDescricao.value
  const carga = parseInt(this.viewer.tfCargaHoraria.value)
  const categoria = this.viewer.tfCategoria.value
  const instrutor = this.viewer.cbInstrutor.value
  
  this.viewer.getCtrl().efetivar(sigla, nome, descricao, carga, categoria, instrutor)
}

//------------------------------------------------------------------------//

function fnBLogout() {
  this.viewer.getCtrl().logout()
}

//------------------------------------------------------------------------//