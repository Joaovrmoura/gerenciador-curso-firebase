Sistema de Gerenciamento de cursos
link do projeto rodando: https://joaovrmoura.github.io/gerenciador-curso-firebase/

Casos de Uso implementados ( Usuário Admin/Instrutor/Aluno)
👤usuário/
Admin: Pode fazer o CRUD completo de cursos.
Instrutor: Pode visualizar, incluir e editar as aulas do curso que ministra.
Aluno: Pode apenas visualizar os cursos disponíveis.
Como usar
Adicione o arquivo de regras do firebase (está na raiz do projeto em regras_firebase.MD).
Cadastre-se como aluno ou instrutor. Para ser admin mude manualmente a função do usuário para admin no banco de dados.

OBS: Usuário ADMIN/
1 - Para acrescentar cursos, a sigla deve ser única e ter exatamente 3 caracteres.
O instrutor do curso vai ser adicionado pelo email. Todo curso deve ter um instrutor.
2- A categoria do curso só pode ser Idiomas, Tecnologia ou Concursos.


Controllers (Controladores)
📁 controller/
CtrlEfetuarLogin.js - Controla o processo de autenticação/login e redireciona baseado no tipo de usuário
CtrlManterAluno.js - Exibe os cursos disponíveis e suas inscrições (processo de inscrições não implementado) 
CtrlManterCurso.js - Gerencia operações de CRUD dos cursos pelo administrador.
CtrlManterInstrutor.js - Gerencia operações de CRUD das aulas pelo instrutor
CtrlNovaConta.js - Controla criação de novas contas
CtrlSessao.js - Gerencia a sessão do usuário, verificando autenticação, permissões e carregando o controlador adequado conforme a página acessada.

Model - Data Access Objects (DAO)
📁 model/DAO/
AlunoDAO.js - Acesso a dados de alunos no Firebase
AudienciaDAO.js - Acesso a dados de audiências (não implementado)
AulaDAO.js - Acesso a dados de aulas 
CursoDAO.js - Acesso a dados de cursos
InscricaoDAO.js - Acesso a dados de inscrições (não implementado)
InstrutorDAO.js - Acesso a dados de instrutores
UsuarioDAO.js - Acesso a dados de usuários

Entidades
📁model/
Aluno.js - Entidade
Audiencia.js - Entidade
Aula.js - Entidade
Curso.js - Entidade
Inscricao.js - Entidade
Instrutor.js - Entidade
ModelError.js - Classe personalizada de erro
Usuario.js - Entidade

Viewers (Visualizações)
📁 viewer/
Status.js - Status de edição 
ViewerAluno.js - Interface para gerenciamento de cursos do aluno
ViewerCriarNovaConta.js - Interface para criação de contas
ViewerCurso.js - Interface para gerenciamento de cursos
ViewerError.js - Classe personalizada de erro
ViewerInstrutor.js - Interface para gerenciamento das aulas do instrutor
ViewerLogin.js - Interface de login

Páginas HTML do projeto (estão na raiz, pois estamos usando o github pages)
cadastro.html - Página HTML de cadastro
index.html - Página HTML principal 
initAdmin.html - Página HTML inicial do administrador
initAluno.html - Página HTML inicial para visualização dos cursos disponíveis 
initCurso.html - Página HTML principal para o gerenciamento de cursos
initInstrutor.html - Página HTML principal para o gerenciamento de aulas do instrutor
login.html - Página HTML de login 

Outras Estruturas
📁 enum/
Contém o enum das categorias dos cursos que só podem ser idiomas, Tecnologia, Concursos.
📁 firebase/
Configurações e inicialização do Firebase
📁 public/
Arquivos estáticos e públicos

Resumo por Categoria
Controllers (6 componentes)
Responsáveis pela lógica de negócio e coordenação entre Model e View
DAOs (7 componentes)
Responsáveis pelo acesso e manipulação de dados no Firebase
Error (1 Componente)
Responsável pelo tratamento específico de erros por entidade
Viewers (6 componentes)
Responsáveis pela interface do usuário e apresentação dos dados

Exemplo de criação de Curso:

