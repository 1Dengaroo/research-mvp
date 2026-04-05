jest.mock('@/lib/supabase/server', () => ({ requireAuth: jest.fn() }));
jest.mock('@/lib/route-utils', () => ({
  ...jest.requireActual('@/lib/route-utils'),
  requireEnvVars: jest.fn()
}));
jest.mock('@/lib/services/people', () => ({
  ...jest.requireActual('@/lib/services/people'),
  bulkSearchPeople: jest.fn()
}));

import { POST } from '@/app/api/people/bulk/route';
import { requireAuth } from '@/lib/supabase/server';
import { requireEnvVars } from '@/lib/route-utils';
import { bulkSearchPeople } from '@/lib/services/people';
import { mockAuthSuccess, mockAuthFailure, expectError } from '@/tests/helpers';

const mockAuth = requireAuth as jest.MockedFunction<typeof requireAuth>;
const mockEnvVars = requireEnvVars as jest.MockedFunction<typeof requireEnvVars>;
const mockBulk = bulkSearchPeople as jest.MockedFunction<typeof bulkSearchPeople>;

beforeEach(() => {
  jest.clearAllMocks();
  mockEnvVars.mockReturnValue(null);
});

describe('POST /api/people/bulk', () => {
  it('returns 401 when unauthenticated', async () => {
    mockAuth.mockResolvedValue(mockAuthFailure());
    const req = new Request('http://localhost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ companies: [{ name: 'Acme', apollo_org_id: 'org1' }] })
    });
    expect((await POST(req as never)).status).toBe(401);
  });

  it('returns results mapped by company', async () => {
    mockAuth.mockResolvedValue(mockAuthSuccess());
    mockBulk.mockResolvedValue([{ company_name: 'Acme', people: [] }]);

    const req = new Request('http://localhost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ companies: [{ name: 'Acme', apollo_org_id: 'org1' }] })
    });

    const body = await (await POST(req as never)).json();
    expect(body.results).toHaveLength(1);
    expect(body.results[0].company_name).toBe('Acme');
    expect(body.results[0].people).toEqual([]);
  });

  it('returns 500 on service error', async () => {
    mockAuth.mockResolvedValue(mockAuthSuccess());
    mockBulk.mockRejectedValue(new Error('fail'));

    const req = new Request('http://localhost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ companies: [{ name: 'A', apollo_org_id: '1' }] })
    });

    await expectError(await POST(req as never), 500, 'INTERNAL_ERROR');
  });
});
