export interface UserDTO {
  id: number;
  name: string;
  email: string;
  email_verified_at: string;
  phone_number: string;
  mpesa_phone: string;
  earnings_balance: string;
  total_earnings: string;
  is_online: true;
  is_active: true;
  last_activity_at: string;
  hired_date: string;
  id_number: null;
  bank_account: null;
  performance_rating: string;
  created_at: string;
  updated_at: string;
}
export interface userDetailsBody {
  email: string;
  password: string;
}
export interface Writer{
      id: number;
      name: string;
      age: number;
      bio: string;
      interests: string;
      profile_photo: string;
      country: string;
      city: string;
      is_online: boolean;
      last_seen_at: string | Date;
      is_active: boolean;
      is_featured: false;
      total_chats: number;
      response_rate: number;
      average_response_time: string | Date;
      total_earnings: number;
      created_at: string | Date;
      updated_at: string | Date;
      deleted_at: string | Date;
      gallery: [
        {
          id: number;
          profile_id: number;
          image_path: string;
          sort_order: number;
          created_at: string | Date;
          updated_at: string | Date;
        }
      ]
}
export interface WriterProfileDTO {
  current_page: number;
  data:Writer[]
}
export interface AuthenticatedUserDTO {
  id: number;
  name: string;
  email: string;
  email_verified_at: string;
  created_at: string;
  updated_at: string;
  two_factor_confirmed_at: string;
  phone: string;
  phone_verified_at: string;
  bio: string;
  interests: [];
  profile_photo: string;
  last_seen_at: string | Date;
  verification_status: string;
  verification_id_photo: string;
  verification_selfie: string;
  verified_at: Date;
  verification_notes: string;
  country: string;
  city: string;
  age: number;
  date_of_birth: string;
  is_active: number;
  is_suspended: number;
  suspension_reason: string;
  deleted_at: string | Date;
  role: string;
  wallet: {
    id: number;
    user_id: number;
    balance: string;
    tokens: number;
    pending_balance: string;
    total_earned: string;
    total_spent: string;
    created_at: string | Date;
    updated_at: string | Date;
  };
}
export interface SendMessagePayload {
  profile_id: number;
  content: string;
  attachments?: any[]; 
}

// Interface for the successful API response
export interface SendMessageResponse {
  message: string;
  data: any; 
}