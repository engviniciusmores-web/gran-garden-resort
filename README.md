<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# ObraControl - Sistema de Gestão de Obras v2.0 🏗️

Sistema completo de gestão e controle de obras para construção civil, desenvolvido com React, TypeScript e IA.

## 🚀 Novidades da v2.0

- ✨ **Modo Escuro** - Toggle entre temas claro e escuro
- 🔍 **Busca e Filtros Avançados** - Encontre tarefas instantaneamente
- 📊 **Gráfico de Evolução Temporal** - Visualize o progresso do projeto
- ⚡ **Atalhos de Teclado** - Navegue mais rápido pelo sistema
- 🔔 **Notificações de Prazo** - Alertas para tarefas urgentes
- 📥 **Exportação Excel** - Exporte dados com um clique
- ✅ **Validações Robustas** - Formulários com feedback em tempo real

📖 **Documentação completa:** [MELHORIAS.md](./MELHORIAS.md) | [CHANGELOG.md](./CHANGELOG.md)

## Run Locally

**Prerequisites:**  Node.js 18+

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set the `GEMINI_API_KEY` in `.env.local` to your Gemini API key:
   ```
   API_KEY=your_api_key_here
   ```

3. Run the app:
   ```bash
   npm run dev
   ```

4. Open http://localhost:5173 in your browser

## ⌨️ Atalhos de Teclado

- `Ctrl/Cmd + K` - Buscar
- `Ctrl/Cmd + N` - Nova tarefa
- `Ctrl/Cmd + D` - Toggle dark mode
- `?` - Ajuda
- `Esc` - Fechar modais

## 📦 Build para Produção

```bash
npm run build
npm run preview
```

## 🧪 Testes

Este projeto utiliza **Vitest** e **React Testing Library** para testes.

### Executar testes:
```bash
npm test              # Executa todos os testes
npm run test:ui       # Abre interface visual de testes
npm run test:coverage # Gera relatório de cobertura
```

### Estrutura de testes:
- `*.test.tsx` - Testes de componentes React
- `*.test.ts` - Testes de funções utilitárias
- `src/test/setup.ts` - Configuração global de testes

### Exemplos de testes implementados:
- ✅ Testes do componente Button
- ✅ Testes de utilitários de data
- ✅ Validações de formulários
- ✅ Interações do usuário

## 🎯 Funcionalidades Principais

- 📊 **Dashboard** - Visão geral com métricas e gráficos
- 📅 **Planejamento** - Gestão completa de tarefas
- 📦 **Materiais** - Controle de estoque e solicitações
- 📝 **Diário de Obra** - Registro diário com IA
- 🗂️ **Base de Dados** - Organização de documentos
- 🏢 **BIM Viewer** - Visualização 3D de modelos

---

View your app in AI Studio: https://ai.studio/apps/drive/16WZic1BoO6UevhTvvv3ihjCHYg4uDzVR
