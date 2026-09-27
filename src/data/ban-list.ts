export interface BannedPhrase {
  phrase: string;
  suggestion?: string;
}

export const bannedPhrases: BannedPhrase[] = [
  // Overused hype & LinkedIn clichés
  { phrase: 'game changer', suggestion: 'significant shift' },
  { phrase: 'game-changer', suggestion: 'significant shift' },
  { phrase: 'let that sink in', suggestion: '(remove)' },
  { phrase: "i'll say it again", suggestion: '(remove)' },
  { phrase: 'unpopular opinion', suggestion: 'my take' },
  { phrase: 'hot take', suggestion: 'my perspective' },
  { phrase: 'read that again', suggestion: '(remove)' },
  { phrase: 'if this resonates', suggestion: '(remove or rephrase)' },
  { phrase: 'buckle up', suggestion: '(remove)' },
  { phrase: "here's the thing", suggestion: '(start with the actual point)' },
  { phrase: 'let me be honest', suggestion: '(just state it)' },
  { phrase: 'the truth is', suggestion: '(state it directly)' },
  { phrase: 'at the end of the day', suggestion: 'ultimately' },
  { phrase: 'deep dive', suggestion: 'detailed look' },
  { phrase: 'level up', suggestion: 'improve' },
  { phrase: 'thought leader', suggestion: 'expert' },
  { phrase: 'synergy', suggestion: 'collaboration' },
  { phrase: 'circle back', suggestion: 'revisit' },
  { phrase: 'low-hanging fruit', suggestion: 'easy win' },
  { phrase: 'move the needle', suggestion: 'create impact' },
  { phrase: 'value add', suggestion: 'benefit' },
  { phrase: 'paradigm shift', suggestion: 'major change' },
  { phrase: 'take it to the next level', suggestion: 'improve significantly' },
  { phrase: 'disrupt', suggestion: 'change' },
  { phrase: 'leverage', suggestion: 'use' },
  { phrase: 'pivot', suggestion: 'change direction' },
  { phrase: 'bandwidth', suggestion: 'time' },
  { phrase: 'alignment', suggestion: 'agreement' },
  { phrase: 'touch base', suggestion: 'connect' },
  { phrase: 'unpack', suggestion: 'explain' },
  { phrase: 'double down', suggestion: 'focus more on' },
  { phrase: 'boil the ocean', suggestion: 'try to do too much' },
  { phrase: 'bleeding edge', suggestion: 'newest' },
  { phrase: 'best in class', suggestion: 'excellent' },
  { phrase: 'ecosystem', suggestion: 'environment' },
  { phrase: 'scalable', suggestion: 'can grow' },
  { phrase: 'revolutionary', suggestion: 'new' },
  { phrase: 'crushing it', suggestion: 'doing well' },
  { phrase: 'killing it', suggestion: 'doing well' },
  { phrase: 'hustle', suggestion: 'work hard' },
  { phrase: 'grind', suggestion: 'work' },

  // AI-era fluff & template voice
  { phrase: 'in today’s fast-paced world', suggestion: '(remove)' },
  { phrase: 'in today’s world', suggestion: '(remove)' },
  { phrase: 'now more than ever', suggestion: '(remove)' },
  { phrase: 'the future of', suggestion: '(be specific)' },
  { phrase: 'unlock the power of', suggestion: '(be concrete)' },
  { phrase: 'harness the power of', suggestion: '(be concrete)' },
  { phrase: 'cutting-edge', suggestion: 'advanced' },
  { phrase: 'seamless', suggestion: 'smooth' },
  { phrase: 'robust', suggestion: 'strong' },
  { phrase: 'holistic', suggestion: 'complete' },
  { phrase: 'world-class', suggestion: 'high quality' },

  // Fake vulnerability patterns
  { phrase: 'i was blown away', suggestion: '(be specific)' },
  { phrase: 'mind blown', suggestion: '(be specific)' },
  { phrase: 'this blew my mind', suggestion: '(be specific)' },
  { phrase: 'never again', suggestion: '(explain consequence)' },

  // Engagement bait & spam triggers
  { phrase: 'drop a comment', suggestion: '(ask a real question)' },
  { phrase: 'smash the like button', suggestion: '(remove)' },
  { phrase: 'comment below', suggestion: '(rephrase naturally)' },
  { phrase: 'link in bio', suggestion: '(be direct instead)' },
  { phrase: 'tag someone who', suggestion: '(use sparingly)' },

  // Weak filler
  { phrase: 'very important', suggestion: '(show why)' },
  { phrase: 'really important', suggestion: '(show why)' },
  { phrase: 'super important', suggestion: '(show why)' },
  { phrase: 'a lot of', suggestion: 'many or specific number' },
  { phrase: 'things', suggestion: 'be specific' },
];