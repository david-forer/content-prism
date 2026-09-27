import { SessionInput, Draft, HookStyle, getEffectiveApiKey, Settings } from '../types';
import { getAngleByKey } from '../data/angles';
import { checkHealth, countWords, calculateReadTime } from './health-checker';
import { GOAL_LABELS } from '../types/template';

interface AIGenerateOptions {
  input: SessionInput;
  settings: Settings;
  onProgress?: (angleKey: string, status: 'generating' | 'done' | 'error') => void;
}

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface AnthropicResponse {
  stop_reason?: string;
  content: Array<{
    type: string;
    text?: string;
  }>;
}

function buildSystemPrompt(input: SessionInput): string {
  const lengthGuide: Record<string, string> = {
  'ultra-short': `
STRICT LENGTH RULE:
- Minimum 50 words
- Maximum 100 words
- Single focused insight only
- Do NOT exceed 100 words
- Do NOT pad with filler
`,

  short: `
STRICT LENGTH RULE:
- Minimum 150 words
- Target 180–200 words
- Do NOT end early
- If under 150 words, expand with one concrete example
`,

  medium: `
STRICT LENGTH RULE:
- Minimum 250 words
- Target 300–350 words
- You MUST hit at least 250 words
- Include at least:
  • 1 concrete example
  • 3 distinct idea sections
  • 1 consequence or implication
- Do NOT end the post early
`,

  long: `
STRICT LENGTH RULE:
- Minimum 400 words
- Target 450–500 words
- You MUST hit at least 400 words
- Use clear structural sections
- Do NOT ramble to inflate length
`,
};

  const isComment = input.length === 'ultra-short';
  const isContentMode = input.inputMode === 'content';

  // Ultra-short comment mode
  if (isComment) {
    return `You are an expert at writing thoughtful LinkedIn comments.

Write a brief comment that:
- Adds ONE specific insight or perspective
- Feels natural and conversational
- Avoids generic praise or filler
- Avoids corporate language
- NO hashtags
- NO CTA
- NO emojis unless absolutely necessary
- References something concrete from the topic

Context:
- Target audience: ${input.audience || 'professionals'}
- Voice/tone: ${input.voice || 'direct and human'}
- Domain/industry: ${input.domain || 'business'}
- Length: ${lengthGuide[input.length]}

Before finalizing:
- Verify the word count meets the minimum requirement.
- If under the minimum, expand with specific examples or clarification.
- If over the maximum, tighten without removing core meaning.

IMPORTANT:
Write ONLY the comment. No prefacing. No explanation. No meta text.`;
  }

  // Content rewrite mode
  if (isContentMode) {
    return `You are a high-level LinkedIn content strategist.

Rewrite the provided content into a structurally distinct LinkedIn post using the specified angle.

Rules:
- The first 2 lines must interrupt scrolling. No soft openings.
- Paragraphs must be 1–3 sentences max.
- Use line breaks for readability.
- Avoid abstract statements like "businesses struggle" or "many people think."
- Use at least one concrete scenario, role, or operational example.
- Avoid clichés and hype language.
- The ending must match the persuasion style required by the angle (not always a sales CTA).

Context:
- Target audience: ${input.audience || 'professionals'}
- Voice/tone: ${input.voice || 'direct and human'}
- Domain/industry: ${input.domain || 'business'}
- Goal: ${GOAL_LABELS[input.goal]}
- Length: ${lengthGuide[input.length]}

Before finalizing:
- Verify the word count meets the minimum requirement.
- If under the minimum, expand with specific examples or clarification.
- If over the maximum, tighten without removing core meaning.

FORMAT REQUIREMENTS:
- Use line breaks between paragraphs (LinkedIn renders these as visible breaks)
- Keep sentences short and punchy
- The hook MUST be compelling enough to make readers click "see more"

IMPORTANT: Write ONLY the post content. No meta-commentary, no "Here's a rewritten version...", no explanations. Just the actual LinkedIn post ready to copy and paste.`;
  }

  // Default: Idea expansion mode
  return `You are a strategic LinkedIn writer who understands platform mechanics.

Write a LinkedIn post that:

- Opens with a strong, specific hook in the first 2 lines.
- Uses short paragraphs (1–3 sentences).
- Uses formatting intentionally (lists only if the angle requires).
- Avoids vague abstractions and corporate phrasing.
- Uses at least one concrete example (role, scenario, number, or timeframe).
- Matches the structural requirements of the selected angle.
- Ends in the style dictated by the angle (not always a CTA).

Context:
- Target audience: ${input.audience || 'professionals'}
- Voice/tone: ${input.voice || 'direct and human'}
- Domain/industry: ${input.domain || 'business'}
- Goal: Get readers to ${input.goal}
- Length: ${lengthGuide[input.length]}

Before finalizing:
- Verify the word count meets the minimum requirement.
- If under the minimum, expand with specific examples or clarification.
- If over the maximum, tighten without removing core meaning.

FORMAT REQUIREMENTS:
- Use line breaks between paragraphs (LinkedIn renders these as visible breaks)
- Keep sentences short and punchy
- The hook MUST be compelling enough to make readers click "see more"
- Include a clear CTA at the end

IMPORTANT: Write ONLY the post content. No meta-commentary, no "Here's a post about...", no explanations. Just the actual LinkedIn post ready to copy and paste.`;
}

