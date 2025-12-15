# 🚀 Guia de Deploy - Gran Garden Resort

## Opção 1: Vercel (RECOMENDADO - Mais Fácil)

### Passo a Passo:

1. **Instalar Vercel CLI**
```bash
npm install -g vercel
```

2. **Fazer Login**
```bash
vercel login
```
Crie uma conta grátis em https://vercel.com

3. **Deploy**
```bash
cd "C:\Users\User\Downloads\teste 4\ggr-main"
vercel
```

4. **Responder perguntas:**
- Set up and deploy? **Y**
- Which scope? **Sua conta**
- Link to existing project? **N**
- Project name? **gran-garden-resort** (ou outro nome)
- Directory? **./** (Enter)
- Override settings? **N**

✅ Seu site estará online em segundos!
- URL de produção: `https://gran-garden-resort.vercel.app`
- Atualizar: apenas rode `vercel --prod` novamente

---

## Opção 2: Netlify (Simples)

### Passo a Passo:

1. **Instalar Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **Build**
```bash
npm run build
```

3. **Login e Deploy**
```bash
netlify login
netlify deploy --prod
```

4. **Selecionar:**
- Pasta de publicação: `dist`

✅ Pronto! URL fornecida no terminal.

---

## Opção 3: GitHub Pages (Grátis)

### Passo a Passo:

1. **Criar repositório no GitHub**
- Acesse https://github.com/new
- Nome: `gran-garden-resort`
- Público ou Privado

2. **Instalar gh-pages**
```bash
npm install --save-dev gh-pages
```

3. **Inicializar Git (se ainda não tiver)**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/gran-garden-resort.git
git push -u origin main
```

4. **Deploy**
```bash
npm run deploy:github
```

5. **Configurar GitHub Pages**
- Vá no repositório → Settings → Pages
- Source: **gh-pages branch**
- Salvar

✅ Site estará em: `https://SEU_USUARIO.github.io/gran-garden-resort`

---

## Opção 4: Render (Grátis)

### Passo a Passo:

1. **Criar conta** em https://render.com

2. **New Static Site**
- Conectar repositório GitHub

3. **Configurações:**
- Build Command: `npm run build`
- Publish Directory: `dist`

✅ Deploy automático a cada push!

---

## Opção 5: Firebase Hosting

### Passo a Passo:

1. **Instalar Firebase CLI**
```bash
npm install -g firebase-tools
```

2. **Login**
```bash
firebase login
```

3. **Inicializar**
```bash
firebase init hosting
```
- Public directory: `dist`
- Single-page app: **Yes**
- GitHub deploys: **No** (por enquanto)

4. **Build e Deploy**
```bash
npm run build
firebase deploy
```

✅ URL: `https://SEU_PROJETO.web.app`

---

## 📦 Build Local (Para testar antes)

```bash
# Build de produção
npm run build

# Testar localmente
npm run preview
```

Abre em http://localhost:4173

---

## 🔧 Configurações Importantes

### Variáveis de Ambiente
Se usar API keys (como Gemini), configure na plataforma:

**Vercel:**
- Settings → Environment Variables
- Adicione: `GEMINI_API_KEY=sua_chave`

**Netlify:**
- Site settings → Environment variables
- Adicione: `GEMINI_API_KEY=sua_chave`

### Domínio Próprio
Todas as plataformas permitem configurar domínio customizado (ex: `gavresorts.com`)

---

## ⚡ Minha Recomendação

Para este projeto, use **Vercel**:
- ✅ Deploy em 30 segundos
- ✅ HTTPS automático
- ✅ CDN global (site rápido no mundo todo)
- ✅ Atualizações com um comando
- ✅ Grátis para projetos pessoais
- ✅ Preview de cada commit

---

## 📱 O que será publicado

O site incluirá:
- ✅ Dashboard com indicadores
- ✅ Gestão de tarefas
- ✅ Cronograma (4.221 tarefas)
- ✅ Controle de materiais
- ✅ Diário de obra
- ✅ Visualizador BIM/IFC
- ✅ Lições Aprendidas
- ✅ Relatórios em PDF/Word
- ✅ Gestão de equipes

Todos os arquivos `.ifc` e dados serão incluídos automaticamente!
