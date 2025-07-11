import ViewerError from "./ViewerError.js";

export default class ViewerLogin {
  #ctrl;

  constructor(ctrl) {
    this.#ctrl = ctrl;
    this.tfEmail = this.obterElemento("tfEmail");
    this.tfSenha = this.obterElemento("tfSenha");
    this.btEntrar = this.obterElemento("btEntrar");

    this.btEntrar.onclick = btLoginCallback;
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