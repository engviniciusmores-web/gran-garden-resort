import PyPDF2
import re

pdf_path = r"c:\Users\User\Downloads\obracontrol---engenharia-raiz\GGR - Cronograma linha de Base_Rev_Out_2025.pdf"

try:
    with open(pdf_path, 'rb') as file:
        pdf_reader = PyPDF2.PdfReader(file)
        
        print(f"Total de páginas: {len(pdf_reader.pages)}\n")
        
        # Ler primeiras 5 páginas para encontrar o cronograma principal
        for page_num in range(min(5, len(pdf_reader.pages))):
            print(f"\n{'='*80}")
            print(f"PÁGINA {page_num + 1}")
            print('='*80)
            
            page = pdf_reader.pages[page_num]
            text = page.extract_text()
            
            # Filtrar linhas relevantes (que contenham datas ou atividades)
            lines = text.split('\n')
            for line in lines:
                # Procurar linhas com datas (formato dd/mm/yyyy ou mm/dd/yyyy)
                if re.search(r'\d{1,2}[/-]\d{1,2}[/-]\d{2,4}', line):
                    print(line)
                # Ou linhas com palavras-chave de atividades
                elif any(keyword in line.lower() for keyword in ['estrutura', 'laje', 'fundação', 'alvenaria', 'concreto', 'pilar', 'viga', 'térreo', 'pavimento', 'bloco']):
                    if len(line.strip()) > 5:  # Ignorar linhas muito curtas
                        print(line)

except Exception as e:
    print(f"Erro ao ler PDF: {e}")
