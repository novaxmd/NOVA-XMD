import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js';
export default async (context) => {

    await ownerMiddleware(context, async () => {

    const { client, m } = context;
    await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

const Myself = await client.decodeJid(client.user.id);
    
    const {
                readreceipts,
                profile,
                status,
                online,
                last,
                groupadd,
                calladd
        } = await client.fetchPrivacySettings(true);
        
        const fnn = `⚙️ *PRIVACY SETTINGS*\n━━━━━━━━━━━━━━━━\nName: ${client.user.name}\nOnline: ${online}\nProfile Picture: ${profile}\nLast Seen: ${last}\nRead Receipt: ${readreceipts}\nGroup Add: ${groupadd}\nStatus: ${status}\nCall Add: ${calladd}\n━━━━━━━━━━━━━━━━\n© bmb tech`;


const avatar = await client.profilePictureUrl(Myself, 'image').catch(_ => 'https://telegra.ph/file/b34645ca1e3a34f1b3978.jpg');

await client.sendMessage(m.chat, { image: { url: avatar}, caption: fnn}) 


})

}
        
