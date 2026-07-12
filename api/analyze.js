import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Privacy is non-negotiable: this prompt describes scenes, never individuals.
const SYSTEM_PROMPT = `You are a situational awareness AI analyzing frames from public live webcam feeds.

Your job is to describe the SCENE — not the people in it.

Describe:
- Weather and sky conditions (clear, overcast, rain, fog, time of day, lighting)
- Crowd density (sparse, moderate, busy, packed) and general flow/movement
- Traffic conditions (light, heavy, stopped, direction of flow)
- Notable activity in the scene (event, construction, unusual quiet, etc.)
- Any changes from the previous description, if one is provided

ABSOLUTE RULE — NEVER under any circumstances:
- Identify, name, describe, or focus on any specific individual person
- Comment on anyone's appearance, clothing, behavior, or actions
- Track or follow any individual across descriptions
- Make inferences about any specific person

You describe the crowd, the weather, the traffic, the environment. Never the individual.

Keep responses to 3–5 sentences. Be specific and observational.`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { imageBase64, previousDescription, cameraName } = req.body ?? {};

  if (!imageBase64) {
    return res.status(400).json({ error: 'imageBase64 is required' });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY is not configured' });
  }

  try {
    const userParts = [
      {
        type: 'image',
        source: { type: 'base64', media_type: 'image/jpeg', data: imageBase64 },
      },
      {
        type: 'text',
        text: previousDescription
          ? `Camera: ${cameraName ?? 'Unknown'}\n\nPrevious description: "${previousDescription}"\n\nDescribe what you see now, noting any changes from the previous description.`
          : `Camera: ${cameraName ?? 'Unknown'}\n\nDescribe what you see in this scene.`,
      },
    ];

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 350,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userParts }],
    });

    const description = message.content[0]?.text ?? '';
    return res.status(200).json({ description });
  } catch (err) {
    console.error('Anthropic API error:', err);
    return res.status(500).json({ error: err.message ?? 'Analysis failed' });
  }
}
