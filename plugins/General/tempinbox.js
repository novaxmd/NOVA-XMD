import axios from 'axios';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default {
    name: 'tempinbox',
    aliases: ['checkinbox', 'tempmailinbox', 'tempcheck'],
    description: 'Check your temporary email inbox',
    run: async (context) => {
        const { client, m, prefix } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        const args = m.body?.split(" ") || [];
        const sessionId = args[1];

        if (!sessionId) {
            return sendInteractive(client, m, `📌 *TEMP INBOX*\n━━━━━━━━━━━━━━━━\nYo, where's the session ID?\nYou created the temp mail, right?\nUsage: ${prefix}tempinbox YOUR_SESSION_ID\nExample: ${prefix}tempinbox U2Vzc2lvbjoc5LI1OhFHh4tv21skV965\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }

        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        try {
            const response = await axios.get(`https://api.nekolabs.web.id/tools/tempmail/v3/inbox?id=${sessionId}`, {
                timeout: 30000
            });

            if (!response.data.success) {
                throw new Error('Invalid session ID or inbox expired');
            }

            const { totalEmails, emails } = response.data.result;

            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });

            if (totalEmails === 0) {
                return sendInteractive(client, m, `📌 *TEMP INBOX*\n━━━━━━━━━━━━━━━━\nInbox is empty, genius.\nNo emails yet.\nUse your temp email somewhere\nand check back.\nTotal Emails: 0\n━━━━━━━━━━━━━━━━\n© bmb tech`);
            }

            let inboxText = `📧 *TEMP INBOX*\n━━━━━━━━━━━━━━━━\nInbox: ${totalEmails} email${totalEmails > 1 ? 's' : ''} found\n`;

            emails.forEach((email, index) => {
                inboxText += `\nEmail ${index + 1}:\nFrom: ${email.from || 'Unknown'}\nSubject: ${email.subject || 'No Subject'}\n`;
                
                if (email.text && email.text.trim()) {
                    const cleanText = email.text.replace(/\r\n/g, '\n').trim();
                    inboxText += `Content: ${cleanText.substring(0, 50)}${cleanText.length > 50 ? '...' : ''}\n`;
                }
                
                if (email.downloadUrl) {
                    inboxText += `Attachment URL available\n`;
                }
            });

            inboxText += `━━━━━━━━━━━━━━━━\n© bmb tech`;

            if (inboxText.length > 4000) {
                const firstPart = inboxText.substring(0, 4000);
                const secondPart = inboxText.substring(4000);

                await client.sendMessage(m.chat, { text: firstPart });
                await client.sendMessage(m.chat, { text: secondPart });
            } else {
                await client.sendMessage(m.chat, { text: inboxText });
            }

        } catch (error) {
            console.error('TempInbox error:', error);
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });

            let errorMessage = `Failed to check inbox, your session ID is probably trash. `;
            if (error.message.includes('Invalid session') || error.message.includes('404') || error.message.includes('Not Found')) {
                errorMessage += "Session expired or invalid. Create a new email.";
            } else if (error.message.includes('timeout')) {
                errorMessage += "API timeout. Try again.";
            } else if (error.message.includes('Network Error')) {
                errorMessage += "Network issue. Check your connection.";
            } else {
                errorMessage += `Error: ${error.message}`;
            }

            await sendInteractive(client, m, `❌ *ERROR*\n━━━━━━━━━━━━━━━━\n${errorMessage}\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }
    } };
