"""
Script de teste para geração de relatórios em PDF e Word
"""

from report_generator import generate_report_from_json
from datetime import datetime

print("="*80)
print("TESTE DE GERAÇÃO DE RELATÓRIOS - GAV GRAN GARDEN RESORT")
print("="*80)

# Dados de teste para diferentes tipos de relatórios
test_reports = [
    {
        'type': 'geral',
        'project': 'Gran Garden Resort - Visão Geral',
        'period': 'last-month',
        'period_label': 'Último Mês',
        'tasks': 150,
        'completedTasks': 120,
        'includeCharts': True,
        'includePhotos': True,
        'generatedAt': datetime.now().isoformat()
    },
    {
        'type': 'blocos',
        'project': 'Gran Garden Resort - Análise por Blocos',
        'period': 'last-3-months',
        'period_label': 'Últimos 3 Meses',
        'tasks': 450,
        'completedTasks': 380,
        'includeCharts': True,
        'includePhotos': False,
        'generatedAt': datetime.now().isoformat()
    },
    {
        'type': 'tarefas',
        'project': 'Gran Garden Resort - Detalhamento de Tarefas',
        'period': 'all-time',
        'period_label': 'Todo o Período',
        'tasks': 850,
        'completedTasks': 650,
        'includeCharts': False,
        'includePhotos': False,
        'generatedAt': datetime.now().isoformat()
    },
    {
        'type': 'financeiro',
        'project': 'Gran Garden Resort - Relatório Financeiro',
        'period': 'last-6-months',
        'period_label': 'Últimos 6 Meses',
        'tasks': 280,
        'completedTasks': 220,
        'includeCharts': True,
        'includePhotos': True,
        'generatedAt': datetime.now().isoformat()
    }
]

# Gerar relatórios de teste
for i, report_data in enumerate(test_reports, 1):
    print(f"\n{'-'*80}")
    print(f"Relatório {i}/{len(test_reports)}: {report_data['type'].upper()}")
    print(f"{'-'*80}")
    
    try:
        # Gerar PDF
        pdf_path = generate_report_from_json(report_data, format='pdf')
        print(f"✅ PDF: {pdf_path}")
        
        # Gerar Word
        word_path = generate_report_from_json(report_data, format='word')
        print(f"✅ Word: {word_path}")
        
    except Exception as e:
        print(f"❌ Erro: {e}")
        import traceback
        traceback.print_exc()

print(f"\n{'='*80}")
print("TESTE CONCLUÍDO!")
print(f"{'='*80}")
print("\n📁 Todos os relatórios foram salvos na pasta: ./relatorios/")
print("\n✨ Verifique os arquivos gerados para confirmar a formatação e marca da GAV")
