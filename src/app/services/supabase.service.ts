import { Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;
  public currentUser = signal<User | null>(null);

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    
    // Check initial session
    this.supabase.auth.getSession().then(({ data: { session } }) => {
      this.currentUser.set(session?.user ?? null);
    });

    // Listen to auth changes
    this.supabase.auth.onAuthStateChange((_event, session) => {
      this.currentUser.set(session?.user ?? null);
    });
  }

  // Helper method to get the initialized client
  public getClient(): SupabaseClient {
    return this.supabase;
  }

  // Auth Methods
  async login(email: string, password: string) {
    return this.supabase.auth.signInWithPassword({ email, password });
  }

  async logout() {
    return this.supabase.auth.signOut();
  }

  async getUserProfile(userId: string) {
    // 1. Fetch user data
    const { data: userData, error: userError } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError) return null;

    // 2. Fetch role
    const { data: roleData } = await this.supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single();

    return {
      ...userData,
      role: roleData?.role || 'driver'
    };
  }
}
