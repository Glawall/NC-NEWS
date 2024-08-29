function Pagination({ totalCount, pageNumber, onPageChange, limit }) {
  const totalPages = Math.ceil(totalCount / limit);
  function handlePageChange(pageNumber) {
    onPageChange(pageNumber);
  }

  return (
    <div className="pagination">
      {pageNumber > 1 && (
        <button
          className="previous-page"
          onClick={() => handlePageChange(pageNumber - 1)}
          disabled={pageNumber === 1}
        >
          Previous
        </button>
      )}
      {pageNumber < totalPages && (
        <button
          className="next-page"
          onClick={() => handlePageChange(pageNumber + 1)}
        >
          Next
        </button>
      )}
    </div>
  );
}

export default Pagination;
