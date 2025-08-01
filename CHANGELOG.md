# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [Unreleased]

### Added
- Funcionalidade de compartilhamento de tarefas
- Sistema de categorias para organizar tarefas
- Filtros avançados para tarefas
- Paginação de resultados
- Sistema de notificações
- Dashboard com estatísticas
- Perfil de usuário completo

### Changed
- Melhorias na interface do usuário
- Otimizações de performance
- Refatoração do código backend

### Fixed
- Correção de bugs na autenticação
- Melhorias na validação de dados
- Correções de segurança

## [1.0.0] - 2024-01-15

### Added
- Sistema de autenticação JWT
- CRUD completo de tarefas
- Interface responsiva com React
- API REST com Django REST Framework
- Sistema de permissões
- Validação de dados
- Testes automatizados
- Dockerização da aplicação
- CI/CD pipeline
- Documentação completa

### Security
- Implementação de autenticação segura
- Validação de entrada
- Proteção CSRF
- Headers de segurança

## [0.1.0] - 2024-01-01

### Added
- Estrutura inicial do projeto
- Configuração básica do Django
- Configuração básica do React
- README inicial

---

## Tipos de Mudanças

- **Added** para novas funcionalidades
- **Changed** para mudanças em funcionalidades existentes
- **Deprecated** para funcionalidades que serão removidas
- **Removed** para funcionalidades removidas
- **Fixed** para correções de bugs
- **Security** para correções de vulnerabilidades

## Como Contribuir

Para adicionar uma entrada ao changelog:

1. Adicione sua entrada na seção `[Unreleased]`
2. Use o tipo apropriado de mudança
3. Seja específico sobre o que foi alterado
4. Inclua referências a issues quando relevante

## Exemplo de Entrada

```markdown
### Added
- Nova funcionalidade de exportação de tarefas (#123)
- Suporte a múltiplos idiomas

### Fixed
- Correção do bug na validação de email (#456)
```

## Links

- [Unreleased]: https://github.com/usuario/todo-app/compare/v1.0.0...HEAD
- [1.0.0]: https://github.com/usuario/todo-app/releases/tag/v1.0.0
- [0.1.0]: https://github.com/usuario/todo-app/releases/tag/v0.1.0 