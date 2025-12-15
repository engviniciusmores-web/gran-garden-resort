#!/usr/bin/env python3
"""
Script para extrair TODOS os dados do projeto Gran Garden Resort:
- Orçamento analítico (valores de cada item)
- Cronograma com valores
- Materiais e grandes compras
- Lista de projetos (PDFs, IFCs)
"""
import json
import pandas as pd
import os
from pathlib import Path
import re

print("🚀 Iniciando extração completa de dados...")

# 1. EXTRAIR ORÇAMENTO ANALÍTICO (VALORES)
print("\n📊 Processando orçamento analítico...")

try:
    orcamento_analitico = pd.read_excel(
        '6 - ORC-EP-GRAN-GARDEN_R03_APROVADO-DIRETORIA_08.08.2025 - ORC ANALITICO.xlsx',
        sheet_name=0
    )
    print(f"   ✅ Orçamento analítico carregado: {len(orcamento_analitico)} linhas")
    print(f"   Colunas: {list(orcamento_analitico.columns)[:10]}")

    # Salvar preview
    orcamento_analitico.head(20).to_json('preview_orcamento_analitico.json', orient='records', indent=2)

except Exception as e:
    print(f"   ⚠️ Erro ao ler orçamento analítico: {e}")

# 2. EXTRAIR ORÇAMENTO SINTÉTICO
print("\n📊 Processando orçamento sintético...")

try:
    orcamento_sintetico = pd.read_excel(
        '6 - ORC-EP-GRAN-GARDEN_R03_APROVADO-DIRETORIA_08.08.2025 - ORC SINTETICO.xlsx',
        sheet_name=0
    )
    print(f"   ✅ Orçamento sintético carregado: {len(orcamento_sintetico)} linhas")
    print(f"   Colunas: {list(orcamento_sintetico.columns)[:10]}")

    # Salvar preview
    orcamento_sintetico.head(20).to_json('preview_orcamento_sintetico.json', orient='records', indent=2)

except Exception as e:
    print(f"   ⚠️ Erro ao ler orçamento sintético: {e}")

# 3. EXTRAIR GRANDES COMPRAS (MATERIAIS)
print("\n📦 Processando cronograma de grandes compras...")

try:
    grandes_compras = pd.read_excel(
        'GGR - Cronograma de Grandes Compras_Rev_Out_2025.xlsx',
        sheet_name=0
    )
    print(f"   ✅ Grandes compras carregadas: {len(grandes_compras)} linhas")
    print(f"   Colunas: {list(grandes_compras.columns)[:10]}")

    # Salvar preview
    grandes_compras.head(20).to_json('preview_grandes_compras.json', orient='records', indent=2)

except Exception as e:
    print(f"   ⚠️ Erro ao ler grandes compras: {e}")

# 4. EXTRAIR FAROL (INDICADORES)
print("\n🚦 Processando farol de indicadores...")

try:
    farol = pd.read_excel('GGR - Farol.xlsx', sheet_name=0)
    print(f"   ✅ Farol carregado: {len(farol)} linhas")
    print(f"   Colunas: {list(farol.columns)[:10]}")

    # Salvar preview
    farol.head(20).to_json('preview_farol.json', orient='records', indent=2)

except Exception as e:
    print(f"   ⚠️ Erro ao ler farol: {e}")

# 5. LISTAR ARQUIVOS DE PROJETO
print("\n📁 Catalogando arquivos de projeto...")

arquivos_projeto = []
extensoes_permitidas = ['.pdf', '.dwg', '.ifc', '.rvt', '.xlsx', '.mpp']

for arquivo in Path('.').glob('**/*'):
    if arquivo.is_file() and arquivo.suffix.lower() in extensoes_permitidas:
        # Ignorar node_modules e .git
        if 'node_modules' in str(arquivo) or '.git' in str(arquivo):
            continue

        # Categorizar arquivo
        nome = arquivo.name
        categoria = 'Outros'

        if 'ARQ' in nome or 'IMPL' in nome:
            categoria = 'Arquitetura'
        elif 'EST' in nome or 'FUND' in nome or 'TERR' in nome or 'PAV' in nome or 'COBE' in nome:
            categoria = 'Estrutura'
        elif 'ORC' in nome:
            categoria = 'Orçamento'
        elif 'Cronograma' in nome:
            categoria = 'Cronograma'
        elif 'Farol' in nome:
            categoria = 'Indicadores'

        tipo = arquivo.suffix.upper().replace('.', '')

        arquivos_projeto.append({
            'nome': nome,
            'caminho': str(arquivo),
            'tipo': tipo,
            'categoria': categoria,
            'tamanho_mb': round(arquivo.stat().st_size / (1024*1024), 2)
        })

print(f"   ✅ {len(arquivos_projeto)} arquivos catalogados")

# Salvar lista de arquivos
with open('lista_arquivos_projeto.json', 'w', encoding='utf-8') as f:
    json.dump(arquivos_projeto, f, ensure_ascii=False, indent=2)

# Estatísticas por categoria
categorias = {}
for arq in arquivos_projeto:
    cat = arq['categoria']
    categorias[cat] = categorias.get(cat, 0) + 1

print("\n📊 Arquivos por categoria:")
for cat, count in sorted(categorias.items()):
    print(f"   {cat}: {count} arquivos")

# 6. RESUMO
print("\n" + "="*60)
print("📋 RESUMO DA EXTRAÇÃO")
print("="*60)

resumo = {
    'data_extracao': '2025-12-13',
    'arquivos_catalogados': len(arquivos_projeto),
    'categorias': categorias,
    'dados_extraidos': {
        'orcamento_analitico': 'preview_orcamento_analitico.json',
        'orcamento_sintetico': 'preview_orcamento_sintetico.json',
        'grandes_compras': 'preview_grandes_compras.json',
        'farol': 'preview_farol.json',
        'arquivos_projeto': 'lista_arquivos_projeto.json'
    }
}

with open('resumo_extracao.json', 'w', encoding='utf-8') as f:
    json.dump(resumo, f, ensure_ascii=False, indent=2)

print("\n✅ Extração completa!")
print("📁 Arquivos gerados:")
print("   - preview_orcamento_analitico.json")
print("   - preview_orcamento_sintetico.json")
print("   - preview_grandes_compras.json")
print("   - preview_farol.json")
print("   - lista_arquivos_projeto.json")
print("   - resumo_extracao.json")
