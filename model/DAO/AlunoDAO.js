import {
  getDatabase,
  ref,
  query,
  orderByChild,
  child,
  get,
  set,
  runTransaction,
  onValue,
  onChildAdded,
  orderByKey,
  equalTo,
  remove,
  push,
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";
import ModelError from "../error/ModelError.js";
import Aluno from "../Aluno.js";
import UsuarioDAO from "./UsuarioDAO.js";

class AlunoDAO {
  static promessaConexao = null;

  constructor() {
    this.obterConexao();
  }

  async obterConexao() {
    if (AlunoDAO.promessaConexao == null) {
      AlunoDAO.promessaConexao = new Promise((resolve, reject) => {
        const db = getDatabase();
        if (db) resolve(db);
        else
          reject(
            new ModelError("Não foi possível estabelecer conexão com o BD")
          );
      });
    }
    return AlunoDAO.promessaConexao;
  }

  async obterAlunoPeloUid(uid) {
    let connectionDB = await this.obterConexao();
    return new Promise(resolve => {
      let dbRefAluno = ref(connectionDB, "alunos/" + uid);
      let consulta = query(dbRefAluno);
      let resultPromise = get(consulta);
      resultPromise.then(dataSnapshot => {
        let alunoSnap = dataSnapshot.val();
        if (alunoSnap != null) {
          resolve(
            new Aluno(alunoSnap.nome, alunoSnap.dataNasc, alunoSnap.email)
          );
        } else resolve(null);
      });
    });
  }
 
  async obterAlunos() {
    let connectionDB = await this.obterConexao();

    return new Promise(resolve => {
      let conjAlunos = [];
      let dbRefAlunos = ref(connectionDB, "alunos");
      let paramConsulta = orderByChild("matricula");
      let consulta = query(dbRefAlunos, paramConsulta);
      let resultPromise = get(consulta);
      resultPromise.then(dataSnapshot => {
        let tamanho = dataSnapshot.length;
        dataSnapshot.forEach(async (dataSnapshotObj, index) => {
          let elem = dataSnapshotObj.val();
          conjAlunos.push(new Aluno(elem.nome, elem.dataNasc, elem.email));
          if (index == tamanho - 1) resolve(conjAlunos);
        });
      });
    });
  }

  async incluir(aluno) {
    let connectionDB = await this.obterConexao();
    let resultado = new Promise((resolve, reject) => {
      let dbRefAlunos = ref(connectionDB, "alunos");
      runTransaction(dbRefAlunos, async alunos => {
        let dbRefNovoAluno;
        let daoUsuario = new UsuarioDAO();
        let usr = await daoUsuario.obterUsuarioPeloEmail(aluno.getEmail());
        if (usr !== undefined && usr !== null) {
          dbRefNovoAluno = child(dbRefAlunos, usr.uid);
        }
        let setPromise = set(dbRefNovoAluno, aluno);
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

  async alterar(aluno) {
    let connectionDB = await this.obterConexao();
    let resultado = new Promise((resolve, reject) => {
      let dbRefAlunos = ref(connectionDB, "alunos");
      runTransaction(dbRefAlunos, async alunos => {
        let daoUsuario = new UsuarioDAO();
        let usr = await daoUsuario.obterUsuarioPeloEmail(aluno.getEmail());
        // let dbRefAlterarAluno = child(dbRefAlunos, aluno.getMatricula());
        let dbRefAlterarAluno = child(dbRefAlunos, usr.uid);

        let setPromise = set(dbRefAlterarAluno, aluno);
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

export default AlunoDAO;
