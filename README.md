Base do projeto do Alessandro:

[Link do último projeto dele](https://glitch.com/edit/#!/prjpwa-faeterj-firebase)

Regras atualidades do João:

```js
{
    "rules": {
        /*****
         ***** REGRAS GERAIS
         *****/
        /*---- Leitura: dono do projeto no Firebase e usuários com função ADMIN ----*/
        ".read": "auth.token.isAdmin == true || root.child('usuarios').child(auth.uid).child('funcao').val() === 'ADMIN'",
        /*---- Escrita: dono do projeto no Firebase ----*/
        ".write": "auth.token.isAdmin == true || root.child('usuarios').child(auth.uid).child('funcao').val() === 'ADMIN'",

        /********** USUÁRIOS *****/
        "usuarios": {
            /*---- Indexação: 'email' para cada filho de usuários ----*/
            ".indexOn": ["email"],
            /*---- Para cada filho de usuários ----*/
            "$uid": {
                /*---- Validação: deverá ter as entradas uid, email e funcao ----*/
                ".validate" : "newData.hasChildren(['email','funcao'])",
                /*---- Leitura: Se a entrada corresponder ao auth.uid ----*/
                ".read": "$uid === auth.uid",
                /*---- Escrita: Se a entrada corresponder ao auth.uid e o valor da entrada funcao for MORADOR ----*/
                ".write": "$uid === auth.uid && newData.child('funcao').val() == 'ALUNO'",
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
        "audiencia": {
          "$uid": {
              ".read" : "$uid === auth.uid && root.child('usuarios').child(auth.uid).child('funcao').val() === 'ALUNO'",
          }
        }
    }
}
```
