export interface User {
    id: string;
    username: string;
    created_at: string;
}

export interface Memory {
    id: string;
    user_id: string;
    image_url: string;
    assigned_date: string;
    message?: string;
    mode_type: 'travel' | 'static';
    created_at: string;
}

export type ViewMode = 'travel' | 'static';
