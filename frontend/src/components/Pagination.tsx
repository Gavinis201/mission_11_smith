interface PaginationProps {
    pageNum: number;
    totalPages: number;
    pageSize: number;
    sortTitles: boolean;
    onPageChange: (newPage: number) => void;
    onPageSizeChange: (newSize: number) => void;
    onSortChange: (newSort: boolean) => void;
  }
  
  const Pagination = ({
    pageNum,
    totalPages,
    pageSize,
    sortTitles,
    onPageChange,
    onPageSizeChange,
    onSortChange,
  }: PaginationProps) => {
    return (
      <div className="flex item-center justify-center mt-4">
        {/* Pagination buttons */}
        <div className="mt-4 d-flex justify-content-center gap-2">
          <button
            disabled={pageNum === 1}
            onClick={() => onPageChange(pageNum - 1)}
          >
            Previous
          </button>
  
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => onPageChange(index + 1)}
              disabled={pageNum === index + 1}
            >
              {index + 1}
            </button>
          ))}
  
          <button
            disabled={pageNum === totalPages}
            onClick={() => onPageChange(pageNum + 1)}
          >
            Next
          </button>
        </div>
  
        {/* User inputs: Results per page and sort by title */}
        <div className="mt-4 d-flex justify-content-center align-items-center gap-4">
          <label
            className="d-flex align-items-center"
            style={{ whiteSpace: 'nowrap', minWidth: '180px' }}
          >
            Results per page:
            <select
              className="form-select ms-2"
              value={pageSize}
              onChange={(p) => {
                onPageSizeChange(Number(p.target.value));
                onPageChange(1);
              }}
              style={{ width: '70px' }}
            >
              <option value="5">5</option>
              <option value="10">10</option>
            </select>
          </label>
  
          <label
            className="d-flex align-items-center ms-3"
            style={{ whiteSpace: 'nowrap' }}
          >
            Sort by Title?
            <input
              type="checkbox"
              className="form-check-input ms-2"
              checked={sortTitles}
              onChange={(cb) => onSortChange(Boolean(cb.target.checked))}
            />
          </label>
        </div>
      </div>
    );
  };
  
  export default Pagination;