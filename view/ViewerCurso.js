import ViewerError from "./ViewerError.js"
import Status from "./Status.js"

export default class ViewrCurso {
  #ctrl
  constructor(ctrl) {
    this.#ctrl = ctrl

    this.btnEditar = this.obterElemento('btnEdit')
    this.btnExcluir = this.obterElemento('btnDelete')
    this.btnIncluir = this.obterElemento('btnAdd')
    this.btnCancelar = this.obterElemento('btnCancel')
    this.btnConfirmar = this.obterElemento('btnConfirme')
    this.divBtnIniciarAcao = this.obterElemento('divBtnIniciarAcao')
    this.divBtnConfirmarAcao = this.obterElemento('divBtnConfirmarAcao')
    this.divTotalInstrutores = this.obterElemento('divTotalInstrutores')
    this.divTotalCurso = this.obterElemento('divTotalCurso')
    this.divNumerarCurso = this.obterElemento('divNumerarCurso')
    this.btPerfil = this.obterElemento('btPerfil')
    this.btLogout = this.obterElemento('btLogout')

    this.divNavegacao = this.obterElemento('divNavegacao')
    this.btnAnterior = this.obterElemento('btnBack')
    this.btnProximo = this.obterElemento('btnNext')
    this.divMostrarInstrutor = this.obterElemento('divMostrarInstrutor')
    this.divCbInstrutor = this.obterElemento('divCbInstrutor')
  
    this.paginacao = this.obterElemento('divPaginacao')

    this.tfSigla = this.obterElemento('tfSigla')
    this.tfNome = this.obterElemento('tfNome')
    this.tfDescricao = this.obterElemento('tfDescricao')
    this.tfCargaHoraria = this.obterElemento('tfCargaHoraria')
    this.tfCategoria = this.obterElemento('tfCategoria')
    this.cbInstrutor = this.obterElemento('cbInstrutor')

    this.btLogout.onclick = fnBLogout
    this.btnProximo.onclick = avancarPaginacao
    this.btnAnterior.onclick = voltarPaginacao
    this.btnIncluir.onclick = iniciarInclusao
    this.btnEditar.onclick = iniciarEdicao
    this.btnExcluir.onclick = excluirCurso
    this.btnCancelar.onclick = cancelarAcao
    this.btnConfirmar.onclick = fnBtOk

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
      this.divNumerarCurso.textContent = posicaoAtual
    }else{
      div.innerHTML = 'Nenhum curso Adicionado'
    }
    this.paginacao.appendChild(div)
  }

  //------------------------------------------------------------------------//

  statusEdicao(status) {
    
    if(status === Status.EXCLUINDO){
      this.divBtnIniciarAcao.classList.add('hidden')
      this.divNavegacao.classList.add('hidden')
      this.divBtnConfirmarAcao.classList.remove('hidden')

    }
    
    if (status === Status.NAVEGANDO) {
      this.desabilitarInputs(true)
      this.divMostrarInstrutor.classList.remove('hidden')
      this.divBtnIniciarAcao.classList.remove('hidden')
      this.divNavegacao.classList.remove('hidden')
      this.divBtnConfirmarAcao.classList.add('hidden')

    } else if (status === Status.ALTERANDO || status === Status.INCLUINDO) {
      this.desabilitarInputs(false)
      this.divBtnIniciarAcao.classList.add('hidden')
      this.divNavegacao.classList.add('hidden')
      this.divBtnConfirmarAcao.classList.remove('hidden')
      this.divCbInstrutor.classList.add('hidden')
      
      if (status === Status.INCLUINDO) {
        this.limparCampos()
        this.divMostrarInstrutor.classList.add('hidden')
        this.divCbInstrutor.classList.remove('hidden')
      }
      if(status == Status.ALTERANDO){
        this.tfSigla.disabled = true
        this.divMostrarInstrutor.classList.add('hidden')
        this.divCbInstrutor.classList.remove('hidden')
      }
    }
  }

  //------------------------------------------------------------------------//

  exibirUsuario(nomeUsuario){
    this.btPerfil.textContent = nomeUsuario
  }
  //------------------------------------------------------------------------//

  desabilitarInputs(isDisabled) {
    [
      this.tfSigla,
      this.tfNome,
      this.tfDescricao,
      this.tfCargaHoraria,
      this.tfCategoria,
      this.cbInstrutor
    ]
      .forEach(input => {
        input.disabled = isDisabled;
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

  async aprensentarCursos(qtdCursos, posicaoAtual, curso) {

    if (curso.length <= 0) {
      console.log('Nenhum curso disponível.')
      this.divTotalCurso.textContent = 0
      this.limparCampos()
      this.divNumerarCurso.textContent = 0
      this.#montarCbInstrutores("Selecione o instrutor")

    } else {
      this.divTotalCurso.textContent = qtdCursos
      this.tfSigla.value = curso.getSigla()
      this.tfNome.value = curso.getNome()
      this.tfDescricao.value = curso.getDescricao()
      this.tfCargaHoraria.value = curso.getCargaHoraria()
      this.tfCategoria.value = curso.getCategoria()
      this.cbInstrutor.value = curso.getInstrutor()

      if (curso.getInstrutor() instanceof Promise) {
        curso.instrutor = await curso.getInstrutor();
      }
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

function iniciarInclusao() {
  this.viewer.getCtrl().iniciarIncluir()
}

//------------------------------------------------------------------------//

function iniciarEdicao() {
  this.viewer.getCtrl().iniciarAlterar()
}

//------------------------------------------------------------------------//

function excluirCurso() {
  this.viewer.getCtrl().iniciarExcluir();
}

//------------------------------------------------------------------------//

function cancelarAcao() {
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