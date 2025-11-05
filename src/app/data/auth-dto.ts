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
export interface userProfileDTO{
          id: number;
        name: string;
        age: number;
        location: string;
        bio: string;
        occupation: string;
        interests: string;
        relationship_status:string;
        profile_photo_url:string;
        is_active: boolean;
        is_featured: boolean;
        is_verified: boolean;
        view_count: number;
        chat_count: number;
        online_status:string;
        last_online_at: string;
        created_at: string;
        updated_at: string;
        deleted_at: null | string | Date;
}