import Fuse from 'fuse.js';
import { supabase } from '../lib/supabase';
import { unifiedDataService } from './unifiedDataService';

export interface SearchResult {
  id: string;
  label: string;
  type: string;
  route: string;
}

// Configure Fuse for client-side search
const fuseOptions: Fuse.IFuseOptions<any> = {
  keys: ['label'],
  threshold: 0.3,
  distance: 100,
  includeScore: true
};

export async function searchAll(query: string): Promise<SearchResult[]> {
  // If no query, return empty
  if (!query || query.trim().length === 0) return [];

  // Production environment: use Supabase full-text search
  if (import.meta.env.PROD) {
    const results: SearchResult[] = [];

    // Properties
    const { data: props, error: propError } = await supabase
      .from('properties')
      .select('id, title')
      .textSearch('search_index', query, { config: 'english', type: 'websearch' })
      .limit(5);
    if (!propError && props) {
      props.forEach(p => results.push({ id: p.id, label: p.title, type: 'Property', route: `/properties/${p.id}` }));
    }

    // Contacts
    const { data: contacts, error: contactError } = await supabase
      .from('contacts')
      .select('id, name')
      .textSearch('search_index', query, { config: 'english', type: 'websearch' })
      .limit(5);
    if (!contactError && contacts) {
      contacts.forEach(c => results.push({ id: c.id, label: c.name, type: 'Contact', route: `/contacts/${c.id}` }));
    }

    // Agents
    const { data: agents, error: agentError } = await supabase
      .from('agents')
      .select('id, name: agent_name')
      .textSearch('search_index', query, { config: 'english', type: 'websearch' })
      .limit(5);
    if (!agentError && agents) {
      agents.forEach(a => results.push({ id: a.id, label: a.name, type: 'Agent', route: `/agents/${a.id}` }));
    }

    // Deals
    const { data: deals, error: dealError } = await supabase
      .from('deals')
      .select('id, title')
      .textSearch('search_index', query, { config: 'english', type: 'websearch' })
      .limit(5);
    if (!dealError && deals) {
      deals.forEach(d => results.push({ id: d.id, label: d.title, type: 'Deal', route: `/deals/${d.id}` }));
    }

    // Return top 20 combined
    return results.slice(0, 20);
  }

  // Development: fetch all and run Fuse
  const [props, contacts, agents, deals] = await Promise.all([
    unifiedDataService.getProperties(),
    unifiedDataService.getContacts(),
    Promise.resolve(unifiedDataService.getAgents()),
    Promise.resolve(unifiedDataService.getDeals())
  ]);

  const items = [
    ...props.map(p => ({ id: p.id, label: p.title, type: 'Property', route: `/properties/${p.id}` })),
    ...contacts.map(c => ({ id: c.id, label: c.name, type: 'Contact', route: `/contacts/${c.id}` })),
    ...agents.map(a => ({ id: a.id, label: a.name, type: 'Agent', route: `/agents/${a.id}` })),
    ...deals.map(d => ({ id: d.id, label: d.title, type: 'Deal', route: `/deals/${d.id}` }))
  ];

  const fuse = new Fuse(items, fuseOptions);
  const fuseResults = fuse.search(query, { limit: 20 });

  return fuseResults.map(r => ({ id: r.item.id, label: r.item.label, type: r.item.type, route: r.item.route }));
} 