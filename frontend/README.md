# NPS System - Frontend

## 🎨 Design System Atualizado

### Paleta de Cores
- **Primária**: Purple (`bg-purple-600`, `hover:bg-purple-700`)
- **Secundária**: Gray (`bg-gray-50`, `text-gray-900`)
- **Status**: 
  - Sucesso: Green (`bg-green-50`, `text-green-700`)
  - Erro: Red (`bg-red-50`, `text-red-700`)
  - Aviso: Yellow (`bg-yellow-50`, `text-yellow-700`)

## 📱 Responsividade Completa

### Breakpoints Utilizados
- **Mobile**: `< 640px` - Layout em coluna única
- **Tablet**: `640px - 1024px` - Layout híbrido
- **Desktop**: `> 1024px` - Layout completo

### Componentes Responsivos

#### 🎯 Sidebar
- **Mobile**: Menu hambúrguer com overlay
- **Desktop**: Sidebar fixa com 256px de largura
- **Design**: Fundo branco com itens roxos
- **Estados**: Hover e ativo com cores roxas

#### 📋 Layout Principal
- **Padding adaptativo**: `p-4 sm:p-6 lg:p-8`
- **Margem lateral**: Apenas em desktop (`lg:ml-64`)
- **Overflow**: Scroll automático no conteúdo

#### 🎨 Páginas Atualizadas

##### Login/Register
- **Formulários**: Labels visíveis, inputs arredondados
- **Botões**: Cores roxas com transições suaves
- **Layout**: Centralizado com padding responsivo

##### Dashboard
- **Cards**: Grid responsivo `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- **Gráfico**: Altura adaptativa `h-80 sm:h-96`
- **Filtros**: Layout flexível `flex-col sm:flex-row`

##### Tickets
- **Modal**: Tamanhos configuráveis (sm, md, lg, xl)
- **Lista**: Cards responsivos com ações empilhadas
- **Formulário**: Validação em tempo real

##### Profile
- **Layout**: Container responsivo com padding adaptativo
- **Botões**: Empilhados em mobile, lado a lado em desktop

##### Evaluate
- **Estrelas**: Tamanho adaptativo `text-2xl sm:text-3xl`
- **Layout**: Centralizado com padding responsivo
- **Cores**: Estrelas roxas (`#8b5cf6`)

## 🚀 Funcionalidades

### Sistema de Notificações
- **Toast**: Posicionado no canto superior direito
- **Auto-dismiss**: 5 segundos
- **Tipos**: Success, Error, Warning, Info
- **Responsivo**: Adapta-se a diferentes telas

### Modal Reutilizável
- **Backdrop**: Clicável para fechar
- **Escape**: Tecla Escape para fechar
- **Foco**: Automático no primeiro input
- **Tamanhos**: sm, md, lg, xl

### Validação de Formulários
- **Tempo real**: Erros aparecem conforme digitação
- **Visual**: Bordas vermelhas e mensagens de erro
- **Acessibilidade**: aria-describedby para screen readers

## ♿ Acessibilidade

### Navegação por Teclado
- **Tab**: Navegação completa entre elementos
- **Enter**: Ativação de botões e links
- **Escape**: Fechamento de modais

### Screen Readers
- **Labels**: Todos os inputs têm labels apropriados
- **Aria-labels**: Botões e elementos interativos
- **Roles**: Dialog, button, navigation

### Contraste
- **Cores**: Contraste adequado em todos os elementos
- **Texto**: Legibilidade garantida
- **Foco**: Indicadores visuais claros

## 🛠️ Tecnologias

- **React 18** com TypeScript
- **TailwindCSS** para estilização
- **React Router** para navegação
- **Lucide React** para ícones
- **Recharts** para gráficos

## 📦 Instalação

```bash
cd frontend
npm install
npm run dev
```

## 🎯 Estrutura de Arquivos

```
frontend/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Layout.tsx      # Layout responsivo
│   │   │   ├── Sidebar.tsx     # Sidebar com design roxo
│   │   │   ├── Modal.tsx       # Modal reutilizável
│   │   │   └── Toast.tsx       # Sistema de notificações
│   │   ├── tickets/
│   │   │   ├── TicketForm.tsx  # Formulário responsivo
│   │   │   └── TicketList.tsx  # Lista em cards
│   │   └── dashboard/
│   │       └── Dashboard.tsx   # Dashboard responsivo
│   ├── pages/
│   │   ├── Login.tsx           # Login responsivo
│   │   ├── Register.tsx        # Register responsivo
│   │   ├── Dashboard.tsx       # Dashboard page
│   │   ├── Tickets.tsx         # Tickets page
│   │   ├── Profile.tsx         # Profile responsivo
│   │   └── Evaluate.tsx        # Evaluate responsivo
│   └── types/
│       └── index.ts            # Tipos TypeScript
```

## 🎨 Melhorias Implementadas

### ✅ Responsividade
- [x] Layout adaptativo para todos os dispositivos
- [x] Sidebar responsiva com menu mobile
- [x] Formulários otimizados para touch
- [x] Cards e grids responsivos
- [x] Gráficos adaptáveis

### ✅ Design System
- [x] Paleta de cores consistente (roxo)
- [x] Componentes reutilizáveis
- [x] Estados visuais claros
- [x] Transições suaves
- [x] Sombras e bordas consistentes

### ✅ Acessibilidade
- [x] Navegação por teclado
- [x] Screen reader friendly
- [x] Contraste adequado
- [x] Labels apropriados
- [x] Foco visual claro

### ✅ UX/UI
- [x] Feedback visual imediato
- [x] Estados de loading
- [x] Validação em tempo real
- [x] Notificações elegantes
- [x] Modais intuitivos

## 🔄 Próximas Melhorias

- [ ] Tema escuro
- [ ] Animações mais elaboradas
- [ ] PWA (Progressive Web App)
- [ ] Testes automatizados
- [ ] Otimização de performance
- [ ] Internacionalização (i18n)
