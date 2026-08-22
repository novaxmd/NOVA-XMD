import { getGroupSettings, updateGroupSetting, getWarnLimit } from '../../database/config.js';

export default async (context) => {
    const { client, m, args, isAdmin, isBotAdmin, prefix } = context;
    await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

    if (!m.isGroup) {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
        return await client.sendMessage(m.chat, { text: 'Groups only, genius.' });
    }

    if (!isAdmin) {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
        return await client.sendMessage(m.chat, { text: "Admins only. You're not special enough." });
    }

    if (!isBotAdmin) {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
        return await client.sendMessage(m.chat, { text: "Make me admin first. I can't enforce rules without power." });
    }

    try {
        const groupSettings = await getGroupSettings(m.chat);
        const value = args.join(" ").toLowerCase();
        const validModes = ["off", "delete", "warn", "kick"];

        if (validModes.includes(value)) {
            const currentMode = String(groupSettings.antilink || "off").toLowerCase();
            if (currentMode === value) {
                await client.sendMessage(m.chat, { react: { text: '⚠️', key: m.reactKey } }).catch(() => {});
                return await client.sendMessage(m.chat, { text: `Antilink is already set to *${value.toUpperCase()}*. Pay attention.` });
            }
            await updateGroupSetting(m.chat, 'antilink', value);
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
            const desc =
                value === 'off' ? "Links are now allowed. Hope you know what you're doing." :
                value === 'delete' ? "Links get deleted, no warn, no kick. Just gone." :
                value === 'warn' ? `Links will be deleted and sender warned.\nAt the warn limit they're KICKED.` :
                'Links = Instant kick. No second chances.';
            return await client.sendMessage(m.chat, { text: `Antilink set to *${value.toUpperCase()}*.\n${desc}` });
        }

        const currentMode = String(groupSettings.antilink || "off").toUpperCase();
        const warnLimit = await getWarnLimit(m.chat);
        const bodyText = `Current mode: *${currentMode}*\nWarn limit: *${warnLimit}* warns before kick\n\nUsage: ${prefix}antilink off | delete | warn | kick\n\noff — Allow links\ndelete — Delete link only, no warn/kick\nwarn — Delete link + warn the sender. After *${warnLimit}* warns they're auto-kicked.\nkick — Delete link + instant kick\n\nTo allow a specific link use: ${prefix}trustlink <link>\nThis group's own invite link is always excluded.\n\nChange warn limit: ${prefix}setwarncount <number>\nExample: ${prefix}setwarncount 5`;

        await client.sendMessage(m.chat, { react: { text: '📋', key: m.reactKey } });
        return await client.sendMessage(m.chat, { text: bodyText });
    } catch (error) {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
        console.error("Antilink command error:", error);
        await client.sendMessage(m.chat, { text: 'Something broke. Try again.' });
    }
};