function buildAnglePrompt(idea: string, angleKey: string, inputMode: 'idea' | 'content' = 'idea'): string {
  const angle = getAngleByKey(angleKey);
  const angleName = angle?.name || angleKey;
  const angleDesc = angle?.description || '';

  // Instructions for idea expansion mode
  const ideaInstructions: Record<string, string> = {
    'story': `Start with a specific moment in time. Write in first person. Describe one concrete situation. Extract one clear lesson. End reflectively, not with a sales CTA.`,
    'mistake': `Reframe the content around a specific mistake. Show how it happens in practice. Present the correction clearly.`,
    'quick-tip': `Share one actionable tip that readers can implement today. Make it specific and practical.`,
    'myth': `Rewrite using:
            Myth: …
            Reality: …
            Explain why the myth spreads. Ground it in one example.`,
    'tutorial': `Break down how to do this into clear, numbered steps. Make each step actionable.`,
    'before-after': `Reformat the content into a before/after contrast.
            Make both states concrete.
            Highlight the turning point.`,
    'lessons': `Extract 3–5 lessons.
            Each lesson must include an example or scenario.
            Structured and concise.`,
    'misconception': `Lead with “Most people think…”
            Explain the incomplete belief.
            Clarify the deeper truth with one scenario.`,
    'mental-model': `Share a framework or mental model for thinking about this topic differently.`,
    'expert-trap': `Reveal a mistake that even experienced people make. Explain the subtle trap and how to avoid it.`,
    'beginner-explanation': `Explain this concept as if teaching a complete beginner. Use analogies and simple language.`,
    'contrarian': `Rewrite with a strong unpopular claim in the first line.
            Name the common wisdom.
            Refute it with specific reasoning.
            End decisively.`,
    'industry-lie': `Expose something misleading that's commonly promoted in this space. Explain the reality.`,
    'prediction': `Share your informed prediction about where this topic/industry is heading. Back it up.`,
    'status-flip': `Challenge who we typically listen to on this topic. Argue for a different perspective.`,
    'checklist': `Convert the content into a 4–6 item numbered checklist.
            Each item must be specific and tactical.
            Minimal narrative.`,
    'sop-drop': `Share your exact process or system for handling this. Be specific about what you do.`,
    'tool-stack': `Share the specific tools/resources you use and why you chose them.`,
    'automation': `Explain how to automate or systematize something related to this topic.`,
    'failure-story': `Turn the content into a failure narrative.
            Emphasize what went wrong and what changed.`,
    'origin-story': `Tell the story of how you got started with this topic. What drew you in?`,
    'turning-point': `Share the moment that changed how you think about this topic.`,
    'client-mirror': `Share an anonymized story about helping someone with this issue. What did you discover?`,
    'who-not-for': `Rewrite defining who should NOT apply this advice.
            Explain the boundary conditions clearly.`,
    'leverage-lens': `Identify the highest-leverage action someone can take in this area.`,
    'second-order': `Explore the downstream effects and consequences of this idea.`,
    'business-impact': `Reframe the content through measurable business outcomes.
            Reference ROI, time saved, revenue impact, or efficiency gains.`,
    'trend-jack': `Connect this topic to a current trend. What does it mean for readers?`,
    'role-based': `Tailor this advice specifically for a particular role or persona.`,
    'career-angle': `Connect this topic to career growth and advancement.`,
    'competitive-teardown': `Analyze what top performers do differently in this area.`,
  };

  // Instructions for content rewrite mode
  const contentInstructions: Record<string, string> = {
    'story': `Rewrite this content as a personal story. Extract the key insight and frame it through a specific moment or experience.`,
    'mistake': `Rewrite this content focusing on a mistake angle. Frame the key points as lessons from a common mistake.`,
    'quick-tip': `Distill this content into one clear, actionable tip. Make it punchy and immediately useful.`,
    'myth': `Rewrite this content as a myth-busting post. Frame the main point as challenging a common misconception.`,
    'tutorial': `Transform this content into a step-by-step tutorial format. Break down the key actions.`,
    'before-after': `Rewrite this as a before/after transformation story. Show the contrast and change.`,
    'lessons': `Extract 3-5 key lessons from this content and present them as hard-won insights.`,
    'misconception': `Reframe this content around a misconception. Lead with what people get wrong.`,
    'mental-model': `Distill this content into a mental model or framework. Give readers a new lens to see the topic.`,
    'expert-trap': `Reframe this content as an expert trap. What subtle mistake do even experienced people make?`,
    'beginner-explanation': `Simplify this content for beginners. Use analogies and clear, jargon-free language.`,
    'contrarian': `Rewrite this with a contrarian angle. Challenge the conventional wisdom in the original.`,
    'industry-lie': `Reframe this content as exposing an industry lie or misleading practice.`,
    'prediction': `Transform this content into a forward-looking prediction. What does this mean for the future?`,
    'status-flip': `Rewrite this challenging who typically speaks on this topic. Bring a fresh perspective.`,
    'checklist': `Convert this content into a practical checklist format.`,
    'sop-drop': `Transform this into a specific process or SOP format. Make it step-by-step and repeatable.`,
    'tool-stack': `Reframe this content around specific tools or resources. Make it practical.`,
    'automation': `Rewrite focusing on how to automate or systematize the key concepts.`,
    'failure-story': `Reframe this content as a failure story. Add vulnerability and lessons learned.`,
    'origin-story': `Transform this into an origin story format. How did this journey begin?`,
    'turning-point': `Rewrite this as a turning point narrative. What moment changed everything?`,
    'client-mirror': `Reframe this as a client story. Show the problem and solution through someone else's experience.`,
    'who-not-for': `Rewrite this defining who should NOT take this advice. Be specific about exceptions.`,
    'leverage-lens': `Distill this to the single highest-leverage point. What's the 80/20?`,
    'second-order': `Rewrite exploring the downstream effects and consequences of these ideas.`,
    'business-impact': `Reframe this content connecting it to business outcomes and ROI.`,
    'trend-jack': `Connect this content to a current trend. Make it timely and relevant.`,
    'role-based': `Rewrite this tailored specifically for a particular role or persona.`,
    'career-angle': `Reframe this content connecting it to career growth and advancement.`,
    'competitive-teardown': `Rewrite this analyzing what top performers do differently.`,
  };

  const instructions = inputMode === 'content' ? contentInstructions : ideaInstructions;
  const instruction = instructions[angleKey] || `Write about this using the "${angleName}" angle: ${angleDesc}`;

  const contentLabel = inputMode === 'content' ? 'Original Content' : 'Topic/Idea';

  return `${contentLabel}: "${idea}"

Angle: ${angleName}
${instruction}

Write the LinkedIn post now:`;
}

