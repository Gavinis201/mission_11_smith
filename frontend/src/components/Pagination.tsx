import { Button, Form } from 'react-bootstrap';

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
      <div className="d-flex flex-column align-items-center gap-3">
        {/* Pagination buttons */}
        <div className="d-flex gap-2">
          <Button
            variant={pageNum === 1 ? "secondary" : "outline-primary"}
            disabled={pageNum === 1}
            onClick={() => onPageChange(pageNum - 1)}
            size="sm"
            className="d-flex align-items-center gap-2 shadow-sm"
          >
            <i className="bi bi-chevron-left"></i>
            Previous
          </Button>
  
          {[...Array(totalPages)].map((_, index) => (
            <Button
              key={index + 1}
              variant={pageNum === index + 1 ? "primary" : "outline-primary"}
              onClick={() => onPageChange(index + 1)}
              size="sm"
              className="shadow-sm"
            >
              {index + 1}
            </Button>
          ))}
  
          <Button
            variant={pageNum === totalPages ? "secondary" : "outline-primary"}
            disabled={pageNum === totalPages}
            onClick={() => onPageChange(pageNum + 1)}
            size="sm"
            className="d-flex align-items-center gap-2 shadow-sm"
          >
            Next
            <i className="bi bi-chevron-right"></i>
          </Button>
        </div>
  
        {/* User inputs: Results per page and sort by title */}
        <div className="d-flex align-items-center gap-4">
          <Form.Group className="d-flex align-items-center gap-2">
            <Form.Label className="mb-0 fw-bold text-muted">Results per page:</Form.Label>
            <Form.Select
              value={pageSize}
              onChange={(e) => {
                onPageSizeChange(Number(e.target.value));
                onPageChange(1);
              }}
              className="shadow-sm"
              style={{ width: '80px' }}
              size="sm"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
            </Form.Select>
          </Form.Group>
  
          <Button
            variant={sortTitles ? "primary" : "outline-primary"}
            onClick={() => onSortChange(!sortTitles)}
            size="sm"
            className="d-flex align-items-center gap-2 shadow-sm"
          >
            <i className={`bi bi-sort-alpha-${sortTitles ? 'down' : 'up'}`}></i>
            Sort by Title
          </Button>
        </div>
      </div>
    );
  };
  
  export default Pagination;