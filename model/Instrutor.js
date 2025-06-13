import ModelError from "./error/ModelError.js";

class Instrutor {
  constructor(nome, email, fone) {
    this.setNome(nome);
    this.setEmail(email);
    this.setFone(fone);
  }

  // Getter e Setter para nome
  getNome() {
    return this.nome;
  }

  setNome(nome) {
    Instrutor.validarNome(nome);
    this.nome = nome;
  }

  // Getter e Setter para email
  getEmail() {
    return this.email;
  }

  setEmail(email) {
    Instrutor.validarEmail(email);
    this.email = email;
  }

  // Getter e Setter para fone
  getFone() {
    return this.fone;
  }

  setFone(fone) {
    Instrutor.validarTelefone(fone);
    this.fone = fone;
  }

  static validarTelefone(telefone) {
    if (telefone == null || telefone == "" || telefone == undefined)
      throw new ModelError("O Telefone do Instrutor não pode ser nulo!");

    const padraoTelefone =
      /^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:((?:9\d|[2-9])\d{3})\-?(\d{4}))$/;
    if (!padraoTelefone.test(telefone))
      throw new ModelError(
        "O Telefone do Instrutor não foi preenchido corretamente!"
      );
  }

  static validarEmail(email) {
    if (email == null || email == "" || email == undefined)
      throw new ModelError("O Email do Instrutor não pode ser nulo!");

    const padraoEmail = /[a-zA-Z0-9._%-]+@[a-zA-Z0-9-]+.[a-zA-Z]{2,4}/;
    if (!padraoEmail.test(email))
      throw new ModelError(
        "O Email do Instrutor não foi digitado corretamente!"
      );
  }

  static validarNome(nome) {
    if (nome == null || nome == "" || nome == undefined)
      throw new ModelError("O Nome do Instrutor não pode ser nulo!");
    if (nome.length > 40)
      throw new ModelError("O Nome do Instrutor deve ter até 40 caracteres!");
    const padraoNome = /[A-Z][a-z] */;
    if (!padraoNome.test(nome))
      throw new ModelError("O Nome do Instrutor só pode conter letras !");
  }
}

export default Instrutor;
