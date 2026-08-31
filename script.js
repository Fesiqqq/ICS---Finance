const CATEGORIES = {
    salary: { emoji: '💰', label: 'Salário', color: '#00b894' },
    food: { emoji: '🍔', label: 'Alimentação', color: '#ff6b6b' },
    transport: { emoji: '🚗', label: 'Transporte', color: '#fdcb6e' },
    health: { emoji: '🏥', label: 'Saúde', color: '#00cec9' },
    leisure: { emoji: '🎮', label: 'Lazer', color: '#a29bfe' },
    education: { emoji: '📚', label: 'Educação', color: '#6c5ce7' },
    bills: { emoji: '📄', label: 'Contas', color: '#fab1a0' },
    shopping: { emoji: '🛍️', label: 'Compras', color: '#fd79a8' },
    investment: { emoji: '📈', label: 'Investimento', color: '#55efc4' },
    other: { emoji: '✨', label: 'Outro', color: '#dfe6e9' }
};

const MOTIVATIONAL = {
    start: [
        'Comece a registrar suas transações!',
        'Controle financeiro é liberdade!',
        'Cada registro é um passo para o futuro!'
    ],
    income: [
        'Ótima entrada! Continue assim! 🎉',
        'Rentabilidade crescendo! 📈',
        'Cada vez mais perto da sua meta!'
    ],
    expense: [
        'Avalie se é necessário. Você consegue! 💪',
        'Cuidado com os gastos, mas viva!',
        'Organização é a chave do sucesso!'
    ],
    saving: [
        'Parabéns, você está economizando! 🌟',
        'Mantenha o foco na meta!',
        'Seu futuro eu vai agradecer!'
    ],
    overBudget: [
        'Atenção: gastos acima da média! ⚠️',
        'Revise seus gastos com cuidado.',
        'Tente reduzir gastos desnecessários.'
    ],
    goalReached: [
        'META ATINGIDA! Você é incrível! 🏆',
        'Objetivo cumprido! Continue assim! 🎊',
        'Sucesso total! Parabéns! 🥳'
    ],
    investment: [
        'Investindo no futuro! 🚀',
        'Seu patrimônio está crescendo! 💎',
        'Juros compostos são seus amigos! 📊'
    ],
    investmentGoal: [
        'META DE INVESTIMENTO ATINGIDA! 🏆',
        'Você é um expert em investimentos! 🎯',
        'Continue assim, seu futuro brilha! ✨'
    ]
};

let transactions = [];
let monthlyGoal = 0;
let investmentGoal = 0;
let editingId = null;

const form = document.getElementById('transactionForm');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');
const categoryInput = document.getElementById('category');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const formTitle = document.getElementById('formTitle');
const transactionList = document.getElementById('transactionList');
const totalIncomeEl = document.getElementById('totalIncome');
const totalExpenseEl = document.getElementById('totalExpense');
const totalBalanceEl = document.getElementById('totalBalance');
const incomeCountEl = document.getElementById('incomeCount');
const expenseCountEl = document.getElementById('expenseCount');
const balancePercentEl = document.getElementById('balancePercent');
const emptyMessage = document.getElementById('emptyMessage');
const searchInput = document.getElementById('searchInput');
const filterType = document.getElementById('filterType');
const filterCategory = document.getElementById('filterCategory');
const sortBy = document.getElementById('sortBy');
const monthlyGoalInput = document.getElementById('monthlyGoal');
const setGoalBtn = document.getElementById('setGoalBtn');
const goalBar = document.getElementById('goalBar');
const goalSpent = document.getElementById('goalSpent');
const goalRemaining = document.getElementById('goalRemaining');
const goalMessage = document.getElementById('goalMessage');
const biggestExpenseEl = document.getElementById('biggestExpense');
const avgDailyEl = document.getElementById('avgDaily');
const totalTransactionsEl = document.getElementById('totalTransactions');
const daysTrackedEl = document.getElementById('daysTracked');
const motivationalText = document.getElementById('motivationalText');
const themeToggle = document.getElementById('themeToggle');
const exportBtn = document.getElementById('exportBtn');
const confettiCanvas = document.getElementById('confettiCanvas');
const ctx = confettiCanvas.getContext('2d');

