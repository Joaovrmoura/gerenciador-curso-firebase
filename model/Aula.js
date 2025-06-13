import ModelError from "./error/ModelError.js";

class Aula {
  constructor(conteudo, curso) {
    this.setConteudo(conteudo);
    this.setCurso(curso);
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
}

export default Aula;
