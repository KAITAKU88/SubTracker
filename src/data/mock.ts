import { Subscription } from '../types/subscription';

export const mockSubscriptions: Subscription[] = [
  {
    id: '1',
    name: 'Lovable Pro',
    amount: 25,
    currency: 'USD',
    cycle: 'monthly',
    purchaseDate: '2026-06-10',
    color: '#9D7BFF',
    createdAt: '2026-01-10',
  },
  {
    id: '2',
    name: 'Claude',
    amount: 20,
    currency: 'USD',
    cycle: 'monthly',
    purchaseDate: '2026-06-19',
    color: '#F5A623',
    createdAt: '2026-02-19',
  },
  {
    id: '3',
    name: 'Spotify',
    amount: 59000,
    currency: 'VND',
    cycle: 'monthly',
    purchaseDate: '2026-06-25',
    color: '#7DD87D',
    createdAt: '2026-03-25',
  },
];
