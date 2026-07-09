import Groq from 'groq-sdk';

const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

function getGroqClient() {
  const key = process.env.GROQ_API_KEY?.trim();
  if (!key) {
    throw new Error(
      'GROQ_API_KEY is missing. Add it to backend/.env and restart the server.'
    );
  }
  return new Groq({ apiKey: key });
}

function isQuotaOrRateLimitError(error) {
  const status = error?.status || error?.statusCode;
  const message = String(error?.message || '').toLowerCase();
  return (
    status === 429 ||
    message.includes('quota') ||
    message.includes('rate limit') ||
    message.includes('rate_limit') ||
    message.includes('too many requests')
  );
}

function wrapAiError(prefix, error) {
  if (isQuotaOrRateLimitError(error)) {
    return new Error(
      `${prefix}: AI quota or rate limit reached. Please try again later.`
    );
  }
  return new Error(`${prefix}: ${error.message || 'Unknown AI error'}`);
}

function extractJsonPayload(text) {
  const trimmed = String(text || '').trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1].trim() : trimmed;

  try {
    return JSON.parse(candidate);
  } catch {
    const arrayMatch = candidate.match(/\[[\s\S]*\]/);
    if (arrayMatch) {
      return JSON.parse(arrayMatch[0]);
    }
    throw new Error('AI returned invalid JSON');
  }
}

function normalizeArrayPayload(payload, keys) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && typeof payload === 'object') {
    for (const key of keys) {
      if (Array.isArray(payload[key])) {
        return payload[key];
      }
    }
  }

  throw new Error('AI did not return an array');
}

function parseJsonArray(text, keys, validator, itemLabel) {
  const payload = extractJsonPayload(text);
  const parsed = normalizeArrayPayload(payload, keys);

  if (!parsed.every(validator)) {
    throw new Error(`AI returned invalid ${itemLabel} objects`);
  }

  return parsed;
}

async function callGroq(prompt) {
  const client = getGroqClient();
  const completion = await client.chat.completions.create({
    model: GROQ_MODEL,
    messages: [
      {
        role: 'system',
        content:
          'You are a professional interview coach. Respond with valid JSON only. Do not include markdown fences or commentary.',
      },
      { role: 'user', content: prompt },
    ],
    temperature: 0.6,
    response_format: { type: 'json_object' },
  });

  const text = completion.choices?.[0]?.message?.content;
  if (!text?.trim()) {
    throw new Error('Empty response from AI');
  }

  return text;
}

const generateInterviewQuestions = async (resumeText) => {
  try {
    const prompt = `
Generate exactly 5 challenging interview questions based on this resume.

Resume text:
${String(resumeText || '').substring(0, 4000)}

Return JSON in this shape:
{
  "questions": [
    { "question": "string", "type": "Technical|Behavioral|Situational|Career" }
  ]
}
`;

    const text = await callGroq(prompt);

    return parseJsonArray(
      text,
      ['questions', 'items', 'data'],
      (item) =>
        item &&
        typeof item.question === 'string' &&
        typeof item.type === 'string',
      'question'
    );
  } catch (error) {
    throw wrapAiError('AI Generation Failed', error);
  }
};

const evaluateInterviewAnswers = async (qaPairs) => {
  try {
    const prompt = `
Evaluate the following interview answers. For each item, provide:
- score: integer from 0 to 10
- strengths: concise string
- weaknesses: concise string
- suggestions: actionable improvement advice using STAR when relevant

Q&A pairs:
${JSON.stringify(qaPairs, null, 2)}

Return JSON in this shape:
{
  "evaluations": [
    { "score": 0, "strengths": "string", "weaknesses": "string", "suggestions": "string" }
  ]
}
`;

    const text = await callGroq(prompt);

    return parseJsonArray(
      text,
      ['evaluations', 'results', 'items', 'data'],
      (item) =>
        item &&
        item.score !== undefined &&
        typeof item.strengths === 'string' &&
        typeof item.weaknesses === 'string' &&
        typeof item.suggestions === 'string',
      'evaluation'
    );
  } catch (error) {
    throw wrapAiError('AI Evaluation Failed', error);
  }
};

export { generateInterviewQuestions, evaluateInterviewAnswers };
