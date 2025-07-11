import ViewerError from "./ViewerError.js"
import Status from "./Status.js"

export default class ViewerCurso  {
  #ctrl
  constructor(ctrl) {
    this.#ctrl = ctrl

    this.btEditar = this.obterElemento('btEditar')
    this.btExcluir = this.obterElemento('btExcluir')
    this.btIncluir = this.obterElemento('btIncluir')
    this.btCancelar = this.obterElemento('btCancelar')
    this.btConfirmar = this.obterElemento('btConfirmar')
    this.divIniciarAcao = this.obterElemento('divIniciarAcao')
    this.divConfirmarAcao = this.obterElemento('divConfirmarAcao')
    this.divTotalInstrutores = this.obterElemento('divTotalInstrutores')
    this.divTotalCurso = this.obterElemento('divTotalCurso')
    this.divNumerarCurso = this.obterElemento('divNumerarCurso')
    this.divPerfil = this.obterElemento('divPerfil')
    this.btLogout = this.obterElemento('btLogout')
    this.divDialogo = this.obterElemento('divDialogo')

    this.divNavegacao = this.obterElemento('divNavegacao')
    this.btAnterior = this.obterElemento('btAnterior')
    this.btProximo = this.obterElemento('btProximo')
    this.divCbInstrutor = this.obterElemento('divCbInstrutor')
    this.divMostrarCursos = this.obterElemento('divMostrarCursos')
    this.paginacao = this.obterElemento('divPaginacao')

    this.tfSigla = this.obterElemento('tfSigla')
    this.tfNome = this.obterElemento('tfNome')
    this.tfDescricao = this.obterElemento('tfDescricao')
    this.tfCargaHoraria = this.obterElemento('tfCargaHoraria')
    this.tfCategoria = this.obterElemento('tfCategoria')
    this.cbInstrutor = this.obterElemento('cbInstrutor')

    this.btLogout.onclick = fnBLogout
    this.btProximo.onclick = avancarPaginacao
    this.btAnterior.onclick = voltarPaginacao
    this.btIncluir.onclick = fnBIncluir
    this.btEditar.onclick = fnBAlterar
    this.btExcluir.onclick = fnBExcluir
    this.btCancelar.onclick = fnBCancelar
    this.btConfirmar.onclick = fnBtOk

  }

  //------------------------------------------------------------------------//

  async #montarCbInstrutores(instrutorAtual) {
    while (this.cbInstrutor.length > 0) {
      this.cbInstrutor.remove(0);
    }

    const opcaoInicial = document.createElement("option");
    opcaoInicial.text = instrutorAtual;
    opcaoInicial.disabled = true;
    opcaoInicial.selected = true;
    opcaoInicial.hidden = true;
    this.cbInstrutor.add(opcaoInicial);

    let listarInstrutoresDTO = await this.#ctrl.obterInstrutoresDTO();
    this.divTotalInstrutores.textContent = listarInstrutoresDTO.length ?? 0
    
    for (let i = 0; i < listarInstrutoresDTO.length; i++) {
      let opt = document.createElement("option");
      opt.value = listarInstrutoresDTO[i].getEmail();
      opt.text = listarInstrutoresDTO[i].getEmail();
      this.cbInstrutor.add(opt);
    }
  }


  //------------------------------------------------------------------------//

  atualizarPaginacao(qtdTotalCursos, posicaoAtual) {
    this.paginacao.textContent = ''
    const div = document.createElement('div')

    if(qtdTotalCursos > 0){
      div.innerHTML = `${posicaoAtual} de ${qtdTotalCursos}`
      this.divNumerarCurso.textContent = `Curso #${posicaoAtual}`
    }else{
      div.innerHTML = 'Nenhum curso Adicionado'
    }
    this.paginacao.appendChild(div)
  }

  //------------------------------------------------------------------------//


  statusEdicao(status) {
    
    if(status === Status.EXCLUINDO){
      this.divDialogo.classList.remove('hidden')
      this.divIniciarAcao.classList.add('hidden')
      this.divNavegacao.classList.add('hidden')
      this.divConfirmarAcao.classList.remove('hidden')
    }
    
    if (status === Status.NAVEGANDO) {
      this.desabilitarInputs(true)
      this.divDialogo.classList.add('hidden')
      this.divIniciarAcao.classList.remove('hidden')
      this.divNavegacao.classList.remove('hidden')
      this.divConfirmarAcao.classList.add('hidden')

    } else if (status === Status.ALTERANDO || status === Status.INCLUINDO) {
      this.desabilitarInputs(false)
      this.divIniciarAcao.classList.add('hidden')
      this.divNavegacao.classList.add('hidden')
      this.divConfirmarAcao.classList.remove('hidden')
      this.divCbInstrutor.classList.add('hidden')
      
      if (status === Status.INCLUINDO) {
        this.limparCampos()
        this.divCbInstrutor.classList.remove('hidden')
      }
      if(status == Status.ALTERANDO){
        this.tfSigla.disabled = true
        this.divCbInstrutor.classList.remove('hidden')
      }
    }
  }

  //------------------------------------------------------------------------//

  exibirUsuario(nomeUsuario){
    this.divPerfil.textContent = nomeUsuario
  }
  
  //------------------------------------------------------------------------//

  desabilitarInputs(habilitar) {
    [
      this.tfSigla,
      this.tfNome,
      this.tfDescricao,
      this.tfCargaHoraria,
      this.tfCategoria,
      this.cbInstrutor
    ]
      .forEach(input => {
        input.disabled = habilitar;
      });
  }

  //------------------------------------------------------------------------//

  statusApresentacao() {
    this.tfSigla.disabled = true;
    this.tfNome.disabled = true;
    this.tfDescricao.disabled = true;
    this.tfCargaHoraria.disabled = true;
    this.tfCategoria.disabled = true;
  }

  //------------------------------------------------------------------------//

  limparCampos() {
    this.tfSigla.value = ""
    this.tfNome.value = ""
    this.tfDescricao.value = ""
    this.tfCargaHoraria.value = ""
    this.tfCategoria.value = ""
    if (this.cbInstrutor) this.cbInstrutor.value = ""
  }

  //------------------------------------------------------------------------//

  async apresentarCursos(qtdCursos, posicaoAtual, curso) {
  
    if (curso == null) {
      console.log('Nenhum curso disponível.')
      this.divTotalCurso.textContent = 0
      this.limparCampos()
      this.divNumerarCurso.textContent = 0
      this.#montarCbInstrutores("Selecione o instrutor")

    } else {

      if (curso.getInstrutor() instanceof Promise) {
        curso.instrutor = await curso.getInstrutor();
      }

      this.divTotalCurso.textContent = qtdCursos
      this.tfSigla.value = curso.getSigla()
      this.tfNome.value = curso.getNome()
      this.tfDescricao.value = curso.getDescricao()
      this.tfCargaHoraria.value = curso.getCargaHoraria()
      this.tfCategoria.value = curso.getCategoria()
      this.cbInstrutor.value = curso.getInstrutor()
      this.#montarCbInstrutores(curso.instrutor.getEmail())
    
    }
    this.atualizarPaginacao(qtdCursos, posicaoAtual)
   
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
    console.log(cursos);
    
    console.log(typeof cursos, cursos == null);
    
    this.divMostrarCursos.innerHTML = "";

   if(cursos == null){
    this.divMostrarCursos.innerHTML = '<h1 class="text-2xl text-slate-900">Nenhum curso adicionado!</h1>';

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
                <span class="font-semibold text-gray-900">Descrição:</span> ${curso.getDescricao()}</p>
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