import ModelError from "./error/ModelError.js";

class Aluno {
  constructor(nome, email, telefone) {
    this.setNome(nome);
    this.setEmail(email);
    this.setFone(telefone);
  }
  // Getter e Setter para nome
  getNome() {
    return this.nome;
  }

  setNome(nome) {
    Aluno.validarNome(nome);
    this.nome = nome;
  }

  // Getter e Setter para dataNasc
  getFone() {
    return this.fone;
  }

  setFone(fone) {
    Aluno.validarTelefone(fone);
    this.fone = fone;
  }

  // Getter e Setter para email
  getEmail() {
    return this.email;
  }

  setEmail(email) {
    Aluno.validarEmail(email);
    this.email = email;
  }

  // Métodos estáticos de validação
  static validarNome(nome) {
    if (nome == null || nome == "" || nome == undefined)
      throw new ModelError("O Nome do Aluno não pode ser nulo!");
    if (nome.length > 40)
      throw new ModelError("O Nome do Aluno deve ter até 40 caracteres!");
    const padraoNome = /[A-Z][a-z]*/;
    if (!padraoNome.test(nome))
      throw new ModelError("O Nome do Aluno só pode conter letras!");
  }

  static validarTelefone(telefone) {
    if (telefone == null || telefone == "" || telefone == undefined)
      throw new ModelError("O Telefone do Aluno não pode ser nulo!");

    const padraoTelefone = /^\(?\d{2}\)?[\s-]?\d{4,5}[\s-]?\d{4}$/;
    if (!padraoTelefone.test(telefone))
      throw new ModelError(
        "O Telefone do Aluno não foi preenchido corretamente!"
      );
  }

  static validarEmail(email) {
    if (email == null || email == "" || email == undefined)
      throw new ModelError("O Email do Aluno não pode ser nulo!");

    const padraoEmail = /[a-zA-Z0-9._%-]+@[a-zA-Z0-9-]+.[a-zA-Z]{2,4}/;
    if (!padraoEmail.test(email))
      throw new ModelError("O Email do Aluno não foi digitado corretamente!");
  }
}

export default Aluno;
