import { GoalType } from '../types';
import { pickRandom } from '../lib/rng';

interface CTAConfig {
  goal: GoalType;
  audience: string;
  rng: () => number;
}

// CTA templates organized by goal
const ctaTemplates: Record<GoalType, string[]> = {
  learn: [
    'What part of this feels most relevant to your situation?',
    'Where does this show up in your business right now?',
    'Which piece of this do you disagree with?',
    'What would you add based on your experience?',
    'Curious how others are thinking about this.',
    'What aspect of this resonates most with your experience?',
    'Which of these points would you like me to expand on?',
    'What questions do you have about applying this?',
    'Have you tried any of these approaches? I would love to hear what worked.',
    'Comment below with your biggest challenge in this area.',
  ],
  save: [
    'Keep this in your back pocket for the next time this shows up.',
    'Worth saving before your next planning session.',
    'You will want this when things get messy.',
    'Save this. It is easier to apply than to remember.',
    'Bookmark this for the next time you revisit this system.',
    'Save this for your next planning session.',
    'Bookmark this and revisit it when you need it.',
    'Save this post. You will want to reference it later.',
    'Keep this handy. It is a framework you can reuse.',
    'This is one to save for when you hit this problem.',
  ],
  share: [
    'If this hits, pass it along.',
    'Tag someone who is overcomplicating this.',
    'Repost if this matches what you are seeing.',
    'Would love to see your take on this.',
    'Who in your network needs this reminder?',
    'Know someone who needs to hear this? Tag them below.',
    'Share this with a colleague who could use it.',
    'Repost this if it resonated. Someone in your network needs it.',
    'Pass this along to someone starting out.',
    'Share your own take on this in the comments.',
  ],
  follow: [
    'I write about this regularly. Stay close if this is your lane.',
    'More breakdowns like this coming.',
    'If you value operator-level thinking, follow along.',
    'I will keep sharing what actually works.',
    'There is more where this came from.',
    'Follow me for more practical insights like this.',
    'I share content like this weekly. Follow to stay updated.',
    'Hit follow if you found this useful. More coming.',
    'Follow along for more actionable frameworks.',
    'I post about this topic regularly. Follow for more.',
  ],
  dm: [
    'If this feels familiar, send me a note.',
    'Happy to look at your setup if you want a second set of eyes.',
    'Reach out if you want to pressure test this in your business.',
    'Message me if you are stuck in this exact spot.',
    'If you want to go deeper on this, we can.',
    'DM me "START" if you want my full breakdown on this.',
    'Send me a message if you want to discuss your specific situation.',
    'Drop me a DM and let me know what you are working on.',
    'Message me if you want to go deeper on this.',
    'My DMs are open if you have questions.',
  ],
  buy: [
    'If you want help implementing this properly, that is what I do.',
    'There is a full system behind this. Happy to walk you through it.',
    'If you are serious about fixing this, we should talk.',
    'This is solvable. The question is whether you want it solved.',
    'If you want this built correctly, reach out.',
    'Ready to implement this? Link in bio for the full guide.',
    'Want the complete framework? Check the link in my profile.',
    'I put together a detailed resource on this. Link in bio.',
    'If you want the step-by-step version, see my profile.',
    'Full implementation guide available. Check my profile link.',
  ],
};

/**
 * Generate a CTA based on goal.
 */
export function generateCTA(config: CTAConfig): string {
  const { goal, rng } = config;
  const templates = ctaTemplates[goal];
  return pickRandom(templates, rng);
}

/**
 * Get all available goals.
 */
export function getGoals(): GoalType[] {
  return ['learn', 'save', 'share', 'follow', 'dm', 'buy'];
}
