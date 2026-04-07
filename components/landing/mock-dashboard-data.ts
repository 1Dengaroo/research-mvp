export const COMPANIES = [
  {
    name: 'Ashby',
    industry: 'Recruiting',
    funding: '$30M Series C',
    score: 9,
    matchReason: 'Building out data infrastructure, posted Snowflake roles',
    signals: [
      { type: 'job_posting', title: 'Data Engineer role mentions Snowflake, dbt' },
      { type: 'funding', title: 'Closed Series C with Benchmark' }
    ]
  },
  {
    name: 'Lattice',
    industry: 'HR Tech',
    funding: '$328M Series F',
    score: 8,
    matchReason: 'Expanding into EMEA, building new sales org from scratch',
    signals: [{ type: 'news', title: 'Opened London office, hiring EMEA sales lead' }]
  },
  {
    name: 'Ramp',
    industry: 'Fintech',
    funding: '$300M Series D',
    score: 9,
    matchReason: 'Tripled headcount in 6 months, retooling outbound stack',
    signals: [
      { type: 'job_posting', title: 'Posted 6 BDR roles in the last 2 weeks' },
      { type: 'funding', title: 'Raised $300M at $16B valuation' }
    ]
  }
];

export const CONTACTS = [
  {
    name: 'David Kim',
    title: 'VP of Sales',
    company: 'Ashby',
    email: 'david.k@ashby.com',
    enriched: true,
    hasLinkedIn: true
  },
  {
    name: 'Sarah Chen',
    title: 'Head of Growth',
    company: 'Lattice',
    email: 'sarah.c@lattice.com',
    enriched: true,
    hasLinkedIn: true
  },
  {
    name: 'James Park',
    title: 'VP of Sales',
    company: 'Ramp',
    email: 'james.p@ramp.com',
    enriched: false,
    hasLinkedIn: false
  },
  {
    name: 'Nina Patel',
    title: 'Director of Revenue Ops',
    company: 'Ashby',
    email: 'nina.p@ashby.com',
    enriched: false,
    hasLinkedIn: false
  },
  {
    name: 'Alex Rivera',
    title: 'Head of Partnerships',
    company: 'Ramp',
    email: 'alex.r@ramp.com',
    enriched: true,
    hasLinkedIn: true
  },
  {
    name: 'Tom Zhang',
    title: 'SDR Manager',
    company: 'Lattice',
    email: 'tom.z@lattice.com',
    enriched: false,
    hasLinkedIn: false
  }
];

/*
 * Emails match the Remes generation prompt:
 * - Plain text, no formatting
 * - Short paragraphs (1-2 sentences)
 * - Signal-led opener
 * - Email 1: 60-80 words, Email 2: under 45 words, Email 3: under 60 words
 * - Sign off with first name only
 * - No forbidden phrases
 */
export const EMAILS = [
  {
    subject: "ramp's bdr hiring spree",
    body: 'Hi James,\n\nSaw Ramp posted 6 BDR roles in the last two weeks. Tripling outbound headcount after a $300M raise usually means pipeline targets just got aggressive.\n\nWe built Remes to detect signals like yours and write the first email automatically. One customer went from 0 to 47 qualified meetings in their first month.\n\nWorth a quick look?\n\nKenny'
  },
  {
    subject: "Re: ramp's bdr hiring spree",
    body: 'Hi James,\n\nQuick follow-up. Teams like Ashby and Lattice use Remes to cut their prospecting time by 80%. Figured it might be relevant as you scale the BDR org.\n\nKenny'
  },
  {
    subject: "Re: ramp's bdr hiring spree",
    body: 'Hi James,\n\nDifferent angle: most BDR teams spend 60% of their day researching accounts instead of selling. Remes handles the research and writes the first touch so reps can focus on conversations from day one.\n\nWould it help to see how the signal detection works?\n\nKenny'
  }
];

export const REGEN_EMAILS = [
  {
    subject: "ramp's outbound overhaul",
    body: 'Hi James,\n\nNoticed Ramp just posted 6 BDR roles back to back. When teams scale that fast, the bottleneck usually shifts from hiring to pipeline quality.\n\nRemes catches buying signals like yours and drafts the first email so reps can start selling on day one instead of researching. Happy to show you how it works in 15 min.\n\nKenny'
  },
  {
    subject: 'scaling bdrs at ramp',
    body: 'Hi James,\n\nRamp tripling its BDR team caught my eye. Most orgs at that stage find their reps spend more time researching than actually reaching out.\n\nWe automate the research and first-touch for teams exactly like yours. One customer booked 47 meetings in month one. Worth a look?\n\nKenny'
  },
  {
    subject: 'a faster ramp-up for ramp',
    body: 'Hi James,\n\nWhen a team goes from 2 to 6 BDRs overnight, onboarding speed becomes the real constraint. Remes gives new reps qualified accounts and ready-to-send emails from their first day.\n\nWould it be useful to see how signal detection works for a fintech ICP?\n\nKenny'
  },
  {
    subject: 're: outbound at scale',
    body: 'Hi James,\n\nQuick thought: the biggest risk with rapid BDR hiring is inconsistent messaging. Remes keeps every first touch on-brand and signal-relevant so quality stays high even as you scale.\n\n15 min walkthrough work this week?\n\nKenny'
  }
];
