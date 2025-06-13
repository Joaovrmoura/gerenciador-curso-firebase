class InscricaoDTO {
  #curso;
  #aluno;
  #dataMatr;

  constructor(inscricao) {
    this.#curso = inscricao.getCurso();
    this.#aluno = inscricao.getAluno();
    this.#dataMatr = inscricao.getDataMatr();
  }

  async getCurso() {
    return await this.#curso;
  }

  async getAluno() {
    return await this.#aluno;
  }

  getDataNasc() {
    return this.#dataMatr;
  }
}

export default InscricaoDTO;
