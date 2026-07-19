import axios from 'axios';
import { uploadTempUrl } from '../../lib/toUrl.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default {
    name: 'removebg',
    aliases: ['nobg', 'rmbg', 'transparent'],
    description: 'Removes background from images using AI',
    run: async (context) => {
        const { client, m, mime } = context;
        
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        const quoted = m.quoted ? m.quoted : m;
        const quotedMime = quoted.mimetype || mime || '';
        
        if (!/image/.test(quotedMime)) {
            return client.sendMessage(m.chat, {
                text: `📌 *REMOVE BG*\n━━━━━━━━━━━━━━━━\nDo you have eyes? That's clearly\nnot an image. Quote an actual image\nfile, you incompetent fool.\n━━━━━━━━━━━━━━━━\n© bmb tech`,
                mentions: [m.sender]
            });
        }

        try {
            const media = await quoted.download();
            if (!media) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
                return sendInteractive(client, m, `📌 *FAILED*\n━━━━━━━━━━━━━━━━\nFailed to download the image.\nYour device is probably as defective\nas your judgment.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
            }

            if (media.length > 10 * 1024 * 1024) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
                return sendInteractive(client, m, `📌 *FAILED*\n━━━━━━━━━━━━━━━━\nImage exceeds 10MB limit.\nDo you think I have infinite storage?\n━━━━━━━━━━━━━━━━\n© bmb tech`);
            }

            const imageUrl = await uploadTempUrl(media, 'png');
            const encodedUrl = encodeURIComponent(imageUrl);
            const removeBgApiUrl = `https://api.ootaizumi.web.id/tools/removebg?imageUrl=${encodedUrl}`;
            
            const response = await axios.get(removeBgApiUrl, {
                headers: { 
                    'accept': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                },
                timeout: 60000
            });

            if (!response.data.status || !response.data.result) {
                throw new Error('The AI failed to process your image. Probably too complex for its intelligence.');
            }

            const transparentImageUrl = response.data.result;
            const transparentResponse = await axios.get(transparentImageUrl, {
                responseType: 'arraybuffer',
                timeout: 30000
            });

            const transparentImage = Buffer.from(transparentResponse.data);

            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });

            await client.sendMessage(
                m.chat,
                { 
                    image: transparentImage, 
                    caption: `📌 *REMOVE BG*\n━━━━━━━━━━━━━━━━\nBackground successfully removed.\n━━━━━━━━━━━━━━━━\n© bmb tech`
                }
            );

            if (transparentResponse.headers['content-type']?.includes('png')) {
                await client.sendMessage(
                    m.chat,
                    {
                        document: transparentImage,
                        mimetype: 'image/png',
                        fileName: `transparent_bg_${Date.now()}.png`,
                        caption: `📌 *PNG FILE*\n━━━━━━━━━━━━━━━━\nPNG version for higher quality.\n━━━━━━━━━━━━━━━━\n© bmb tech`
                    }
                );
            }

        } catch (err) {
            console.error('RemoveBG error:', err);
            
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });

            let errorMessage = 'An unexpected error occurred';
            
            if (err.message.includes('timeout')) {
                errorMessage = 'Processing took too long. Your image might be too complex or the server is busy.';
            } else if (err.message.includes('Network Error')) {
                errorMessage = 'Network connection failed. Check your internet, you digital neanderthal.';
            } else if (err.message.includes('Upload process failed')) {
                errorMessage = 'Failed to upload image for processing.';
            } else if (err.message.includes('AI failed to process')) {
                errorMessage = 'The AI could not process this image. Try something less abstract.';
            } else if (err.message.includes('ENOTFOUND')) {
                errorMessage = 'Cannot connect to the background removal service.';
            } else {
                errorMessage = 'Service failed. Try again later.';
            }

            await sendInteractive(client, m, `📌 *FAILED*\n━━━━━━━━━━━━━━━━\nBackground removal failed.\nError: ${errorMessage}\nSuggestions:\nUse clear, high-contrast images\nEnsure subject has defined edges\nTry a simpler composition\nCheck your internet connection\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }
    }
};