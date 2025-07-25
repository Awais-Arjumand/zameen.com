"use client";
import ReactPaginate from "react-paginate";
import HomeBoxesDetails from "./HomeBoxesDetails";
import { useRef, useState } from "react";

const HousesBoxes = ({ houseData }) => {
  const housesRef = useRef(null);
  const itemsPerPage = 12;
  const [currentPage, setCurrentPage] = useState(0);

  const totalItems = houseData.length;
  const startIndex = currentPage * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentItems = houseData.slice(startIndex, endIndex);
  const pageCount = Math.ceil(totalItems / itemsPerPage);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
    housesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      ref={housesRef}
      className="w-full h-fit  rounded-lg flex flex-col gap-y-2"
    >
      <div className="w-full h-10 border-b border-gray-300 flex items-center justify-start bg-[#fafafa] px-3 pb-4">
        <p className="text-gray-700 font-medium text-base">
          Showing {startIndex + 1}-{endIndex} of {totalItems} Listings
        </p>
      </div>

      <div className="w-full h-fit bg-[#f7f8fa] px-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-5">
        {currentItems.length > 0 ? (
          currentItems.map((item) => (
            <HomeBoxesDetails key={item.id} {...item} />
          ))
        ) : (
          <div className="col-span-3 text-center py-10">
            <p className="text-lg">
              No properties found matching your criteria
            </p>
          </div>
        )}
      </div>

      {pageCount > 1 && (
        <div className="flex justify-end pb-6">
          <ReactPaginate
            previousLabel={"<"}
            nextLabel={">"}
            breakLabel={"..."}
            pageCount={pageCount}
            marginPagesDisplayed={1}
            pageRangeDisplayed={3}
            onPageChange={handlePageClick}
            containerClassName={"pagination flex gap-2"}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
            activeClassName={"active"}
            disabledClassName={"disabled"}
            previousClassName={"page-item"}
            nextClassName={"page-item"}
            previousLinkClassName={"page-link"}
            nextLinkClassName={"page-link"}
          />
        </div>
      )}
    </div>
  );
};

export default HousesBoxes;
