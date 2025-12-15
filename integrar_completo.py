#!/usr/bin/env python3
"""
Integração COMPLETA dos dados do Gran Garden Resort:
- Tarefas do cronograma com VALORES FINANCEIROS
- Materiais e grandes compras
- Arquivos de projeto (PDFs, IFCs)
- Medição por PESO (valor), não por quantidade de tarefas
"""
import json
import pandas as pd
from datetime import datetime

print("="*80)
print("🏗️  INTEGRAÇÃO COMPLETA - GRAN GARDEN RESORT")
print("="*80)

# 1. CARREGAR TAREFAS EXISTENTES
print("\n📋 Carregando tarefas do cronograma...")
with open('todas_tarefas.json', 'r', encoding='utf-8') as f:
    tarefas = json.load(f)
print(f"   ✅ {len(tarefas)} tarefas carregadas")

# 2. CARREGAR ORÇAMENTO ANALÍTICO
print("\n💰 Processando orçamento analítico...")
orcamento = pd.read_excel(
    '6 - ORC-EP-GRAN-GARDEN_R03_APROVADO-DIRETORIA_08.08.2025 - ORC ANALITICO.xlsx',
    sheet_name=0
)

# Criar dicionário de valores por serviço
valores_por_servico = {}
for _, row in orcamento.iterrows():
    servico_cod = str(row.get('SERVIÇO', ''))
    descricao = str(row.get('DESCRICAO DO SERVIÇO', ''))
    total = row.get('TOTAL', 0)
    item_pla = str(row.get('Item_pla', ''))

    if servico_cod and servico_cod != 'nan':
        if servico_cod not in valores_por_servico:
            valores_por_servico[servico_cod] = {
                'codigo': servico_cod,
                'descricao': descricao,
                'valor_total': 0,
                'item_pla': item_pla
            }
        if total and str(total) != 'nan':
            valores_por_servico[servico_cod]['valor_total'] += float(total)

print(f"   ✅ {len(valores_por_servico)} serviços com valores processados")

# Calcular valor total do orçamento
valor_total_orcamento = sum(v['valor_total'] for v in valores_por_servico.values())
print(f"   💵 Valor total do orçamento: R$ {valor_total_orcamento:,.2f}")

# 3. ATRIBUIR VALORES ÀS TAREFAS
print("\n🔗 Vinculando valores às tarefas...")

# Criar mapeamento de descrições para encontrar correspondências
def encontrar_valor_tarefa(tarefa_nome, bloco, lote):
    """
    Tenta encontrar o valor correspondente da tarefa no orçamento
    """
    # Palavras-chave para busca
    keywords = []
    nome_lower = tarefa_nome.lower()

    if 'fundação' in nome_lower or 'fundacao' in nome_lower:
        keywords = ['fundação', 'fundacao', 'estaca', 'sapata']
    elif 'estrutura' in nome_lower:
        keywords = ['estrutura', 'concreto', 'forma', 'armadura']
    elif 'alvenaria' in nome_lower:
        keywords = ['alvenaria', 'bloco', 'tijolo']
    elif 'limpeza' in nome_lower:
        keywords = ['limpeza', 'terreno']
    elif 'escavação' in nome_lower or 'escavacao' in nome_lower:
        keywords = ['escavação', 'escavacao', 'terraplenagem']
    elif 'contenção' in nome_lower or 'contencao' in nome_lower:
        keywords = ['contenção', 'contencao', 'muro']

    # Buscar no orçamento
    for servico_cod, dados in valores_por_servico.items():
        descricao_lower = dados['descricao'].lower()
        for keyword in keywords:
            if keyword in descricao_lower:
                return dados['valor_total'] / 15  # Dividir pelo número de blocos

    return 0  # Valor padrão se não encontrar

# Processar tarefas com valores
tarefas_com_valores = []
valor_total_distribuido = 0

for tarefa in tarefas:
    # Copiar tarefa
    tarefa_completa = tarefa.copy()

    # Estimar valor baseado no tipo de serviço
    valor_estimado = encontrar_valor_tarefa(
        tarefa['name'],
        tarefa.get('bloco', ''),
        tarefa.get('lote', '')
    )

    # Se não encontrou valor, atribuir baseado no progresso e orçamento médio
    if valor_estimado == 0:
        # Valor médio por tarefa
        valor_estimado = valor_total_orcamento / len(tarefas)

    tarefa_completa['valor_previsto'] = round(valor_estimado, 2)
    tarefa_completa['valor_realizado'] = round(valor_estimado * (tarefa.get('realizado_pct', 0) / 100), 2)

    valor_total_distribuido += valor_estimado

    tarefas_com_valores.append(tarefa_completa)

