import PyPDF2
import re
from datetime import datetime

print("="*120)
print("EXTRAINDO PLANEJAMENTO REAL DA PRODUÇÃO - PDF")
print("="*120)

# Ler PDF do planejamento real
with open('pla prod estrut 2 rev01 (2) (4).pdf', 'rb') as file:
    pdf_reader = PyPDF2.PdfReader(file)
    print(f"Total de páginas no PDF: {len(pdf_reader.pages)}")
    
    all_text = []
    for page_num in range(len(pdf_reader.pages)):
        page = pdf_reader.pages[page_num]
        text = page.extract_text()
        all_text.append(text)
        
        if page_num < 5:  # Mostrar primeiras 5 páginas
            print(f"\n{'='*120}")
            print(f"PÁGINA {page_num + 1}")
            print('='*120)
            lines = text.split('\n')
            for i, line in enumerate(lines[:50], 1):  # Primeiras 50 linhas
                print(f"{i:3d} | {line}")
    
    # Juntar todo texto
    full_text = '\n'.join(all_text)
    
    # Procurar padrões
    print(f"\n{'='*120}")
    print("BUSCANDO PADRÕES DE DADOS")
    print('='*120)
    
    # Buscar datas (dd/mm/yyyy)
    dates = re.findall(r'\d{1,2}/\d{1,2}/\d{4}', full_text)
    print(f"\nDatas encontradas: {len(dates)}")
    if dates:
        print(f"Exemplos: {dates[:10]}")
    
    # Buscar percentuais
    percentages = re.findall(r'\d+%|\d+\.\d+%', full_text)
    print(f"\nPercentuais encontrados: {len(percentages)}")
    if percentages:
        print(f"Exemplos: {percentages[:20]}")
    
    # Buscar palavras-chave da construção
    keywords = ['estrutura', 'fundação', 'laje', 'pilar', 'viga', 'concreto', 'forma', 
                'armação', 'pavimento', 'térreo', 'bloco', 'A1', 'A2', 'A3', 'A4',
                'B1', 'B2', 'B3', 'B4', 'C1', 'C2', 'C3', 'C4']
    
    print(f"\n{'='*120}")
    print("ELEMENTOS ESTRUTURAIS ENCONTRADOS")
    print('='*120)
    
    for keyword in keywords:
        count = len(re.findall(keyword, full_text, re.IGNORECASE))
        if count > 0:
            print(f"{keyword.upper()}: {count} menções")
    
    # Salvar texto completo
    with open('planejamento_real_extraido.txt', 'w', encoding='utf-8') as out:
        out.write(full_text)
    
    print(f"\n✅ Texto completo salvo em: planejamento_real_extraido.txt")
    
    # Tentar extrair tabelas ou listas estruturadas
    print(f"\n{'='*120}")
    print("PROCURANDO ESTRUTURAS DE DADOS")
    print('='*120)
    
    lines = full_text.split('\n')
    structured_lines = []
    
    for line in lines:
        # Linhas com datas e números (possíveis atividades)
        if re.search(r'\d{1,2}/\d{1,2}/\d{4}', line) and len(line) > 10:
            structured_lines.append(line)
    
    print(f"\nLinhas estruturadas encontradas: {len(structured_lines)}")
    print("\nPrimeiras 30 linhas estruturadas:")
    for i, line in enumerate(structured_lines[:30], 1):
        print(f"{i:3d} | {line}")
    
    # Salvar linhas estruturadas
    with open('linhas_estruturadas_pdf.txt', 'w', encoding='utf-8') as out:
        for line in structured_lines:
            out.write(line + '\n')
    
    print(f"\n✅ Linhas estruturadas salvas em: linhas_estruturadas_pdf.txt")

print(f"\n{'='*120}")
print("PROCESSAMENTO DO PDF CONCLUÍDO")
print('='*120)
