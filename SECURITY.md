# Política de Segurança

## Versões Suportadas

Use esta seção para informar às pessoas sobre quais versões do seu projeto estão atualmente sendo suportadas com atualizações de segurança.

| Versão | Suportada          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reportando uma Vulnerabilidade

Se você descobrir uma vulnerabilidade de segurança, por favor, siga estas etapas:

1. **NÃO** abra um issue público no GitHub
2. Envie um email para [security@example.com](mailto:security@example.com)
3. Inclua detalhes sobre a vulnerabilidade, incluindo:
   - Descrição da vulnerabilidade
   - Passos para reproduzir
   - Possível impacto
   - Sugestões de correção (se houver)

### O que esperar

- Você receberá uma confirmação em 24 horas
- Uma avaliação será feita em 72 horas
- Atualizações regulares sobre o progresso da correção
- Crédito público após a correção (se desejado)

## Medidas de Segurança Implementadas

### Backend (Django)
- Autenticação JWT com tokens de acesso e refresh
- Validação de entrada em todos os endpoints
- Proteção CSRF
- Headers de segurança configurados
- Sanitização de dados
- Rate limiting (recomendado para produção)

### Frontend (React)
- Validação de entrada no cliente
- Sanitização de dados antes de enviar para API
- Armazenamento seguro de tokens
- Proteção contra XSS

### Infraestrutura
- HTTPS obrigatório em produção
- Headers de segurança configurados
- Logs de auditoria
- Backup regular dos dados

## Boas Práticas para Desenvolvedores

1. **Nunca** commite credenciais ou chaves secretas
2. Use variáveis de ambiente para configurações sensíveis
3. Mantenha as dependências atualizadas
4. Revise o código regularmente em busca de vulnerabilidades
5. Use HTTPS em produção
6. Implemente rate limiting
7. Monitore logs de segurança

## Atualizações de Segurança

- Atualizações críticas serão lançadas imediatamente
- Atualizações importantes serão lançadas em 7 dias
- Atualizações menores serão incluídas na próxima versão regular

## Contato

Para questões de segurança, entre em contato:
- Email: [security@example.com](mailto:security@example.com)
- PGP Key: [0x1234567890ABCDEF](https://keys.openpgp.org/vks/v1/by-fingerprint/0x1234567890ABCDEF) 