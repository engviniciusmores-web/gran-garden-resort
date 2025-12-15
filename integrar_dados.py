#!/usr/bin/env python3
"""
Script para integrar os dados completos do cronograma no constants.ts
"""
import json

# Ler dados completos
with open('todas_tarefas.json', 'r', encoding='utf-8') as f:
    todas_tarefas = json.load(f)

print(f"Total de tarefas carregadas: {len(todas_tarefas)}")

# Mapear status
def mapear_status(status_original):
    if status_original == 'Concluído':
        return 'Concluído'
    elif 'Andamento' in status_original:
        return 'Em Andamento'
    elif 'Atraso' in status_original or 'Atrasad' in status_original:
        return 'Atrasado'
    else:
        return 'A Fazer'

# Mapear responsável baseado no bloco
def mapear_responsavel(bloco):
    if bloco and 'A' in bloco:
        return 'Equipe Caio'
    elif bloco and 'B' in bloco:
        return 'Equipe Tatiane'
    elif bloco and 'C' in bloco:
        return 'Equipe Lucas'
    elif bloco and ('Lazer' in bloco or 'Rec' in bloco):
        return 'Equipe Tatiane'
    else:
        return 'Equipe Daniel'

# Converter tarefas
tarefas_convertidas = []
for idx, tarefa in enumerate(todas_tarefas):
    # Criar nome completo da tarefa
    nome_completo = f"{tarefa['name']} {tarefa['bloco']} - {tarefa['lote']}"

    # Determinar o deadline (usar end_real se existir, senão end_baseline)
    deadline = tarefa['end_real'] if tarefa['end_real'] else tarefa['end_baseline']

    # Mapear status
    status = mapear_status(tarefa['status'])

    # Responsável
    responsavel = tarefa['responsavel'] if tarefa['responsavel'] and tarefa['responsavel'] != '-' else mapear_responsavel(tarefa['bloco'])

    tarefa_convertida = {
        'id': str(tarefa['id']),
        'name': nome_completo,
        'deadline': deadline,
        'status': status,
        'responsible': responsavel,
        'plannedStart': tarefa['start_baseline'],
        'plannedEnd': tarefa['end_baseline'],
        'actualStart': tarefa['start_real'] if tarefa['start_real'] else tarefa['start_baseline'],
        'actualEnd': tarefa['end_real'] if tarefa['end_real'] else tarefa['end_baseline'],
        'progress': int(tarefa['realizado_pct']) if tarefa['realizado_pct'] else 0,
        'bloco': tarefa['bloco'],
        'lote': tarefa['lote'],
        'servico': tarefa['servico']
    }

    tarefas_convertidas.append(tarefa_convertida)

# Salvar em JSON para importação
with open('tarefas_completas.json', 'w', encoding='utf-8') as f:
    json.dump(tarefas_convertidas, f, ensure_ascii=False, indent=2)

print(f"✅ {len(tarefas_convertidas)} tarefas convertidas e salvas em tarefas_completas.json")

# Estatísticas
status_count = {}
for t in tarefas_convertidas:
    status = t['status']
    status_count[status] = status_count.get(status, 0) + 1

print("\n📊 Estatísticas:")
for status, count in sorted(status_count.items()):
    print(f"  {status}: {count}")
