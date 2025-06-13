class AulaDTO {
  #conteudo;

  constructor(aula) {
    this.#conteudo = aula.getConteudo();
  }

  getConteudo() {
    return this.#conteudo;
  }
}

export default AulaDTO;
