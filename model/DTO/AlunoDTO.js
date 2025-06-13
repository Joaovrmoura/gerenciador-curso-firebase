class AlunoDTO {
  #nome;
  #dataNasc;
  #email;

  constructor(aluno) {
    this.#nome = aluno.getNome();
    this.#dataNasc = aluno.getDataNasc();
    this.#email = aluno.getEmail();
  }

  getNome() {
    return this.#nome;
  }

  getDataNasc() {
    return this.#dataNasc;
  }

  getEmail() {
    return this.#email;
  }
}

export default AlunoDTO;
