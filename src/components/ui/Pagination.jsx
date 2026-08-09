// ─── Pagination ───────────────────────────────────────────────────────────────
// Props:
//   currentPage : number
//   totalPages  : number
//   onPageChange: fn(page)

import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="pagination">
      <button
        className="page-btn bordered"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        id="pagination-prev"
      >
        <ChevronLeft style={{ width: 12, height: 12 }} /> Prev
      </button>

      {pages.map((page) => (
        <button
          key={page}
          id={`pagination-page-${page}`}
          className={`page-btn${currentPage === page ? ' active' : ''}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      <button
        className="page-btn bordered"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        id="pagination-next"
      >
        Next <ChevronRight style={{ width: 12, height: 12 }} />
      </button>
    </div>
  );
}
