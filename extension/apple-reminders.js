console.log('[EXT] Script injected into iCloud iframe');

function parseJapaneseDate(str) {
    const standard = str.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})、(\d{1,2}):(\d{2})/);
    if (standard) {
        const [_, year, month, day, hour, minute] = standard;
        return new Date(year, month - 1, day, hour, minute);
    }

    const fallback = str.match(/^([^\d])(\d{1,2}):(\d{2})/);
    if (fallback) {
        const [_, _prefix, hour, minute] = fallback;
        const now = new Date();
        now.setHours(parseInt(hour, 10));
        now.setMinutes(parseInt(minute, 10));
        now.setSeconds(0);
        now.setMilliseconds(0);
        return now;
    }

    return new Date(9999, 0, 1);
}

function sortRowgroup(rowgroup) {
    const items = Array.from(rowgroup.querySelectorAll('div[id^="reminder-item-"]'));
    console.log(`[EXT] ${items.length} items found in rowgroup`);

    const itemsWithDate = items.map(item => {
        const dateSpan = item.querySelector('span.due-date span');
        const dateText = dateSpan?.textContent.trim() || '';
        const parsedDate = parseJapaneseDate(dateText);
        return { item, date: parsedDate };
    });

    itemsWithDate.sort((a, b) => a.date - b.date);

    for (const { item } of itemsWithDate) {
        rowgroup.appendChild(item);
    }

    console.log('[EXT] Rowgroup sorted');
}

function sortAllLists() {
    const lists = document.querySelectorAll('.reminder-list-items');
    console.log(`[EXT] ${lists.length} lists detected`);

    lists.forEach(list => {
        const rowgroup = Array.from(list.children).find(child =>
            child.getAttribute('role') === 'rowgroup'
        );
        if (rowgroup) {
            sortRowgroup(rowgroup);
        } else {
            console.warn('[EXT] No direct rowgroup found in list');
        }
    });

    console.log('[EXT] All lists sorted');
}

function aggressiveAutoScroll(callback) {
    const container = document.querySelector('.reminder-list-items');
    if (!container) {
        console.warn('[EXT] Container not found');
        return;
    }

    let lastCount = 0;
    let stableCycles = 0;
    const maxStable = 3;

    const scrollStep = () => {
        const currentCount = document.querySelectorAll('.reminder-list-items div[role="rowgroup"] div[id^="reminder-item-"]').length;
        console.log(`[EXT] Loaded: ${currentCount} (stable: ${stableCycles}/${maxStable})`);

        if (currentCount === lastCount) {
            stableCycles++;
        } else {
            stableCycles = 0;
            lastCount = currentCount;
        }

        if (stableCycles >= maxStable) {
            console.log('[EXT] Scrolling complete, sorting now');
            callback();
            return;
        }

        container.scrollBy(0, 5000);
        setTimeout(scrollStep, 500);
    };

    scrollStep();
}

const waitUntilReady = setInterval(() => {
    const test = document.querySelector('.reminder-list-items div[role="rowgroup"] div[id^="reminder-item-"]');
    if (test) {
        clearInterval(waitUntilReady);
        console.log('[EXT] First reminder detected, starting aggressive scroll...');
        aggressiveAutoScroll(sortAllLists);
    } else {
        console.log('[EXT] Waiting for first reminder...');
    }
}, 1000);
