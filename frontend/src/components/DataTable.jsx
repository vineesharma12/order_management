import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

import { EmptyState } from './EmptyState.jsx';

const PAGE_SIZE = 8;

function getSearchValue(row, columns) {
  return columns
    .map((column) => {
      const value = column.searchValue ? column.searchValue(row) : row[column.key];
      return Array.isArray(value) ? value.join(' ') : value;
    })
    .filter((value) => value !== undefined && value !== null)
    .join(' ')
    .toLowerCase();
}

export function DataTable({ columns, rows, emptyTitle = 'No data available', searchPlaceholder = 'Search list...' }) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const normalizedQuery = query.trim().toLowerCase();

  const filteredRows = useMemo(() => {
    if (!normalizedQuery) {
      return rows;
    }
    return rows.filter((row) => getSearchValue(row, columns).includes(normalizedQuery));
  }, [columns, normalizedQuery, rows]);

  const pageCount = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * PAGE_SIZE;
  const visibleRows = filteredRows.slice(start, start + PAGE_SIZE);

  function updateQuery(value) {
    setQuery(value);
    setPage(1);
  }

  return (
    <div className="list-view">
      <div className="list-toolbar">
        <label className="list-search">
          <Search size={17} aria-hidden="true" />
          <input value={query} onChange={(event) => updateQuery(event.target.value)} placeholder={searchPlaceholder} />
        </label>
        <span>{filteredRows.length} records</span>
      </div>
      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key}>{column.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row) => (
              <tr key={row.id}>
                {columns.map((column) => (
                  <td key={column.key} data-label={column.header}>
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {visibleRows.length === 0 && <EmptyState title={rows.length === 0 ? emptyTitle : 'No data available'} />}
      </div>
      <div className="pagination">
        <span>
          Page {currentPage} of {pageCount}
        </span>
        <div>
          <button className="icon-button ghost" type="button" onClick={() => setPage(currentPage - 1)} disabled={currentPage === 1} aria-label="Previous page" title="Previous page">
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <button className="icon-button ghost" type="button" onClick={() => setPage(currentPage + 1)} disabled={currentPage === pageCount} aria-label="Next page" title="Next page">
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
