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

import Curso from "../Curso.js";
import ModelError from "../error/ModelError.js";

class CursoDAO {
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
        if (curso != null) resolve(new Curso(curso.sigla, curso.nome));
        else resolve(null);
      });
    });
  }

  async obterCursos() {
    let connectionDB = await this.obterConexao();
    return new Promise(resolve => {
      let conjCursos = [];
      let dbRefCursos = ref(connectionDB, "cursos");
      let consulta = query(dbRefCursos);
      let resultPromise = get(consulta);
      resultPromise
        .then(dataSnapshot => {
          let tamanho = dataSnapshot.length;
          dataSnapshot.forEach((dataSnapshotObj, index) => {
            let elem = dataSnapshotObj.val();
            conjCursos.push(new Curso(elem.sigla, elem.nome));
            if (index == tamanho - 1) resolve(conjCursos);
          });
          resolve(conjCursos);
        })
        .catch(e => {
          console.log("#ERRO: " + e);
          resolve([]);
        });
    });
  }

  async incluir(curso) {
    let connectionDB = await this.obterConexao();
    return new Promise((resolve, reject) => {
      let dbRefCursos = ref(connectionDB, "cursos");
      runTransaction(dbRefCursos, cursos => {
        let dbRefNovoCurso = child(dbRefCursos, curso.getSigla());
        let setPromise = set(dbRefNovoCurso, curso);
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

  async alterar(curso) {
    let connectionDB = await this.obterConexao();
    return new Promise((resolve, reject) => {
      let dbRefCursos = ref(connectionDB, "cursos");
      runTransaction(dbRefCursos, cursos => {
        let dbRefCursoAlterado = child(dbRefCursos, curso.getSigla());
        let setPromise = set(dbRefCursoAlterado, curso);
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

  // Não incluso no MdC
  async excluir(curso) {
    let connectionDB = await this.obterConexao();
    return new Promise((resolve, reject) => {
      let dbRefCursos = ref(connectionDB, "cursos");
      runTransaction(dbRefCursos, cursos => {
        let dbRefExcluirCurso = child(dbRefCursos, curso.getSigla());
        let setPromise = remove(dbRefExcluirCurso, curso);
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
}

export default CursoDAO;