print(f"   ✅ {len(tarefas_com_valores)} tarefas processadas com valores")
print(f"   💵 Valor total distribuído: R$ {valor_total_distribuido:,.2f}")

# 4. PROCESSAR GRANDES COMPRAS (MATERIAIS)
print("\n📦 Processando grandes compras e materiais...")
grandes_compras_df = pd.read_excel(
    'GGR - Cronograma de Grandes Compras_Rev_Out_2025.xlsx',
    sheet_name=0,
    header=3  # Pular cabeçalhos
)

materiais = []
for idx, row in grandes_compras_df.iterrows():
    servico = row.get('Grandes Compras', '')
    if servico and str(servico) not in ['nan', 'null', None, 'Serviço']:
        material = {
            'id': f"MAT_{idx}",
            'nome': str(servico),
            'prazo_fornecedor': row.get('Prazo Fornecedor', 0),
            'prazo_suprimentos': row.get('Prazo Suprimentos', 0),
            'prazo_obra': row.get('Prazo Levantamento Obra', 0),
            'frete_dias': row.get('Frete', 0),
            'categoria': 'Material Principal'
        }
        materiais.append(material)

print(f"   ✅ {len(materiais)} materiais principais catalogados")

# 5. PROCESSAR ARQUIVOS DE PROJETO
print("\n📁 Catalogando arquivos de projeto...")
with open('lista_arquivos_projeto.json', 'r', encoding='utf-8') as f:
    arquivos_projeto = json.load(f)

print(f"   ✅ {len(arquivos_projeto)} arquivos catalogados")

# Estatísticas por categoria
stats_categorias = {}
for arq in arquivos_projeto:
    cat = arq['categoria']
    stats_categorias[cat] = stats_categorias.get(cat, 0) + 1

# 6. CRIAR ESTRUTURA COMPLETA DE DADOS
print("\n📊 Criando estrutura completa de dados...")

dados_completos = {
    'projeto': {
        'nome': 'Gran Garden Resort',
        'codigo': 'O4210',
        'orcamento_total': valor_total_orcamento,
        'orcamento_realizado': sum(t['valor_realizado'] for t in tarefas_com_valores),
        'data_atualizacao': datetime.now().isoformat(),
        'total_tarefas': len(tarefas_com_valores),
        'total_materiais': len(materiais),
        'total_arquivos': len(arquivos_projeto)
    },
    'tarefas': tarefas_com_valores,
    'materiais': materiais,
    'arquivos_projeto': arquivos_projeto,
    'estatisticas': {
        'tarefas': {
            'total': len(tarefas_com_valores),
            'concluidas': len([t for t in tarefas_com_valores if t['status'] == 'Concluído']),
            'em_andamento': len([t for t in tarefas_com_valores if 'Andamento' in t['status']]),
            'atrasadas': len([t for t in tarefas_com_valores if 'Atraso' in t['status']]),
            'a_fazer': len([t for t in tarefas_com_valores if t['status'] == 'A Fazer'])
        },
        'valores': {
            'orcamento_total': valor_total_orcamento,
            'realizado': sum(t['valor_realizado'] for t in tarefas_com_valores),
            'percentual_executado': round((sum(t['valor_realizado'] for t in tarefas_com_valores) / valor_total_orcamento) * 100, 2) if valor_total_orcamento > 0 else 0
        },
        'arquivos_por_categoria': stats_categorias
    }
}

# Salvar dados completos
with open('dados_completos_integrados.json', 'w', encoding='utf-8') as f:
    json.dump(dados_completos, f, ensure_ascii=False, indent=2)

print(f"   ✅ Estrutura completa criada!")

# 7. RELATÓRIO FINAL
print("\n" + "="*80)
print("📊 RELATÓRIO DA INTEGRAÇÃO COMPLETA")
print("="*80)

print(f"\n💰 VALORES:")
print(f"   Orçamento Total: R$ {valor_total_orcamento:,.2f}")
print(f"   Realizado: R$ {dados_completos['estatisticas']['valores']['realizado']:,.2f}")
print(f"   Percentual: {dados_completos['estatisticas']['valores']['percentual_executado']}%")

print(f"\n📋 TAREFAS:")
for status, qtd in dados_completos['estatisticas']['tarefas'].items():
    print(f"   {status.title()}: {qtd}")

print(f"\n📦 MATERIAIS: {len(materiais)} itens principais")

print(f"\n📁 ARQUIVOS DE PROJETO:")
for cat, qtd in stats_categorias.items():
    print(f"   {cat}: {qtd} arquivos")

print("\n✅ Integração completa salva em: dados_completos_integrados.json")
print("="*80)
