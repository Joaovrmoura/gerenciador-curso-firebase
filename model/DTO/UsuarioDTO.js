class UsuarioDTO {
  constructor(usr) {
    this.email = usr.getEmail();
    this.uid = usr.getUid();
    this.funcao = usr.getFuncao();
  }

  getEmail() {
    return this.email;
  }

  getUid() {
    return this.uid;
  }

  getFuncao() {
    return this.funcao;
  }
}

export default UsuarioDTO;
