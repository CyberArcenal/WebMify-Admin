import { useState, useEffect, useCallback } from 'react';
import notifyLogAPI, { NotifyLog } from '../../../api/core/notifyLog';

interface UseNotificationLogsParams {
  page?: number;
  limit?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
  keyword?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export const useNotificationLogs = (initialParams?: UseNotificationLogsParams) => {
  const [logs, setLogs] = useState<NotifyLog[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<UseNotificationLogsParams>({
    page: 1,
    limit: 10,
    sortBy: 'created_at',
    sortOrder: 'DESC',
    ...initialParams,
  });

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Map frontend filters to API params
      const params: any = {
        page: filters.page,
        page_size: filters.limit,
        status: filters.status,
        start_date: filters.startDate,
        end_date: filters.endDate,
        sort_by: filters.sortBy,
        sort_order: filters.sortOrder?.toLowerCase() as 'asc' | 'desc' | undefined,
        search: filters.keyword,
      };
      // Remove undefined keys
      Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

      const response = await notifyLogAPI.list(params);
      setLogs(response.results);
      setPagination({
        total: response.pagination.count,
        page: response.pagination.current_page,
        limit: response.pagination.page_size,
        totalPages: response.pagination.total_pages,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to fetch notification logs');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const refetch = useCallback(() => {
    fetchLogs();
  }, [fetchLogs]);

  const updateFilters = useCallback((newFilters: Partial<UseNotificationLogsParams>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      page: 1,
      limit: 10,
      sortBy: 'created_at',
      sortOrder: 'DESC',
    });
  }, []);

  const setPage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const setPageSize = useCallback((limit: number) => {
    setFilters((prev) => ({ ...prev, limit, page: 1 }));
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return {
    logs,
    pagination,
    loading,
    error,
    filters,
    updateFilters,
    clearFilters,
    setPage,
    setPageSize,
    refetch,
  };
};