async function callOpenAI(
  apiKey: string,
  messages: OpenAIMessage[]
): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-5.6-sol',
      messages,
      max_completion_tokens: 16000,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${error}`);
  }

  const data: OpenAIResponse = await response.json();
  return data.choices[0]?.message?.content || '';
}

async function callAnthropic(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
      'anthropic-beta': 'server-side-fallback-2026-07-01',
    },
    body: JSON.stringify({
      model: 'claude-opus-5-5',
      max_tokens: 16000,
      output_config: { effort: 'high' },
      fallbacks: 'default',
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Anthropic API error: ${response.status} - ${error}`);
  }

  const data: AnthropicResponse = await response.json();
  if (data.stop_reason === 'refusal') {
    throw new Error('Anthropic declined this request');
  }
  // Opus 5 returns thinking blocks before the answer, so read the text block by type
  return data.content.find((b) => b.type === 'text')?.text || '';
}

function generateId(): string {
  return crypto.randomUUID();
}

/**
 * Generate a single draft using AI.
 */
export async function generateDraftWithAI(
  input: SessionInput,
  angleKey: string,
  settings: Settings
): Promise<Draft> {
  const apiKey = getEffectiveApiKey(settings);
  const systemPrompt = buildSystemPrompt(input);
  const userPrompt = buildAnglePrompt(input.idea, angleKey, input.inputMode || 'idea');

  let text: string;

  if (settings.aiProvider === 'openai') {
    text = await callOpenAI(apiKey, [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ]);
  } else if (settings.aiProvider === 'anthropic') {
    text = await callAnthropic(apiKey, systemPrompt, userPrompt);
  } else {
    throw new Error('No AI provider configured');
  }

  // Clean up the text
  text = text.trim();

  const healthNotes = checkHealth({ text, targetLength: input.length });

  return {
    id: generateId(),
    angleKey,
    text,
    originalText: text,
    wordCount: countWords(text),
    readTime: calculateReadTime(text),
    healthNotes,
    isEdited: false,
    hookStyle: 'contrast' as HookStyle, // AI doesn't use hook styles
  };
}

