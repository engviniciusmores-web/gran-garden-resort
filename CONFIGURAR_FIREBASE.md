# 🔥 Configuração do Firebase - Banco de Dados da Obra

Este guia mostra como configurar o Firebase para armazenar fotos, diários e todos os registros da obra.

---

## 📋 PASSO 1: Criar Projeto no Firebase

1. **Acesse:** https://console.firebase.google.com
2. Clique em **"Adicionar projeto"**
3. Nome do projeto: `gran-garden-resort` (ou outro)
4. **Desative** Google Analytics (opcional, pode ativar depois)
5. Clique em **"Criar projeto"**
6. Aguarde ~30 segundos

---

## 🌐 PASSO 2: Registrar App Web

1. No painel do projeto, clique no ícone **</> (Web)**
2. Nome do app: `Gran Garden Resort Web`
3. **NÃO** marque "Firebase Hosting" (já usamos GitHub Pages)
4. Clique em **"Registrar app"**

5. **COPIE AS CREDENCIAIS** que aparecem:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy......................",
  authDomain: "gran-garden-resort.firebaseapp.com",
  projectId: "gran-garden-resort",
  storageBucket: "gran-garden-resort.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123..."
};
```

---

## 📝 PASSO 3: Configurar Variáveis de Ambiente

1. **Crie o arquivo `.env`** na raiz do projeto:
```bash
cd "C:\Users\User\Downloads\teste 4\ggr-main"
Copy-Item .env.example .env
```

2. **Abra o arquivo `.env`** e preencha com suas credenciais:
```env
VITE_FIREBASE_API_KEY=AIzaSy......................
VITE_FIREBASE_AUTH_DOMAIN=gran-garden-resort.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=gran-garden-resort
VITE_FIREBASE_STORAGE_BUCKET=gran-garden-resort.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123...
```

⚠️ **IMPORTANTE:** Não commite o arquivo `.env` no Git! Ele já está no `.gitignore`.

---

## 🗄️ PASSO 4: Ativar Firestore Database

1. No menu lateral do Firebase, clique em **"Firestore Database"**
2. Clique em **"Criar banco de dados"**
3. Escolha localização: **us-central** (ou nam5 para América do Sul)
4. Modo de segurança: **"Modo de teste"** (por enquanto)
   - ⚠️ Depois vamos configurar regras de segurança
5. Clique em **"Ativar"**

---

## 📷 PASSO 5: Ativar Storage (Para Fotos)

1. No menu lateral, clique em **"Storage"**
2. Clique em **"Começar"**
3. Modo de segurança: **"Modo de teste"**
4. Localização: **mesma do Firestore**
5. Clique em **"Concluir"**

---

## 🔐 PASSO 6: Configurar Regras de Segurança

### Firestore Rules:

1. Vá em **Firestore Database** → **Regras**
2. Cole este código:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir leitura para todos
    match /{document=**} {
      allow read: if true;
    }
    
    // Permitir escrita apenas autenticado (por enquanto permite todos)
    match /dailyLogs/{logId} {
      allow create, update, delete: if true;
    }
    
    match /photos/{photoId} {
      allow create, update, delete: if true;
    }
    
    match /lessonsLearned/{lessonId} {
      allow create, update, delete: if true;
    }
  }
}
```

3. Clique em **"Publicar"**

⚠️ **Nota:** Em produção, adicione autenticação! Por enquanto está aberto para testes.

### Storage Rules:

1. Vá em **Storage** → **Regras**
2. Cole este código:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /photos/{fileName} {
      // Permitir upload de imagens até 5MB
      allow read: if true;
      allow write: if request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }
  }
}
```

3. Clique em **"Publicar"**

---

## ✅ PASSO 7: Testar Localmente

```powershell
# Entrar na pasta
cd "C:\Users\User\Downloads\teste 4\ggr-main"

# Rodar em desenvolvimento
npm run dev
```

Acesse http://localhost:3000 e teste:
1. Vá em **"Galeria de Fotos"**
2. Tente enviar uma foto
3. Se funcionar, aparece no Firebase Console!

Verifique no Firebase Console:
- **Firestore**: Veja em "photos" collection
- **Storage**: Veja em "photos/" folder

---

## 🚀 PASSO 8: Deploy com Firebase Configurado

```powershell
# Build
npm run build

