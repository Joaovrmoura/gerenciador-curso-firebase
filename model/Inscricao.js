import ModelError from "./error/ModelError.js";

class Inscricao {
  constructor(curso, aluno, dataMatr) {
    this.setCurso(curso);
    this.setAluno(aluno);
    this.setDataMatr(dataMatr);
  }

  // Getter e Setter para curso
  async getCurso() {
    if (this.curso.constructor.name === "Promise")
      this.curso = await this.curso;
    return this.curso;
  }

  setCurso(curso) {
    Inscricao.validarCurso(curso);
    this.curso = curso;
  }

  // Getter e Setter para aluno
  async getAluno() {
    if (this.aluno.constructor.name === "Promise")
      this.aluno = await this.aluno;
    return this.aluno;
  }

  setAluno(aluno) {
    Inscricao.validarAluno(aluno);
    this.aluno = aluno;
  }

  // Getter e Setter para dataMatr
  getDataMatr() {
    return this.dataMatr;
  }

  setDataMatr(dataMatr) {
    Inscricao.validarDataMatr(dataMatr);
    this.dataMatr = dataMatr;
  }

  static validarDataMatr(dataVisto) {
    if (dataVisto == null || dataVisto == undefined)
      throw new ModelError("A data de visto não pode ser nula!");
    if (!(dataVisto instanceof Date))
      throw new ModelError("A data de visto deve ser uma instância de Date!");
  }

  static validarAluno(aluno) {
    if (aluno == null || aluno == undefined)
      throw new ModelError("É necessário indicar qual é o Aluno da inscrição!");
    if (aluno.constructor.name !== "Aluno")
      throw new ModelError("Aluno Inválido");
  }

  static validarCurso(curso) {
    if (curso == null || curso == undefined)
      throw new ModelError("É necessário indicar qual é o Curso da inscrição!");
    if (curso.constructor.name !== "Curso")
      throw new ModelError("Curso Inválido");
  }
}

export default Inscricao;
