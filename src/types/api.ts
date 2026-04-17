export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
  nextPage?: number;
}
