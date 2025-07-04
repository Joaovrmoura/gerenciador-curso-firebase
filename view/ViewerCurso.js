import ViewerError from "./ViewerError.js";

export default class ViwerAdicionarCurso {

  #ctrl;

  constructor(ctrl) {
    this.#ctrl = ctrl;

    this.tfSigla = this.obterElemento('tfSigla');
    this.tfNome = this.obterElemento('tfNome');
    this.tfDescricao = this.obterElemento('tfDescricao');
    this.tfcargaHoraria = this.obterElemento('tfCargaHoraria');
    this.tfCategoria = this.obterElemento('tfCategoria');
    this.cbInstrutor = this.obterElemento('cbInstrutor');

    this.btLogout = this.obterElemento('btLogout')
    this.btAdicionar = this.obterElemento('btAdicionar')

    this.divApresentarCursos = this.obterElemento('divApresentarCursos')

    this.btLogout.onclick = fnLogout
    this.btAdicionar.onclick = fnAdicionarCurso 
    this.init();
  }

  //------------------------------------------------------------------------//

  obterElemento(idElemento) {
    let elemento = document.getElementById(idElemento);
    if (elemento == null)
      throw new ViewerError("Não encontrei um elemento com id '" + idElemento + "'");
    // Adicionando o atributo 'viewer' no elemento do Viewer. Isso permitirá
    // que o elemento guarde a referência para o objeto Viewer que o contém.
    elemento.viewer = this;
    return elemento;
  }

  //------------------------------------------------------------------------//

  async #montarCbCursos() {
    while (this.cbInstrutor.length > 0) {
      this.cbInstrutor.remove(0);
    }

     // Adiciona a opção inicial "Escolha um instrutor"
    const opcaoInicial = document.createElement("option");
    opcaoInicial.text = "Escolha um instrutor...";
    opcaoInicial.disabled = true;
    opcaoInicial.selected = true;
    opcaoInicial.hidden = true;
    this.cbInstrutor.add(opcaoInicial);
    
    let listarInstrutoresDTO = await this.#ctrl.obterInstrutoresDTO();
    console.log(listarInstrutoresDTO);
    
    for (let i = 0; i < listarInstrutoresDTO.length; i++) {
      let opt = document.createElement("option");
      opt.value = listarInstrutoresDTO[i].getEmail(); 
      opt.text  = listarInstrutoresDTO[i].getNome();  
      this.cbInstrutor.add(opt);
    }
  } 

  //------------------------------------------------------------------------//

  async aprensentarCursos(cursos){
    for (let i = 0; i < cursos.length; i++) {
      if (cursos[i].instrutor instanceof Promise) {
        cursos[i].instrutor = await cursos[i].instrutor;
      }
    }

    cursos.forEach(curso => {
        const div = document.createElement('div')
        div.innerHTML = `
          <div class="course-card">
              <div class="course-header">
                  <div id="divSiglaCurso" class="course-sigla">${curso.getSigla()}</div>
                  <div id="divNomeCurso" class="course-title">${curso.getNome()}</div>
              </div>
              <div class="course-body">
                  <div class="course-meta">
                      <div class="course-meta-item">
                          <div class="course-meta-label">Carga Horária</div>
                          <div id="divCargaHorariaCurso" class="course-meta-value">${curso.getCargaHoraria()}</div>
                      </div>
                      <div class="course-meta-item">
                          <div class="course-meta-label">Categoria</div>
                          <div id="divCategoriaCurso" class="course-meta-value">${curso.getCategoria()}</div>
                      </div>
                  </div>
                  <p>${curso.descricao}</p>
                  <div class="course-instructor">
                      <div class="instructor-avatar">CS</div>
                      <div id="instrutorCurso" class="instructor-name">${curso.instrutor.getNome()}</div>
                  </div>
              </div>
            </div>
            `
         this.divApresentarCursos.appendChild(div)
    })
    this.#montarCbCursos()
  }

  //------------------------------------------------------------------------//


  getCtrl() {
    return this.#ctrl;
  }
  
  init() {
    this.btAdicionar.addEventListener('click', (e) => {e.preventDefault();});
  }

}

//------------------------------------------------------------------------//
// CALLBACKs para os Botões
//------------------------------------------------------------------------//

function fnAdicionarCurso() {
  // Recuperando o que está preenchido no input tfNome
  const sigla = this.viewer.tfSigla.value;
  if (sigla == null || sigla == "") {
    alert("sigla não preenchida");
    return;
  }

  // Recuperando o que está preenchido no input tfConta
  const nome = this.viewer.tfNome.value;
  if (nome == null || nome == "") {
    alert("nome não preenchido");
    return;
  }

  // Recuperando o que está preenchido no input tfSenha
  const descricao = this.viewer.tfDescricao.value;
  if (descricao == null || descricao == "") {
    alert("descricao não preenchida");
    return;
  }

  // Recuperando o que está preenchido no input tfReplay
  const cargaHoraria = parseInt(this.viewer.tfcargaHoraria.value);
  
  if(cargaHoraria <= 0){
    alert("CargaHoraria não inválida!");
  }
  if (cargaHoraria == null || cargaHoraria == "") {
    alert("CargaHoraria não preenchida");
    return;
  }

  // Recuperando o que está preenchido no input tfReplay
  const categoria  = this.viewer.tfCategoria.value;
  if (categoria == null || categoria == "") {
    alert("Categoria não preenchida");
    return;
  }

  // Recuperando o que está preenchido no input tfReplay
  const instrutor  = this.viewer.cbInstrutor.value;
  if (instrutor == null || instrutor == "") {
    alert("Instrutor não preenchido");
    return;
  }


  // nome, conta, senha, telefone, funcao
  // Solicito ao controlador do caso de uso que crie a nova conta  nome, email, telefone, senha, funcao
  this.viewer.getCtrl().adicionarCurso(sigla, nome, descricao, cargaHoraria, categoria, instrutor);
}

function fnLogout(){
  this.viewer.getCtrl().logout()
}
// //------------------------------------------------------------------------//

// function fnBtCancelar() {
//   this.viewer.getCtrl().cancelar();
// }

// //------------------------------------------------------------------------//

