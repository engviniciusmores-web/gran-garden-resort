#!/usr/bin/env python3
"""
INTEGRAÇÃO FINAL COMPLETA - Gran Garden Resort
Com valores, materiais e arquivos de projeto
"""
import json
import pandas as pd
from datetime import datetime

print("="*80)
print("🏗️  INTEGRAÇÃO FINAL COMPLETA - GRAN GARDEN RESORT")
print("="*80)

# 1. CARREGAR TAREFAS EXISTENTES
print("\n📋 Carregando tarefas do cronograma...")
with open('todas_tarefas.json', 'r', encoding='utf-8') as f:
    tarefas = json.load(f)
print(f"   ✅ {len(tarefas)} tarefas carregadas")

# 2. CARREGAR ORÇAMENTO
print("\n💰 Processando orçamento...")
orcamento = pd.read_excel(
    '6 - ORC-EP-GRAN-GARDEN_R03_APROVADO-DIRETORIA_08.08.2025 - ORC ANALITICO.xlsx',
    sheet_name=0
)

# Calcular valor total
valores_servicos = orcamento.groupby('SERVIÇO')['TOTAL'].sum().to_dict()
valor_total_orcamento = sum(valores_servicos.values())
print(f"   💵 Orçamento Total: R$ {valor_total_orcamento:,.2f}")

# 3. DISTRIBUIR VALORES NAS TAREFAS
print("\n🔗 Distribuindo valores nas tarefas...")

# Valor médio por tarefa (distribuição simplificada)
valor_medio_tarefa = valor_total_orcamento / len(tarefas)

tarefas_com_valores = []
for tarefa in tarefas:
    t = tarefa.copy()

    # Atribuir valor baseado no tipo de atividade
    multiplicador = 1.0
    nome_lower = tarefa['name'].lower()

    if 'estrutura' in nome_lower or 'concreto' in nome_lower:
        multiplicador = 2.5  # Estruturas custam mais
    elif 'fundação' in nome_lower or 'fundacao' in nome_lower:
        multiplicador = 2.0
    elif 'contenção' in nome_lower or 'contencao' in nome_lower:
        multiplicador = 1.8
    elif 'instalações' in nome_lower or 'instalacoes' in nome_lower:
        multiplicador = 1.5
    elif 'acabamento' in nome_lower or 'pintura' in nome_lower:
        multiplicador = 1.2
    elif 'limpeza' in nome_lower:
        multiplicador = 0.3

    valor_previsto = valor_medio_tarefa * multiplicador
    valor_realizado = valor_previsto * (tarefa.get('realizado_pct', 0) / 100.0)

    t['valor_previsto'] = round(valor_previsto, 2)
    t['valor_realizado'] = round(valor_realizado, 2)
    t['peso_financeiro'] = round((valor_previsto / valor_total_orcamento) * 100, 4)  # % do orçamento

    tarefas_com_valores.append(t)

valor_total_realizado = sum(t['valor_realizado'] for t in tarefas_com_valores)
print(f"   ✅ Valores distribuídos")
print(f"   💵 Realizado: R$ {valor_total_realizado:,.2f} ({(valor_total_realizado/valor_total_orcamento)*100:.2f}%)")

# 4. PROCESSAR MATERIAIS (GRANDES COMPRAS)
print("\n📦 Processando materiais e grandes compras...")
try:
    materiais_df = pd.read_excel(
        'GGR - Cronograma de Grandes Compras_Rev_Out_2025.xlsx',
        header=None,
        skiprows=5  # Pular cabeçalho
    )

    materiais = []
    for idx, row in materiais_df.iterrows():
        servico = row.get(1, '')  # Coluna 1 tem o nome do serviço
        if servico and str(servico) != 'nan':
            material = {
                'id': f"MAT_{idx:03d}",
                'nome': str(servico),
                'prazo_fornecedor_dias': int(row.get(7, 0)) if pd.notna(row.get(7)) else 0,
                'prazo_suprimentos_dias': int(row.get(8, 0)) if pd.notna(row.get(8)) else 0,
                'prazo_obra_dias': int(row.get(9, 0)) if pd.notna(row.get(9)) else 0,
                'frete_dias': int(row.get(6, 0)) if pd.notna(row.get(6)) else 0,
                'categoria': 'Material Principal',
                'atividade_relacionada': str(row.get(14, '')) if pd.notna(row.get(14)) else ''
            }
            materiais.append(material)

    print(f"   ✅ {len(materiais)} materiais processados")
except Exception as e:
    print(f"   ⚠️ Erro ao processar materiais: {e}")
    materiais = []

# 5. CARREGAR ARQUIVOS DE PROJETO
print("\n📁 Carregando arquivos de projeto...")
with open('lista_arquivos_projeto.json', 'r', encoding='utf-8') as f:
    arquivos_projeto = json.load(f)

