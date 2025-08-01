# To-Do List Application

Uma aplicação web completa de gerenciamento de tarefas desenvolvida com React (frontend) e Django REST Framework (backend).

## 🚀 Funcionalidades

### Obrigatórias
- ✅ CRUD completo de Tarefas
- ✅ Sistema de autenticação (registro e login)
- ✅ Marcação de tarefas como concluídas/não concluídas
- ✅ Filtragem de tarefas
- ✅ Paginação de tarefas
- ✅ Frontend em React
- ✅ Backend com Django REST Framework

### Opcionais
- ✅ Criação e gerenciamento de categorias
- ✅ Compartilhamento de tarefas entre usuários
- ✅ Dockerização da aplicação
- ✅ Testes unitários com pytest

## 🏗️ Arquitetura

### Backend (Django REST Framework)
- **Framework**: Django 4.2 + Django REST Framework
- **Banco de dados**: SQLite (desenvolvimento) / PostgreSQL (produção)
- **Autenticação**: JWT (JSON Web Tokens)
- **Estrutura**:
  ```
  backend/
  ├── todo_project/          # Configurações do projeto Django
  ├── tasks/                 # App de tarefas
  ├── users/                 # App de usuários
  ├── categories/            # App de categorias
  └── requirements.txt       # Dependências Python
  ```

### Frontend (React)
- **Framework**: React 18
- **Build tool**: Vite
- **Gerenciamento de estado**: Context API + useReducer
- **Roteamento**: React Router
- **HTTP Client**: Axios
- **UI**: CSS Modules + Tailwind CSS
- **Estrutura**:
  ```
  frontend/
  ├── src/
  │   ├── components/        # Componentes reutilizáveis
  │   ├── pages/            # Páginas da aplicação
  │   ├── contexts/         # Contextos React
  │   ├── services/         # Serviços de API
  │   ├── hooks/            # Custom hooks
  │   └── utils/            # Utilitários
  ├── public/               # Arquivos estáticos
  └── package.json          # Dependências Node.js
  ```

## 🛠️ Tecnologias Utilizadas

### Backend
- Python 3.11+
- Django 4.2
- Django REST Framework 3.14
- Django CORS Headers
- PyJWT
- pytest (testes)

### Frontend
- Node.js 18+
- React 18
- Vite 4
- React Router 6
- Axios
- Tailwind CSS

### DevOps
- Docker
- Docker Compose

## 📋 Pré-requisitos

- Python 3.11+
- Node.js 18+
- Docker e Docker Compose (opcional)

## 🚀 Como Executar

### Opção 1: Execução Local

#### Backend
```bash
# Navegar para o diretório backend
cd backend

# Criar ambiente virtual
python -m venv venv

# Ativar ambiente virtual
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt

# Executar migrações
python manage.py migrate

# Criar superusuário (opcional)
python manage.py createsuperuser

# Executar servidor de desenvolvimento
python manage.py runserver
```

#### Frontend
```bash
# Navegar para o diretório frontend
cd frontend

# Instalar dependências
npm install

# Executar servidor de desenvolvimento
npm run dev
```

### Opção 2: Docker (Recomendado)

```bash
# Executar com Docker Compose
docker-compose up --build

# Para executar em background
docker-compose up -d --build
```

## 🌐 Acessos

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **Admin Django**: http://localhost:8000/admin

## 🧪 Testes

### Backend
```bash
cd backend
pytest
```

### Frontend
```bash
cd frontend
npm test
```

## 📁 Estrutura do Projeto

```
todo-app/
├── backend/                 # Backend Django
│   ├── todo_project/       # Configurações do projeto
│   ├── tasks/              # App de tarefas
│   ├── users/              # App de usuários
│   ├── categories/         # App de categorias
│   ├── requirements.txt    # Dependências Python
│   └── manage.py          # Script de gerenciamento Django
├── frontend/               # Frontend React
│   ├── src/               # Código fonte
│   ├── public/            # Arquivos públicos
│   └── package.json       # Dependências Node.js
├── docker-compose.yml     # Configuração Docker
├── Dockerfile.backend     # Dockerfile do backend
├── Dockerfile.frontend    # Dockerfile do frontend
└── README.md             # Este arquivo
```

## 🎯 Decisões de Design

### Backend
1. **Arquitetura REST**: API RESTful seguindo as melhores práticas
2. **Autenticação JWT**: Tokens JWT para autenticação stateless
3. **Modelos Relacionais**: Relacionamentos entre usuários, tarefas e categorias
4. **Validação**: Validação robusta nos serializers
5. **Permissões**: Sistema de permissões baseado em usuário
6. **Paginação**: Paginação padrão do DRF para listas

### Frontend
1. **Componentes Funcionais**: Uso de hooks e componentes funcionais
2. **Context API**: Gerenciamento de estado global para autenticação
3. **Separação de Responsabilidades**: Componentes, páginas e serviços bem definidos
4. **Responsividade**: Design responsivo com Tailwind CSS
5. **UX/UI**: Interface intuitiva e moderna

### Segurança
1. **CORS**: Configuração adequada de CORS
2. **Validação**: Validação tanto no frontend quanto no backend
3. **Autenticação**: Tokens JWT seguros
4. **Sanitização**: Sanitização de dados de entrada

## 🔧 Configurações

### Variáveis de Ambiente

Crie um arquivo `.env` no diretório `backend/`:

```env
SECRET_KEY=sua_chave_secreta_aqui
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

## 📝 API Endpoints

### Autenticação
- `POST /api/auth/register/` - Registrar usuário
- `POST /api/auth/login/` - Login
- `POST /api/auth/logout/` - Logout

### Tarefas
- `GET /api/tasks/` - Listar tarefas
- `POST /api/tasks/` - Criar tarefa
- `GET /api/tasks/{id}/` - Obter tarefa
- `PUT /api/tasks/{id}/` - Atualizar tarefa
- `DELETE /api/tasks/{id}/` - Deletar tarefa
- `PATCH /api/tasks/{id}/toggle/` - Alternar status da tarefa

### Categorias
- `GET /api/categories/` - Listar categorias
- `POST /api/categories/` - Criar categoria
- `GET /api/categories/{id}/` - Obter categoria
- `PUT /api/categories/{id}/` - Atualizar categoria
- `DELETE /api/categories/{id}/` - Deletar categoria

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes. 