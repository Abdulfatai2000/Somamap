export const BODY_SYSTEMS = [
  'head',
  'chest',
  'abdomen',
  'back',
  'waist',
  'left-shoulder',
  'right-shoulder',
  'left-elbow',
  'right-elbow',
  'left-upper-arm',
  'right-upper-arm',
  'left-forearm',
  'right-forearm',
  'left-hand',
  'right-hand',
  'left-thigh',
  'right-thigh',
  'left-knee',
  'right-knee',
  'left-lower-leg',
  'right-lower-leg',
  'left-foot',
  'right-foot'
] as const;

export type BodySystem = typeof BODY_SYSTEMS[number];
