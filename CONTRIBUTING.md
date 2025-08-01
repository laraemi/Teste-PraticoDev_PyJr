# Guia de Contribuição

Obrigado por considerar contribuir para o projeto To-Do List! Este documento fornece diretrizes para contribuições.

## Como Contribuir

### 1. Fork e Clone

1. Faça um fork do repositório
2. Clone seu fork localmente:
   ```bash
   git clone https://github.com/seu-usuario/todo-app.git
   cd todo-app
   ```

### 2. Configuração do Ambiente

#### Backend (Django)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

#### Frontend (React)
```bash
cd frontend
npm install
npm run dev
```

### 3. Criando uma Branch

Crie uma branch para sua feature:
```bash
git checkout -b feature/nome-da-feature
```

### 4. Desenvolvimento

- Siga as convenções de código estabelecidas
- Escreva testes para novas funcionalidades
- Mantenha os testes existentes passando
- Documente mudanças significativas

### 5. Testes

Execute os testes antes de fazer commit:
```bash
# Backend
cd backend
python -m pytest tests/ -v

# Frontend
cd frontend
npm test
```

### 6. Commit

Use commits convencionais:
```bash
git commit -m "feat: adiciona funcionalidade de filtro por categoria"
git commit -m "fix: corrige bug na validação de email"
git commit -m "docs: atualiza README com novas instruções"
```

### 7. Push e Pull Request

```bash
git push origin feature/nome-da-feature
```

Crie um Pull Request no GitHub com:
- Descrição clara das mudanças
- Screenshots (se aplicável)
- Referência a issues relacionadas

## Padrões de Código

### Python (Backend)
- Use Black para formatação
- Use Flake8 para linting
- Siga PEP 8
- Documente funções e classes
- Use type hints quando possível

### JavaScript/React (Frontend)
- Use Prettier para formatação
- Use ESLint para linting
- Siga as convenções do React
- Use componentes funcionais e hooks
- Documente props e componentes

### Git
- Use commits convencionais
- Mantenha commits pequenos e focados
- Use mensagens descritivas

## Estrutura do Projeto

```
todo-app/
├── backend/                 # Backend Django
│   ├── todo_project/       # Configurações do projeto
│   ├── users/              # App de usuários
│   ├── tasks/              # App de tarefas
│   ├── categories/         # App de categorias
│   ├── tests/              # Testes
│   └── requirements.txt    # Dependências Python
├── frontend/               # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── contexts/       # Contextos React
│   │   ├── services/       # Serviços de API
│   │   └── utils/          # Utilitários
│   └── package.json        # Dependências Node.js
└── docs/                   # Documentação
```

## Tipos de Contribuição

### Bug Reports
- Use o template de issue para bugs
- Inclua passos para reproduzir
- Descreva o comportamento esperado vs atual
- Inclua informações do ambiente

### Feature Requests
- Use o template de issue para features
- Descreva o problema que a feature resolve
- Proponha uma solução
- Discuta alternativas consideradas

### Pull Requests
- Use o template de PR
- Inclua testes para novas funcionalidades
- Atualize documentação quando necessário
- Certifique-se de que todos os testes passam

## Processo de Review

1. **Automatic Checks**: CI/CD verifica testes e linting
2. **Code Review**: Mantenedores revisam o código
3. **Feedback**: Comentários e sugestões são fornecidos
4. **Iteration**: Faça as mudanças necessárias
5. **Approval**: PR é aprovado e mergeado

## Comunicação

- Use issues para discussões
- Seja respeitoso e construtivo
- Ajude outros contribuidores
- Mantenha discussões focadas no código

## Recursos Úteis

- [Documentação do Django](https://docs.djangoproject.com/)
- [Documentação do React](https://reactjs.org/docs/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Contributing Guidelines](https://github.com/standard/standard)

## Agradecimentos

Obrigado por contribuir para tornar este projeto melhor! 🎉 