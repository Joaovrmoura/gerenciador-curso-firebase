import {
  getDatabase,
  ref,
  query,
  child,
  get,
  set,
  remove,
  runTransaction,
  onValue,
  onChildAdded,
  orderByChild,
  orderByKey,
  equalTo,
  push,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

import Aula from "../Aula.js";
import ModelError from "../error/ModelError.js";
import Instrutor from "../Instrutor.js";
import Curso from "../Curso.js";
import CursoDAO from "./CursoDAO.js";

class AulaDAO {

  //-----------------------------------------------------------------------------------------//

  // único atributo presente em DaoCurso. Observe que é um atributo estático; ou seja,
  // se tivermos mais de um objeto DaoCurso, todos vão compartilhar o mesmo atributo
  // conexão.
  static promessaConexao = null;

  // Construtor: vai tentar estabelecer uma conexão com o IndexedDB
  constructor() {
    this.obterConexao();
  }

  //-----------------------------------------------------------------------------------------//
  
  /*
   *  Devolve uma Promise com a referência para o Realtime Database
   */ 
  obterConexao() {
    // Como 'promessaConexao' é um atributo estático, usamos o nome da classe 
    // para acessá-lo
    if(AulaDAO.promessaConexao == null) {
      AulaDAO.promessaConexao = new Promise((resolve, reject) => {
        const db = getDatabase();
        if(db)
            resolve(db);
        else 
            reject(new ModelError("Não foi possível estabelecer conexão com o BD"));
      });
    }
    return AulaDAO.promessaConexao;
  }

 //-----------------------------------------------------------------------------------------//

  async incluir(aula) {
    // Recuperando a conexão com o Realtime Database
    let connectionDB = await this.obterConexao();    
    return new Promise((resolve, reject) => {
      // Referência para a raiz de 'aulas'
      let dbRefAulas = ref(connectionDB, 'aulas');
      
      // Inicia uma transação na raiz 'aulas'
      runTransaction(dbRefAulas, (aulas) => {
        // Monta o child 'aulas/$siglaCurso/$numOrdem'
        let dbRefNovaAula = child(dbRefAulas, `${aula.curso.getSigla()}/${aula.getNumOrdem()}`);
        const conteudo = aula.getConteudo();
        // Inclui ou atualiza a aula usando 'set'
        let setPromise = set(dbRefNovaAula, { conteudo });
        
        // Define o resultado da operação
        setPromise
        .then(value => { resolve(true); })
        .catch((e) => { console.log("#ERRO ao incluir aula: " + e); resolve(false); });
      });
    });
  }
  
  //-----------------------------------------------------------------------------------------//

  async obterAulasPelaSiglaDoCurso(sigla) {
    let connectionDB = await this.obterConexao();   
    return new Promise(async (resolve) => {
      let conjAulas = [];      
      let dbRefAulas = ref(connectionDB, 'aulas/' + sigla);
      let consulta = query(dbRefAulas);
      let resultPromise = get(consulta);

      const daoCurso = new CursoDAO();
      const curso = await daoCurso.obterCursoPelaSigla(sigla);
      const instrutor = await curso.getInstrutor();

      resultPromise.then(dataSnapshot => {
        dataSnapshot.forEach(dataSnapshotObj => {
          let elem = dataSnapshotObj.val();
          let numOrdem = parseInt(dataSnapshotObj.key);
          // console.log(elem);
          
          conjAulas.push(new Aula(numOrdem, elem.conteudo, curso, instrutor));
        });
        resolve(conjAulas);
      }).catch((e) => { 
        console.log("#ERRO: " + e); 
        resolve([]); 
      });
    });
  }

  //-----------------------------------------------------------------------------------------//
  
  async alterar(aula) {
    // Recuperando a conexão com o Realtime Database
    let connectionDB = await this.obterConexao();    
    return new Promise((resolve, reject) => {
      // Referência para a raiz de 'aulas'
      let dbRefAulas = ref(connectionDB, 'aulas');
      console.log(aula);
      
      // Inicia uma transação na raiz 'aulas'
      runTransaction(dbRefAulas, (aulas) => {
        // Monta o child 'aulas/$siglaCurso/$numOrdem'
        let dbRefNovaAula = child(dbRefAulas, `${aula.curso.getSigla()}/${aula.getNumOrdem()}`);
        
        // Inclui ou atualiza a aula usando 'set'
        let setPromise = set(dbRefNovaAula, { conteudo: aula.getConteudo() });
        
        // Define o resultado da operação
        setPromise
        .then(value => { resolve(true); })
        .catch((e) => { console.log("#ERRO ao incluir aula: " + e); resolve(false); });
      });
    });
  }
  
  //-----------------------------------------------------------------------------------------//

  async excluir(aula) {
    // Recuperando a conexão com o Realtime Database
    let connectionDB = await this.obterConexao();    
    return new Promise((resolve, reject) => {
      // Referência para a raiz de 'aulas'
      let dbRefAulas = ref(connectionDB, 'aulas');
      console.log(aula);
      
      // Inicia uma transação na raiz 'aulas'
      runTransaction(dbRefAulas, (aulas) => {
        // Monta o child 'aulas/$siglaCurso/$numOrdem'
        let dbRefNovaAula = child(dbRefAulas, `${aula.curso.getSigla()}/${aula.getNumOrdem()}`);
        
        // Inclui ou atualiza a aula usando 'set'
        let setPromise = remove(dbRefNovaAula, { conteudo: aula.getConteudo() });
        
        // Define o resultado da operação
        setPromise
        .then(value => { resolve(true); })
        .catch((e) => { console.log("#ERRO ao incluir aula: " + e); resolve(false); });
      });
    });
  }
  
  //-----------------------------------------------------------------------------------------//

}

export default AulaDAO;
