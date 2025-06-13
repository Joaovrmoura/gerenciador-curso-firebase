class CursoDTO {
  #sigla;
  #nome;
  #descricao;
  #cargaHoraria;
  #categoria;

  constructor(curso) {
    this.#sigla = curso.getSigla();
    this.#nome = curso.getNome();
    this.#descricao = curso.getDescricao();
    this.#cargaHoraria = curso.getCargaHoraria();
    this.#categoria = curso.getCategoria();
  }

  getSigla() {
    return this.#sigla;
  }

  getNome() {
    return this.#nome;
  }

  getDescricao() {
    return this.#descricao;
  }

  getCargaHoraria() {
    return this.#cargaHoraria;
  }

  getCategoria() {
    return this.#categoria;
  }
}
