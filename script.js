document.addEventListener('DOMContentLoaded', () => {
    // Register Service Worker for PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('Service Worker terdaftar!', reg))
            .catch(err => console.error('Service Worker gagal terdaftar', err));
    }

    const dateInput = document.getElementById('report-date');
    const salesList = document.getElementById('sales-list');
    const expensesList = document.getElementById('expenses-list');
    const addSaleBtn = document.getElementById('add-sale');
    const addExpenseBtn = document.getElementById('add-expense');
    
    const generateBtn = document.getElementById('generate-btn');
    const resultContainer = document.getElementById('result-container');
    const reportOutput = document.getElementById('report-output');
    const copyBtn = document.getElementById('copy-btn');
    const waBtn = document.getElementById('wa-btn');

    const btnReset = document.getElementById('btn-reset');
    const btnHistory = document.getElementById('btn-history');
    const historyModal = document.getElementById('history-modal');
    const closeHistory = document.getElementById('close-history');
    const historyList = document.getElementById('history-list');

    // Load saved data or initialize defaults
    loadData();

    addSaleBtn.addEventListener('click', () => {
        addSaleItem();
        saveData();
    });
    
    addExpenseBtn.addEventListener('click', () => {
        addExpenseItem();
        saveData();
    });

    dateInput.addEventListener('change', saveData);

    // Reset Button
    btnReset.addEventListener('click', () => {
        if (confirm('Yakin ingin mengosongkan semua angka ke 0? (Nama menu akan dipertahankan)')) {
            document.querySelectorAll('.item-qty').forEach(input => {
                if (input.type === 'number') input.value = '0';
                else input.value = '';
            });
            saveData();
        }
    });

    // History Modal
    btnHistory.addEventListener('click', () => {
        renderHistory();
        historyModal.classList.remove('hidden');
    });

    closeHistory.addEventListener('click', () => {
        historyModal.classList.add('hidden');
    });

    generateBtn.addEventListener('click', () => {
        const report = generateReport();
        resultContainer.classList.remove('hidden');
        resultContainer.scrollIntoView({ behavior: 'smooth' });
        
        // Simpan ke riwayat saat dibuat
        saveToHistory(dateInput.value, report);
    });

    copyBtn.addEventListener('click', () => {
        reportOutput.select();
        document.execCommand('copy');
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Tersalin!';
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 2000);
    });

    waBtn.addEventListener('click', () => {
        const text = encodeURIComponent(reportOutput.value);
        window.open(`https://wa.me/?text=${text}`, '_blank');
    });

    function addSaleItem(name = '', qty = '0') {
        const item = document.createElement('div');
        item.className = 'list-item';
        item.innerHTML = `
            <input type="text" class="input-base item-name" placeholder="Item (mis: Es Teh)" value="${name}" aria-label="Nama Menu Penjualan">
            <div class="counter-group">
                <button type="button" class="btn-counter btn-minus" tabindex="-1" aria-label="Kurangi jumlah">-</button>
                <input type="number" class="input-base item-qty text-center" placeholder="0" value="${qty}" min="0" aria-label="Jumlah terjual">
                <button type="button" class="btn-counter btn-plus" tabindex="-1" aria-label="Tambah jumlah">+</button>
            </div>
            <button type="button" class="btn-delete" title="Hapus" tabindex="-1" aria-label="Hapus menu">✕</button>
        `;

        const nameInput = item.querySelector('.item-name');
        const qtyInput = item.querySelector('.item-qty');
        
        nameInput.addEventListener('input', saveData);
        qtyInput.addEventListener('input', saveData);

        item.querySelector('.btn-minus').addEventListener('click', () => {
            let current = parseInt(qtyInput.value) || 0;
            if (current > 0) {
                qtyInput.value = current - 1;
                saveData();
            }
        });
        
        item.querySelector('.btn-plus').addEventListener('click', () => {
            let current = parseInt(qtyInput.value) || 0;
            qtyInput.value = current + 1;
            saveData();
        });

        item.querySelector('.btn-delete').addEventListener('click', () => {
            item.remove();
            saveData();
        });
        
        salesList.appendChild(item);
    }

    function addExpenseItem(name = '', amount = '') {
        const item = document.createElement('div');
        item.className = 'list-item';
        item.innerHTML = `
            <input type="text" class="input-base item-name" placeholder="Item (mis: Cup)" value="${name}" aria-label="Nama item pengeluaran">
            <input type="text" class="input-base item-qty" placeholder="Nominal" value="${amount}" aria-label="Nominal pengeluaran">
            <button type="button" class="btn-delete" title="Hapus" tabindex="-1" aria-label="Hapus pengeluaran">✕</button>
        `;

        const nameInput = item.querySelector('.item-name');
        const amountInput = item.querySelector('.item-qty');
        
        nameInput.addEventListener('input', saveData);
        amountInput.addEventListener('input', saveData);

        item.querySelector('.btn-delete').addEventListener('click', () => {
            item.remove();
            saveData();
        });
        
        expensesList.appendChild(item);
    }

    function saveData() {
        const data = {
            date: dateInput.value,
            sales: [],
            expenses: []
        };

        salesList.querySelectorAll('.list-item').forEach(item => {
            data.sales.push({
                name: item.querySelector('.item-name').value,
                qty: item.querySelector('.item-qty').value
            });
        });

        expensesList.querySelectorAll('.list-item').forEach(item => {
            data.expenses.push({
                name: item.querySelector('.item-name').value,
                amount: item.querySelector('.item-qty').value
            });
        });

        localStorage.setItem('laporan_kedai_data', JSON.stringify(data));
    }

    function loadData() {
        const savedData = localStorage.getItem('laporan_kedai_data');
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                const todayStr = new Date().toISOString().split('T')[0];
                
                const isNewDay = data.date !== todayStr;
                
                dateInput.value = isNewDay ? todayStr : (data.date || todayStr);

                data.sales.forEach(sale => {
                    addSaleItem(sale.name, isNewDay ? '0' : sale.qty);
                });

                data.expenses.forEach(exp => {
                    addExpenseItem(exp.name, isNewDay ? '' : exp.amount);
                });
                
                if (isNewDay) {
                    saveData();
                }
                return;
            } catch (e) {
                console.error("Failed to parse local data", e);
            }
        }

        dateInput.value = new Date().toISOString().split('T')[0];
        addSaleItem('Es Teh', '0');
        addSaleItem('Es Jeruk', '0');
        addExpenseItem('Es Batu', '');
        addExpenseItem('Cup', '');
        saveData();
    }

    function generateReport() {
        const dateStr = formatDate(dateInput.value);
        let report = `Laporan Penjualan\nTanggal: ${dateStr}\n\n`;

        const salesItems = salesList.querySelectorAll('.list-item');
        let hasSales = false;
        let salesText = `Penjualan:\n`;
        
        const salesMap = {};
        salesItems.forEach(item => {
            const name = item.querySelector('.item-name').value.trim();
            const qty = parseInt(item.querySelector('.item-qty').value.trim()) || 0;
            
            if (name && qty > 0) {
                const standardName = name.charAt(0).toUpperCase() + name.slice(1);
                salesMap[standardName] = (salesMap[standardName] || 0) + qty;
            }
        });

        for (const [name, qty] of Object.entries(salesMap)) {
            salesText += `- ${name} = ${qty}\n`;
            hasSales = true;
        }

        report += hasSales ? salesText + '\n' : `Penjualan:\n- Belum ada data\n\n`;

        const expenseItems = expensesList.querySelectorAll('.list-item');
        let hasExpenses = false;
        let expensesText = `Pengeluaran:\n`;
        
        const expenseMap = {};
        expenseItems.forEach(item => {
            const name = item.querySelector('.item-name').value.trim();
            const amountStr = item.querySelector('.item-qty').value.trim();
            if (name && amountStr) {
                const standardName = name.charAt(0).toUpperCase() + name.slice(1);
                
                const cleanAmount = amountStr.replace(/\s/g, '');
                const match = cleanAmount.match(/^([0-9.,]+)(.*)$/);
                
                if (!expenseMap[standardName]) {
                    expenseMap[standardName] = { total: 0, usesK: false, raw: [], isNumeric: true };
                }
                
                if (match) {
                    let numStr = match[1].replace(/\./g, '').replace(/,/g, '.');
                    let num = parseFloat(numStr) || 0;
                    let suffix = match[2].toLowerCase();
                    
                    if (suffix === 'k') {
                        num *= 1000;
                        expenseMap[standardName].usesK = true;
                    }
                    expenseMap[standardName].total += num;
                } else {
                    expenseMap[standardName].isNumeric = false;
                    expenseMap[standardName].raw.push(amountStr);
                }
            }
        });

        for (const [name, data] of Object.entries(expenseMap)) {
            if (!data.isNumeric) {
                expensesText += `- ${name} = ${data.raw.join(' + ')}\n`;
            } else {
                if (data.usesK && data.total % 1000 === 0) {
                    expensesText += `- ${name} = ${data.total / 1000}k\n`;
                } else {
                    expensesText += `- ${name} = ${data.total.toLocaleString('id-ID')}\n`;
                }
            }
            hasExpenses = true;
        }

        report += hasExpenses ? expensesText : `Pengeluaran:\n- Belum ada data\n`;
        
        reportOutput.value = report;
        return report;
    }

    function saveToHistory(date, text) {
        let history = JSON.parse(localStorage.getItem('laporan_kedai_history') || '[]');
        const existingIndex = history.findIndex(h => h.date === date);
        if (existingIndex >= 0) {
            history[existingIndex].text = text;
        } else {
            history.unshift({ date, text });
        }
        // Simpan hanya 30 hari terakhir
        if (history.length > 30) history = history.slice(0, 30);
        localStorage.setItem('laporan_kedai_history', JSON.stringify(history));
    }

    function renderHistory() {
        let history = JSON.parse(localStorage.getItem('laporan_kedai_history') || '[]');
        historyList.innerHTML = '';
        
        if (history.length === 0) {
            historyList.innerHTML = '<p style="text-align:center; color:var(--text-muted);">Belum ada riwayat laporan tersimpan.</p>';
            return;
        }
        
        history.forEach((h, index) => {
            const div = document.createElement('div');
            div.className = 'history-item';
            div.innerHTML = `
                <div class="history-date">${formatDate(h.date)}</div>
                <div class="history-text">${h.text}</div>
                <div class="history-actions">
                    <button class="btn-secondary btn-sm copy-hist">Salin</button>
                    <button class="btn-success btn-sm wa-hist">Kirim WA</button>
                    <button class="btn-secondary btn-sm del-hist" style="color:var(--danger); border-color:var(--danger);">Hapus</button>
                </div>
            `;
            
            div.querySelector('.copy-hist').addEventListener('click', (e) => {
                navigator.clipboard.writeText(h.text);
                e.target.textContent = 'Tersalin!';
                setTimeout(() => e.target.textContent = 'Salin', 2000);
            });
            
            div.querySelector('.wa-hist').addEventListener('click', () => {
                window.open(`https://wa.me/?text=${encodeURIComponent(h.text)}`, '_blank');
            });
            
            div.querySelector('.del-hist').addEventListener('click', () => {
                if(confirm('Yakin ingin menghapus riwayat ini?')) {
                    history.splice(index, 1);
                    localStorage.setItem('laporan_kedai_history', JSON.stringify(history));
                    renderHistory(); // Re-render
                }
            });
            
            historyList.appendChild(div);
        });
    }

    function formatDate(dateString) {
        if (!dateString) return 'Tidak ada tanggal';
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', options);
    }
});
