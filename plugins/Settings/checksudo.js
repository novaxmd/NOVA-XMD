import { getSudoUsers } from '../../database/config.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default {
    name: 'checksudo',
    aliases: ['listsudo', 'sudolist', 'sudos', 'listsudos', 'sudousers', 'getsudo'],
    description: 'List all sudo users',
    run: async (context) => {
        const { client, m } = context;
        await client.sendMessage(m.chat, { react: { text: '⏳', key: m.reactKey } });

        const sudoUsers = await getSudoUsers();

        if (!sudoUsers || sudoUsers.length === 0) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return sendInteractive(client, m, "📌 *SUDO USERS*\n━━━━━━━━━━━━━━━━\nNo Sudo Users found. You're all alone.\n━━━━━━━━━━━━━━━━\n© bmb tech");
        }

        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });

        const rows = [
            {
                items: ["No", "Sudo Users"],
                isHeading: true
            },
            ...sudoUsers.map((jid, index) => ({
                items: [(index + 1).toString(), jid]
            }))
        ];

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
                                messageType: 4,
                                tableMetadata: {
                                    rows: rows,
                                    title: "Sudo Users"
                                }
                            }
                        ],
                        messageType: 1,
                        unifiedResponse: {
                            data: "response/sudousers//typenameGenAIMarkdownTextUXPrimitive//typenameGenAISingleLayoutViewMode"
                        },
                        contextInfo: {
                            mentionedJid: [],
                            groupMentions: [],
                            statusAttributions: [],
                            forwardingScore: 1,
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
        client.relayMessage(m.chat, content, relayOption);
    }
};
