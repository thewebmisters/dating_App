import { AuthenticatedUserDTO } from "./auth-dto";

export interface ChatSummary {
  id: number;
  user_id: number;
  profile_id: number;
  status: string;
  claimed_by: number;
  claimed_at: string;
  unread_count: number;
  profile: {
    id: number;
    name: string;
    profile_photo: string;
    is_online: boolean;
  };
  last_message: {
    id: number;
    content: string;
    created_at: string | Date;
  };
  created_at: string | Date;
}

export interface PaginatedChatsResponse {
  message: string;
  data: {
    current_page: number;
    data: ChatSummary[];
    per_page: number;
    total: number;
  };
}
export interface SendWriterMessagePayload {
  content: string;
  attachments?: {
    type: 'image' | 'file';
    data: string; // base64 encoded data
    filename: string;
    size: number;
    mimeType: string;
  }[];
}
/**
 * Represents the entire API response from the GET /api/chats/claimed endpoint.
 */
export interface ClaimedChatsResponse {
  message: string;
  data: ClaimedChat[]; // The 'data' property is an array of ClaimedChat objects
}
/**
 * Represents a single chat object claimed by a writer.
 */
export interface ClaimedChat {
  id: number;
  user_id: number;
  profile_id: number;
  claimed_by: number;
  claimed_at: string | Date;
  last_writer_message_at: string | Date | null;
  status: string;
  created_at: string | Date;
  updated_at: string | Date;
  user: AuthenticatedUserDTO;
  profile: ChatProfile;
  messages: ChatMessage[];
  unread_count?: number;
}

/**
 * Represents the 'profile' object nested within a ClaimedChat.
 */
export interface ChatProfile {
  id: number;
  name: string;
  age: number;
  bio: string;
  interests: string[];
  profile_photo: string;
  country: string;
  city: string;
  is_online: boolean;
  last_seen_at: string | Date | null;
  is_active: boolean;
  is_featured: boolean;
}

/**
 * Represents a single 'message' object nested within a ClaimedChat.
 */
export interface ChatMessage {
  id: number;
  chat_id: number;
  sender_type: 'user' | 'profile';
  sender_id: number;
  content: string;
  original_content: string | null;
  tokens_cost: number;
  writer_id: number | null;
  writer_earnings: string;
  is_read: boolean;
  read_at: string | Date | null;
  is_flagged: boolean;
  created_at: string | Date;
  updated_at: string | Date;
}
export interface MessageResponseDTO {
  message: string;
  data: MessagesDTO[]
}
export interface MessagesDTO {
  id: number;
  chat_id: number;
  sender_id: number;
  sender_type: string;
  content?: string;  // For sendWriterMessage response
  message?: string;  // For getChatMessages response
  original_content?: string | null;
  tokens_cost?: number;
  writer_id?: number | null;
  writer_earnings?: string;
  has_filtered_content: boolean;
  token_cost: number;
  is_read: boolean;
  read_at?: string | Date | null;
  is_flagged?: boolean;
  attachments: [],
  created_at: Date;
  updated_at?: string | Date;
  sender: {
    id: number;
    name: string;
    email: string;
    profile_photo: string;
    age: number;
    city: string;
    country: string;
    logbook: []
  },
  profile: {
    id: number;
    name: string;
    age: number;
    profile_photo: string;
    is_online: true;
    last_seen_at: Date;
    city: string;
    country: string;
  }
}