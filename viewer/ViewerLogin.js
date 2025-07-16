import ViewerError from "./ViewerError.js";

//---- Importando as funções associadas à autenticação (Versão 10.9.0 do Firebase) ----//
import { RecaptchaVerifier } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
//------------------------------------------------------------------------//

export default class ViewerLogin {
  #ctrl;

  constructor(ctrl) {
    this.#ctrl = ctrl;
    this.tfEmail = this.obterElemento("tfEmail");
    this.tfSenha = this.obterElemento("tfSenha");
    this.btEntrar = this.obterElemento("btEntrar");
    this.menssagemDeErro = this.obterElemento('menssagemDeErro')

    this.btEntrar.onclick = btLoginCallback;

    window.recaptchaVerifier = new RecaptchaVerifier(
        ctrl.getAuth(),
        "recaptcha-container",
        {}
      );
  
      window.recaptchaVerifier.render().then(function (widgetId) {
        window.recaptchaWidgetId = widgetId;
      });
  }

  
  obterElemento(idElemento) {
    let elemento = document.getElementById(idElemento);
    if (elemento == null)
      throw new ViewerError("Não encontrei um elemento com id '" + idElemento + "'");
    // Adicionando o atributo 'viewer' no elemento do Viewer. Isso permitirá
    // que o elemento guarde a referência para o objeto Viewer que o contém.
    elemento.viewer = this;
    return elemento;
  }
  
  mostrarMenssagem(menssagem){
    this.menssagemDeErro.innerHTML = menssagem
    setTimeout(() => {
      this.menssagemDeErro.innerHTML = ""
    }, 3000)
  }

  getCtrl() {
    return this.#ctrl;
  } 

}


function btLoginCallback() {
  const conta = this.viewer.tfEmail.value.trim();
  const senha = this.viewer.tfSenha.value.trim();

  if (!conta) return alert("Preencha o e-mail");
  if (!senha) return alert("Preencha a senha");

  this.viewer.getCtrl().efetuarLogin(conta, senha);
}