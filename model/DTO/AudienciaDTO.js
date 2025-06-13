class AudienciaDTO {
  #aluno;
  #aula;
  #dataVisto;

  constructor(audiencia) {
    this.#aluno = audiencia.getAluno();
    this.#aula = audiencia.setAula();
    this.#dataVisto = audiencia.setDataVisto();
  }

  async getAluno() {
    return await this.#aluno;
  }

  async getAula() {
    return await this.#aula;
  }

  getDataVisto() {
    return this.#dataVisto;
  }
}

export default AudienciaDTO;
