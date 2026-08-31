<div align="center">

# 💸 ICS Finance

**Controle de gastos inteligente e visual — feito por Siqueira, Caua & Igor**

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

**100% local · sem servidor · sem banco de dados · dados salvos no seu navegador**

</div>

---

## ✨ Sobre o projeto

O **ICS Finance** é um aplicativo web de controle financeiro pessoal, moderno e com visual em *glassmorphism*. Ele ajuda a registrar entradas e saídas, acompanhar seus gastos por categoria, definir limites mensais e monitorar sua jornada de investimentos — tudo de forma simples, rápida e visual.

> O nome **ICS** vem das iniciais dos três criadores: **I**gor, **C**aua e **S**iqueira.

---

## 🚀 Como usar

1. Faça o download ou clone este repositório
2. Abra o arquivo `index.html` em qualquer navegador (Chrome, Edge, Firefox...)
3. Comece a registrar suas transações!

> **Dica:** o projeto não precisa de instalação, servidor ou internet. Os dados ficam salvos no `localStorage` do seu navegador.

---

## 🎨 Funcionalidades

### 📊 Visão geral
- **Entradas, Saídas e Saldo** — cards de resumo com animação de contagem
- **Percentual do total** — veja quanto das movimentações é entrada

### ➕ Registro de transações
- Descrição, valor, tipo (entrada/saída) e categoria
- **10 categorias** com emojis e cores próprias
- Editar e excluir transações facilmente

### 🎯 Média de Gastos
- Defina um **limite mensal** de gastos
- Barra de progresso com alertas de cor (verde → amarelo → vermelho)
- Mensagens motivacionais de acordo com seu desempenho

### 📈 Investimento
- Defina sua **meta mensal de investimento**
- Acompanhe % da meta, total investido e número de operações
- Confetti 🎉 ao atingir a meta!

### 📊 Gráficos
- **Gráfico de barras** — gastos por categoria
- **Gráfico de rosca (donut)** — distribuição percentual dos gastos com legenda

### 🔍 Transações
- Busca por texto
- Filtro por tipo (entrada/saída) e categoria
- Ordenação por data ou valor

### 🎨 Personalização
- **5 paletas de cores** (tons quentes e frios) — escolha a que mais te agrada
- **Tema claro e escuro**
- Tudo fica salvo no seu navegador

### 📤 Exportação
- Exporte suas transações para **CSV** (compatível com Excel)

---

## 🎨 Paletas de cores

| Categoria | Paleta | Tema |
|-----------|--------|------|
| 🌅 Quente | Sol & Pôr do Sol | Laranja, rosa, roxo |
| 🧡 Quente | Âmbar & Cobre | Dourado, âmbar |
| 🌊 Frio | Azul Oceano | Azul royal, ciano |
| 💎 Frio | Esmeralda | Verde + azul |
| 🌀 Frio | Pacífico | Ciano, índigo, teal |

---

## 🗂️ Estrutura do projeto

```
ICS-Finance/
├── index.html   → Estrutura da página
├── style.css    → Estilos e tema (glassmorphism)
└── script.js    → Lógica e funcionalidades
```

---

## 🧠 Como o JavaScript funciona

A lógica do `script.js` foi organizada em **funções com responsabilidades bem definidas**, seguindo o padrão da To-Do List. Os dados ficam em um único **array de objetos** (`transactions`) e toda a interface é **atualizada dinamicamente** a partir dele.

```js
let transactions = [];   // array que guarda todas as movimentações

// cada movimentação é um OBJETO
{
  id: "abc123",
  description: "Almoço",
  amount: 25.00,
  type: "expense",       // "income" (entrada) ou "expense" (saída)
  category: "food",
  date: "2026-08-31T14:30:00.000Z"
}
```

### 🔁 spread operator (`...`)
Usado para **adicionar** uma transação sem mutar o array original (imutabilidade):

```js
transactions = [...transactions, newTransaction];
```

### 🗺️ `map()` 
Usado para **editar** uma transação, percorrendo o array e retornando um novo com o item atualizado:

```js
transactions = transactions.map(t =>
    t.id === id ? { ...t, description, amount, type, category } : t
);
```

### 🚫 `filter()`
Usado para **excluir** uma transação e para **filtrar** a lista por tipo/categoria/busca:

```js
// excluir
transactions = transactions.filter(t => t.id !== id);

// filtrar
const expenses = transactions.filter(t => t.type === 'expense');
```

### 📊 `reduce()`
Usado para **calcular totais** (entradas, saídas, saldo e gastos por categoria) somando os valores:

```js
const totals = transactions.reduce((acc, t) => {
    if (t.type === 'income') {
        return { ...acc, income: acc.income + t.amount };
    }
    return { ...acc, expense: acc.expense + t.amount };
}, { income: 0, expense: 0 });
```

### ➡️ Arrow Functions (`=>`)
Usadas em todos os callbacks, deixando o código conciso e legível — como nos exemplos acima.

### 🧭 Fluxo principal
1. **`addTransaction()`** → cria o objeto, adiciona ao array e salva no `localStorage`
2. **`render()`** → chama todas as funções de exibição (resumo, lista, gráficos...)
3. **`renderSummary()`** → usa `reduce()` + `animateValue()` para mostrar os totais
4. **`renderChart()` / `renderDonutChart()`** → desenham os gráficos no Canvas
5. **`getFilteredTransactions()`** → aplica busca, filtros e ordenação antes de renderizar

---

## 🎨 Protótipo (Figma)

Sempre que possível, a ideia e o fluxo da aplicação foram organizados em um protótipo no Figma antes da implementação, definindo as decisões de **UX/UI** (layout dos cards, posição dos gráficos, fluxo de cadastro).

---

## 🛠️ Tecnologias

- **HTML5** — estrutura semântica
- **CSS3** — estilos modernos, *glassmorphism*, animações e responsividade
- **JavaScript (vanilla)** — toda a lógica, sem dependências externas
- **Canvas API** — gráficos e efeito de confete

---

## 📱 Responsividade

O layout se adapta a qualquer tamanho de tela:
- **Desktop** — cards em linha, seções lado a lado
- **Tablet / Mobile** — tudo empilhado de forma organizada

---

## 👥 Autores

| Nome | Papel |
|------|-------|
| **Siqueira** | 💻 Desenvolvimento |
| **Caua** | 💻 Desenvolvimento |
| **Igor** | 💻 Desenvolvimento |

---

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos. Sinta-se à vontade para usar, estudar e modificar. 😊

---

<div align="center">
  Feito com 💜 por <b>Siqueira, Caua & Igor</b>
</div>
