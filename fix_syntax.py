import re

# Ler o arquivo gerado
with open('constants_completo.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Corrigir sintaxe TypeScript
# Remover '|| undefined' quando há uma data válida
content = re.sub(r"'(\d{4}-\d{2}-\d{2})' \|\| undefined", r"'\1'", content)

# Substituir '' || undefined por undefined
content = re.sub(r"'' \|\| undefined", 'undefined', content)

# Salvar arquivo corrigido
with open('constants_completo_fixed.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Sintaxe TypeScript corrigida com sucesso!")
print("📁 Arquivo salvo: constants_completo_fixed.ts")
