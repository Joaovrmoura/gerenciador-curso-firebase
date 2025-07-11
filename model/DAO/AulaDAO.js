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
  
  async obterAulasPelaSiglaDoCurso(sigla) {
    // Recuperando a conexão com o Realtime Database
    let connectionDB = await this.obterConexao();      
    // Retornamos uma Promise que nos dará o resultado
    return new Promise((resolve) => {
      // Declaramos uma variável que referenciará o array com os objetor Curso
      let conjAulas = [];      
      // Definindo uma 'ref' para o objeto no banco de dados      
      let dbRefAulas = ref(connectionDB,'aulas/' + sigla);
      // Executo a query a partir da 'ref' definida
      let consulta = query(dbRefAulas);
      // Recupero a Promise com o resultado obtido
      let resultPromise = get(consulta);
      // Com o resultado, vamos montar o array de resposta
      resultPromise.then(dataSnapshot => {
        let tamanho = dataSnapshot.length;
        // Para cada objeto presente no resultado

        dataSnapshot.forEach((dataSnapshotObj,index) => {
          // Recupero o objeto com val()
          let elem = dataSnapshotObj.val();
          
          // Instancio um objeto Curso e o coloco no array de resposta      
          conjAulas.push(elem);
          
          // Se é o último objeto a retornar
          if(index == tamanho - 1)
            resolve(conjAulas);          
        });
        // Ao final do 'forEach', coloco o array como resolve da Promise a ser retornada
        resolve(conjAulas);
      }).catch((e) => { console.log("#ERRO: " + e); resolve([])});
    });
  }

  //-----------------------------------------------------------------------------------------//
  
  async incluir(aula) {
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
        let setPromise = set(dbRefNovaAula,  {conteudo: aula.getConteudo()});
        
        // Define o resultado da operação
        setPromise
        .then(value => { resolve(true); })
        .catch((e) => { console.log("#ERRO ao incluir aula: " + e); resolve(false); });
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
