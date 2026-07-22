import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { promises as fs } from 'fs';
import path from 'path';
import { aliases } from '../../handlers/commandHandler.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

const normalizeNumber = (jid) => {
    if (!jid) return '';
    return jid.split('@')[0].split(':')[0].replace(/\D/g, '') + '@s.whatsapp.net';
};

const DEVELOPER = normalizeNumber('255767862457');
const CATEGORIES = ['AI', 'Anime', 'Coding', 'Downloads', 'Editing', 'Effects', 'General', 'Groups', 'Heroku', 'NSFW', 'Owner', 'Privacy', 'Reactions', 'Search', 'Settings', 'Utils'];
const PLUGINS_DIR = path.join(__dirname, '..', '..', 'plugins');

function resolveAlias(input) {
    try {
        if (aliases && aliases[input.toLowerCase()]) return aliases[input.toLowerCase()];
    } catch {}
    return input;
}

export default async (context) => {
    const { client, m, text, prefix } = context;
    await client.sendMessage(m.chat, { react: { text: '🔍', key: m.reactKey } });

    if (normalizeNumber(m.sender) !== DEVELOPER) {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
        return await sendInteractive(client, m, `🚫 *ACCESS DENIED*\n━━━━━━━━━━━━━━━━\nThis command is restricted to the bot owner.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
    }

    if (!text) {
        const categoryList = CATEGORIES.map(c => `• ${c}`).join('\n');
        return await sendInteractive(client, m, `📌 *GETCMD*\n━━━━━━━━━━━━━━━━\nUsage: ${prefix}getcmd <name>\nCategories:\n━━━━━━━━━━━━━━━━\n© bmb tech`);
    }

    const rawInput = text.trim().endsWith('.js') ? text.trim().slice(0, -3) : text.trim();
    const commandName = resolveAlias(rawInput);
    let fileFound = false;

    for (const category of CATEGORIES) {
        const filePath = path.join(PLUGINS_DIR, category, `${commandName}.js`);
        try {
            const data = await fs.readFile(filePath, 'utf8');
            const fileBuffer = Buffer.from(data, 'utf8');
            const aliasNote = commandName !== rawInput ? `Alias: ${rawInput} → ${commandName}\n` : '';

            const responseId = Math.random().toString(36).substring(2);
            const introText = `📌 *COMMAND FILE*\n━━━━━━━━━━━━━━━━\nFile: ${commandName}.js\nCategory: ${category}\nSize: ${data.length} chars\n━━━━━━━━━━━━━━━━\n© bmb tech`;
            
            const encodedData = Buffer.from(JSON.stringify({
                "response_id": responseId,
                "sections": [
                    {
                        "view_model": {
                            "primitive": {
                                "text": introText,
                                "__typename": "GenAIMarkdownTextUXPrimitive"
                            },
                            "__typename": "GenAISingleLayoutViewModel"
                        }
                    },
                    {
                        "view_model": {
                            "primitive": {
                                "language": "javascript",
                                "code_blocks": [
                                    { "content": data, "type": "DEFAULT" }
                                ],
                                "__typename": "GenAICodeUXPrimitive"
                            },
                            "__typename": "GenAISingleLayoutViewModel"
                        }
                    }
                ]
            })).toString('base64');

            const content = {
                messageContextInfo: {
                    threadId: [],
                    deviceListMetadata: {
                        senderKeyIndexes: [],
                        recipientKeyIndexes: []
                    },
                    deviceListMetadataVersion: 2,
                    botMetadata: {
                        pluginMetadata: {},
                        richResponseSourcesMetadata: {
                            sources: []
                        }
                    }
                },
                botForwardedMessage: {
                    message: {
                        richResponseMessage: {
                            submessages: [
                                {
                                    messageType: 2,
                                    messageText: introText
                                },
                                {
                                    messageType: 3,
                                    codeMetadata: {
                                        codeLanguage: "javascript",
                                        codeBlocks: [
                                            {
                                                highlightType: 0,
                                                codeContent: data
                                            }
                                        ]
                                    }
                                }
                            ],
                            messageType: 1,
                            unifiedResponse: {
                                data: encodedData
                            },
                            contextInfo: {
                                mentionedJid: [],
                                groupMentions: [],
                                statusAttributions: [],
                                forwardingScore: 743,
                                isForwarded: true,
                                forwardedAiBotMessageInfo: {
                                    botJid: "867051314767696@bot"
                                },
                                forwardOrigin: 4
                            }
                        }
                    }
                }
            };
            const relayOption = {};
            
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
            await client.relayMessage(m.chat, content, relayOption);
            await client.sendMessage(m.chat, {
                document: fileBuffer,
                fileName: `${commandName}.js`,
                mimetype: 'application/javascript',
                caption: `📌 *GETCMD*\n━━━━━━━━━━━━━━━━\n📄 ${commandName}.js\nCategory: ${category}\nSize: ${data.length} chars\n${aliasNote}━━━━━━━━━━━━━━━━\n© bmb tech`
            });
            
            fileFound = true;
            break;
        } catch (err) {
            if (err.code !== 'ENOENT') {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                return await sendInteractive(client, m, `❌ *ERROR*\n━━━━━━━━━━━━━━━━\nError reading file: ${err.message}\n━━━━━━━━━━━━━━━━\n© bmb tech`);
            }
        }
    }

    if (!fileFound) {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
        await sendInteractive(client, m, `📌 *NOT FOUND*\n━━━━━━━━━━━━━━━━\n"${rawInput}" not found in any category.\nTip: use ${prefix}getcmd with no args\nto see all categories.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
    }
};
