import { describe, it, vi } from 'vitest';

describe('infra', function infra() {
  // EXAMPLE: You can increase API timeout for slow API calls
  vi.setConfig({ testTimeout: 5000 });

  describe('infra', () => {
    it('does nothing', () => undefined);
  });
});