# Separar por tipo
arquivos_por_tipo = {}
for arq in arquivos_projeto:
    tipo = arq['tipo']
    if tipo not in arquivos_por_tipo:
        arquivos_por_tipo[tipo] = []
    arquivos_por_tipo[tipo].append(arq)

print(f"   ✅ {len(arquivos_projeto)} arquivos catalogados")
print(f"   📄 PDFs: {len(arquivos_por_tipo.get('PDF', []))}")
print(f"   📊 XLSXs: {len(arquivos_por_tipo.get('XLSX', []))}")
print(f"   📋 Outros: {len([a for a in arquivos_projeto if a['tipo'] not in ['PDF', 'XLSX']])}")

# 6. CRIAR ESTRUTURA FINAL
print("\n📊 Criando estrutura final de dados...")

dados_finais = {
    'projeto': {
        'nome': 'Gran Garden Resort',
        'codigo': 'O4210',
        'orcamento_total': round(valor_total_orcamento, 2),
        'orcamento_realizado': round(valor_total_realizado, 2),
        'percentual_executado': round((valor_total_realizado / valor_total_orcamento) * 100, 2),
        'data_atualizacao': datetime.now().isoformat(),
        'total_tarefas': len(tarefas_com_valores),
        'total_materiais': len(materiais),
        'total_arquivos': len(arquivos_projeto)
    },
    'tarefas_completas': tarefas_com_valores,
    'materiais': materiais,
    'arquivos_projeto': arquivos_projeto,
    'arquivos_por_tipo': {
        tipo: len(arqs) for tipo, arqs in arquivos_por_tipo.items()
    },
    'estatisticas': {
        'tarefas_por_status': {
            'concluido': len([t for t in tarefas_com_valores if t['status'] == 'Concluído']),
            'em_andamento': len([t for t in tarefas_com_valores if 'Andamento' in t['status']]),
            'atrasado': len([t for t in tarefas_com_valores if 'Atraso' in t['status']]),
            'a_fazer': len([t for t in tarefas_com_valores if t['status'] == 'A Fazer'])
        },
        'valores_por_status': {
            'previsto_total': round(sum(t['valor_previsto'] for t in tarefas_com_valores), 2),
            'realizado_total': round(valor_total_realizado, 2),
            'realizado_concluido': round(sum(t['valor_realizado'] for t in tarefas_com_valores if t['status'] == 'Concluído'), 2),
            'realizado_em_andamento': round(sum(t['valor_realizado'] for t in tarefas_com_valores if 'Andamento' in t['status']), 2)
        },
        'top_tarefas_por_valor': sorted(
            [{
                'nome': t['name'],
                'valor': t['valor_previsto'],
                'peso': t['peso_financeiro'],
                'status': t['status']
            } for t in tarefas_com_valores],
            key=lambda x: x['valor'],
            reverse=True
        )[:20]  # Top 20
    }
}

# Salvar
with open('dados_finais_integrados.json', 'w', encoding='utf-8') as f:
    json.dump(dados_finais, f, ensure_ascii=False, indent=2)

# 7. RELATÓRIO FINAL
print("\n" + "="*80)
print("📊 RELATÓRIO FINAL DA INTEGRAÇÃO")
print("="*80)

print(f"\n💰 FINANCEIRO:")
print(f"   Orçamento Total: R$ {dados_finais['projeto']['orcamento_total']:,.2f}")
print(f"   Realizado: R$ {dados_finais['projeto']['orcamento_realizado']:,.2f}")
print(f"   Percentual Executado: {dados_finais['projeto']['percentual_executado']}%")

print(f"\n📋 TAREFAS ({dados_finais['projeto']['total_tarefas']} total):")
for status, qtd in dados_finais['estatisticas']['tarefas_por_status'].items():
    print(f"   {status.title()}: {qtd}")

print(f"\n📦 MATERIAIS: {len(materiais)} itens principais")

print(f"\n📁 ARQUIVOS DE PROJETO ({len(arquivos_projeto)} total):")
for tipo, qtd in sorted(dados_finais['arquivos_por_tipo'].items()):
    print(f"   {tipo}: {qtd} arquivos")

print(f"\n🏆 TOP 5 TAREFAS POR VALOR:")
for i, tarefa in enumerate(dados_finais['estatisticas']['top_tarefas_por_valor'][:5], 1):
    print(f"   {i}. {tarefa['nome'][:60]}...")
    print(f"      Valor: R$ {tarefa['valor']:,.2f} ({tarefa['peso']:.2f}% do orçamento) - {tarefa['status']}")

print("\n✅ Dados completos salvos em: dados_finais_integrados.json")
print("="*80)
