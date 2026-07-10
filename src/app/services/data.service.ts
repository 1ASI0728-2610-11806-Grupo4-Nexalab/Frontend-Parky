import { Injectable, signal, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'conductor' | 'propietario' | 'both';
  avatarUrl: string;
  reputation: number;
  isVerified: boolean;
  memberSince: string;
}

export interface Garage {
  id: string;
  ownerId: string;
  address: string;
  district: string;
  pricePerHour: number;
  coordinates: { lat: number; lng: number };
  rating: number;
  features: string[];
  imageUrl: string;
  isAvailable: boolean;
}

export interface Vehicle {
  id: string;
  ownerId: string;
  brand: string;
  model: string;
  color: string;
  type: string;
  plate: string;
}

export interface Reservation {
  id: string;
  driverId: string;
  garageId: string;
  startTime: string;
  endTime: string;
  status: 'active' | 'completed' | 'cancelled';
  totalPrice: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isAiGenerated?: boolean;
}

export interface ChatThread {
  id: string;
  participant: Partial<User>;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: ChatMessage[];
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // Mock Data
  private initialUsers: User[] = [
    {
      id: 'u1',
      name: 'Carlos Mendoza',
      email: 'carlos@example.com',
      role: 'conductor',
      avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
      reputation: 4.9,
      isVerified: true,
      memberSince: 'Octubre 2023'
    },
    {
      id: 'u2',
      name: 'Laura G.',
      email: 'laura@example.com',
      role: 'propietario',
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80',
      reputation: 4.9,
      isVerified: true,
      memberSince: 'Enero 2023'
    }
  ];

  private initialGarages: Garage[] = [
    {
      id: 'g1',
      ownerId: 'u2',
      address: 'Av. Libertador 1234',
      district: 'San Isidro',
      pricePerHour: 4.5,
      coordinates: { lat: -12.0961, lng: -77.0345 },
      rating: 4.9,
      features: ['Cámara IA', 'Techado'],
      imageUrl: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=500&q=80',
      isAvailable: true
    },
    {
      id: 'g2',
      ownerId: 'u2',
      address: 'Calle Las Camelias 450',
      district: 'San Isidro',
      pricePerHour: 5,
      coordinates: { lat: -12.0935, lng: -77.0274 },
      rating: 4.8,
      features: ['Seguridad 24/7'],
      imageUrl: 'https://images.unsplash.com/photo-1604063155787-8491c33f2187?w=500&q=80',
      isAvailable: true
    },
    {
      id: 'g3',
      ownerId: 'u3',
      address: 'Av. Larco 880',
      district: 'Miraflores',
      pricePerHour: 3.5,
      coordinates: { lat: -12.1245, lng: -77.0287 },
      rating: 4.6,
      features: [],
      imageUrl: 'https://images.unsplash.com/photo-1486006920555-c77dcf18193c?w=500&q=80',
      isAvailable: false
    }
  ];

  private initialVehicles: Vehicle[] = [
    {
      id: 'v1',
      ownerId: 'u1',
      brand: 'Toyota',
      model: 'Corolla',
      color: 'Gris Oscuro',
      type: 'Sedán',
      plate: 'ABC-123'
    },
    {
      id: 'v2',
      ownerId: 'u1',
      brand: 'Kia',
      model: 'Rio',
      color: 'Blanco',
      type: 'Hatchback',
      plate: 'XYZ-789'
    }
  ];

