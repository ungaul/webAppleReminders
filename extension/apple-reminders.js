console.log('[EXT] Script injected into iCloud iframe');

function parseDueDate(item) {
    const span = item.querySelector('span.due-date span');
    const txt = span?.textContent.trim() || '';
    const parts = txt.split(/[、,]/).map(s => s.trim());
    let dm = parts[0].match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})$/);
    let tm = parts[1]?.match(/^(\d{1,2}):(\d{2})$/);
    if (dm && tm) {
        const [ , Y, M, D ] = dm;
        const [ h, m ] = parts[1].split(':').map(Number);
        return new Date(+Y, +M - 1, +D, h, m);
    }
    if (dm) {
        const [ , Y, M, D ] = dm;
        return new Date(+Y, +M - 1, +D, 0, 0);
    }
    let rtm = parts[0].match(/^(今日|明日|昨日)(\d{1,2}):(\d{2})$/);
    if (rtm) {
        const [ , label, h, m ] = rtm;
        const now = new Date();
        const base = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        if (label === '明日') base.setDate(base.getDate() + 1);
        else if (label === '昨日') base.setDate(base.getDate() - 1);
        return new Date(base.getFullYear(), base.getMonth(), base.getDate(), +h, +m);
    }
    let r = parts[0].match(/^(今日|明日|昨日)$/);
    if (r) {
        const [ , label ] = r;
        const now = new Date();
        const base = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        if (label === '明日') base.setDate(base.getDate() + 1);
        else if (label === '昨日') base.setDate(base.getDate() - 1);
        return new Date(base.getFullYear(), base.getMonth(), base.getDate(), 0, 0);
    }
    return new Date(9999, 0, 1);
}

function sortRowgroup(rowgroup) {
    const items = Array.from(rowgroup.querySelectorAll('div[id^="reminder-item-"]'));
    console.log(`[EXT] ${items.length} items found in rowgroup`);
    const withDate = items.map(item => ({
        item,
        date: parseDueDate(item)
    }));
    withDate.sort((a, b) => a.date - b.date);
    withDate.forEach(({ item }) => rowgroup.appendChild(item));
    console.log('[EXT] Rowgroup sorted');
}

function sortAllLists() {
    const lists = document.querySelectorAll('.reminder-list-items');
    console.log(`[EXT] ${lists.length} lists detected`);
    lists.forEach(list => {
        list.querySelectorAll('[role="rowgroup"]').forEach(rg => sortRowgroup(rg));
    });
    console.log('[EXT] All lists sorted');
}

function autoScrollAndSort(callback) {
    const container = document.querySelector('.reminder-list-items');
    if (!container) {
        console.warn('[EXT] Container not found');
        return;
    }
    let last = 0, stable = 0, maxStable = 5;
    console.log('[EXT] Starting auto-scroll');
    (function step() {
        container.scrollTop = container.scrollHeight;
        setTimeout(() => {
            const count = container.querySelectorAll('div[role="rowgroup"] div[id^="reminder-item-"]').length;
            console.log(`[EXT] Loaded items: ${count} (stable: ${stable}/${maxStable})`);
            if (count === last) stable++;
            else { last = count; stable = 0; }
            if (stable >= maxStable) {
                console.log('[EXT] Scrolling complete, sorting now');
                callback();
            } else {
                step();
            }
        }, 1500);
    })();
}

const waitUntilReady = setInterval(() => {
    const any = document.querySelector('.reminder-list-items div[role="rowgroup"] div[id^="reminder-item-"]');
    if (any) {
        clearInterval(waitUntilReady);
        console.log('[EXT] First reminder detected, starting auto-scroll...');
        autoScrollAndSort(sortAllLists);
    } else {
        console.log('[EXT] Waiting for first reminder...');
    }
}, 1000);
