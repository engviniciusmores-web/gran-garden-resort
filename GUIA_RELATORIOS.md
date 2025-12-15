# Sistema de Geração de Relatórios GAV - Gran Garden Resort

## 📊 Visão Geral

O sistema foi atualizado para gerar relatórios profissionais em **PDF e Word (.docx)** ao invés de arquivos TXT simples, incluindo a marca da GAV Resorts.

## ✨ Principais Mudanças

### 1. **Geração de Relatórios Web (React)**
- ✅ Relatórios em PDF com formatação profissional
- ✅ Relatórios em Word (.docx) com tabelas formatadas
- ✅ Logo da GAV incluído automaticamente
- ✅ Interface modernizada no componente ReportsView

### 2. **Geração de Relatórios Python**
- ✅ Módulo `report_generator.py` criado
- ✅ Suporte para PDF e Word
- ✅ Formatação com cores institucionais da GAV
- ✅ Integração com scripts existentes

## 🎨 Formatação dos Relatórios

### Elementos Visuais:
- **Logo**: Gran Garden Resort (GAV Resorts)
- **Cores**:
  - Azul principal: `#1e40af` (títulos)
  - Cinza escuro: `#334155` (texto principal)
  - Cinza claro: `#cbd5e1` (separadores)
- **Tipografia**: Helvetica (PDF) / Calibri (Word)
- **Layout**: A4, margens 2cm (PDF) / 1 polegada (Word)

### Estrutura do Relatório:
1. Logo da GAV (topo centralizado)
2. Título principal
3. Informações do projeto
4. Resumo executivo com tabela
5. Observações (gráficos/fotos se aplicável)
6. Rodapé com informações do sistema

## 🚀 Como Usar

### No Navegador (React)

1. Acesse a aba "Relatórios" no sistema
2. Selecione o tipo de relatório desejado
3. Escolha o período de análise
4. Marque as opções de inclusão (gráficos/fotos)
5. Clique em "PDF" ou "Word" para gerar o relatório

O arquivo será baixado automaticamente com nome formatado:
- `relatorio_{tipo}_{data}.pdf`
- `relatorio_{tipo}_{data}.docx`

### Via Python (Scripts)

#### Usar o módulo report_generator:

```python
from report_generator import generate_report_from_json

# Dados do relatório
data = {
    'type': 'geral',
    'project': 'Gran Garden Resort - Projeto Completo',
    'period': 'last-month',
    'period_label': 'Último Mês',
    'tasks': 150,
    'completedTasks': 120,
    'includeCharts': True,
    'includePhotos': False,
    'generatedAt': datetime.now().isoformat()
}

# Gerar PDF
pdf_path = generate_report_from_json(data, format='pdf')

# Gerar Word
word_path = generate_report_from_json(data, format='word')
```

## 📦 Dependências

### React/TypeScript:
```json
{
  "jspdf": "^2.x",
  "jspdf-autotable": "^3.x",
  "docx": "^9.x",
  "file-saver": "^2.x"
}
```

Instalação:
```bash
npm install jspdf jspdf-autotable docx file-saver
```

### Python (requer Python 3.12 ou inferior):
```
reportlab
python-docx
```

Instalação:
```bash
pip install reportlab python-docx
```

**Nota**: O projeto usa Python 3.15 alpha que ainda não é compatível com essas bibliotecas. Recomenda-se usar Python 3.12 para os scripts Python.

## 📁 Arquivos Modificados

### Novos Arquivos:
- `report_generator.py` - Módulo Python para geração de relatórios
- `test_reports.py` - Script de teste para validação

### Arquivos Atualizados:
- `components/ReportsView.tsx` - Interface React atualizada
- `process_completo.py` - Integração com gerador de relatórios
- `package.json` - Novas dependências adicionadas

## 🔧 Configuração do Logo

O logo da GAV deve estar localizado em:
```
public/assets/gran-garden-resort.jpg
```

Se o logo não for encontrado, os relatórios ainda serão gerados sem a imagem.

## 📝 Tipos de Relatórios Disponíveis

1. **Geral** - Visão geral completa do projeto
2. **Por Blocos** - Análise por bloco de construção
3. **Tarefas** - Detalhamento de atividades
4. **Financeiro** - Análise de custos e orçamento

## 🎯 Exemplos de Uso

### Gerar relatório completo após processamento:
```python
# No final do process_completo.py
from report_generator import generate_report_from_json

report_data = {
    'type': 'geral',
    'project': 'Gran Garden Resort - Cronograma Completo',
    'period': 'all-time',
    'period_label': 'Todo o Período',
    'tasks': len(all_tasks),
    'completedTasks': len([t for t in all_tasks if t['status'] == 'Concluído']),
    'includeCharts': True,
    'includePhotos': False,
    'generatedAt': datetime.now().isoformat()
}

# Gerar ambos os formatos
generate_report_from_json(report_data, format='pdf')
generate_report_from_json(report_data, format='word')
```

### Integração com o sistema web:
O componente `ReportsView.tsx` já está configurado para gerar relatórios automaticamente quando o usuário clicar nos botões "PDF" ou "Word".

## ⚠️ Notas Importantes

1. **Compatibilidade Python**: Para usar os scripts Python, é recomendado Python 3.9 a 3.12
2. **Logo**: Certifique-se de que o arquivo de logo está no local correto
3. **Pasta de Saída**: Relatórios Python são salvos em `./relatorios/`
4. **Navegador**: Relatórios web são baixados diretamente pelo navegador

## 🆘 Troubleshooting

### Logo não aparece:
- Verifique se o arquivo está em `public/assets/gran-garden-resort.jpg`
- O sistema funciona mesmo sem o logo

### Erro de módulo não encontrado (Python):
- Instale as dependências: `pip install reportlab python-docx`
- Use Python 3.9-3.12 (não 3.15)

### Relatório vazio ou incompleto:
- Verifique se os dados estão sendo passados corretamente
- Confira os logs no console para mensagens de erro

## 📞 Suporte

Para dúvidas ou problemas:
- Email: vinicius.mores@gavresorts.com.br
- Sistema: Gran Garden Resort v2.0
