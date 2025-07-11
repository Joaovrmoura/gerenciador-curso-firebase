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
import ModelError from "../error/ModelError.js";
import Usuario from "../Usuario.js";
import UsuarioDTO from "../DTO/UsuarioDTO.js";


class DaoUsuario {
  static promessaConexao = null;

  constructor() {
    this.obterConexao();
  }

  async obterConexao() {
    if (DaoUsuario.promessaConexao == null) {
      DaoUsuario.promessaConexao = new Promise(function (resolve, reject) {
        const db = getDatabase();
        if (db) resolve(db);
        else
          reject(
            new ModelError("Não foi possível estabelecer conexão com o BD")
          );
      });
    }
    return DaoUsuario.promessaConexao;
  }

  async obterUsuarioPeloUID(uid) {
    let connectionDB = await this.obterConexao();
    return new Promise(resolve => {
      let dbRefUsuario = ref(connectionDB, "usuarios/" + uid);
      let consulta = query(dbRefUsuario);
      let resultPromise = get(consulta);
      resultPromise.then(dataSnapshot => {
        let usr = dataSnapshot.val();
        if (usr != null) resolve(new Usuario(usr.email, usr.uid, usr.funcao));
        else resolve(null);
      });
    });
  }

  async obterUsuarioPeloEmail(email) {
    let connectionDB = await this.obterConexao();
    return new Promise(resolve => {
      let dbRefUsuario = ref(connectionDB, "usuarios");
      let paramConsulta = orderByChild("email");
      let paramEqual = equalTo(email);
      let consulta = query(dbRefUsuario, paramConsulta, paramEqual);
      let resultPromise = get(consulta);
      resultPromise.then(dataSnapshot => {
        let usr = dataSnapshot.val();
        console.log(usr);
        if (usr != null) {
          const usrData = Object.values(usr)[0];
          resolve(new Usuario(usrData.email, usrData.uid, usrData.funcao));
        } else {
          resolve(null);
        }
      });
    });
  }

  async obterUsuarios() {
    let connectionDB = await this.obterConexao();

    return new Promise(resolve => {
      let conjUsuarios = [];
      let dbRefUsuarios = ref(connectionDB, "usuarios");
      let paramConsulta = orderByChild("email");
      let consulta = query(dbRefUsuarios, paramConsulta);
      let resultPromise = get(consulta);
      resultPromise.then(
        dataSnapshot => {
          dataSnapshot.forEach(dataSnapshotObj => {
            let elem = dataSnapshotObj.val();
            conjUsuarios.push(new Usuario(elem.email, elem.uid, elem.funcao));
          });
          resolve(conjUsuarios);
        },
        e => console.log("#" + e)
      );
    });
  }

  async incluir(usuario) {
    let connectionDB = await this.obterConexao();
    let resultado = new Promise((resolve, reject) => {
      let dbRefUsuario = ref(connectionDB, "usuarios/" + usuario.getUid());
      let setPromise = set(dbRefUsuario, new UsuarioDTO(usuario));
      setPromise.then(
        value => {
          resolve(true);
        },
        erro => {
          reject(erro);
        }
      );
    });
    return resultado;
  }

  async alterar(usuario) {
    let connectionDB = await this.obterConexao();
    let resultado = new Promise((resolve, reject) => {
      let dbRefUsuario = ref(connectionDB, "usuarios/" + usuario.getUid());
      let setPromise = set(dbRefUsuario, new UsuarioDTO(usuario));
      setPromise.then(
        value => {
          resolve(true);
        },
        erro => {
          reject(erro);
        }
      );
    });
    return resultado;
  }

  async excluir(usuario) {
    let connectionDB = await this.obterConexao();
    let resultado = new Promise((resolve, reject) => {
      let dbRefUsuario = ref(connectionDB, "usuarios/" + usuario.getUid());
      let setPromise = remove(dbRefUsuario);
      setPromise.then(
        value => {
          resolve(true);
        },
        erro => {
          reject(erro);
        }
      );
    });
    return resultado;
  }
}

export default DaoUsuario;
