// Shared result shape for all server actions.
// (The old generic registerUser action was deleted — signups go through
// registerParent and applyAsNanny, which also create the role's profile.)
export type ActionResult = {
  success: boolean;
  error?: string;
  data?: any;
};
