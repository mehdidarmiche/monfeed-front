import OpenAI from 'openai'
import { factories } from '@strapi/strapi'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export default factories.createCoreService('api::event.event', () => ({
  async generateDescriptionFromTitle(title: string) {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
  {
    role: 'system',
    content:
      'Tu es un assistant en stratégie de contenu pour les réseaux sociaux. Pour chaque tâche saisie dans un calendrier éditorial (type : création de post, programmation, brainstorming, etc.), tu génères une courte description adaptée au contexte (max 100 caractères). Ta réponse doit clarifier l’objectif ou le contenu prévu, de manière concise et professionnelle.',
  },
  {
    role: 'user',
    content: `Tâche saisie : "${title}". Génère une description claire (max 100 caractères) adaptée à un calendrier de gestion de réseaux sociaux.`,
  },
],
temperature: 0.7,
max_tokens: 30

    })

    return completion.choices[0].message?.content?.trim() || ''
  },
}))