  private initialChats: ChatThread[] = [
    {
      id: 'c1',
      participant: { id: 'u2', name: 'Laura G.', avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80', role: 'propietario' },
      lastMessage: 'El portón se cerrará automáticamente al ingresar.',
      lastMessageTime: '14:20',
      unreadCount: 1,
      messages: [
        { id: 'm1', senderId: 'u1', text: 'Hola Laura, estoy a 5 minutos de llegar. ¿Cómo es el proceso para abrir el portón?', timestamp: '14:15' },
        { id: 'm2', senderId: 'u2', text: '¡Hola Carlos! He habilitado el acceso inteligente. Cuando estés frente al portón gris, presiona el botón "Abrir Portón" en tu app Parky.', timestamp: '14:18', isAiGenerated: true },
        { id: 'm3', senderId: 'u2', text: 'El portón se cerrará automáticamente al ingresar.', timestamp: '14:20' }
      ]
    },
    {
      id: 'c2',
      participant: { id: 'u4', name: 'Miguel A.', avatarUrl: 'https://randomuser.me/api/portraits/men/46.jpg', role: 'propietario' },
      lastMessage: 'Perfecto, te espero.',
      lastMessageTime: 'Ayer',
      unreadCount: 0,
      messages: [
        { id: 'm1', senderId: 'u1', text: '¿La cochera techada tiene límite de altura?', timestamp: 'Ayer, 10:00' },
        { id: 'm2', senderId: 'u4', text: 'Hola Carlos. Sí, el límite es de 2.10 metros.', timestamp: 'Ayer, 10:05' },
        { id: 'm3', senderId: 'u1', text: 'Genial, mi auto entra sin problema. Reservaré para mañana.', timestamp: 'Ayer, 10:10' },
        { id: 'm4', senderId: 'u4', text: 'Perfecto, te espero.', timestamp: 'Ayer, 10:15' }
      ]
    },
    {
      id: 'c3',
      participant: { id: 'u5', name: 'Ana S.', avatarUrl: 'https://randomuser.me/api/portraits/women/68.jpg', role: 'conductor' },
      lastMessage: 'Gracias por la info.',
      lastMessageTime: 'Lun',
      unreadCount: 0,
      messages: [
        { id: 'm1', senderId: 'u5', text: 'Disculpa, ¿hay vigilancia en las noches?', timestamp: 'Lunes, 08:00' },
        { id: 'm2', senderId: 'u1', text: 'Sí, el edificio cuenta con conserje 24/7 y cámaras de seguridad.', timestamp: 'Lunes, 08:20', isAiGenerated: true },
        { id: 'm3', senderId: 'u5', text: 'Gracias por la info.', timestamp: 'Lunes, 08:30' }
      ]
    },
    {
      id: 'c4',
      participant: { id: 'u6', name: 'Roberto F.', avatarUrl: 'https://randomuser.me/api/portraits/men/75.jpg', role: 'conductor' },
      lastMessage: '¿La cochera tiene espacio para una camioneta 4x4?',
      lastMessageTime: '10:30',
      unreadCount: 1,
      messages: [
        { id: 'm1', senderId: 'u6', text: 'Hola, quería alquilar tu espacio para mañana.', timestamp: '10:25' },
        { id: 'm2', senderId: 'u6', text: '¿La cochera tiene espacio para una camioneta 4x4?', timestamp: '10:30' }
      ]
    }
  ];

  private initialReservations: Reservation[] = [
    {
      id: 'r1',
      driverId: 'u1',
      garageId: 'g1', // Av. Libertador
      startTime: 'Hoy, 14:30',
      endTime: 'Hoy, 18:30',
      status: 'active',
      totalPrice: 18.00
    },
    {
      id: 'r2',
      driverId: 'u1',
      garageId: 'g2', // Calle Las Camelias
      startTime: 'Ayer, 09:00',
      endTime: 'Ayer, 12:00',
      status: 'completed',
      totalPrice: 15.00
    },
    {
      id: 'r3',
      driverId: 'u1',
      garageId: 'g3', // Av. Larco
      startTime: 'Lunes, 18:00',
      endTime: 'Lunes, 19:30',
      status: 'cancelled',
      totalPrice: 0
    }
  ];

  // Signals for reactive state
  public users = signal<User[]>(this.initialUsers);
  public garages = signal<Garage[]>(this.initialGarages);
  public vehicles = signal<Vehicle[]>(this.initialVehicles);
  public chats = signal<ChatThread[]>(this.initialChats);
  public reservations = signal<Reservation[]>(this.initialReservations);
  
  // Current user mock (Carlos Mendoza)
  public currentUser = signal<User | null>(this.initialUsers[0]);

  private supabaseService = inject(SupabaseService);

  constructor() {
    this.testSupabaseConnection();
    this.loadRealGarages();
  }

  async testSupabaseConnection() {
    console.log('Testing Supabase Connection...');
    const { data, error } = await this.supabaseService.getClient().from('parking_spots').select('*').limit(1);
    if (error) {
      console.error('Error connecting to Supabase:', error.message);
    } else {
      console.log('✅ Supabase connected successfully! Data:', data);
    }
  }

  async loadRealGarages() {
    const { data: garagesData, error } = await this.supabaseService.getClient()
      .from('garages')
      .select('*, parking_spots(default_price_per_hour, is_active)');
    
    if (error) {
      console.error('Error loading garages:', error.message);
      return;
    }

    if (garagesData && garagesData.length > 0) {
      const mapped: Garage[] = garagesData.map((g: any) => ({
        id: g.id,
        ownerId: g.owner_id,
        address: g.address,
        district: g.district || 'San Isidro',
        pricePerHour: g.parking_spots?.[0]?.default_price_per_hour || 4.5,
        // PostGIS location requires decoding, using fallback for MVP visualization
        coordinates: { lat: -12.0961, lng: -77.0345 },
        rating: 5.0,
        features: [g.is_covered ? 'Techado' : '', g.camera_enabled ? 'Cámara IA' : ''].filter(Boolean),
        imageUrl: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=500&q=80',
        isAvailable: g.parking_spots?.some((s: any) => s.is_active) ?? false
      }));

      // Merge with existing mocks or overwrite
      // For now, we will prepend the real garage from DB to the list
      this.garages.update(current => [...mapped, ...current]);
    }
  }

  // Methods
  addUser(user: Partial<User>) {
    const newUser: User = {
      id: `u${this.users().length + 1}`,
      name: user.name || 'Usuario Nuevo',
      email: user.email || '',
      role: user.role || 'conductor',
      avatarUrl: user.avatarUrl || `https://i.pravatar.cc/150?u=${Math.random()}`,
      reputation: 5.0,
      isVerified: false,
      memberSince: 'Reciente'
    };
    this.users.update(users => [...users, newUser]);
    return newUser;
  }

  getGaragesByDistrict(district: string) {
    return this.garages().filter(g => g.district === district);
  }

  getGarageById(garageId: string): Garage | undefined {
    return this.garages().find(g => g.id === garageId);
  }

  getUserVehicles(userId: string) {
    return this.vehicles().filter(v => v.ownerId === userId);
  }
}