/**
 * Generate all drafts using AI.
 */
export async function generateDraftsWithAI(
  options: AIGenerateOptions
): Promise<Draft[]> {
  const { input, settings, onProgress } = options;
  const drafts: Draft[] = [];

  for (const angleKey of input.selectedAngles) {
    try {
      onProgress?.(angleKey, 'generating');
      const draft = await generateDraftWithAI(input, angleKey, settings);
      drafts.push(draft);
      onProgress?.(angleKey, 'done');
    } catch (error) {
      console.error(`Failed to generate draft for ${angleKey}:`, error);
      onProgress?.(angleKey, 'error');
      // Create an error placeholder draft
      drafts.push({
        id: generateId(),
        angleKey,
        text: `Failed to generate: ${error instanceof Error ? error.message : 'Unknown error'}`,
        originalText: '',
        wordCount: 0,
        readTime: 0,
        healthNotes: [{ type: 'warning', message: 'Generation failed' }],
        isEdited: false,
        hookStyle: 'contrast' as HookStyle,
      });
    }
  }

  return drafts;
}

/**
 * Regenerate a single draft with AI.
 */
export async function regenerateDraftWithAI(
  input: SessionInput,
  angleKey: string,
  settings: Settings
): Promise<Draft> {
  return generateDraftWithAI(input, angleKey, settings);
}
