export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PaginatedResult<T> = {
  items: T[];
  pagination: PaginationMeta;
};

export function getPagination(page: number, limit: number, total: number): PaginationMeta {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  return { page, limit, total, totalPages };
}

export function parsePaginationQuery(query: { page?: unknown; limit?: unknown }) {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(query.limit) || 12));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}
