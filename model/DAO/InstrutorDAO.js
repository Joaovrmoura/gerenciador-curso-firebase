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
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";

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
    });
    return resultado;
  }

export default InstrutorDAO;
