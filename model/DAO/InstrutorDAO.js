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
          const usrData = Object.values(usr)[0]

          
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

    
  async incluir(instrutor, uid) {
    let connectionDB = await this.obterConexao();
    let resultado = new Promise((resolve, reject) => {
      let dbRefInstrutores = ref(connectionDB, "instrutores");
      runTransaction(dbRefInstrutores, async instrutores => {
        let dbRefNovoInstrutor;
        dbRefNovoInstrutor = child(dbRefInstrutores, uid);
        let setPromise = set(dbRefNovoInstrutor, instrutor);
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
