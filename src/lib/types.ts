export interface Memory {
    id: string;
    image_url: string;
    assigned_date: string;
    message?: string;
    mode_type: 'travel' | 'static';
    created_at: string;
}

export type ViewMode = 'travel' | 'static';
