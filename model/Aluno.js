import ModelError from "./error/ModelError.js";

class Aluno {
  constructor(nome, dataNasc, email) {
    this.setNome(nome);
    this.setDataNasc(dataNasc);
    this.setEmail(email);
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
  getDataNasc() {
    return this.dataNasc;
  }

  setDataNasc(dataNasc) {
    Aluno.validarDataNasc(dataNasc);
    this.dataNasc = dataNasc;
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
    const padraoNome = /[A-Z][a-z] */;
    if (!padraoNome.test(nome))
      throw new ModelError("O Nome do Aluno só pode conter letras !");
  }

  static validarDataNasc(dataNasc) {
    if (dataNasc == null || dataNasc === undefined || dataNasc.trim() === "") {
      throw new Error("A Data de Nascimento não pode ser nula ou vazia!");
    }
    const data = new Date(dataNasc);
    if (isNaN(data.getTime())) {
      throw new Error("Data de Nascimento inválida!");
    }
    const hoje = new Date();
    if (data > hoje) {
      throw new Error("Data de Nascimento não pode ser no futuro!");
    }
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