# Commit
& "C:\Program Files\Git\bin\git.exe" add .
& "C:\Program Files\Git\bin\git.exe" commit -m "Add Firebase integration"
& "C:\Program Files\Git\bin\git.exe" push

# Deploy GitHub Pages
& "C:\Program Files\Git\bin\git.exe" subtree push --prefix dist origin gh-pages
```

---

## 📊 O Que Será Armazenado no Firebase?

### 1. **Galeria de Fotos** (Collection: `photos`)
```javascript
{
  url: "https://storage.googleapis.com/...",
  caption: "Concretagem Laje 2",
  location: "Bloco A - 2º Pavimento",
  tags: ["concreto", "estrutura"],
  uploadedBy: "João Silva",
  uploadedAt: Timestamp,
  fileName: "photos/123456789_foto.jpg"
}
```

### 2. **Diários de Obra** (Collection: `dailyLogs`)
```javascript
{
  date: "2025-12-15",
  weather: "sunny",
  activities: "Concretagem completa...",
  team: "Equipe Caio, Equipe Marcelo",
  notes: "Sem pendências",
  createdAt: Timestamp,
  createdBy: "Eng. Vinicius"
}
```

### 3. **Lições Aprendidas** (Collection: `lessonsLearned`)
```javascript
{
  title: "Atraso na entrega de concreto",
  description: "...",
  category: "management",
  severity: "high",
  status: "resolved",
  // ... outros campos
}
```

---

## 🔍 Como Consultar os Dados?

### No Firebase Console:
1. Acesse https://console.firebase.google.com
2. **Firestore Database** → Ver todos os registros
3. **Storage** → Ver todas as fotos
4. Pesquise, filtre, exporte dados

### No App:
- **Galeria de Fotos**: Busca por descrição, local, tags
- **Histórico**: (em breve) Lista completa de diários
- **Relatórios**: Exporta tudo em PDF/Excel

---

## 💰 Custos do Firebase

**Plano Gratuito (Spark):**
- ✅ 1 GB Storage
- ✅ 10 GB Download/mês
- ✅ 50K leituras/dia
- ✅ 20K escritas/dia

**Suficiente para:**
- ~200-500 fotos
- Milhares de diários
- Equipe de 10-20 pessoas

Se exceder, upgrade para **Blaze** (pague pelo uso):
- Storage: $0.026/GB/mês
- Download: $0.12/GB
- Ainda muito barato!

---

## 🔐 Segurança em Produção (Opcional)

### 1. Ativar Authentication:

```powershell
# No Firebase Console
# Authentication → Get Started
# Ativar: Email/Password ou Google
```

### 2. Atualizar Regras Firestore:

```javascript
match /dailyLogs/{logId} {
  allow read: if true;
  allow create: if request.auth != null;
  allow update, delete: if request.auth.uid == resource.data.userId;
}
```

---

## ❓ Problemas Comuns

**"Firebase não configurado"**
- Verifique se o arquivo `.env` existe
- Reinicie o servidor: `npm run dev`

**"Permission denied"**
- Verifique as regras do Firestore/Storage
- Certifique-se que está em "modo de teste"

**"Quota exceeded"**
- Plano gratuito atingido
- Upgrade para Blaze ou limpe dados antigos

**Fotos não aparecem**
- Verifique CORS no Storage
- Regras do Storage devem permitir leitura

---

## 📱 Funcionalidades Disponíveis:

✅ **Upload de Fotos**: Direto do celular/computador
✅ **Galeria Completa**: Visualize todas as fotos
✅ **Busca Avançada**: Por descrição, local, tags
✅ **Diários Salvos**: No Firebase automaticamente
✅ **Consulta Fácil**: Interface intuitiva
✅ **Offline**: Cache local (PWA)
✅ **Backup Automático**: Tudo na nuvem

---

## 🎯 Próximos Passos:

1. Configure o Firebase seguindo este guia
2. Teste localmente
3. Faça deploy
4. Compartilhe com a equipe
5. Todos podem enviar fotos e diários!

**Dúvidas?** vinicius.mores@gavresorts.com.br
