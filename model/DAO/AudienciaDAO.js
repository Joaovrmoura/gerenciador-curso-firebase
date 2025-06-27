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

import Audiencia from "../Audiencia.js";
import ModelError from "../error/ModelError.js";

class AudienciaDAO {
  static promessaConexao = null;

  constructor() {
    this.obterConexao();
  }

  obterConexao() {
    if (AudienciaDAO.promessaConexao == null) {
      AudienciaDAO.promessaConexao = new Promise((resolve, reject) => {
        const db = getDatabase();
        if (db) resolve(db);
        else
          reject(
            new ModelError("Não foi possível estabelecer conexão com o BD")
          );
      });
    }
    return AudienciaDAO.promessaConexao;
  }

export default AudienciaDAO;
