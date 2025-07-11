// "use strict";

// // A cláusula 'import' é utilizada sempre que uma classe precisar conhecer a estrutura
// // de outra classe. No arquivo referenciado após o 'from' é necessário informar o que
// // para a ser visível para a classe que utiliza o import. Para isso, lá colocamos a 
// // indicação 'export'

// import { getDatabase, ref, query, onValue, onChildAdded, orderByChild, 
//         child, orderByKey, equalTo, get, set, remove, push, runTransaction } 
//   from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

// // Importamos a definição da classe Curso
// import Curso from "/model/Curso.js";
// // Importamos a definição da classe ModelError
// import ModelError from "/model/ModelError.js";

// /*
//  * DAO --> Data Access Object
//  * A responsabilidade de um DAO é fazer uma ponte entre o programa e o 
//  * recurso de persistência dos dados (ex. SGDB)
//  */

// export default class DaoInscricao {
  
//   //-----------------------------------------------------------------------------------------//

//   // único atributo presente em DaoCurso. Observe que é um atributo estático; ou seja,
//   // se tivermos mais de um objeto DaoCurso, todos vão compartilhar o mesmo atributo
//   // conexão.
//   static promessaConexao = null;

//   // Construtor: vai tentar estabelecer uma conexão com o IndexedDB
//   constructor() {
//     this.obterConexao();
//   }

//   //-----------------------------------------------------------------------------------------//
  
//   /*
//    *  Devolve uma Promise com a referência para o Realtime Database
//    */ 
//   obterConexao() {
//     // Como 'promessaConexao' é um atributo estático, usamos o nome da classe 
//     // para acessá-lo
//     if(DaoCurso.promessaConexao == null) {
//       DaoCurso.promessaConexao = new Promise((resolve, reject) => {
//         const db = getDatabase();
//         if(db)
//             resolve(db);
//         else 
//             reject(new ModelError("Não foi possível estabelecer conexão com o BD"));
//       });
//     }
//     return DaoCurso.promessaConexao;
//   }
  
//   //-----------------------------------------------------------------------------------------//
  
//   async obterCursoPelaSigla(sigla) {
//     // Recuperando a conexão com o Realtime Database
//     let connectionDB = await this.obterConexao();   
//     // Retornamos uma Promise que nos dará o resultado
//     return new Promise((resolve) => {
//       // Definindo uma 'ref' para o objeto no banco de dados
//       let dbRefCurso = ref(connectionDB,'cursos/' + sigla );
//       // Executando a consulta a partir da 'ref'
//       let consulta = query(dbRefCurso);
//       // Obtendo os dados da query. Nos devolve uma Promise
//       let resultPromise = get(consulta);
//       // Recuperando o resultado usando 'then'
//       resultPromise.then(dataSnapshot => {
//         // Pego o valor (objeto) da consulta
//         let curso = dataSnapshot.val();
//         // Se há algum objeto no Firebase dado como resposta
//         if(curso != null) 
//           // Instancio um objeto Curso a partir do val()
//           resolve(new Curso(curso.sigla, curso.nome));
        
//         else
//           resolve(null);
//       });
//     });
//   }

//   //-----------------------------------------------------------------------------------------//
//   // Esse método devolve todos os objeto Curso ordenados pela 'sigla', 
//   // pois será utilizado o índice. 

//   async obterCursos() {
//     // Recuperando a conexão com o Realtime Database
//     let connectionDB = await this.obterConexao();      
//     // Retornamos uma Promise que nos dará o resultado
//     return new Promise((resolve) => {
//       // Declaramos uma variável que referenciará o array com os objetor Curso
//       let conjCursos = [];      
//       // Definindo uma 'ref' para o objeto no banco de dados      
//       let dbRefCursos = ref(connectionDB,'cursos');
//       // Executo a query a partir da 'ref' definida
//       let consulta = query(dbRefCursos);
//       // Recupero a Promise com o resultado obtido
//       let resultPromise = get(consulta);
//       // Com o resultado, vamos montar o array de resposta
//       resultPromise.then(dataSnapshot => {
//         let tamanho = dataSnapshot.length;
//         // Para cada objeto presente no resultado
//         dataSnapshot.forEach((dataSnapshotObj,index) => {
//           // Recupero o objeto com val()
//           let elem = dataSnapshotObj.val();
//           // Instancio um objeto Curso e o coloco no array de resposta
//           conjCursos.push(new Curso(elem.sigla, elem.nome));
//           // Se é o último objeto a retornar
//           if(index == tamanho - 1)
//             resolve(conjCursos);          
//         });
//         // Ao final do 'forEach', coloco o array como resolve da Promise a ser retornada
//         resolve(conjCursos);
//       }).catch((e) => { console.log("#ERRO: " + e); resolve([])});
//     });
//   }

