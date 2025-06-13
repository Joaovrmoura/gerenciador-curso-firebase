class UsuarioDTO {
  constructor(usuario) {
    this.email = usuario.getEmail();
    this.uid = usuario.getUid();
    this.funcao = usuario.getFuncao();
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
