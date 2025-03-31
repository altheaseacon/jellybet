let balance = 1000;
let inventory = [];
const actionLog = [];

const rarities = {
    common: { chance: 60, price: 50 },
    rare: { chance: 30, price: 150 },
    epic: { chance: 8, price: 500 },
    legendary: { chance: 2, price: 2000 }
};

const packs = {
    common: { price: 100, drops: [
        { rarity: 'common', chance: 80 },
        { rarity: 'rare', chance: 20 }
    ]},
    rare: { price: 300, drops: [
        { rarity: 'rare', chance: 70 },
        { rarity: 'epic', chance: 25 },
        { rarity: 'legendary', chance: 5 }
    ]}
};

function getRandomBear(packType) {
    const drops = packs[packType].drops;
    const total = drops.reduce((sum, item) => sum + item.chance, 0);
    let random = Math.random() * total;
    
    for(const item of drops) {
        if(random < item.chance) {
            return {
                rarity: item.rarity,
                price: rarities[item.rarity].price
            };
        }
        random -= item.chance;
    }
}

function buyPack(packType) {
    const pack = packs[packType];
    if(balance < pack.price) {
        alert('Недостаточно средств!');
        return;
    }
    
    balance -= pack.price;
    const bear = getRandomBear(packType);
    inventory.push(bear);
    
    // Логирование
    const logEntry = `Открыта ${packType} пачка: Получен ${bear.rarity} мишка!`;
    actionLog.unshift(logEntry);
    if(actionLog.length > 5) actionLog.pop();
    
    updateUI();
}

function sellBear(index) {
    const bear = inventory[index];
    balance += bear.price;
    inventory.splice(index, 1);
    updateUI();
}

function updateUI() {
    // Обновление баланса
    document.getElementById('money').textContent = balance;
    
    // Обновление инвентаря
    const inventoryDiv = document.getElementById('inventoryItems');
    inventoryDiv.innerHTML = inventory.map((bear, index) => `
        <div class="bear-item" onclick="sellBear(${index})">
            ${bear.rarity} мишка (${bear.price})
        </div>
    `).join('');
    
    // Обновление лога
    const logDiv = document.getElementById('actionLog');
    logDiv.innerHTML = actionLog.map(entry => `
        <div>${entry}</div>
    `).join('');
}

// Инициализация
updateUI();
