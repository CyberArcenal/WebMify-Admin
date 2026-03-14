export interface Pagination {
  next: string | null;
  previous: string | null;
  count: number;
  current_page: number;
  total_pages: number;
  page_size: number;
}