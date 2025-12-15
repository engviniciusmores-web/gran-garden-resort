# 🚀 Deploy no GitHub Pages - Passo a Passo

## ✅ PASSO 1: Instalar Git

1. Baixe o Git: https://git-scm.com/download/win
2. Instale com configurações padrão
3. Reinicie o VS Code após a instalação

---

## ✅ PASSO 2: Criar Repositório no GitHub

1. Acesse: https://github.com/new
2. **Repository name**: `gran-garden-resort` (ou outro nome)
3. **Descrição**: Sistema de Gestão de Obras - Gran Garden Resort
4. Deixe **Public** (ou Private se preferir)
5. **NÃO** marque "Add a README file"
6. Clique em **Create repository**

---

## ✅ PASSO 3: Preparar o Projeto

Abra o Terminal do VS Code e execute:

```powershell
# Entrar na pasta do projeto
cd "C:\Users\User\Downloads\teste 4\ggr-main"

# Inicializar Git
git init

# Adicionar todos os arquivos
git add .

# Fazer commit inicial
git commit -m "Initial commit - Gran Garden Resort"

# Renomear branch para main
git branch -M main

# Conectar com GitHub (SUBSTITUA SEU_USUARIO pelo seu usuário do GitHub)
git remote add origin https://github.com/SEU_USUARIO/gran-garden-resort.git

# Enviar para GitHub
git push -u origin main
```

**NOTA:** No primeiro push, o GitHub vai pedir login. Use suas credenciais do GitHub.

---

## ✅ PASSO 4: Instalar gh-pages e Fazer Deploy

```powershell
# Instalar gh-pages
npm install --save-dev gh-pages

# Fazer build e deploy
npm run deploy:github
```

---

## ✅ PASSO 5: Configurar GitHub Pages

1. Vá no repositório no GitHub
2. Clique em **Settings** (Configurações)
3. No menu lateral, clique em **Pages**
4. Em **Source**, selecione: **gh-pages** branch
5. Clique em **Save**

✅ **Pronto!** Seu site estará disponível em:
```
https://SEU_USUARIO.github.io/gran-garden-resort
```

---

## 🌐 PASSO 6: Conectar Domínio do Google Workspace (OPCIONAL)

Se você quiser usar seu domínio próprio (ex: `gavresorts.com`):

### 1. Configurar DNS no Google Domains

No painel do Google Domains, adicione estes registros DNS:

**Para domínio raiz (gavresorts.com):**
```
Tipo: A
Nome: @
Valor: 185.199.108.153
TTL: 3600

Tipo: A
Nome: @
Valor: 185.199.109.153
TTL: 3600

Tipo: A
Nome: @
Valor: 185.199.110.153
TTL: 3600

Tipo: A
Nome: @
Valor: 185.199.111.153
TTL: 3600
```

**Para subdomínio (www.gavresorts.com ou gestor.gavresorts.com):**
```
Tipo: CNAME
Nome: www (ou gestor)
Valor: SEU_USUARIO.github.io
TTL: 3600
```

### 2. Configurar no GitHub

1. Vá em **Settings** → **Pages**
2. Em **Custom domain**, digite seu domínio: `gavresorts.com` ou `gestor.gavresorts.com`
3. Clique em **Save**
4. Marque **Enforce HTTPS** (aguarde alguns minutos)

⏱️ **Tempo de propagação:** 24-48 horas (mas geralmente funciona em minutos)

---

## 🔄 Como Atualizar o Site Depois

Sempre que fizer mudanças:

```powershell
# 1. Adicionar mudanças
git add .

# 2. Commit
git commit -m "Descrição das mudanças"

# 3. Enviar para GitHub
git push

# 4. Fazer novo deploy
npm run deploy:github
```

---

## 🎯 Alternativa: Firebase Hosting (com Google Workspace)

Se preferir Firebase (já que tem Google Workspace):

```powershell
# 1. Instalar Firebase CLI
npm install -g firebase-tools

# 2. Login no Google
firebase login

# 3. Inicializar
firebase init hosting

# Responder:
# - Use existing project ou Create new
# - Public directory: dist
# - Single-page app: Yes
# - Overwrites: No

# 4. Build e Deploy
npm run build
firebase deploy
```

✅ **URL:** `https://SEU_PROJETO.web.app`

### Conectar Domínio no Firebase:
1. No Console Firebase → Hosting
2. **Add custom domain**
3. Digite seu domínio: `gavresorts.com`
4. Siga instruções de DNS (Firebase configura automaticamente)

---

## ❓ Precisa de Ajuda?

**Git não instalado?**
- Baixe: https://git-scm.com/download/win

**Erro de autenticação no GitHub?**
- Use Personal Access Token: https://github.com/settings/tokens
- Ou GitHub CLI: `gh auth login`

**Site não aparece?**
- Aguarde 5-10 minutos após primeiro deploy
- Verifique em Settings → Pages se está ativo

---

## 📋 Checklist Final

- [ ] Git instalado
- [ ] Repositório criado no GitHub
- [ ] Código enviado (`git push`)
- [ ] gh-pages instalado
- [ ] Deploy feito (`npm run deploy:github`)
- [ ] GitHub Pages configurado (branch gh-pages)
- [ ] Site funcionando no link do GitHub
- [ ] (Opcional) Domínio customizado configurado

---

**🎉 Depois de configurado, seu sistema estará online e acessível 24/7!**