//   //-----------------------------------------------------------------------------------------//

//   // async incluir(curso) {
//   //   let connectionDB = await this.obterConexao();    
//   //   return new Promise( (resolve, reject) => {
//   //     let dbRefCursos = ref(connectionDB, 'aulas');

//   //     runTransaction(dbRefCursos, (cursos) => {       
//   //       let dbRefNovoCurso = child(dbRefCursos,curso.getSigla());
//   //       let setPromise = set(dbRefNovoCurso,curso);
//   //       setPromise
//   //         .then( value => {resolve(true)})
//   //         .catch((e) => {console.log("#ERRO: " + e);resolve(false);});
//   //     });
//   //   });
//   //   return resultado;
//   // }

//   //-----------------------------------------------------------------------------------------//

//   async incluir(aula) {
//     // Recuperando a conexão com o Realtime Database
//     let connectionDB = await this.obterConexao();    
//     // siglaCurso, numOrdem, conteudo

//     return new Promise((resolve, reject) => {
//       // Referência para a raiz de 'aulas'
//       let dbRefAulas = ref(connectionDB, 'aulas');
      
//       // Inicia uma transação na raiz 'aulas'
//       runTransaction(dbRefAulas, (aulas) => {
//         // Monta o child 'aulas/$siglaCurso/$numOrdem'
//         let dbRefNovaAula = child(dbRefAulas, `${aula.Curso.getSigla()}/${aula.getNumOrdem()}`);
        
//         // Inclui ou atualiza a aula usando 'set'
//         let setPromise = set(dbRefNovaAula, { conteudo: aula.getConteudo() });
        
//         // Define o resultado da operação
//         setPromise
//           .then(value => { resolve(true); })
//           .catch((e) => { console.log("#ERRO ao incluir aula: " + e); resolve(false); });
        
//         return aulas; // Importante: precisa retornar o valor da transação
//       });
//     });
//   }

//   //-----------------------------------------------------------------------------------------//

//   async alterar(curso) {
//     // Recuperando a conexão com o Realtime Database
//     let connectionDB = await this.obterConexao();    
//     // Retornamos uma Promise que nos informará se a inclusão foi realizada ou não
//     return new Promise( (resolve, reject) => {
//       // Monto a 'ref' para a entrada 'cursos' para a inclusão
//       let dbRefCursos = ref(connectionDB,'cursos');
//       // Inicio uma transação
//       runTransaction(dbRefCursos, (cursos) => {       
//         // Monto um child de 'cursos', onde vamos colocar a alteração do . Esse filho 
//         // de 'cursos' que é formado pela 'ref' 'cursos' (dbRefCursos) mais a sigla 
//         // do novo curso
//         let dbRefCursoAlterado = child(dbRefCursos,curso.getSigla());
//         // 'set' também é utilizado para alterar um objeto no Firebase a partir de seu 
//         // 'ref'. Como devolve uma promise, definimos o resultado pelo 'then'
//         let setPromise = set(dbRefCursoAlterado,curso);
//         // Definimos o resultado da operação
//         setPromise
//           .then( value => {resolve(true)})
//           .catch((e) => {console.log("#ERRO: " + e);resolve(false);});
//       });
//     });
//     return resultado;
//   }
  
//   //-----------------------------------------------------------------------------------------//

//   async excluir(curso) {
//     // Recuperando a conexão com o Realtime Database
//     let connectionDB = await this.obterConexao();    
//     // Retornamos uma Promise que nos informará se a inclusão foi realizada ou não
//     return new Promise( (resolve, reject) => {
//       // Monto a 'ref' para a entrada 'cursos' para a inclusão
//       let dbRefCursos = ref(connectionDB,'cursos');
//       // Inicio uma transação
//       runTransaction(dbRefCursos, (cursos) => {       
//         // Monto um child de 'cursos', onde vamos promover a exclusão do curso. Esse filho 
//         // de 'cursos' que é formado pela 'ref' 'cursos' (dbRefCursos) mais a sigla 
//         // do novo curso
//         let dbRefExcluirCurso = child(dbRefCursos,curso.getSigla());
//         // 'remove'  é utilizado para excluir um  objeto no Firebase a partir de seu 
//         // 'ref'. Como devolve uma promise, definimos o resultado pelo 'then'
//         let setPromise = remove(dbRefExcluirCurso,curso);
//         // Definimos o resultado da operação
//         setPromise
//           .then( value => {resolve(true)})
//           .catch((e) => {console.log("#ERRO: " + e);resolve(false);});
//       });
//     });
//     return resultado;
//   }
//   //-----------------------------------------------------------------------------------------//
// }
