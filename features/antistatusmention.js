import { getGroupSettings, addWarn, resetWarn, getWarnLimit } from '../database/config.js';
import { resolveTargetJid } from '../lib/lidResolver.js';

const _num = (jid) => (jid || '').split('@')[0].split(':')[0].replace(/\D/g, '');

const _pNum = (p) => {
    const phone = p.phoneNumber || p.phone_number || '';
    if (phone) return _num(phone);
    const base = p.id || p.jid || '';
    if (base && !base.endsWith('@lid')) return _num(base);
    return _num(p.lid || base);
};

export default async (client, m) => {
    try {
        if (!m?.message) return;
        if (m.key.fromMe) return;
        if (!m.isGroup) return;
        if (m.mtype !== 'groupStatusMentionMessage') return;

        const groupSettings = await getGroupSettings(m.chat);
        const mode = (groupSettings.antistatusmention || 'off').toLowerCase();
        if (!mode || mode === 'off' || mode === 'false') return;

        const groupMetadata = await client.groupMetadata(m.chat);
        const sender = resolveTargetJid(m.sender, groupMetadata.participants);

        if (!sender) {
            return;
        }

        const senderNum = _num(sender);
        const botRaw = client.decodeJid ? client.decodeJid(client.user.id) : (client.user?.id || '');
        const botNum = _num(botRaw);

        const isAdmin = groupMetadata.participants.some(p => {
            return _pNum(p) === senderNum && (p.admin === 'admin' || p.admin === 'superadmin');
        });
        const isBotAdmin = groupMetadata.participants.some(p => {
            return _pNum(p) === botNum && (p.admin === 'admin' || p.admin === 'superadmin');
        });

        const username = senderNum || sender.split('@')[0];

        if (isAdmin) {
            await client.sendMessage(m.chat, {
                text: `status mention detected\n@${username} you're admin, this one stays.`,
                mentions: [sender] });
            return;
        }

        if (!isBotAdmin) {
            await client.sendMessage(m.chat, {
                text: `status mention detected\n@${username} make me admin to enforce this.`,
                mentions: [sender] });
            return;
        }

        try {
            await client.sendMessage(m.chat, {
                delete: {
                    remoteJid: m.chat,
                    fromMe: false,
                    id: m.key.id,
                    participant: m.key.participant || m.sender } });
        } catch (e) {
        }

        if (mode === 'delete') {
            await client.sendMessage(m.chat, {
                text: `status mention detected, message deleted\n@${username} avoid mentioning status.`,
                mentions: [sender] });
            return;
        }

        if (mode === 'kick') {
            try {
                await client.groupParticipantsUpdate(m.chat, [sender], 'remove');
                await client.sendMessage(m.chat, {
                    text: `status mention detected, message deleted\n@${username} kicked for status mention.`,
                    mentions: [sender] });
            } catch (e) {
                await client.sendMessage(m.chat, {
                    text: `status mention detected, message deleted\n@${username} tried to kick but failed, check my permissions.`,
                    mentions: [sender] });
            }
            return;
        }

        const MAX_WARNS = await getWarnLimit(m.chat);
        const newCount = await addWarn(m.chat, username);
        const remaining = MAX_WARNS - newCount;

        if (newCount >= MAX_WARNS) {
            await resetWarn(m.chat, username);
            try { await client.groupParticipantsUpdate(m.chat, [sender], 'remove'); } catch {}
            await client.sendMessage(m.chat, {
                text: `status mention detected, message deleted\n@${username} kicked, warn limit ${newCount}/${MAX_WARNS} reached.`,
                mentions: [sender] });
            return;
        }

        await client.sendMessage(m.chat, {
            text: `status mention detected, message deleted\n@${username} avoid mentioning status. Warn ${newCount}/${MAX_WARNS}.`,
            mentions: [sender] });
    } catch (err) {
        console.error('[ANTISTATUSMENTION] Error:', err.message);
    }
};
