/**
 * Angle-specific templates for draft generation.
 *
 * Placeholders:
 * - {{hook}} - Generated hook text
 * - {{cta}} - Generated call-to-action
 * - {{idea}} - The user's original idea
 * - {{audience}} - Target audience
 * - {{insight.thesis}} - Core thesis statement
 * - {{insight.example}} - Concrete example
 * - {{insight.counterpoint}} - Alternative perspective
 * - {{insight.nextStep}} - Actionable takeaway
 * - {{bullets}} - 3 supporting bullets as list
 * - {{pick:a|b|c}} - Random selection from options
 */

export const angleTemplates: Record<string, string> = {
  // Base Angles
  'story': `{{hook}}

{{insight.example}}

{{pick:Here is what I learned|The takeaway|What this taught me}}:

{{bullets}}

{{insight.nextStep}}

{{cta}}`,

  'mistake': `{{hook}}

I made this mistake {{pick:early in my career|last year|more times than I would like to admit}}:

{{insight.counterpoint}}

{{pick:Here is what I should have done|The fix was simple|What actually works}}:

{{bullets}}

{{insight.nextStep}}

{{cta}}`,

  'quick-tip': `{{hook}}

{{insight.thesis}}

{{pick:Try this|Here is the hack|Quick win}}:

{{bullets}}

{{cta}}`,

  'myth': `{{hook}}

{{pick:The myth|What people believe|The assumption}}: {{insight.counterpoint}}

{{pick:The reality|What actually happens|The truth}}:

{{bullets}}

{{insight.nextStep}}

{{cta}}`,

  'tutorial': `{{hook}}

{{pick:Here is how to do it|Step by step|The process}}:

{{bullets}}

{{pick:Pro tip|Bonus|Extra step}}: {{insight.nextStep}}

{{cta}}`,

  'before-after': `{{hook}}

BEFORE:
{{insight.counterpoint}}

AFTER:
{{insight.thesis}}

What changed:

{{bullets}}

{{cta}}`,

  'lessons': `{{hook}}

{{pick:After years of|Looking back on|Reflecting on}} {{idea}}, here is what I know now:

{{bullets}}

{{insight.thesis}}

{{cta}}`,

  // Cognitive Angles
  'misconception': `{{hook}}

The misconception: {{insight.counterpoint}}

{{pick:What most people miss|The nuance|The reality}}:

{{bullets}}

{{insight.nextStep}}

{{cta}}`,

  'mental-model': `{{hook}}

{{pick:A framework for thinking about|How I approach|The mental model for}} {{idea}}:

{{insight.thesis}}

{{bullets}}

{{insight.nextStep}}

{{cta}}`,

  'expert-trap': `{{hook}}

Even experienced professionals fall into this trap: {{insight.counterpoint}}

The problem is subtle:

{{bullets}}

{{insight.nextStep}}

{{cta}}`,

  'beginner-explanation': `{{hook}}

{{pick:Let me break this down|Here is the simple version|Think of it this way}}:

{{insight.thesis}}

The key parts:

{{bullets}}

{{insight.nextStep}}

{{cta}}`,

  // Power & Positioning Angles
  'contrarian': `{{hook}}

{{pick:Controversial take|Unpopular opinion|Against the grain}}: {{insight.thesis}}

Why I believe this:

{{bullets}}

{{insight.example}}

{{cta}}`,

  'industry-lie': `{{hook}}

{{pick:The industry sells|You have been told|The popular narrative}}: {{insight.counterpoint}}

The reality:

{{bullets}}

{{insight.nextStep}}

{{cta}}`,

  'prediction': `{{hook}}

{{pick:Here is what I see coming|My prediction|What the next few years hold}}:

{{insight.thesis}}

The signals:

{{bullets}}

{{insight.nextStep}}

{{cta}}`,

  'status-flip': `{{hook}}

{{pick:We have it backwards|The hierarchy is wrong|Rethink who you listen to}}:

{{insight.counterpoint}}

{{pick:Who actually knows|The real experts|Where wisdom lives}}:

{{bullets}}

{{cta}}`,

  // Tactical Angles
  'checklist': `{{hook}}

{{pick:Your checklist|The essentials|What to check}} for {{idea}}:

{{bullets}}

{{pick:Bonus item|Do not forget|One more thing}}: {{insight.nextStep}}

{{cta}}`,

  'sop-drop': `{{hook}}

{{pick:My exact process|How I actually do it|The SOP}} for {{idea}}:

{{bullets}}

{{insight.example}}

{{cta}}`,

  'tool-stack': `{{hook}}

{{pick:The tools I use|My stack|What actually works}} for {{idea}}:

{{bullets}}

{{pick:Why this combo works|The secret sauce|What ties it together}}: {{insight.thesis}}

{{cta}}`,

  'automation': `{{hook}}

{{pick:How to automate|Set it and forget it|The automation}} for {{idea}}:

{{bullets}}

Time saved: {{pick:hours per week|significant|more than you think}}.

{{insight.nextStep}}

{{cta}}`,

  // Narrative Angles
  'failure-story': `{{hook}}

{{insight.example}}

{{pick:What went wrong|The mistake|Where I failed}}:

{{insight.counterpoint}}

{{pick:The lesson|What I learned|The silver lining}}:

{{bullets}}

{{cta}}`,

  'origin-story': `{{hook}}

{{pick:How I got started with|My journey into|The beginning of}} {{idea}}:

{{insight.example}}

What I wish I knew then:

{{bullets}}

{{cta}}`,

  'turning-point': `{{hook}}

{{pick:The moment everything changed|When it clicked|The shift}}:

{{insight.example}}

Before: {{insight.counterpoint}}

After: {{insight.thesis}}

{{cta}}`,

  'client-mirror': `{{hook}}

A {{pick:client|team|company}} came to me with this challenge:

{{insight.counterpoint}}

What we discovered:

{{bullets}}

{{insight.nextStep}}

{{cta}}`,

  // Strategic Angles
  'who-not-for': `{{hook}}

This approach to {{idea}} is NOT for you if:

{{bullets}}

{{pick:Who it IS for|If this resonates|The right fit}}:

{{insight.thesis}}

{{cta}}`,

  'leverage-lens': `{{hook}}

The highest-leverage action for {{idea}}:

{{insight.thesis}}

Why this matters more than everything else:

{{bullets}}

{{insight.nextStep}}

{{cta}}`,

  'second-order': `{{hook}}

{{pick:The downstream effects|What happens next|The ripple effects}} of {{idea}}:

First order: {{insight.thesis}}

Second order:

{{bullets}}

{{pick:The implication|What this means|Bottom line}}: {{insight.nextStep}}

{{cta}}`,

  'business-impact': `{{hook}}

{{pick:The business case for|Why leadership cares about|The ROI of}} {{idea}}:

{{insight.thesis}}

The measurable impacts:

{{bullets}}

{{insight.example}}

{{cta}}`,

  // Social & Market Angles
  'trend-jack': `{{hook}}

{{pick:Everyone is talking about|The current trend in|What is happening with}} this. Here is the connection to {{idea}}:

{{insight.thesis}}

{{pick:What this means for you|How to position|The opportunity}}:

{{bullets}}

{{cta}}`,

  'role-based': `{{hook}}

{{pick:If you are a|For|Specifically for}} {{audience}}:

{{insight.thesis}}

Your action items:

{{bullets}}

{{insight.nextStep}}

{{cta}}`,

  'career-angle': `{{hook}}

{{pick:Want to level up|Looking to advance|Building your career}}? Master {{idea}}.

Why this skill matters:

{{bullets}}

{{insight.example}}

{{insight.nextStep}}

{{cta}}`,

  'competitive-teardown': `{{hook}}

{{pick:What top performers do differently|The pattern among leaders|What separates good from great}} with {{idea}}:

{{insight.thesis}}

The patterns:

{{bullets}}

{{insight.nextStep}}

{{cta}}`,
};
