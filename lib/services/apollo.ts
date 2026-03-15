import type { TargetContact } from '@/lib/types';

const APOLLO_BASE = 'https://api.apollo.io/api/v1';

function getApiKey() {
  const key = process.env.APOLLO_API_KEY;
  if (!key) throw new Error('APOLLO_API_KEY is not set');
  return key;
}

export async function findContact(
  companyName: string,
  targetTitles: string[] = ['VP', 'Head', 'Director', 'CTO', 'CEO', 'Founder']
): Promise<TargetContact | null> {
  const apiKey = getApiKey();

  const params = new URLSearchParams();
  params.append('q_organization_name', companyName);
  for (const title of targetTitles.slice(0, 3)) {
    params.append('person_titles[]', title);
  }
  params.append('per_page', '3');
  params.append('page', '1');

  const response = await fetch(`${APOLLO_BASE}/mixed_people/api_search?${params}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'x-api-key': apiKey
    }
  });

  if (!response.ok) {
    console.error(`Apollo search failed for ${companyName}: ${response.status}`);
    return null;
  }

  const data = await response.json();
  const people = data.people;

  if (!people || people.length === 0) return null;

  const person = people[0];
  return {
    name: [person.first_name, person.last_name || person.last_name_obfuscated]
      .filter(Boolean)
      .join(' '),
    title: person.title || 'Unknown',
    linkedin_url: person.linkedin_url || null
  };
}
