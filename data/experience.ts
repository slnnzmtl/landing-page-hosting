import type { ClaimSource, WorkCard } from './homepage'

const linkedInProfile: ClaimSource = {
  origin: 'https://www.linkedin.com/in/daniel-kazansky/',
  status: 'approved',
  note: 'Public LinkedIn profile attached to DDD-157. Used as the public CV and source for published professional experience roles.',
}

const ticket167: ClaimSource = {
  origin: 'https://linear.app/ddd7486/issue/DDD-167/add-enterprise-work-track-and-sanitized-experience-case-studies',
  status: 'approved',
  note:
    'Sanitized enterprise marketplace, analytics, and subscription commerce framing from DDD-167; approved public metrics: 20% faster merchant setup, 25% higher AI-assisted onboarding completion for 500+ users, 15% lower payment abandonment.',
}

/** Full professional role writeups shown on /experience; homepage cards stay condensed. */
export const experienceRoles: WorkCard[] = [
  {
    slug: 'upwork-reputation-team',
    title: 'Senior Software Engineer (Reputation Team)',
    subtitle: 'Upwork · Jan 2025 – May 2026 · Remote',
    icon: '/images/experience/upwork.png',
    iconAlt: 'Upwork',
    summary:
      'Embedded long-term contractor building marketplace reputation and enforcement UI for tens of millions of active users. Owned high-impact product domains end-to-end and maintained PagerDuty on-call operational responsibility.\n\n- Core Feature Ownership: Successfully launched the Partner Certified Skills Program and the Freelancer Aggregated Strengths reputation engine across multiple high-traffic surfaces (Profiles, Search, Onboarding).\n\n- System Migration: Contributed to the platform-wide overhaul of the Job Success Dashboard, transitioning to a new evaluation model.\n\n- Technical Modernization: Led code refactoring efforts migrating legacy UI modules from Vue 2 to Vue 3 to optimize application architecture.\n\n- Engineering Productivity: Designed an AI development workflow utilizing Cursor, Claude Code, and MCP integrations (Figma, Linear, GitHub, Confluence) to improve engineering velocity and feature throughput.',
    source: linkedInProfile,
    tags: ['Vue 3', 'TypeScript', 'Cursor', 'MCP'],
  },
  {
    slug: 'subbly-senior-software-developer',
    title: 'Senior Software Developer',
    subtitle: 'Subbly® · Full-time · Nov 2023 – Dec 2024 · Remote',
    icon: '/images/experience/subbly.png',
    iconAlt: 'Subbly',
    summary:
      'Refactored subscription setup UX, reducing merchant setup time by 20%, and developed an AI-powered onboarding chatbot, improving completion rates by 25% for 500+ users.\nOptimized cart and payment flows, cutting abandonment by 15%, and built a custom design system for flexibility.',
    source: ticket167,
    tags: ['TypeScript', 'Vue'],
  },
  {
    slug: 'capgemini-software-developer',
    title: 'Software Developer',
    subtitle: 'Capgemini Engineering · Full-time · Jun 2022 – May 2023 · Remote',
    icon: '/images/experience/capgemini.png',
    iconAlt: 'Capgemini Engineering',
    summary:
      'Developed a big data analytics system with React, TypeScript, and Redux, managing 10M+ data points over HTTP.\nBuilt interactive dashboards in a monorepo setup with Lerna, enabling efficient marketing and forecasting for enterprise clients.',
    source: linkedInProfile,
    tags: ['Redux', 'React', 'TypeScript'],
  },
]

export function publishedExperienceRoles(roles: WorkCard[] = experienceRoles): WorkCard[] {
  return roles.filter(role => role.source.status === 'approved')
}
