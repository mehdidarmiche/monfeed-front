import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default () => ({
  async generatePostMessage(message: string) {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'Tu es un expert en stratégie de contenu pour les réseaux sociaux. Génère un texte engageant et pertinent pour un post sur les réseaux sociaux (Facebook, Instagram, LinkedIn). Le style doit être naturel, accrocheur, et adapté à la plateforme. Max 200 caractères.',
        },
        {
          role: 'user',
          content: `Sujet du post : "${message}". Génère un texte engageant pour un post réseaux sociaux (max 200 caractères).`,
        },
      ],
      temperature: 0.7,
      max_tokens: 60,
    });

    return completion.choices[0].message?.content?.trim() || '';
  },
});
