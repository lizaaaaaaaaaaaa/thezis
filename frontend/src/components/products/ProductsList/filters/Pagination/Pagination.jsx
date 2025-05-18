import React from "react";
import styles from "./Pagination.module.scss";

const Pagination = ({
  currentPage,
  totalProducts,
  productsPerPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className={styles.pagination}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &#10096;
      </button>
      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={currentPage === page ? styles.active : ""}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        &#10097;
      </button>
    </div>
  );
};

export default Pagination;
