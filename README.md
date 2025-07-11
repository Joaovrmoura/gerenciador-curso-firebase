O VIWER DO ALUNO ESTA COMENTADO POIS AINDA ESTOU IMPLEMENTANDO
as regras do FIREBASE  estão em REGRAS_FIREBASE.txt 

Quando fizer login como ADMIN/INSTRUTOR/ALUNO:
admin: vai para uma página initAdmin.html, aqui vc vai escolher a operção 
que quer fzr como admin (a única funcionalidade que implementei foi de Gerenciar Cursos)

viewers/controllers
viewerCursos -> CtrlManterCuros : Uso do admin
ViewerInstrutor -> CtrlManterInstrutor: Uso do instrutor
viewerAluno -> CtrlManterAluno : Uso do aluno

Casos de Uso: Administrador pode fazer o CRUD de cursos

Casos de Uso: Instrutor pode fazer o CRUD(retirei a lógica de excluir aula pq o
estava dando problema na hora de implemetar o numOrdem de aulas) 

Caso de Uso: Aluno pode visualizar os Cursos(Não fiz inscrição nem a visualização das aulas)

aluno: initAluno.html(ler cursos)

intrutor: initInstrutor.html(gerenciar aulas)


AS CLASSES SÃO INICIADAS NO CtrlSessao

passei o this.usuario para o construtor das classes controller que preciso.
pois precisava saber quem é o usuário logado para implementar algumas lógicas
EXEMPLO: o instrutor só pode ler os cursos que ele é o instrutor
então passei o this.usuario(que vem da CtrlSessao) para o construtor
para saber o uid do instrutor


