import ModelError from "./error/ModelError.js";

class Audiencia {
  constructor(aluno, aula, dataVisto) {
    this.setAluno(aluno);
    this.setAula(aula);
    this.setDataVisto(dataVisto);
  }

  // Getter e Setter para aluno
  async getAluno() {
    if (this.aluno.constructor.name === "Promise")
      this.aluno = await this.aluno;
    return this.aluno;
  }

  setAluno(aluno) {
    Audiencia.validarAluno(aluno);
    this.aluno = aluno;
  }

  // Getter e Setter para aula
  async getAula() {
    if (this.aula.constructor.name === "Promise") this.aula = await this.aula;
    return this.aula;
  }

  setAula(aula) {
    Audiencia.validarAula(aula);
    this.aula = aula;
  }

  // Getter e Setter para dataVisto
  getDataVisto() {
    return this.dataVisto;
  }

  setDataVisto(dataVisto) {
    Audiencia.validarDataVisto(dataVisto);
    this.dataVisto = dataVisto;
  }

  static validarDataVisto(dataVisto) {
    if (dataVisto == null || dataVisto == undefined)
      throw new ModelError("A data de visto não pode ser nula!");
    if (!(dataVisto instanceof Date))
      throw new ModelError("A data de visto deve ser uma instância de Date!");
  }

  static validarAula(aula) {
    if (aula == null || aula == undefined)
      throw new ModelError("É necessário indicar qual é a Aula da audiência!");
    if (aula.constructor.name !== "Aula") throw new ModelError("Aula Inválida");
    // Qual é o curso da aula?
    // Quais inscrições o aluno tem?
    // Pegar todos os cursos vinculados àquele aluno
  }

  static validarAluno(aluno) {
    if (aluno == null || aluno == undefined)
      throw new ModelError("É necessário indicar qual é o Aluno da audiência!");
    if (aluno.constructor.name !== "Aluno")
      throw new ModelError("Aluno Inválido");
  }
}

export default Audiencia;
