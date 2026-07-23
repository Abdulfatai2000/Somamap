export const BODY_SYSTEMS = [
  'head',
  'chest',
  'abdomen',
  'left-arm',
  'right-arm',
  'left-leg',
  'right-leg',
  'back'
] as const;

export type BodySystem = typeof BODY_SYSTEMS[number];
