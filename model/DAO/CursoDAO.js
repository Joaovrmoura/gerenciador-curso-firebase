import {
  getDatabase,
  ref,
  query,
  child,
  get,
  set,
  remove,
  runTransaction
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

import Curso from "../Curso.js";
import ModelError from "../error/ModelError.js";
import Instrutor from "../Instrutor.js";
import InstrutorDAO from "./InstrutorDAO.js";
import DaoUsuario from "./UsuarioDAO.js";

export default class CursoDAO {
  static promessaConexao = null;

  constructor() {
    this.obterConexao();
  }

  obterConexao() {
    if (CursoDAO.promessaConexao == null) {
      CursoDAO.promessaConexao = new Promise((resolve, reject) => {
        const db = getDatabase();
        if (db) resolve(db);
        else
          reject(
            new ModelError("Não foi possível estabelecer conexão com o BD")
          );
      });
    }
    return CursoDAO.promessaConexao;
  }

  async obterCursoPelaSigla(sigla) {
    let connectionDB = await this.obterConexao();
    return new Promise(resolve => {
      let dbRefCurso = ref(connectionDB, "cursos/" + sigla);
      let consulta = query(dbRefCurso);
      let resultPromise = get(consulta);
      resultPromise.then(dataSnapshot => {
    
        let curso = dataSnapshot.val();
        
        if (curso != null){
          const daoInstrutor = new InstrutorDAO()
          const instrutor = daoInstrutor.obterInstrutorPeloUid(curso.instrutor)

          resolve(new Curso(curso.sigla, curso.nome, curso.descricao, curso.cargaHoraria, curso.categoria, instrutor));
        } 
        else resolve(null);
      });
    });
  }

  async obterCursos() {
    // Recuperando a conexão com o Realtime Database
    let connectionDB = await this.obterConexao();      
    // Retornamos uma Promise que nos dará o resultado
    return new Promise((resolve) => {
      // Declaramos uma variável que referenciará o array com os objetor Curso
      let conjCursos = [];      
      // Definindo uma 'ref' para o objeto no banco de dados      
      let dbRefCursos = ref(connectionDB,'cursos');
      // Executo a query a partir da 'ref' definida
      let consulta = query(dbRefCursos);
      // Recupero a Promise com o resultado obtido
      let resultPromise = get(consulta);
      // Com o resultado, vamos montar o array de resposta
      resultPromise.then(dataSnapshot => {
        let tamanho = dataSnapshot.length;
        // Para cada objeto presente no resultado
        const daoInstrutor = new InstrutorDAO()
        dataSnapshot.forEach((dataSnapshotObj,index) => {
          // Recupero o objeto com val()
          let elem = dataSnapshotObj.val();
          
          const instrutor = daoInstrutor.obterInstrutorPeloUid(elem.instrutor)
          // Instancio um objeto Curso e o coloco no array de resposta
          conjCursos.push(new Curso(elem.sigla, elem.nome, elem.descricao, elem.cargaHoraria, elem.categoria, instrutor));
          // Se é o último objeto a retornar
          if(index == tamanho - 1)
            resolve(conjCursos);          
        });
        // Ao final do 'forEach', coloco o array como resolve da Promise a ser retornada
        resolve(conjCursos);
      }).catch((e) => { console.log("#ERRO: " + e); resolve([])});
    });
  }


  //-----------------------------------------------------------------------------------------//

  async obterTodosCursosDoInstrutor(uid){
    // Recuperando a conexão com o Realtime Database
    let connectionDB = await this.obterConexao();      
    // Retornamos uma Promise que nos dará o resultado
    return new Promise((resolve) => {
      // Declaramos uma variável que referenciará o array com os objetor Curso
      let conjCursos = [];      
      // Definindo uma 'ref' para o objeto no banco de dados      
      let dbRefCursos = ref(connectionDB,'cursos');
      // Executo a query a partir da 'ref' definida
      let consulta = query(dbRefCursos);
      // Recupero a Promise com o resultado obtido
      let resultPromise = get(consulta);
      // Com o resultado, vamos montar o array de resposta
      resultPromise.then(dataSnapshot => {
        let tamanho = dataSnapshot.length;
        // Para cada objeto presente no resultado
        const daoInstrutor = new InstrutorDAO()
        dataSnapshot.forEach((dataSnapshotObj,index) => {
          // Recupero o objeto com val()
          let elem = dataSnapshotObj.val();
          
          const instrutor = daoInstrutor.obterInstrutorPeloUid(uid)
          // Instancio um objeto Curso e o coloco no array de resposta
          if(elem.instrutor === uid){
            conjCursos.push(new Curso(elem.sigla, elem.nome, elem.descricao, elem.cargaHoraria, elem.categoria, instrutor));
          }
          // Se é o último objeto a retornar
          if(index == tamanho - 1)
            resolve(conjCursos);          
        });
        // Ao final do 'forEach', coloco o array como resolve da Promise a ser retornada
        resolve(conjCursos);
      }).catch((e) => { console.log("#ERRO: " + e); resolve([])});
    });
  } 

  //-----------------------------------------------------------------------------------------//

  // async obterCursoDoinstrutorPelaSigla(sigla, uid){
  //  let connectionDB = await this.obterConexao();
  //   return new Promise(resolve => {
  //     let dbRefCurso = ref(connectionDB, "cursos/" + sigla);
  //     let consulta = query(dbRefCurso);
  //     let resultPromise = get(consulta);
  //     resultPromise.then(dataSnapshot => {
    
  //       let curso = dataSnapshot.val();
        
  //       if (curso != null && curso.instrutor == uid){
  //         const daoInstrutor = new InstrutorDAO()
  //         const instrutor = daoInstrutor.obterInstrutorPeloUid(curso.instrutor)

  //         resolve(new Curso(curso.sigla, curso.nome, curso.descricao, curso.cargaHoraria, curso.categoria, instrutor));
  //       } 
  //       else resolve(null);
  //     });
  //   });
  // }
  //-----------------------------------------------------------------------------------------//

  // async incluir(curso) {
  //   let connectionDB = await this.obterConexao();    
  //   //--------- PROMISE --------------//
  //   let resultado = new Promise( (resolve, reject) => {
  //     let dbRefCursos = ref(connectionDB,'cursos');
  //     runTransaction(dbRefCursos, async (cursos) => { 
  //       let dbRefNovoCurso;
  //       // Recuperando o UID do Aluno - Será necessário que ele tenha se 
  //       // registrado previamente no sistema. Senão, vamos indexá-lo pela matrícula 
  //       // e depois faremos a correção
  //       let daoUsuario = new DaoUsuario();
  //       let usr = await daoUsuario.obterUsuarioPeloEmail(curso.instrutor.getEmail());

  //       // console.log( {
  //       //   sigla: curso.getSigla(),
  //       //   nome: curso.getNome(), 
  //       //   descricao: curso.getDescricao(),
  //       //   cargaHoraria: curso.getCargaHoraria(),
  //       //   categoria: curso.getCategoria(),
  //       //   instrutor: curso.instrutor, 
  //       //   instrutor_uid: usr.uid
  //       //   });
  //         curso.instrutor = usr.uid;
  //         console.log(curso.instrutor);
          
        
  //         dbRefNovoCurso = child(dbRefCursos, curso.getSigla());
  //         // 'sigla','nome','descricao','cargaHoraria','categoria','instrutor','instrutor_uid'
  //       let setPromise = set(dbRefNovoCurso, curso);
  //       setPromise.then( value => {resolve(true)},  erro => {reject(erro)});
  //     });
  //   });
  //   return resultado;
  // }

  //-----------------------------------------------------------------------------------------//
  
  async incluir(curso) {
    let connectionDB = await this.obterConexao();    
      let daoUsuario = new DaoUsuario();
      let usr = await daoUsuario.obterUsuarioPeloEmail(curso.instrutor.getEmail());
    return new Promise( (resolve, reject) => {
      let dbRefCursos = ref(connectionDB,'cursos');
      runTransaction(dbRefCursos, (cursos) => {       
        let dbRefNovoCurso = child(dbRefCursos, curso.getSigla());
        let setPromise = set(dbRefNovoCurso, {...curso, instrutor: usr.uid});
        // Definimos o resultado da operação
        setPromise
          .then( value => {
            resolve(true)
          })
          .catch((e) => {
            console.log("#ERRO: " + e);
            resolve(false);
          });
      });
    });
    // return resultado;
  }
  //-----------------------------------------------------------------------------------------//
  
  
  async alterar(curso) {
    let connectionDB = await this.obterConexao();
    let daoUsuario = new DaoUsuario();
    let usr = await daoUsuario.obterUsuarioPeloEmail(curso.instrutor.getEmail());
    return new Promise((resolve, reject) => {
      let dbRefCursos = ref(connectionDB, "cursos");
      runTransaction(dbRefCursos, cursos => {
        let dbRefCursoAlterado = child(dbRefCursos, curso.getSigla());
        let setPromise = set(dbRefCursoAlterado, {...curso, instrutor: usr.uid});
        setPromise
        .then(value => {
            resolve(true);
          })
          .catch(e => {
            console.log("#ERRO: " + e);
            resolve(false);
          });
        });
      });
      // return resultado;
    }
    
    //-----------------------------------------------------------------------------------------//
    
    
    // Não incluso no MdC
    // async excluir(curso) {
      //   let connectionDB = await this.obterConexao();
      //   return new Promise((resolve, reject) => {
        //     let dbRefCursos = ref(connectionDB, "cursos");
        //     runTransaction(dbRefCursos, cursos => {
          //       let dbRefExcluirCurso = child(dbRefCursos, curso.getSigla());
          //       let setPromise = remove(dbRefExcluirCurso, curso);
          //       setPromise
          //         .then(value => {
            //           resolve(true);
            //         })
            //         .catch(e => {
              //           console.log("#ERRO: " + e);
              //           resolve(false);
              //         });
              //     });
              //   });
              //   // return resultado;
              // }
              // 
              // 
              //               
  //-----------------------------------------------------------------------------------------//
    
  async excluir(curso) {
    let connectionDB = await this.obterConexao();
    return new Promise((resolve, reject) => {
      let dbRefCursos = ref(connectionDB, "cursos");
      runTransaction(dbRefCursos, cursos => {
        // Remove o curso
        let dbRefExcluirCurso = child(dbRefCursos, curso.getSigla());
        let setPromiseCurso = remove(dbRefExcluirCurso);
      
      // Remove as aulas do curso
      let dbRefAulas = ref(connectionDB, "aulas");
      let dbRefExcluirAulas = child(dbRefAulas, curso.getSigla());
      let setPromiseAulas = remove(dbRefExcluirAulas);
      
      // Executa as duas remoções em paralelo
      Promise.all([setPromiseCurso, setPromiseAulas])
        .then(values => {
          resolve(true);
        })
        .catch(e => {
          console.log("#ERRO: " + e);
          resolve(false);
        });
      });
    });
  }
//-----------------------------------------------------------------------------------------//
}