const investmentGoalInput = document.getElementById('investmentGoal');
const setInvestmentBtn = document.getElementById('setInvestmentBtn');
const investmentBar = document.getElementById('investmentBar');
const investedAmountEl = document.getElementById('investedAmount');
const investmentRemainingEl = document.getElementById('investmentRemaining');
const investmentPercentEl = document.getElementById('investmentPercent');
const investmentTotalEl = document.getElementById('investmentTotal');
const investmentCountEl = document.getElementById('investmentCount');
const investmentMessage = document.getElementById('investmentMessage');

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function formatCurrency(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
    toast.innerHTML = `<span>${icons[type]}</span> ${message}`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function setMotivation(type) {
    motivationalText.textContent = randomItem(MOTIVATIONAL[type] || MOTIVATIONAL.start);
}

function addTransaction(description, amount, type, category) {
    const newTransaction = {
        id: generateId(),
        description,
        amount: parseFloat(amount),
        type,
        category,
        date: new Date().toISOString()
    };
    transactions = [...transactions, newTransaction];
    saveToLocalStorage();
    render();
    setMotivation(type === 'income' ? 'income' : 'expense');
    showToast(
        type === 'income' ? 'Entrada adicionada!' : 'Saída registrada.',
        type === 'income' ? 'success' : 'info'
    );
    checkGoal();
    checkInvestment();
}

function updateTransaction(id, description, amount, type, category) {
    transactions = transactions.map(t =>
        t.id === id ? { ...t, description, amount: parseFloat(amount), type, category } : t
    );
    saveToLocalStorage();
    render();
    showToast('Transação atualizada!', 'info');
}

function removeTransaction(id) {
    const li = document.querySelector(`[data-id="${id}"]`);
    if (li) {
        li.classList.add('removing');
        setTimeout(() => {
            transactions = transactions.filter(t => t.id !== id);
            saveToLocalStorage();
            render();
            showToast('Transação removida.', 'warning');
        }, 300);
    } else {
        transactions = transactions.filter(t => t.id !== id);
        saveToLocalStorage();
        render();
    }
}

function calculateTotals() {
    const totals = transactions.reduce((acc, t) => {
        if (t.type === 'income') {
            return { ...acc, income: acc.income + t.amount, incomeCount: acc.incomeCount + 1 };
        }
        return { ...acc, expense: acc.expense + t.amount, expenseCount: acc.expenseCount + 1 };
    }, { income: 0, expense: 0, incomeCount: 0, expenseCount: 0 });

    const balance = totals.income - totals.expense;
    const total = totals.income + totals.expense;
    const balancePercent = total > 0 ? ((totals.income / total) * 100).toFixed(1) : 0;

    return { ...totals, balance, balancePercent };
}

function calculateStats() {
    const expenses = transactions.filter(t => t.type === 'expense');
    const biggest = expenses.length > 0
        ? expenses.reduce((max, t) => t.amount > max.amount ? t : max)
        : null;

    const uniqueDays = [...new Set(transactions.map(t => t.date.split('T')[0]))];
    const expenseTotal = expenses.reduce((sum, t) => sum + t.amount, 0);
    const avgDaily = uniqueDays.length > 0 ? expenseTotal / uniqueDays.length : 0;

    return {
        biggestExpense: biggest ? formatCurrency(biggest.amount) : '-',
        biggestLabel: biggest ? biggest.description : '',
        avgDaily: formatCurrency(avgDaily),
        totalTransactions: transactions.length,
        daysTracked: uniqueDays.length
    };
}

function getFilteredTransactions() {
    let filtered = [...transactions];

    const searchTerm = searchInput.value.toLowerCase().trim();
    if (searchTerm) {
        filtered = filtered.filter(t =>
            t.description.toLowerCase().includes(searchTerm) ||
            CATEGORIES[t.category]?.label.toLowerCase().includes(searchTerm)
        );
    }

    const typeVal = filterType.value;
    if (typeVal !== 'all') {
        filtered = filtered.filter(t => t.type === typeVal);
    }

    const catVal = filterCategory.value;
    if (catVal !== 'all') {
        filtered = filtered.filter(t => t.category === catVal);
    }

    const sortVal = sortBy.value;
    filtered.sort((a, b) => {
        switch (sortVal) {
            case 'date-desc': return new Date(b.date) - new Date(a.date);
            case 'date-asc': return new Date(a.date) - new Date(b.date);
            case 'amount-desc': return b.amount - a.amount;
            case 'amount-asc': return a.amount - b.amount;
            default: return 0;
        }
    });

    return filtered;
}

function renderTransactions() {
    const filtered = getFilteredTransactions();

    if (filtered.length === 0) {
        transactionList.innerHTML = '';
        emptyMessage.classList.remove('hidden');
        return;
    }

    emptyMessage.classList.add('hidden');

    const items = filtered.map(t => {
        const cat = CATEGORIES[t.category] || CATEGORIES.other;
        return `
            <li data-id="${t.id}">
                <div class="transaction-category">${cat.emoji}</div>
                <div class="transaction-info">
                    <span class="description">${t.description}</span>
                    <div class="meta">
                        <span class="type-badge ${t.type}">${t.type === 'income' ? 'Entrada' : 'Saída'}</span>
                        <span>${cat.label}</span>
                        <span>${formatDate(t.date)}</span>
                    </div>
                </div>
                <span class="transaction-amount ${t.type}">
                    ${t.type === 'income' ? '+' : '-'} ${formatCurrency(t.amount)}
                </span>
                <div class="transaction-actions">
                    <button class="edit-btn" onclick="startEdit('${t.id}')" title="Editar">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                    </button>
                    <button class="delete-btn" onclick="removeTransaction('${t.id}')" title="Remover">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                    </button>
                </div>
            </li>
        `;
    }).join('');

    transactionList.innerHTML = items;
}

function renderSummary() {
    const { income, expense, balance, incomeCount, expenseCount, balancePercent } = calculateTotals();

    animateValue(totalIncomeEl, income);
    animateValue(totalExpenseEl, expense);
    animateValue(totalBalanceEl, balance);

    incomeCountEl.textContent = `${incomeCount} transação${incomeCount !== 1 ? 'ões' : ''}`;
    expenseCountEl.textContent = `${expenseCount} transação${expenseCount !== 1 ? 'ões' : ''}`;
    balancePercentEl.textContent = `${balancePercent}% do total`;
}

function animateValue(el, target) {
    const current = parseFloat(el.dataset.value || 0);
    const diff = target - current;
    const steps = 30;
    const stepValue = diff / steps;
    let step = 0;

    el.dataset.value = target;

    function update() {
        step++;
        const value = current + stepValue * step;
        el.textContent = formatCurrency(step >= steps ? target : value);
        if (step < steps) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}

function renderGoal() {
    if (monthlyGoal <= 0) {
        goalBar.style.width = '0%';
        goalSpent.textContent = 'R$ 0,00 gasto';
        goalRemaining.textContent = 'R$ 0,00 restante';
        goalMessage.textContent = '';
        goalMessage.style.background = 'transparent';
        return;
    }

    const expenses = transactions.filter(t => t.type === 'expense');
    const totalSpent = expenses.reduce((sum, t) => sum + t.amount, 0);
    const percent = Math.min((totalSpent / monthlyGoal) * 100, 100);
    const remaining = Math.max(monthlyGoal - totalSpent, 0);

    goalBar.style.width = `${percent}%`;
    goalSpent.textContent = `${formatCurrency(totalSpent)} gasto`;
    goalRemaining.textContent = `${formatCurrency(remaining)} restante`;

    if (percent >= 100) {
        goalBar.style.background = 'linear-gradient(90deg, #ff6b6b, #fd79a8)';
        goalMessage.textContent = randomItem(MOTIVATIONAL.overBudget);
        goalMessage.style.background = 'rgba(255, 107, 107, 0.1)';
        goalMessage.style.color = '#ff6b6b';
    } else if (percent >= 80) {
        goalBar.style.background = 'linear-gradient(90deg, #fdcb6e, #e17055)';
        goalMessage.textContent = '⚠️ Quase no limite! Cuidado.';
        goalMessage.style.background = 'rgba(253, 203, 110, 0.1)';
        goalMessage.style.color = '#fdcb6e';
    } else {
        goalBar.style.background = 'linear-gradient(90deg, #00cec9, #6c5ce7)';
        goalMessage.textContent = randomItem(MOTIVATIONAL.saving);
        goalMessage.style.background = 'rgba(0, 206, 201, 0.1)';
        goalMessage.style.color = '#00cec9';
    }
}

function checkGoal() {
    if (monthlyGoal <= 0) return;
    const expenses = transactions.filter(t => t.type === 'expense');
    const totalSpent = expenses.reduce((sum, t) => sum + t.amount, 0);

    if (totalSpent >= monthlyGoal) {
        showToast('Média de gastos estourada! Revise seus gastos.', 'error');
    }
}

function renderInvestment() {
    const investmentTransactions = transactions.filter(t => t.type === 'expense' && t.category === 'investment');
    const totalInvested = investmentTransactions.reduce((sum, t) => sum + t.amount, 0);
    const count = investmentTransactions.length;

    if (investmentGoal <= 0) {
        investmentBar.style.width = '0%';
        investedAmountEl.textContent = 'R$ 0,00 investido';
        investmentRemainingEl.textContent = 'Defina sua meta de investimento';
        investmentPercentEl.textContent = '0%';
        investmentTotalEl.textContent = formatCurrency(totalInvested);
        investmentCountEl.textContent = count;
        investmentMessage.textContent = '';
        investmentMessage.style.background = 'transparent';
        return;
    }

    const percent = Math.min((totalInvested / investmentGoal) * 100, 100);
    const remaining = Math.max(investmentGoal - totalInvested, 0);

    investmentBar.style.width = `${percent}%`;
    investedAmountEl.textContent = `${formatCurrency(totalInvested)} investido`;
    investmentRemainingEl.textContent = `${formatCurrency(remaining)} restante`;
    investmentPercentEl.textContent = `${percent.toFixed(1)}%`;
    investmentTotalEl.textContent = formatCurrency(totalInvested);
    investmentCountEl.textContent = count;

    if (percent >= 100) {
        investmentBar.style.background = 'linear-gradient(90deg, #55efc4, #00b894)';
        investmentMessage.textContent = randomItem(MOTIVATIONAL.investmentGoal);
        investmentMessage.style.background = 'rgba(85, 239, 196, 0.1)';
        investmentMessage.style.color = '#55efc4';
    } else if (percent >= 50) {
        investmentBar.style.background = 'linear-gradient(90deg, #55efc4, #00cec9)';
        investmentMessage.textContent = '🚀 Mais da metade! Continue assim!';
        investmentMessage.style.background = 'rgba(85, 239, 196, 0.05)';
        investmentMessage.style.color = '#00cec9';
    } else {
        investmentBar.style.background = 'linear-gradient(90deg, #00b894, #55efc4)';
        investmentMessage.textContent = randomItem(MOTIVATIONAL.investment);
        investmentMessage.style.background = 'rgba(0, 184, 148, 0.1)';
        investmentMessage.style.color = '#00b894';
    }
}

function checkInvestment() {
    if (investmentGoal <= 0) return;
    const investmentTransactions = transactions.filter(t => t.type === 'expense' && t.category === 'investment');
    const totalInvested = investmentTransactions.reduce((sum, t) => sum + t.amount, 0);

    if (totalInvested >= investmentGoal) {
        showToast('Meta de investimento atingida! 🎉', 'success');
        launchConfetti();
    }
}

function renderStats() {
    const stats = calculateStats();
    biggestExpenseEl.textContent = stats.biggestLabel
        ? `${stats.biggestLabel} (${stats.biggestExpense})`
        : stats.biggestExpense;
    avgDailyEl.textContent = stats.avgDaily;
    totalTransactionsEl.textContent = stats.totalTransactions;
    daysTrackedEl.textContent = stats.daysTracked;
}

function renderChart() {
    const canvas = document.getElementById('categoryChart');
    const context = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    context.scale(dpr, dpr);

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    context.clearRect(0, 0, width, height);

    const expenses = transactions.filter(t => t.type === 'expense');
    if (expenses.length === 0) {
        context.fillStyle = '#8888aa';
        context.font = '14px Inter';
        context.textAlign = 'center';
        context.fillText('Adicione gastos para ver o gráfico', width / 2, height / 2);
        return;
    }

    const categoryTotals = expenses.reduce((acc, t) => {
        return { ...acc, [t.category]: (acc[t.category] || 0) + t.amount };
    }, {});

    const sorted = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
    const maxVal = sorted[0][1];

    const barHeight = 32;
    const gap = 14;
    const leftPad = 130;
    const rightPad = 80;
    const topPad = 20;
    const barWidth = width - leftPad - rightPad;
    const chartStyles = getComputedStyle(document.documentElement);
    const chartTextSecondary = chartStyles.getPropertyValue('--text-secondary').trim() || '#8888aa';
    const chartTextPrimary = chartStyles.getPropertyValue('--text-primary').trim() || '#f0f0ff';

    sorted.forEach(([cat, val], i) => {
        const y = topPad + i * (barHeight + gap);
        const catInfo = CATEGORIES[cat] || CATEGORIES.other;
        const w = (val / maxVal) * barWidth;

        context.fillStyle = chartTextSecondary;
        context.font = '13px Inter';
        context.textAlign = 'right';
        context.fillText(`${catInfo.emoji} ${catInfo.label}`, leftPad - 12, y + barHeight / 2 + 5);

        const grad = context.createLinearGradient(leftPad, 0, leftPad + w, 0);
        grad.addColorStop(0, catInfo.color);
        grad.addColorStop(1, catInfo.color + '88');
        context.fillStyle = grad;
        roundRect(context, leftPad, y, w, barHeight, 8);
        context.fill();

        context.fillStyle = chartTextPrimary;
        context.font = 'bold 12px Inter';
        context.textAlign = 'left';
        context.fillText(formatCurrency(val), leftPad + w + 10, y + barHeight / 2 + 5);
    });
}

function renderDonutChart() {
    const canvas = document.getElementById('donutChart');
    const context = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    const displaySize = 220;
    canvas.width = displaySize * dpr;
    canvas.height = displaySize * dpr;
    canvas.style.width = displaySize + 'px';
    canvas.style.height = displaySize + 'px';
    context.scale(dpr, dpr);

    const centerX = displaySize / 2;
    const centerY = displaySize / 2;
    const radius = 80;
    const lineWidth = 28;

    context.clearRect(0, 0, displaySize, displaySize);

    const expenses = transactions.filter(t => t.type === 'expense');
    const legendEl = document.getElementById('donutLegend');

    if (expenses.length === 0) {
        context.beginPath();
        context.arc(centerX, centerY, radius, 0, Math.PI * 2);
        context.strokeStyle = 'rgba(136, 136, 170, 0.15)';
        context.lineWidth = lineWidth;
        context.stroke();

        context.fillStyle = '#8888aa';
        context.font = '12px Inter';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText('Sem dados', centerX, centerY - 8);
        context.font = '10px Inter';
        context.fillText('para exibir', centerX, centerY + 8);

        legendEl.innerHTML = '';
        return;
    }

    const categoryTotals = expenses.reduce((acc, t) => {
        return { ...acc, [t.category]: (acc[t.category] || 0) + t.amount };
    }, {});

    const totalExpenses = Object.values(categoryTotals).reduce((a, b) => a + b, 0);
    const sorted = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);

    let currentAngle = -Math.PI / 2;

    sorted.forEach(([cat, val]) => {
        const catInfo = CATEGORIES[cat] || CATEGORIES.other;
        const sliceAngle = (val / totalExpenses) * Math.PI * 2;

        context.beginPath();
        context.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        context.strokeStyle = catInfo.color;
        context.lineWidth = lineWidth;
        context.lineCap = 'butt';
        context.stroke();

        currentAngle += sliceAngle;
    });

    const innerRadius = radius - lineWidth / 2 - 2;
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const styles = getComputedStyle(document.documentElement);

    context.beginPath();
    context.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
    context.fillStyle = styles.getPropertyValue('--bg-secondary').trim() || (isLight ? '#f0f2ff' : '#12122a');
    context.fill();

    context.fillStyle = styles.getPropertyValue('--text-primary').trim() || (isLight ? '#1a1a3e' : '#f0f0ff');
    context.font = 'bold 18px Inter';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(formatCurrency(totalExpenses), centerX, centerY - 8);

    context.fillStyle = styles.getPropertyValue('--text-secondary').trim() || (isLight ? '#6b6b8d' : '#8888aa');
    context.font = '11px Inter';
    context.fillText('total gasto', centerX, centerY + 12);

    let legendHTML = '';
    sorted.forEach(([cat, val]) => {
        const catInfo = CATEGORIES[cat] || CATEGORIES.other;
        const pct = ((val / totalExpenses) * 100).toFixed(1);
        legendHTML += `
            <div class="legend-item">
                <span class="legend-dot" style="background:${catInfo.color}"></span>
                <span class="legend-label">${catInfo.emoji} ${catInfo.label}</span>
                <span class="legend-value">${formatCurrency(val)}</span>
                <span class="legend-percent">${pct}%</span>
            </div>
        `;
    });
    legendEl.innerHTML = legendHTML;
}

function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}

