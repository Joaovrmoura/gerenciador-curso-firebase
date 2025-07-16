import ViewerError from "./ViewerError.js";

//---- Importando as funções associadas à autenticação (Versão 10.9.0 do Firebase) ----//
import { RecaptchaVerifier } from "https://www.gstatic.com/firebasejs/11.8.0/firebase-auth.js";
//------------------------------------------------------------------------//

export default class ViewerCriarNovaConta {

  #ctrl;

  constructor(ctrl) {
    this.#ctrl = ctrl;

    // FIRST: Get all DOM references
    this.tfNome = this.obterElemento("tfNome");
    this.tfEmail = this.obterElemento("tfEmail");
    this.tfSenha = this.obterElemento("tfSenha");
    this.tfTelefone = this.obterElemento("tfTelefone");
    this.btNovaConta = this.obterElemento("btNovaConta");
    this.cbFuncao = this.obterElemento("cbFuncao"); // Remove if not in HTML
    this.menssagemDeErro = this.obterElemento('menssagemDeErro')
    
    // Bind context for methods
    this.btNovaConta.onclick = fnNovaConta;
    
    //   // Recaptcha
    // window.recaptchaVerifier = new RecaptchaVerifier(
    //   ctrl.getAuth(),
    //   "recaptcha-container",
    //   {}
    // );

    // window.recaptchaVerifier.render().then(function (widgetId) {
    //   window.recaptchaWidgetId = widgetId;
    // });

  }

  //------------------------------------------------------------------------//

  obterElemento(idElemento) {
    let elemento = document.getElementById(idElemento);
    if (elemento == null)
      throw new ViewerError("Não encontrei um elemento com id '" + idElemento + "'");
    // Adicionando o atributo 'viewer' no elemento do Viewer. Isso permitirá
    // que o elemento guarde a referência para o objeto Viewer que o contém.
    elemento.viewer = this;
    return elemento;
  }

  //------------------------------------------------------------------------//

  getCtrl() {
    return this.#ctrl;
  }

  //------------------------------------------------------------------------//

  mostrarMenssagem(menssagem){
    this.menssagemDeErro.innerHTML = menssagem
    setTimeout(() => {
      this.menssagemDeErro.innerHTML = ""
    }, 3000)
  }

  //------------------------------------------------------------------------//


  voltar() {
    window.history.go(-1);
  }


}

//------------------------------------------------------------------------//
// CALLBACKs para os Botões
//------------------------------------------------------------------------//

function fnNovaConta() {
  // Recuperando o que está preenchido no input tfNome
  const nome = this.viewer.tfNome.value;
  if (nome == null || nome == "") {
    alert("nome não preenchido");
    return;
  }

  // Recuperando o que está preenchido no input tfConta
  const email = this.viewer.tfEmail.value;
  if (email == null || email == "") {
    alert("conta não preenchida");
    return;
  }

  // Recuperando o que está preenchido no input tfSenha
  const senha = this.viewer.tfSenha.value;
  if (senha == null || senha == "") {
    alert("senha não preenchida");
    return;
  }

  // Recuperando o que está preenchido no input tfReplay
  const telefone = this.viewer.tfTelefone.value;
  if (telefone == null || telefone == "") {
    alert("Telefone não preenchido");
    return;
  }

  // Recuperando a função do novo usuário
  const funcao = this.viewer.cbFuncao.value;
  // nome, conta, senha, telefone, funcao
  // Solicito ao controlador do caso de uso que crie a nova conta  nome, email, telefone, senha, funcao
  console.log(nome, email, senha, telefone, funcao);
  this.viewer.getCtrl().criarNovaConta(nome, email, senha, telefone, funcao);

}

//------------------------------------------------------------------------//

function fnBtCancelar() {
  this.viewer.getCtrl().cancelar();
}

//------------------------------------------------------------------------//

