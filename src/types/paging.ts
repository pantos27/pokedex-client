
export interface PagedResponse<T> {
    items: T[];
    meta: {
        page: number;
        per_page: number;
        total: number;
        pages: number;
        has_next: boolean;
        has_prev: boolean;
        next_page: number | null;
        prev_page: number | null;
    };
}
