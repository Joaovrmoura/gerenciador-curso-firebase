import {
  getDatabase,
  ref,
  query,
  get,
  set,
  remove,
  orderByChild,
  child,
  runTransaction,
  onValue,
  onChildAdded,
  orderByKey,
  equalTo,
  push,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

import Instrutor from "../Instrutor.js";
import ModelError from "../error/ModelError.js";
import UsuarioDAO from "./UsuarioDAO.js";

class InstrutorDAO {
  static promessaConexao = null;

  constructor() {
    this.obterConexao();
  }

  obterConexao() {
    if (InstrutorDAO.promessaConexao == null) {
      InstrutorDAO.promessaConexao = new Promise((resolve, reject) => {
        const db = getDatabase();
        if (db) resolve(db);
        else
          reject(
            new ModelError("Não foi possível estabelecer conexão com o BD")
          );
      });
    }
    return InstrutorDAO.promessaConexao;
  }
  

  async obterInstrutorPeloUid(uid) {
    let connectionDB = await this.obterConexao();
    return new Promise(resolve => {
      let dbRefInstrutores = ref(connectionDB, "instrutores/" + uid);
      let consulta = query(dbRefInstrutores);
      let resultPromise = get(consulta);

      resultPromise.then(dataSnapshot => {
        let instrutorSnap = dataSnapshot.val();
        if (instrutorSnap != null) {
          resolve(
            new Instrutor(instrutorSnap.nome, instrutorSnap.email, instrutorSnap.fone)
          );
        } else resolve(null);
      });
    });
  }

  async obterInstrutorPeloEmail(email) {
    let connectionDB = await this.obterConexao();
    return new Promise(resolve => {
      let dbRefUsuario = ref(connectionDB, "instrutores");
      let paramConsulta = orderByChild("email");
      let paramEqual = equalTo(email);
      let consulta = query(dbRefUsuario, paramConsulta, paramEqual);
      let resultPromise = get(consulta);
      resultPromise.then(dataSnapshot => {
        let usr = dataSnapshot.val();
        console.log(usr);
        if (usr != null) {
          const usrData = Object.values(usr)[0];

          // TEM QUE  VOLTA A SER NEW Usuario(usrData.email, usrData.uid, usrData.funcao)

          // Retorna um objeto com chave de UID e valor sendo outro objeto com as informações
          // console.log("Instrutor da consulta pelo e-mail: ");
          // console.log(usr);
          // console.log(Object.values(usr)[0]);
          // console.log(usrData.email);
          // console.log(usrData.uid);
          // console.log(usrData.funcao);
          
          resolve(new Instrutor(usrData.nome, usrData.email, usrData.fone));
        } else {
          resolve(null);
        }
      });
    });
  }


  async obterInstrutores() {
    let connectionDB = await this.obterConexao();

    return new Promise((resolve, reject) => {
      let conjAlunos = [];
      let dbRefAlunos = ref(connectionDB, "instrutores");
      let paramConsulta = orderByChild("email");
      let consulta = query(dbRefAlunos, paramConsulta);

      get(consulta).then(dataSnapshot => {
        if (!dataSnapshot.exists()) {
          // Se não existe, retorna array vazio
          resolve(conjAlunos);
          return;
        }

        dataSnapshot.forEach(childSnapshot => {
          let elem = childSnapshot.val();
          conjAlunos.push(new Instrutor(elem.nome, elem.email, elem.fone));
        });

        resolve(conjAlunos);
      }).catch(error => {
        reject(error);
      });
    });
  }

  async incluir(instrutor) {
  let connectionDB = await this.obterConexao();
  let resultado = new Promise((resolve, reject) => {

    let dbRefInstrutores = ref(connectionDB, "instrutores");
    
    runTransaction(dbRefInstrutores, async instrutores => {
      let daoUsuario = new UsuarioDAO();
      let usr = await daoUsuario.obterUsuarioPeloEmail(instrutor.getEmail());
      if (usr !== undefined && usr !== null) {
        // O instrutor já foi cadastrado como um usuário do sistema
        let dbRefNovoInstrutor = ref(connectionDB, "instrutores/" + usr.uid); // /instrutores/$uid
        // Guarda no ref definido acima o objeto 'instrutor' recebido por parâmetro
        let setPromise = set(dbRefNovoInstrutor, instrutor);
        setPromise.then(
          value => {
            resolve(true);
          },
          erro => {
            reject(erro);
          }
        );
      } else {
        reject("Esse instrutor ainda não foi cadastrado como usuário.");
      }
      return; // retorna undefined para finalizar a transação
      }); // fim do runTransaction
    }); // fim da Promise

    return resultado; // retorna a Promise criada
  }
                                  
  async alterar(instrutor) {
    let connectionDB = await this.obterConexao();
    let resultado = new Promise((resolve, reject) => {
      let dbRefInstrutores = ref(connectionDB, "instrutores");
      runTransaction(dbRefInstrutores, async instrutores => {
        let daoUsuario = new UsuarioDAO();
        let usr = await daoUsuario.obterUsuarioPeloEmail(instrutor.getEmail());
        // let dbRefAlterarAluno = child(dbRefAlunos, aluno.getMatricula());
        let dbRefAlterarInstrutor = child(dbRefInstrutores, usr.uid);

        let setPromise = set(dbRefAlterarInstrutor, instrutor);
        setPromise.then(
          value => {
            resolve(true);
          },
          erro => {
            reject(erro);
          }
        );
      });
    });
    return resultado;
  }
}
export default InstrutorDAO;
