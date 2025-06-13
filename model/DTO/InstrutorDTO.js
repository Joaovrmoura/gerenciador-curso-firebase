class InstrutorDTO {
  #nome;
  #email;
  #fone;

  constructor(instrutor) {
    this.#nome = instrutor.getNome();
    this.#email = instrutor.getEmail();
    this.#fone = instrutor.getFone();
  }

  getNome() {
    return this.#nome;
  }

  getEmail() {
    return this.#email;
  }

  getFone() {
    return this.#fone;
  }
}

export default InstrutorDTO;
