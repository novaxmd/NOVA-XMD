import axios from 'axios';
import fetch from 'node-fetch';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default {
    name: 'tempmail',
    aliases: ['tempemail', 'tempinbox', 'tempmailcreate'],
    description: 'Create temporary email for disposable inbox',
    run: async (context) => {
        const { client, m, prefix } = context;

        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        try {
            const response = await axios.get('https://api.nekolabs.web.id/tools/tempmail/v3/create', {
                timeout: 30000
            });

            if (!response.data.success || !response.data.result) {
                throw new Error('Failed to create temporary email');
            }

            const { email, sessionId, expiresAt } = response.data.result;
            const expires = new Date(expiresAt).toLocaleString();

            await client.sendMessage(m.chat, { react: { text: '', key: m.reactKey } });

            await client.sendMessage(
                m.chat,
                {
                    interactiveMessage: {
                        header: `📌 *TEMP MAIL*\n━━━━━━━━━━━━━━━━\nTEMPORARY EMAIL CREATED!\nYOUR EMAIL:\n${email}\nSESSION ID:\n${sessionId}\nEXPIRES: ${expires}\nHOW TO CHECK INBOX:\n${prefix}tempinbox ${sessionId}\n━━━━━━━━━━━━━━━━\n© bmb tech`,
                        buttons: [
                            {
                                name: "cta_copy",
                                buttonParamsJson: JSON.stringify({
                                    display_text: "Copy Session ID",
                                    id: "copy_session",
                                    copy_code: sessionId
                                })
                            },
                            {
                                name: "cta_copy", 
                                buttonParamsJson: JSON.stringify({
                                    display_text: "Copy Email",
                                    id: "copy_email",
                                    copy_code: email
                                })
                            }
                        ]
                    }
                }
            );

        } catch (error) {
            console.error('TempMail error:', error);
            await client.sendMessage(m.chat, { react: { text: '', key: m.reactKey } });

            let errorMessage = `Failed to create temporary email, you impatient creature. `;
            if (error.message.includes('timeout')) {
                errorMessage += "API took too long, try again later.";
            } else if (error.message.includes('Network Error')) {
                errorMessage += "Check your internet connection, dummy.";
            } else if (error.message.includes('Failed to create')) {
                errorMessage += "Email service is down, try later.";
            } else {
                errorMessage += `Error: ${error.message}`;
            }

            await sendInteractive(client, m, `❌ *ERROR*\n━━━━━━━━━━━━━━━━\n${errorMessage}\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }
    } };
