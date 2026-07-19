import Toxic_Tech, { useMultiFileAuthState, delay, makeCacheableSignalKeyStore, fetchLatestBaileysVersion } from '@whiskeysockets/baileys';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import path from 'path';
import pino from 'pino';

                import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys';
import { sendInteractive } from '../../lib/sendInteractive.js';
function cleanNumber(input) {
    let num = input.replace(/[\s\-\(\)\+\.]/g, '');
    num = num.replace(/[^0-9]/g, '');
    if (num.startsWith('00')) {
        num = num.slice(2);
    }
    return num;
}

function makeid(len = 6) {
    let result = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < len; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export default {
    name: 'pair',
    aliases: ['getcode', 'paircode', 'pairingcode', 'connect'],
    description: 'Generates a pairing code for WhatsApp multi-device linking',
    run: async (context) => {
        const { client, m, text, prefix } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        try {
            if (!text) {
                return await sendInteractive(client, m, `📌 *PAIRING*\n━━━━━━━━━━━━━━━━\nOi genius, give me a number\nto pair with. You think I can\nread your mind?\nUsage: *${prefix}pair <number>*\nExample: *${prefix}pair 254712345678*\nExample: *${prefix}pair +1 234 567 8901*\nSpaces, dashes, plus signs...\nI'll clean that mess up for you.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
            }

            const number = cleanNumber(text);

            if (number.length < 6 || number.length > 15) {
                return await sendInteractive(client, m, `📌 *INVALID NUMBER*\n━━━━━━━━━━━━━━━━\nThat number is garbage.\nCleaned: ${number}\nNeed 6-15 digits with country code.\nTry again with a real number.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
            }

            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

            await sendInteractive(client, m, `📌 *PAIRING*\n━━━━━━━━━━━━━━━━\nGenerating code for: ${number}\nHold on, this takes a sec...\nDon't spam the command, idiot.\n━━━━━━━━━━━━━━━━\n© bmb tech`);

            const sessionId = makeid(8);
            let tempPath;
            try {
                const basePath = path.join(__dirname, '..', '..', 'features', 'toxicmd', 'temp');
                if (fs.existsSync(basePath) && !fs.statSync(basePath).isDirectory()) {
                    fs.unlinkSync(basePath);
                }
                const toxicmdPath = path.join(__dirname, '..', '..', 'features', 'toxicmd');
                if (fs.existsSync(toxicmdPath) && !fs.statSync(toxicmdPath).isDirectory()) {
                    fs.unlinkSync(toxicmdPath);
                }
                tempPath = path.join(basePath, sessionId);
                fs.mkdirSync(tempPath, { recursive: true });
            } catch (dirErr) {
                tempPath = path.join('/tmp', 'toxic-pair-' + sessionId);
                fs.mkdirSync(tempPath, { recursive: true });
            }

            const { version } = await fetchLatestBaileysVersion();
            const { state, saveCreds } = await useMultiFileAuthState(tempPath);

            const pairSocket = Toxic_Tech({
                version,
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })) },
                printQRInTerminal: false,
                logger: pino({ level: 'silent' }),
                browser: ["Ubuntu", "Chrome", "20.0.04"],
                syncFullHistory: false,
                generateHighQualityLinkPreview: true,
                shouldIgnoreJid: jid => !!jid?.endsWith('@g.us'),
                getMessage: async () => undefined,
                markOnlineOnConnect: true,
                connectTimeoutMs: 120000,
                keepAliveIntervalMs: 30000,
                defaultQueryTimeoutMs: 60000,
                transactionOpts: { maxCommitRetries: 10, delayBetweenTriesMs: 3000 },
                retryRequestDelayMs: 10000
            });

            pairSocket.ev.on('creds.update', saveCreds);

            await delay(3000);
            const code = await pairSocket.requestPairingCode(number);

            if (!code) throw new Error("Pairing code generation failed. The number might not be on WhatsApp.");

            await client.sendMessage(m.chat, { react: { text: '', key: m.reactKey } });

            const formattedCode = code.match(/.{1,4}/g)?.join('-') || code;

            try {

                const ctaMsg = generateWAMessageFromContent(m.chat, {
                    viewOnceMessage: {
                        message: {
                            interactiveMessage: proto.Message.InteractiveMessage.create({
                                body: proto.Message.InteractiveMessage.Body.create({
                                    text: `📌 *PAIRING CODE*\n━━━━━━━━━━━━━━━━\nNumber: ${number}\nCode: *${formattedCode}*\nCopy the code and paste it\nin your WhatsApp linked\ndevices section.\nThe code expires quickly so\nmove your slow ass.\n━━━━━━━━━━━━━━━━\n© bmb tech`
                                }),
                                footer: proto.Message.InteractiveMessage.Footer.create({
                                    text: 'NOVA-XMD Pairing System'
                                }),
                                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                                    buttons: [
                                        {
                                            name: 'cta_copy',
                                            buttonParamsJson: JSON.stringify({
                                                display_text: 'Copy Pairing Code',
                                                id: 'copy_code',
                                                copy_code: formattedCode
                                            })
                                        }
                                    ]
                                })
                            })
                        }
                    }
                });

                await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });


                await client.relayMessage(m.chat, ctaMsg.message, { messageId: ctaMsg.key.id });

            } catch (btnErr) {
    await client.sendMessage(m.chat, { react: { text: '', key: m.reactKey } }).catch(() => {});
                await sendInteractive(client, m, `📌 *PAIRING CODE*\n━━━━━━━━━━━━━━━━\nNumber: ${number}\nCode: *${formattedCode}*\nCopy the code above and paste\nit in your WhatsApp linked\ndevices section. Hurry up,\nit expires quick.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
            }

            setTimeout(async () => {
                try {
                    await pairSocket.ws.close();
                } catch (e) {}
                setTimeout(() => {
                    if (fs.existsSync(tempPath)) fs.rmSync(tempPath, { recursive: true, force: true });
                }, 5000);
            }, 10000);

        } catch (error) {
            console.error("Error in pair command:", error);
            await client.sendMessage(m.chat, { react: { text: '', key: m.reactKey } });
            await sendInteractive(client, m, `📌 *PAIRING FAILED*\n━━━━━━━━━━━━━━━━\nCouldn't generate the code.\n${error.message || 'Unknown error'}\nMake sure the number is valid\nand actually on WhatsApp.\nThen try again, if you can\nmanage that.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }
    }
};
