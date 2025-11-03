# 🐛 Debug - Problemas com Usuários

## Problema Reportado
1. Não aparecem usuários na primeira tela
2. Não filtra por gênero conforme preferência

## ✅ Correções Implementadas

### 1. Backend - Endpoint `/users`
- ✅ Adicionado logs para debug
- ✅ Corrigido bug na query quando há likes anteriores
- ✅ Endpoint `/debug/me` para verificar dados do usuário

### 2. Frontend - likeStore.ts
- ✅ Passa todos os dados do usuário (não apenas username)
- ✅ Adicionado logs para debug
- ✅ Adicionado parâmetro `forceReload` para recarregar

### 3. Frontend - ProfileDetailsPage
- ✅ Validação de campos obrigatórios
- ✅ Logs para debug

### 4. Frontend - InterestsPage
- ✅ Logs detalhados do processo de salvamento
- ✅ Mensagens de erro mais descritivas

## 🔍 Como Debugar

### 1. Verificar se o usuário tem perfil completo

**No navegador (Console):**
```javascript
// Ver token do usuário
localStorage.getItem('user-token')

// Ver dados salvos temporariamente
localStorage.getItem('profile-data')
```

**Testar API diretamente:**
```bash
# Substituir USER_ID pelo token do localStorage
curl http://localhost:3000/debug/me -H "user-token: USER_ID"
```

**Resposta esperada:**
```json
{
  "user": {
    "_id": "...",
    "username": "joao",
    "firstName": "João",
    "lastName": "Silva",
    "gender": "Male",
    "preference": "Female",  // ⭐ IMPORTANTE
    "interests": ["Music", "Fitness"],
    "dateOfBirth": "..."
  }
}
```

### 2. Verificar se o filtro está funcionando

**Console do backend deve mostrar:**
```
Current user: joao preference: Female
Filtering by gender: Female
Query: {"_id":{"$ne":"..."},"gender":"Female"}
Found users: 3
```

**Console do frontend deve mostrar:**
```
Fetched users: [{...}, {...}, {...}]
Mapped users: [{...}, {...}, {...}]
```

### 3. Popular banco com dados de teste

```bash
cd back
node populate-test-users.js
```

Isso criará:
- 3 usuários do sexo feminino (preferem homens)
- 3 usuários do sexo masculino (preferem mulheres)
- 1 usuário "Other" (prefere ambos)

## 🧪 Teste Passo a Passo

### Cenário 1: Novo Usuário

1. **Criar usuário:**
   - Username: `teste1`
   - Password: `123456`

2. **Preencher perfil:**
   - Nome: `Teste`
   - Sobrenome: `Um`
   - Data: `1995-01-01`
   - Gênero: `Male` ⭐
   - Preferência: `Female` ⭐

3. **Selecionar interesses** (opcional)

4. **Verificar console do navegador:**
   ```
   Saving profile data: {firstName: "Teste", gender: "Male", preference: "Female", ...}
   Profile data from storage: {...}
   Updating user with data: {...}
   User updated successfully: {...}
   ```

5. **Na página /likes, verificar console:**
   ```
   Fetched users: [...]  // Deve ter apenas usuários do sexo Female
   ```

### Cenário 2: Usuário Existente Sem Perfil

Se o usuário JÁ EXISTE mas não tem `gender` e `preference`:

**Solução 1 - Atualizar via API:**
```bash
curl -X PUT http://localhost:3000/users/USER_ID \
  -H "Content-Type: application/json" \
  -H "user-token: USER_ID" \
  -d '{
    "firstName": "João",
    "lastName": "Silva",
    "dateOfBirth": "1995-05-15",
    "gender": "Male",
    "preference": "Female",
    "interests": ["Music"]
  }'
```

**Solução 2 - Forçar redirecionar para ProfileDetails:**
```javascript
// No router ou em uma guarda de rota
const user = await api.getCurrentUser();
if (!user.gender || !user.preference) {
  router.push('/profileDetails');
}
```

## ⚠️ Problemas Comuns

### Problema: "No users found"

**Causas possíveis:**
1. ❌ Não há usuários no banco com o gênero desejado
2. ❌ Usuário não tem `preference` definida
3. ❌ Todos os usuários já foram curtidos

**Solução:**
```bash
# Popular banco com usuários de teste
node populate-test-users.js

# Verificar usuários no MongoDB
mongosh
use test
db.users.find({}).pretty()
```

### Problema: "User not logged in"

**Causa:** Token não está no localStorage

**Solução:**
```javascript
// No console do navegador
localStorage.setItem('user-token', 'SEU_USER_ID')
```

### Problema: Filtra errado (mostra gênero incorreto)

**Verificar:**
1. Campo `gender` dos usuários no banco
2. Campo `preference` do usuário logado
3. Logs do backend

**Exemplo esperado:**
- Usuário logado: `gender: Male, preference: Female`
- Backend busca: `WHERE gender = 'Female'`
- Resultado: Apenas mulheres

## 📊 Verificar Dados no MongoDB

```javascript
// mongosh
use test

// Ver todos os usuários
db.users.find({}, {username: 1, gender: 1, preference: 1}).pretty()

// Ver usuários femininos
db.users.find({gender: "Female"}, {username: 1, firstName: 1}).pretty()

// Ver usuários masculinos
db.users.find({gender: "Male"}, {username: 1, firstName: 1}).pretty()

// Atualizar usuário específico
db.users.updateOne(
  {username: "joao"},
  {$set: {gender: "Male", preference: "Female"}}
)
```

## 🔧 Endpoints Úteis

```bash
# Health check
curl http://localhost:3000/health

# Ver dados do usuário atual
curl http://localhost:3000/debug/me -H "user-token: USER_ID"

# Listar usuários (com filtro)
curl http://localhost:3000/users -H "user-token: USER_ID"

# Atualizar perfil
curl -X PUT http://localhost:3000/users/USER_ID \
  -H "Content-Type: application/json" \
  -H "user-token: USER_ID" \
  -d '{"gender": "Male", "preference": "Female"}'
```

## 📝 Checklist de Debug

- [ ] Backend rodando (porta 3000)
- [ ] Frontend rodando (Vite)
- [ ] MongoDB rodando
- [ ] Usuário tem token no localStorage
- [ ] Usuário tem `gender` definido no banco
- [ ] Usuário tem `preference` definida no banco
- [ ] Existem usuários com o gênero desejado no banco
- [ ] Console do navegador não mostra erros
- [ ] Console do backend mostra logs corretos
