class AulaDTO {
  #conteudo;
  #curso;
  #instrutor;

  constructor(aula) {
    this.#conteudo = aula.getConteudo();
    this.#curso = aula.getCurso();
    this.#instrutor = aula.getInstrutor();
  }

  getConteudo() {
    return this.#conteudo;
  }
  
  async getCurso() {
    return await this.#curso;
  }
  
  async getInstrutor() {
    return await this.#instrutor;
  }
}

export default AulaDTO;
