import { downloadContentFromMessage } from '@whiskeysockets/baileys';
import axios from 'axios';
import fsPromises from 'fs/promises';
import fs from 'fs';
import path from 'path';
import os from 'os';
import FormData from 'form-data';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default {
    name: 'stt',
    aliases: ['speechtotext', 'transcribe', 'voicetotext'],
    description: 'Transcribes voice notes and audio messages to text',
    run: async (context) => {
        const { client, m, prefix } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        let _km = {};
        try { _km = await import('../../keys.js'); } catch {}
        const _groqKeys = _km.GROQ_API_KEYS?.length ? _km.GROQ_API_KEYS : [_km.GROQ_API_KEY || process.env.GROQ_KEY_1 || process.env.GROQ_API_KEY || ''].filter(Boolean);
        if (!_groqKeys.length) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return sendInteractive(client, m, `📌 *STT*\n━━━━━━━━━━━━━━━━\nNo GROQ key set. Add GROQ_KEY_1 to env vars.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }
        let GROQ_API_KEY = _km.getNextGroqKey?.() || _groqKeys[0];

        const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const directAudio = m.message?.audioMessage;
        const quotedAudio = quoted?.audioMessage;
        const audioMsg = directAudio || quotedAudio;

        if (!audioMsg) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
            return sendInteractive(client, m, `📌 *STT*\n━━━━━━━━━━━━━━━━\nReply to a voice note or audio message,\nyou muppet. I'm not magic — I can't\ntranscribe thin air.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }

        await client.sendMessage(m.chat, { react: { text: '👂', key: m.reactKey } });

        const tmpFile = path.join(os.tmpdir(), `stt_${Date.now()}.ogg`);

        try {
            const stream = await downloadContentFromMessage(audioMsg, 'audio');
            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }

            await fsPromises.writeFile(tmpFile, buffer);

            const form = new FormData();
            form.append('file', fs.createReadStream(tmpFile), { filename: 'audio.ogg', contentType: 'audio/ogg' });
            form.append('model', 'whisper-large-v3');
            form.append('response_format', 'json');

            let response;
            for (let _i = 0; _i < _groqKeys.length; _i++) {
                const _k = _km.getNextGroqKey?.() || _groqKeys[_i];
                if (!_k) continue;
                try {
                    response = await axios.post('https://api.groq.com/openai/v1/audio/transcriptions', form, {
                        headers: { ...form.getHeaders(), Authorization: `Bearer ${_k}` } });
                    break;
                } catch (e) {
                    if ((e.response?.status === 429 || e.response?.status === 401 || e.response?.status === 403) && _groqKeys.length > 1) {
                        _km.markKeyFailed?.(_k);
                        continue;
                    }
                    throw e;
                }
            }
            if (!response) throw new Error('All GROQ keys exhausted');

            const transcribed = response.data?.text?.trim();

            if (!transcribed) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
                return sendInteractive(client, m, `📌 *STT*\n━━━━━━━━━━━━━━━━\nI listened to that rubbish and got\nabsolutely nothing. Either you mumbled\nor you sent silence. Both are equally\nuseless.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
            }

            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
            await sendInteractive(client, m, `📌 *STT*\n━━━━━━━━━━━━━━━━\n👂 *Transcription:*\n${transcribed}\n_You're welcome. Now learn to type\nnext time._\n━━━━━━━━━━━━━━━━\n© bmb tech`);

        } catch (error) {
            console.error('STT error:', error);
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
            await sendInteractive(client, m, `📌 *STT*\n━━━━━━━━━━━━━━━━\nTranscription crashed. Whisper took one\nlisten and gave up — honestly can't\nblame it.\nError: ${error.message}\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        } finally {
            fsPromises.unlink(tmpFile).catch(() => {});
        }
    }
};
