function Pagination({ totalCount, pageNumber, onPageChange, limit }) {
  const totalPages = Math.ceil(totalCount / limit);
  function handlePageChange(pageNumber) {
    onPageChange(pageNumber);
  }

  return (
    <div className="pagination">
      {pageNumber > 1 && (
        <button
          onClick={() => handlePageChange(pageNumber - 1)}
          className="prev-button"
        >
          Previous
        </button>
      )}
      <div className="pagination-info">
        <span>
          Page {pageNumber} of {Math.ceil(totalCount / limit)}
        </span>
      </div>
      {pageNumber < totalPages && (
        <button
          onClick={() => handlePageChange(pageNumber + 1)}
          className="next-button"
        >
          Next
        </button>
      )}
    </div>
  );
}

export default Pagination;
