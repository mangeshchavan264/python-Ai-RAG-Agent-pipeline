import { useState, useEffect, useCallback } from 'react';
import {
  useReactTable, getCoreRowModel, getSortedRowModel,
  getPaginationRowModel, flexRender,
} from '@tanstack/react-table';
import { Database, RefreshCw, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import axios from 'axios';

const API = 'http://localhost:8000';

const columns = [
  {
    accessorKey: 'id',
    header: 'ID',
    size: 50,
    cell: info => <span className="cell-id">#{info.getValue()}</span>,
  },
  {
    accessorKey: 'created_at',
    header: 'Time',
    cell: info => <span className="cell-time">{info.getValue()}</span>,
  },
  {
    accessorKey: 'question',
    header: 'Question',
    cell: info => <div className="cell-q cell-trunc">{info.getValue()}</div>,
  },
  {
    accessorKey: 'answer',
    header: 'Answer',
    cell: info => <div className="cell-a cell-trunc">{info.getValue()}</div>,
  },
  {
    accessorKey: 'sources',
    header: 'Chunks',
    enableSorting: false,
    cell: info => (
      <span className="cell-src-count">{info.getValue()?.length ?? 0}</span>
    ),
  },
];

export default function HistoryTable({ refreshTick }) {
  const [data,    setData]    = useState([]);
  const [loading, setLoading] = useState(false);
  const [sorting, setSorting] = useState([]);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const { data: rows } = await axios.get(`${API}/history`);
      setData(rows);
    } catch {
      /* swallow — backend may not be up yet */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchHistory(); }, [fetchHistory, refreshTick]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 8 } },
  });

  const SortIcon = ({ col }) => {
    if (!col.getCanSort()) return null;
    const sorted = col.getIsSorted();
    return sorted === 'asc'  ? <ChevronUp   size={12} className="sort-icon" /> :
           sorted === 'desc' ? <ChevronDown size={12} className="sort-icon" /> :
                               <ChevronsUpDown size={12} className="sort-icon" />;
  };

  const { pageIndex } = table.getState().pagination;
  const pageCount     = table.getPageCount();

  return (
    <div className="history-section">
      <div className="section-header">
        <h2><Database size={16} /> Query History &amp; DB Entries</h2>
        <button className="refresh-btn" onClick={fetchHistory} disabled={loading}>
          <RefreshCw size={13} style={loading ? { animation: 'spin .7s linear infinite' } : {}} />
          Refresh
        </button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id}>
                {hg.headers.map(h => (
                  <th key={h.id} onClick={h.column.getToggleSortingHandler()}>
                    {flexRender(h.column.columnDef.header, h.getContext())}
                    <SortIcon col={h.column} />
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="loading-row"><span className="spinner" /></td></tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <div className="empty-state">
                    <Database />
                    <p>No entries yet — ask a question above to populate the history.</p>
                  </div>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pageCount > 1 && (
        <div className="pagination">
          <span>
            Page {pageIndex + 1} of {pageCount} &nbsp;·&nbsp; {data.length} total entries
          </span>
          <div className="page-btns">
            <button className="page-btn" onClick={() => table.firstPage()}  disabled={!table.getCanPreviousPage()}>«</button>
            <button className="page-btn" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>‹</button>
            {Array.from({ length: pageCount }, (_, i) => (
              <button
                key={i}
                className={`page-btn ${pageIndex === i ? 'active' : ''}`}
                onClick={() => table.setPageIndex(i)}
              >
                {i + 1}
              </button>
            ))}
            <button className="page-btn" onClick={() => table.nextPage()}    disabled={!table.getCanNextPage()}>›</button>
            <button className="page-btn" onClick={() => table.lastPage()}    disabled={!table.getCanNextPage()}>»</button>
          </div>
        </div>
      )}
    </div>
  );
}