function render() {
    renderSummary();
    renderTransactions();
    renderGoal();
    renderInvestment();
    renderStats();
    renderChart();
    renderDonutChart();
}

function startEdit(id) {
    const transaction = transactions.find(t => t.id === id);
    if (!transaction) return;

    editingId = id;
    descriptionInput.value = transaction.description;
    amountInput.value = transaction.amount;
    typeInput.value = transaction.type;
    categoryInput.value = transaction.category;

    formTitle.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
        Editar Transação
    `;
    submitBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"/>
        </svg>
        Salvar
    `;
    cancelBtn.classList.remove('hidden');
    form.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function cancelEdit() {
    editingId = null;
    form.reset();
    formTitle.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Nova Transação
    `;
    submitBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Adicionar
    `;
    cancelBtn.classList.add('hidden');
}

function exportCSV() {
    if (transactions.length === 0) {
        showToast('Nenhuma transação para exportar.', 'warning');
        return;
    }

    const header = 'Data,Descrição,Tipo,Categoria,Valor\n';
    const rows = transactions.map(t => {
        const cat = CATEGORIES[t.category]?.label || t.category;
        const date = new Date(t.date).toLocaleDateString('pt-BR');
        return `${date},"${t.description}",${t.type === 'income' ? 'Entrada' : 'Saída'},${cat},${t.amount.toFixed(2)}`;
    }).join('\n');

    const blob = new Blob(['\ufeff' + header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ics_finance_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('CSV exportado com sucesso!', 'success');
}

function toggleTheme() {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    document.documentElement.setAttribute('data-theme', isLight ? '' : 'light');
    const sunIcon = themeToggle.querySelector('.sun-icon');
    const moonIcon = themeToggle.querySelector('.moon-icon');
    sunIcon.style.display = isLight ? 'block' : 'none';
    moonIcon.style.display = isLight ? 'none' : 'block';
    localStorage.setItem('theme', isLight ? 'dark' : 'light');
    setTimeout(() => {
        renderChart();
        renderDonutChart();
    }, 100);
}

function loadTheme() {
    const saved = localStorage.getItem('theme');
    if (saved === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        const sunIcon = themeToggle.querySelector('.sun-icon');
        const moonIcon = themeToggle.querySelector('.moon-icon');
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
    }
}

/* Palette selection */
const paletteToggle = document.getElementById('paletteToggle');
const palettePanel = document.getElementById('palettePanel');
const paletteOptions = document.querySelectorAll('.palette-option');

function setActivePaletteOption() {
    const current = document.documentElement.getAttribute('data-palette');
    paletteOptions.forEach(opt => {
        if (opt.dataset.palette === current) {
            opt.classList.add('active');
        } else {
            opt.classList.remove('active');
        }
    });
}

function applyPalette(palette) {
    const html = document.documentElement;
    if (palette) {
        html.setAttribute('data-palette', palette);
        localStorage.setItem('palette', palette);
    } else {
        html.removeAttribute('data-palette');
        localStorage.removeItem('palette');
    }
    setActivePaletteOption();
    setTimeout(() => {
        renderChart();
        renderDonutChart();
    }, 100);
}

function loadPalette() {
    const saved = localStorage.getItem('palette');
    if (saved) {
        document.documentElement.setAttribute('data-palette', saved);
    }
    setActivePaletteOption();
}

paletteToggle.addEventListener('click', () => {
    palettePanel.classList.toggle('hidden');
});

paletteOptions.forEach(opt => {
    opt.addEventListener('click', () => {
        applyPalette(opt.dataset.palette);
        const name = opt.querySelector('.palette-name').textContent;
        showToast(`Paleta "${name}" aplicada!`, 'success');
    });
});

/* Confetti */
let confettiParticles = [];
let confettiActive = false;

function launchConfetti() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
    confettiActive = true;
    confettiParticles = [];

    const colors = ['#6c5ce7', '#00cec9', '#fd79a8', '#fdcb6e', '#55efc4', '#ff6b6b', '#a29bfe'];

    for (let i = 0; i < 150; i++) {
        confettiParticles.push({
            x: Math.random() * confettiCanvas.width,
            y: Math.random() * confettiCanvas.height - confettiCanvas.height,
            w: Math.random() * 10 + 5,
            h: Math.random() * 6 + 3,
            color: colors[Math.floor(Math.random() * colors.length)],
            speed: Math.random() * 3 + 2,
            angle: Math.random() * Math.PI * 2,
            spin: (Math.random() - 0.5) * 0.2,
            drift: (Math.random() - 0.5) * 2
        });
    }

    animateConfetti();
}

function animateConfetti() {
    if (!confettiActive) return;

    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    let alive = 0;
    confettiParticles.forEach(p => {
        p.y += p.speed;
        p.x += p.drift;
        p.angle += p.spin;

        if (p.y < confettiCanvas.height + 20) {
            alive++;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.angle);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            ctx.restore();
        }
    });

    if (alive > 0) {
        requestAnimationFrame(animateConfetti);
    } else {
        confettiActive = false;
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
}

/* Event Listeners */
form.addEventListener('submit', function (e) {
    e.preventDefault();
    const description = descriptionInput.value.trim();
    const amount = amountInput.value;
    const type = typeInput.value;
    const category = categoryInput.value;

    if (!description) {
        showToast('Informe uma descrição válida.', 'error');
        descriptionInput.focus();
        return;
    }
    if (!amount || amount <= 0) {
        showToast('Informe um valor maior que zero.', 'error');
        amountInput.focus();
        return;
    }
    if (!CATEGORIES[category]) {
        showToast('Selecione uma categoria válida.', 'error');
        categoryInput.focus();
        return;
    }

    if (editingId) {
        updateTransaction(editingId, description, amount, type, category);
        cancelEdit();
    } else {
        addTransaction(description, amount, type, category);
    }

    form.reset();
});

cancelBtn.addEventListener('click', cancelEdit);
searchInput.addEventListener('input', renderTransactions);
filterType.addEventListener('change', renderTransactions);
filterCategory.addEventListener('change', renderTransactions);
sortBy.addEventListener('change', renderTransactions);
themeToggle.addEventListener('click', toggleTheme);
exportBtn.addEventListener('click', exportCSV);

setGoalBtn.addEventListener('click', () => {
    const val = parseFloat(monthlyGoalInput.value);
    if (!val || val <= 0) {
        showToast('Defina uma média válida.', 'warning');
        return;
    }
    monthlyGoal = val;
    localStorage.setItem('monthlyGoal', monthlyGoal);
    renderGoal();
    showToast(`Média de gastos de ${formatCurrency(monthlyGoal)} definida!`, 'success');
    launchConfetti();
});

setInvestmentBtn.addEventListener('click', () => {
    const val = parseFloat(investmentGoalInput.value);
    if (!val || val <= 0) {
        showToast('Defina uma meta de investimento válida.', 'warning');
        return;
    }
    investmentGoal = val;
    localStorage.setItem('investmentGoal', investmentGoal);
    renderInvestment();
    showToast(`Meta de investimento de ${formatCurrency(investmentGoal)} definida!`, 'success');
    launchConfetti();
});

function saveToLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function loadFromLocalStorage() {
    const data = localStorage.getItem('transactions');
    if (data) {
        transactions = JSON.parse(data);
    }
    const goal = localStorage.getItem('monthlyGoal');
    if (goal) {
        monthlyGoal = parseFloat(goal);
        monthlyGoalInput.value = monthlyGoal;
    }
    const invGoal = localStorage.getItem('investmentGoal');
    if (invGoal) {
        investmentGoal = parseFloat(invGoal);
        investmentGoalInput.value = investmentGoal;
    }
}

window.addEventListener('resize', () => {
    if (transactions.some(t => t.type === 'expense')) {
        renderChart();
        renderDonutChart();
    }
});

loadTheme();
loadPalette();
loadFromLocalStorage();
render();
setMotivation('start');
