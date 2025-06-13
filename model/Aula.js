import ModelError from "./error/ModelError.js";

class Aula {
  constructor(numOrdem, conteudo, curso, instrutor) {
    this.setNumOrdem(numOrdem);
    this.setConteudo(conteudo);
    this.setCurso(curso);
    this.setInstrutor(instrutor);
  }
  
  async getInstrutor() {
    if (this.instrutor.constructor.name === "Promise")
      this.instrutor = await this.instrutor;
    return this.instrutor;
  }

  setInstrutor(instrutor) {
    Aula.validarInstrutor(instrutor);
    this.instrutor = instrutor;
  }
  
  static validarInstrutor(instrutor) {
    if (instrutor == null || instrutor == undefined)
      throw new ModelError("É necessário indicar qual é o Instrutor da aula!");
    if (instrutor.constructor.name !== "Instrutor" && instrutor.constructor.name !== "Promise")
      throw new ModelError("Instrutor Inválido");
  }
  
  async getCurso() {
    if (this.curso.constructor.name === "Promise")
      this.curso = await this.curso;
    return this.curso;
  }

  setCurso(curso) {
    Aula.validarCurso(curso);
    this.curso = curso;
  }
  
  static validarCurso(curso) {
    if (curso == null || curso == undefined)
      throw new ModelError("É necessário indicar qual é o Curso da aula!");
    if (curso.constructor.name !== "Curso" && curso.constructor.name !== "Promise")
      throw new ModelError("Curso Inválido");
  }

  // Getter para conteudo
  getConteudo() {
    return this.conteudo;
  }

  // Setter para conteudo com validação
  setConteudo(conteudo) {
    Aula.validarConteudo(conteudo);
    this.conteudo = conteudo;
  }

  // Método estático de validação
  static validarConteudo(conteudo) {
    if (conteudo == null || conteudo === undefined)
      throw new ModelError("O conteúdo não pode ser nulo!");
    if (typeof conteudo !== "string")
      throw new ModelError("O conteúdo deve ser uma string!");
    if (conteudo.trim() === "")
      throw new ModelError("O conteúdo não pode ser vazio!");
  }
  
  // Getter para conteudo
  getNumOrdem() {
    return this.numOrdem;
  }

  // Setter para conteudo com validação
  setNumOrdem(numOrdem) {
    Aula.validarNumOrdem(numOrdem);
    this.numOrdem = numOrdem;
  }
  
  static validarNumOrdem(numOrdem) {
    if(numOrdem == null || numOrdem == undefined || numOrdem < 0) {
      throw new ModelError("O número de ordem deve ser um valor valido!");
    }
  }
}

export default Aula;
