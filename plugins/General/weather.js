import axios from 'axios';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default {
    name: 'weather',
    aliases: ['wthr', 'forecast', 'temp'],
    description: 'Get current weather for any city',
    run: async (context) => {
        const { client, m, text } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
        const city = (text || '').trim();
        if (!city) {
            return sendInteractive(client, m, `📌 *WEATHER*\n━━━━━━━━━━━━━━━━\nGive me a city name, genius.\nUsage: .weather Nairobi\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }
        try {
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
            const res = await axios.get(`https://wttr.in/${encodeURIComponent(city)}?format=j1`, { timeout: 10000 });
            const w = res.data.current_condition?.[0];
            const area = res.data.nearest_area?.[0];
            if (!w) throw new Error('No data');
            const areaName = area?.areaName?.[0]?.value || city;
            const country = area?.country?.[0]?.value || '';
            const desc = w.weatherDesc?.[0]?.value || '';
            const tempC = w.temp_C || '?';
            const feelsC = w.FeelsLikeC || '?';
            const humidity = w.humidity || '?';
            const wind = w.windspeedKmph || '?';
            const visibility = w.visibility || '?';
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
            return sendInteractive(client, m, `📌 *WEATHER*\n━━━━━━━━━━━━━━━━\n📍 ${areaName}, ${country}\n☁️ ${desc}\n🌡️ Temp: ${tempC}°C (Feels ${feelsC}°C)\n💧 Humidity: ${humidity}%\n💨 Wind: ${wind} km/h\n👁️ Visibility: ${visibility} km\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        } catch (e) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
            return sendInteractive(client, m, `📌 *WEATHER*\n━━━━━━━━━━━━━━━━\nWeather API is throwing a tantrum. Try again.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }
    }
};
