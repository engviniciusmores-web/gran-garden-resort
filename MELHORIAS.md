# ObraControl - Sistema de Gestão de Obras

## 🚀 Melhorias Implementadas

### ✨ Novos Recursos

#### 1. **Modo Escuro (Dark Mode)**
- Toggle entre modo claro e escuro no header
- Preferência salva no localStorage
- Transições suaves entre temas
- Suporte completo em todos os componentes

#### 2. **Filtros e Busca Avançada**
- Sistema de busca em tempo real por atividade ou responsável
- Filtros por status: Todos, A Fazer, Em Andamento, Concluído, Atrasado
- Contador de resultados filtrados
- Interface intuitiva e responsiva

#### 3. **Notificações de Prazo**
- Alertas automáticos para tarefas com prazo em até 3 dias
- Banner de notificação destacado no topo da página de planejamento
- Lista detalhada das tarefas urgentes

#### 4. **Exportação de Dados**
- Botão para exportar tarefas em formato CSV/Excel
- Inclui todos os campos: Atividade, Prazo, Responsável, Status
- Nome do arquivo com data automática

#### 5. **Validações de Formulário**
- Validação em tempo real de campos obrigatórios
- Mensagens de erro específicas e claras
- Feedback visual (bordas vermelhas) para campos inválidos
- Validação de datas (não permite datas no passado)
- Validação de quantidade mínima em solicitações de material

#### 6. **Gráfico de Evolução Temporal**
- Visualização da evolução do projeto ao longo do tempo
- Comparação entre planejado vs realizado
- Gráfico de área com gradiente
- Indicador de desvio com alertas
- Análise dos últimos 6 meses de progresso

#### 7. **Atalhos de Teclado (Keyboard Shortcuts)**
- `Ctrl/Cmd + K` - Focar na busca
- `Ctrl/Cmd + N` - Nova tarefa (na tela de Planejamento)
- `Ctrl/Cmd + D` - Alternar modo escuro/claro
- `Esc` - Fechar modais
- `?` - Abrir menu de ajuda
- Modal de ajuda com lista completa de atalhos

### 🎨 Melhorias de UI/UX

- **Animações suaves**: fadeIn e slideInRight para transições
- **Hover effects**: Feedback visual em cards e botões
- **Loading states**: Indicadores de carregamento
- **Responsividade**: Melhorias para dispositivos móveis
- **Acessibilidade**: Focus states e tamanhos de toque adequados
- **Custom scrollbar**: Scrollbar estilizada para melhor aparência
- **Print styles**: Estilos otimizados para impressão

### 📱 Mobile First

- Menu hambúrguer funcional
- Layouts adaptáveis para telas pequenas
- Touch targets com tamanho mínimo de 44px
- Prevenção de pull-to-refresh indesejado

### 🔒 Melhorias de Segurança

- Validação de entrada em todos os formulários
- Sanitização de dados antes do envio
- Prevenção de submissão de dados inválidos

## 🛠️ Tecnologias Utilizadas

- **React 19.2.3** - Framework principal
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Estilização
- **Recharts** - Gráficos e visualizações
- **Lucide React** - Ícones
- **Google Gemini AI** - Geração de resumos de diário de obra

## 📦 Como Executar

1. Instalar dependências:
   ```bash
   npm install
   ```

2. Configurar a API Key do Gemini:
   - Criar arquivo `.env.local` na raiz do projeto
   - Adicionar: `API_KEY=sua_chave_aqui`

3. Executar em desenvolvimento:
   ```bash
   npm run dev
   ```

4. Build para produção:
   ```bash
   npm run build
   ```

## 📊 Funcionalidades Principais

### Dashboard
- Visão geral do projeto com métricas principais
- Cards de estatísticas (Avanço Físico, Volume de Concreto, Área Construída)
- Gráfico de evolução temporal
- Previsão do tempo
- Atividades recentes

### Planejamento
- Lista completa de tarefas
- Busca e filtros avançados
- Exportação para Excel
- Notificações de prazo
- Criação de novas tarefas com validação

### Materiais
- Controle de estoque
- Alertas de reposição
- Gráfico de consumo diário
- Solicitação de materiais por e-mail

### Diário de Obra
- Registro de clima e condições
- Controle de efetivo
- Produção diária (concreto, aço, forma)
- Registro de ocorrências
- Geração automática de resumo com IA

### Base de Dados
- Biblioteca de arquivos
- Organização por categoria
- Acesso rápido a documentos

### BIM Viewer
- Visualizador 3D de modelos IFC (simulado)
- Extração de propriedades
- Análise de elementos construtivos

## 🎯 Próximas Melhorias Sugeridas

- [ ] Sistema de notificações push
- [ ] Relatórios em PDF
- [ ] Integração com calendário
- [ ] Modo offline com sincronização
- [ ] Dashboard customizável
- [ ] Histórico de alterações
- [ ] Comentários e anexos em tarefas
- [ ] Gráfico de Gantt interativo

## 📝 Notas de Desenvolvimento

- O sistema utiliza dados mock para demonstração
- A integração com backend real requer implementação de API
- O visualizador BIM é uma simulação - para produção, usar bibliotecas como web-ifc ou Three.js
- As validações do lado do cliente devem ser complementadas com validações no servidor

## 👥 Equipe

Desenvolvido para o projeto **Gran Garden Resort**

---

**Versão:** 2.0.0  
**Última atualização:** Dezembro 2025
