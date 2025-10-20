const API_URLS = {
  auth: 'https://functions.poehali.dev/6905a7bc-aa2a-4cff-8db9-d7bfc09014c3',
  creatures: 'https://functions.poehali.dev/13de1bf1-74b0-4733-afe5-66dd5a4f24eb',
  shop: 'https://functions.poehali.dev/d29c82a5-c005-4029-9533-33804564c3a1',
  feedback: 'https://functions.poehali.dev/51e4fe58-febf-4cb8-aeab-17f10ff73922',
  premium: 'https://functions.poehali.dev/4a561bc3-6393-403b-ad7b-4da5bc5c01e2'
};

export interface User {
  id: number;
  email: string;
  username: string;
  insectomix_balance: number;
  is_premium: boolean;
  premium_until?: string;
}

export interface Creature {
  id: number;
  name: string;
  latin_name: string;
  category: string;
  description: string;
  habitat?: string;
  diet?: string;
  size_info?: string;
  lifespan?: string;
  conservation_status?: string;
  image_url?: string;
  premium_content?: string;
}

export interface ShopItem {
  id: number;
  name: string;
  description: string;
  price: number;
  effect: string;
  icon_name: string;
  owned: number;
}

export const api = {
  async register(email: string, password: string, username: string): Promise<User> {
    const response = await fetch(API_URLS.auth, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'register', email, password, username })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Registration failed');
    return data.user;
  },

  async login(email: string, password: string): Promise<User> {
    const response = await fetch(API_URLS.auth, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', email, password })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Login failed');
    return data.user;
  },

  async getCreatures(params?: { category?: string; search?: string; userId?: number }): Promise<{ creatures: Creature[]; is_premium: boolean }> {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.append('category', params.category);
    if (params?.search) searchParams.append('search', params.search);
    
    const headers: Record<string, string> = {};
    if (params?.userId) headers['X-User-Id'] = params.userId.toString();
    
    const response = await fetch(`${API_URLS.creatures}?${searchParams}`, { headers });
    const data = await response.json();
    return data;
  },

  async getCreature(id: number, userId?: number): Promise<Creature> {
    const headers: Record<string, string> = {};
    if (userId) headers['X-User-Id'] = userId.toString();
    
    const response = await fetch(`${API_URLS.creatures}?id=${id}`, { headers });
    const data = await response.json();
    return data;
  },

  async getShopItems(userId?: number): Promise<ShopItem[]> {
    const headers: Record<string, string> = {};
    if (userId) headers['X-User-Id'] = userId.toString();
    
    const response = await fetch(API_URLS.shop, { headers });
    const data = await response.json();
    return data.items;
  },

  async purchaseItem(userId: number, itemId: number): Promise<{ success: boolean; new_balance: number }> {
    const response = await fetch(API_URLS.shop, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, item_id: itemId })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Purchase failed');
    return data;
  },

  async submitFeedback(email: string, message: string): Promise<void> {
    const response = await fetch(API_URLS.feedback, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, message })
    });
    if (!response.ok) throw new Error('Failed to submit feedback');
  },

  async activatePremium(userId: number): Promise<{ premium_until: string; bonus_insectomix: number }> {
    const response = await fetch(API_URLS.premium, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to activate premium');
    return data;
  }
};
