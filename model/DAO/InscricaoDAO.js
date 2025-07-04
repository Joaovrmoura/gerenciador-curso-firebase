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

import Inscricao from "../Inscricao.js";
import ModelError from "../error/ModelError.js";

class inscricaoDAO {
  static promessaConexao = null;

  constructor() {
    this.obterConexao();
  }

  obterConexao() {
    if (inscricaoDAO.promessaConexao == null) {
      inscricaoDAO.promessaConexao = new Promise((resolve, reject) => {
        const db = getDatabase();
        if (db) resolve(db);
        else
          reject(
            new ModelError("Não foi possível estabelecer conexão com o BD")
          );
      });
    }
    return inscricaoDAO.promessaConexao;
  }
}
export default inscricaoDAO;
