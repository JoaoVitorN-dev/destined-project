# 🚀 Guia Rápido de Teste - Sistema de Match

## 📋 Pré-requisitos

1. MongoDB rodando
2. Backend rodando na porta 3000
3. Frontend rodando (Vite)

## 🧪 Passo a Passo para Testar

### 1. Criar Usuário 1 (Homem procurando Mulher)

1. Acesse a aplicação
2. Faça login/cadastro com:
   - Username: `joao`
   - Password: `123456`
3. Na página **Profile Details**:
   - First Name: `João`
   - Last Name: `Silva`
   - Data de Nascimento: `1995-05-15`
   - Gender: `Male`
   - Preference: `Female` ⭐
4. Na página **Interests**:
   - Selecione: Music, Fitness, Traveling
   - Clique em Continue
5. Você será redirecionado para `/likes` (página principal)

### 2. Criar Usuário 2 (Mulher procurando Homem)

1. Abra em aba anônima ou faça logout
2. Faça cadastro com:
   - Username: `maria`
   - Password: `123456`
3. Na página **Profile Details**:
   - First Name: `Maria`
   - Last Name: `Santos`
   - Data de Nascimento: `1997-08-20`
   - Gender: `Female`
   - Preference: `Male` ⭐
4. Na página **Interests**:
   - Selecione: Music, Cooking, Art
   - Clique em Continue

### 3. Testar o Match

**Como João (preference: Female):**
- Você verá apenas Maria (e outras mulheres)
- Clique no botão verde (💚) para dar like

**Como Maria (preference: Male):**
- Você verá apenas João (e outros homens)
- Clique no botão verde (💚) para dar like

**Resultado:** 🎉 Modal de Match aparecerá!

### 4. Criar Usuário 3 (Pessoa procurando Ambos)

1. Faça cadastro com:
   - Username: `alex`
   - Password: `123456`
3. Na página **Profile Details**:
   - First Name: `Alex`
   - Gender: `Other`
   - Preference: `Both` ⭐
4. Alex verá TODOS os usuários (João, Maria, etc.)

## ✅ O Que Verificar

### Filtro de Preferência
- [x] Usuário com preference "Male" vê apenas usuários com gender "Male"
- [x] Usuário com preference "Female" vê apenas usuários com gender "Female"
- [x] Usuário com preference "Both" vê todos os usuários

### Informações no Card
- [x] Nome e idade exibidos corretamente
- [x] Interesses aparecem como tags (máx 3)
- [x] Distância mockada aparece
- [x] Indicador de usuário atual (bolinhas)

### Sistema de Match
- [x] Like funciona
- [x] Dislike pula para próximo usuário
- [x] Match detectado quando ambos se curtem
- [x] Modal de match aparece

### Navegação
- [x] Após completar cadastro, redireciona para `/likes`
- [x] Botão Skip em Interests funciona
- [x] TabBar permite navegar entre páginas

## 🐛 Possíveis Problemas

### Backend não filtra usuários
**Solução:** Verifique se o usuário tem `preference` definida no banco:
```javascript
// No MongoDB
db.users.find({ username: "joao" })
// Deve ter campo "preference": "Female"
```

### Usuários não aparecem
**Solução:** 
1. Verifique se há usuários cadastrados com perfis completos
2. Verifique o console do navegador para erros
3. Teste a API diretamente: `GET http://localhost:3000/users` com header `user-token`

### Match não detecta
**Solução:**
1. Verifique se ambos os usuários deram like
2. Verifique a collection `likes` no MongoDB
3. Console do navegador deve mostrar `match: true` na resposta

## 📊 Estrutura de Dados Esperada

### User no MongoDB
```json
{
  "_id": "...",
  "username": "joao",
  "password": "...",
  "firstName": "João",
  "lastName": "Silva",
  "dateOfBirth": "1995-05-15T00:00:00.000Z",
  "gender": "Male",
  "preference": "Female",
  "interests": ["Music", "Fitness", "Traveling"],
  "createdAt": "2025-11-03T..."
}
```

### Like no MongoDB
```json
{
  "_id": "...",
  "curtidor": "userId1", // quem deu o like
  "curtido": "userId2",  // quem recebeu o like
  "__v": 0
}
```

## 🔍 Endpoints para Teste Manual

```bash
# Listar usuários (com filtro de preferência)
curl -H "user-token: SEU_USER_ID" http://localhost:3000/users

# Dar like
curl -X POST http://localhost:3000/likes \
  -H "Content-Type: application/json" \
  -H "user-token: SEU_USER_ID" \
  -d '{"curtidoId": "ID_DO_USUARIO_CURTIDO"}'

# Ver matches
curl -H "user-token: SEU_USER_ID" http://localhost:3000/likes/matches
```

## 🎨 Visual Esperado (Estilo Tinder)

- Card grande com foto (placeholder avatar)
- Nome + idade na parte inferior
- Tags de interesses
- 3 botões: Dislike (vermelho), Like (verde), Matches (rosa)
- Modal de match quando há correspondência
- Indicadores de navegação (bolinhas)

## 📝 Notas Importantes

1. **Primeira página após cadastro:** `/likes` (não `/users`)
2. **Filtro automático:** Baseado na preferência escolhida
3. **Idade:** Calculada automaticamente da data de nascimento
4. **Interesses:** Máximo 3 exibidos no card
5. **Match:** Detectado automaticamente ao dar like mútuo
