import { CursoCategoria } from "../enum/CursoCategoria.js";
import ModelError from "./error/ModelError.js";

class Curso {
  constructor(sigla, nome, descricao, cargaHoraria, categoria) {
    this.setSigla(sigla);
    this.setNome(nome);
    this.setDescricao(descricao);
    this.setCargaHoraria(cargaHoraria);
    this.setCategoria(categoria);
  }

  // Getter e Setter para sigla
  getSigla() {
    return this.sigla;
  }

  setSigla(sigla) {
    Curso.validarSigla(sigla);
    this.sigla = sigla;
  }

  static validarSigla(sigla) {
    if (sigla == null || sigla === undefined)
      throw new ModelError("A sigla não pode ser nula!");
    if (typeof sigla !== "string")
      throw new ModelError("A sigla deve ser uma string!");
    if (sigla.length !== 3)
      throw new ModelError("A sigla deve ter exatamente 3 letras!");
    const padraoSigla = /^[A-Za-z]{3}$/;
    if (!padraoSigla.test(sigla))
      throw new ModelError(
        "A sigla deve conter exatamente três letras (A-Z ou a-z)!"
      );
  }

  // Getter e Setter para nome
  getNome() {
    return this.nome;
  }

  setNome(nome) {
    Curso.validarNome(nome);
    this.nome = nome;
  }

  static validarNome(nome) {
    if (nome == null || nome === undefined)
      throw new ModelError("O nome não pode ser nulo!");
    if (typeof nome !== "string")
      throw new ModelError("O nome deve ser uma string!");
    if (nome.trim() === "") throw new ModelError("O nome não pode ser vazio!");
    if (nome.length > 50)
      throw new ModelError("O nome deve ter até 50 caracteres!");
  }

  // Getter e Setter para descricao
  getDescricao() {
    return this.descricao;
  }

  setDescricao(descricao) {
    Curso.validarDescricao(descricao);
    this.descricao = descricao;
  }

  static validarDescricao(descricao) {
    if (descricao == null || descricao === undefined)
      throw new ModelError("A descrição não pode ser nula!");
    if (typeof descricao !== "string")
      throw new ModelError("A descrição deve ser uma string!");
    if (descricao.trim() === "")
      throw new ModelError("A descrição não pode ser vazia!");
    if (descricao.length > 200)
      throw new ModelError("A descrição deve ter até 200 caracteres!");
  }

  // Getter e Setter para cargaHoraria
  getCargaHoraria() {
    return this.cargaHoraria;
  }

  setCargaHoraria(cargaHoraria) {
    Curso.validarCargaHoraria(cargaHoraria);
    this.cargaHoraria = cargaHoraria;
  }

  static validarCargaHoraria(cargaHoraria) {
    if (cargaHoraria == null || cargaHoraria === undefined)
      throw new ModelError("A carga horária não pode ser nula!");
    if (typeof cargaHoraria !== "number")
      throw new ModelError("A carga horária deve ser um número!");
    if (cargaHoraria <= 0)
      throw new ModelError("A carga horária deve ser maior que zero!");
  }

  // Getter e Setter para categoria
  getCategoria() {
    return this.categoria;
  }

  setCategoria(categoria) {
    Curso.validarCategoria(categoria);
    this.categoria = categoria;
  }

  static validarCategoria(categoria) {
    if (categoria == null || categoria === undefined)
      throw new ModelError("A categoria não pode ser nula!");
    if (typeof categoria !== "string")
      throw new ModelError("A categoria deve ser uma string!");
    if (categoria.trim() === "")
      throw new ModelError("A categoria não pode ser vazia!");
    if (categoria.length > 30)
      throw new ModelError("A categoria deve ter até 30 caracteres!");
    const categoriasValidas = Object.values(CursoCategoria);
    if (!categoriasValidas.includes(categoria))
      throw new ModelError(
        `Categoria inválida. Opções permitidas: ${categoriasValidas.join(", ")}`
      );
  }
}

export default Curso;
