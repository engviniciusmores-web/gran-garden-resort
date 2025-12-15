# Changelog - ObraControl

Todas as alterações notáveis neste projeto serão documentadas neste arquivo.

## [2.0.0] - 2025-12-13

### ✨ Novos Recursos

#### Interface
- **Modo Escuro (Dark Mode)**
  - Toggle para alternar entre modo claro e escuro
  - Preferência salva em localStorage
  - Suporte completo em todos os componentes
  - Ícone de sol/lua no header
  
- **Sistema de Ajuda**
  - Modal de ajuda com atalhos de teclado
  - Botão de ajuda no header
  - Atalho `?` para acesso rápido

#### Planejamento
- **Busca e Filtros Avançados**
  - Campo de busca em tempo real
  - Filtros por status (Todos, A Fazer, Em Andamento, Concluído, Atrasado)
  - Contador de resultados
  - Interface expansível para filtros
  
- **Notificações de Prazo**
  - Banner de alerta para tarefas com prazo em até 3 dias
  - Lista detalhada de tarefas urgentes
  - Destaque visual com ícone de sino
  
- **Exportação de Dados**
  - Botão para exportar tarefas em CSV
  - Inclui todos os campos principais
  - Nome do arquivo com timestamp

#### Dashboard
- **Gráfico de Evolução Temporal**
  - Visualização de progresso ao longo do tempo
  - Comparação planejado vs realizado
  - Gráfico de área com gradientes
  - Alertas de desvio automáticos
  - Dados dos últimos 6 meses

#### Atalhos de Teclado
- `Ctrl/Cmd + K` - Focar na busca
- `Ctrl/Cmd + N` - Nova tarefa (apenas em Planejamento)
- `Ctrl/Cmd + D` - Toggle dark mode
- `Esc` - Fechar modais
- `?` - Abrir ajuda

### 🔧 Melhorias

#### Validações
- **Formulário de Nova Tarefa**
  - Validação de campos obrigatórios
  - Mínimo de 3 caracteres para nome e responsável
  - Data não pode ser no passado
  - Feedback visual com bordas vermelhas
  - Mensagens de erro específicas
  
- **Solicitação de Material**
  - Validação de quantidade (deve ser > 0)
  - Campo obrigatório destacado
  - Melhor UX com placeholder descritivo

#### UX/UI
- Animações suaves (fadeIn, slideInRight)
- Hover effects em cards e botões
- Estados de loading
- Custom scrollbar estilizada
- Melhor feedback visual em interações
- Transições suaves entre temas

#### Acessibilidade
- Focus states visíveis
- Tamanhos de toque mínimos (44px mobile)
- Suporte a leitores de tela
- Atalhos de teclado para navegação

### 📱 Responsividade

- Layout mobile otimizado
- Menu hambúrguer funcional
- Grid adaptável
- Touch targets adequados
- Prevenção de pull-to-refresh

### 🎨 Estilos

- Arquivo CSS dedicado (`index.css`)
- Variáveis para dark mode
- Animações keyframe customizadas
- Scrollbar personalizada
- Print styles

### 📊 Dados e Constantes

- Dados de evolução temporal (MOCK_TIMELINE_DATA)
- Estrutura de dados expandida
- Melhor organização de constantes

### 🐛 Correções

- Feedback de sucesso em solicitação de material
- Validação de entrada de dados
- Prevenção de submissão de formulários vazios
- Melhor tratamento de erros

### 🔒 Segurança

- Validação client-side robusta
- Sanitização de inputs
- Prevenção de XSS em formulários

---

## [1.0.0] - 2025-10-01

### ✨ Versão Inicial

- Sistema de login
- Seleção de projetos
- Dashboard com métricas
- Planejamento de tarefas
- Controle de materiais
- Diário de obra com IA
- Base de dados de arquivos
- Visualizador BIM (simulado)
- Gestão de equipes
- Relatórios

---

## Tipos de Mudanças

- **✨ Novos Recursos** - para novas funcionalidades
- **🔧 Melhorias** - para melhorias em funcionalidades existentes
- **🐛 Correções** - para correção de bugs
- **📚 Documentação** - para mudanças na documentação
- **🎨 Estilos** - para mudanças de UI/estilos
- **♻️ Refatoração** - para refatoração de código
- **⚡ Performance** - para melhorias de performance
- **🔒 Segurança** - para correções de segurança

---

**Nota:** Este projeto segue [Semantic Versioning](https://semver.org/).
