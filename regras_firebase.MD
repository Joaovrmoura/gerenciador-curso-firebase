	
{
    "rules": {
        ".read": "auth.token.isAdmin == true || root.child('usuarios').child(auth.uid).child('funcao').val() === 'ADMIN'",
        ".write": "auth.token.isAdmin == true || root.child('usuarios').child(auth.uid).child('funcao').val() === 'ADMIN'",

        /********** USUÁRIOS *****/
        "usuarios": {
            ".indexOn": ["email"],
            "$uid": {
                ".validate" : "newData.hasChildren(['email','funcao'])",
                ".read": "$uid === auth.uid",
               ".write": "$uid === auth.uid && (newData.child('funcao').val() == 'ALUNO' || newData.child('funcao').val() == 'INSTRUTOR')"    
            }
        },
  
        /******** INSCRIÇÕES ****/
        "inscricoes": {
            "$uid": {
                ".read" : "$uid === auth.uid && root.child('usuarios').child(auth.uid).child('funcao').val() === 'ALUNO'",
                ".write": "$uid === auth.uid && root.child('usuarios').child(auth.uid).child('funcao').val() === 'ALUNO'",
                "$siglaCurso" : {
                    ".validate" : "root.child('cursos').child($siglaCurso).exists() === true"
                 }
             }
         },
           
       /******** ALUNOS ****/
       "alunos" : {
            ".indexOn": ["email"],
            "$uid": {
                ".validate" : "newData.hasChildren(['nome','email','fone'])",
                ".read": "$uid === auth.uid",
                ".write": "$uid === auth.uid && root.child('usuarios').child(auth.uid).child('funcao').val() === 'ALUNO'"
            }
        },
          
      /******** INSTRUTORES: QUALQUER USUÁRIO AUTENTICADO PODE LER O NÓ DE INSTRUTORES ****/
      "instrutores" : {
            ".indexOn": ["email"],
            "$uid": {
                ".validate" : "newData.hasChildren(['nome','email','fone'])",
                ".read": "root.child('usuarios').child(auth.uid).exists() === true",
                ".write": "$uid === auth.uid && root.child('usuarios').child(auth.uid).child('funcao').val() === 'INSTRUTOR'"
            }
        },
          
        /******** CURSOS ****/
        "cursos" : {
            ".read": "root.child('usuarios').child(auth.uid).exists() === true",
            ".indexOn": ["nome", "categoria"],
            "$sigla" : {
                ".validate" : "newData.hasChildren(['nome','descricao','cargaHoraria','categoria','instrutor'])",
                "instrutor" : {
                    ".validate" : "root.child('usuarios').child(newData.val()).child('funcao').val() === 'INSTRUTOR'"
                }
            }
        },
       
        /******** AULAS ****/
        "aulas" : {
            "$siglaCurso" : {
                ".read": "(root.child('usuarios').child(auth.uid).child('funcao').val() === 'ALUNO' && root.child('inscricoes').child(auth.uid).child($siglaCurso).exists() == true) || (root.child('usuarios').child(auth.uid).child('funcao').val() === 'INSTRUTOR' && root.child('cursos').child($siglaCurso).child('instrutor').val() == auth.uid)",
                ".write": "root.child('usuarios').child(auth.uid).child('funcao').val() === 'INSTRUTOR' && root.child('cursos').child($siglaCurso).child('instrutor').val() == auth.uid",
                "$numOrdem" : {
                    ".validate" : "newData.hasChildren(['conteudo'])"
                }
            }
        },
          
        /******** AULAS ****/
        "audiencia": {
          "$uid": {
              ".read" : "$uid === auth.uid && root.child('usuarios').child(auth.uid).child('funcao').val() === 'ALUNO'",
          }
        }
    }
}