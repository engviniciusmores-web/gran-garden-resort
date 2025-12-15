import re

# Ler o arquivo constants.ts
with open('constants.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Substituir todos os status "Em Andamento - XXX" por "Em Andamento"
content = re.sub(r"status: 'Em Andamento - (Inicial|Avançado)'", "status: 'Em Andamento'", content)

# Salvar
with open('constants.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Status corrigido com sucesso!")
print("✅ Todos 'Em Andamento - Inicial' e 'Em Andamento - Avançado' substituídos por 'Em Andamento'")
