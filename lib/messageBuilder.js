const LINE = '━━━━━━━━━━━━━━━━';

function pickEmoji(title) {
    const t = title.toLowerCase();
    if (t.includes('error')) return '❌';
    if (t.includes('denied')) return '🚫';
    if (t.includes('ai') || t.includes('gpt')) return '🤖';
    if (t.includes('song') || t.includes('music') || t.includes('audio')) return '🎵';
    if (t.includes('video')) return '🎬';
    if (t.includes('image') || t.includes('photo')) return '🖼️';
    if (t.includes('sticker')) return '🌟';
    if (t.includes('ban') || t.includes('block')) return '🚫';
    if (t.includes('menu')) return '📋';
    if (t.includes('setting')) return '⚙️';
    if (t.includes('download')) return '📥';
    if (t.includes('upload') || t.includes('url')) return '📤';
    if (t.includes('success') || t.includes('approved') || t.includes('added')) return '✅';
    if (t.includes('warn')) return '⚠️';
    if (t.includes('group')) return '👥';
    return '📌';
}

export function buildMsg(title, lines = [], footer = '© bmb tech') {
    const emoji = pickEmoji(title);
    const body = lines.filter(Boolean).join('\n');
    if (body) {
        return `${emoji} *${title.toUpperCase()}*\n${LINE}\n${body}\n${LINE}\n${footer}`;
    }
    return `${emoji} *${title.toUpperCase()}*\n${LINE}\n${footer}`;
}

export function buildLine(msg, footer = '© bmb tech') {
    return `${msg}\n${LINE}\n${footer}`;
}

export function buildError(title, err, footer = '© bmb tech') {
    const msg = err instanceof Error ? err.message : String(err);
    return `❌ *ERROR*\n${LINE}\n${msg}\n${LINE}\n${footer}`;
}

export function buildList(title, items = [], footer = '© bmb tech') {
    const emoji = pickEmoji(title);
    const body = items.map((item, i) => `${i + 1}. ${item}`).join('\n');
    if (body) {
        return `${emoji} *${title.toUpperCase()}*\n${LINE}\n${body}\n${LINE}\n${footer}`;
    }
    return `${emoji} *${title.toUpperCase()}*\n${LINE}\n${footer}`;
}

export function buildField(title, fields = {}, footer = '© bmb tech') {
    const emoji = pickEmoji(title);
    const body = Object.entries(fields).map(([k, v]) => `*${k}:* ${v}`).join('\n');
    if (body) {
        return `${emoji} *${title.toUpperCase()}*\n${LINE}\n${body}\n${LINE}\n${footer}`;
    }
    return `${emoji} *${title.toUpperCase()}*\n${LINE}\n${footer}`;
}

export function buildUsage(cmd, usage, example, footer = '© bmb tech') {
    return `📌 *${cmd.toUpperCase()}*\n${LINE}\nUsage: ${usage}\nExample: ${example}\n${LINE}\n${footer}`;
}
