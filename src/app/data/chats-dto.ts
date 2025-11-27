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
