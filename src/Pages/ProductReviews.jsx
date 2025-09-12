import React from "react";
import { Container, Row, Col, Image, Pagination } from "react-bootstrap";
import { FaStar, FaRegStar } from "react-icons/fa";
import { useState } from "react";

// ReviewCard component
const ReviewCard = ({ name, date, rating, comment }) => {
  return (
    <div style={{ borderBottom: "2px solid #00614A", padding: "20px 0" }}>
      <Row style={{ padding: "20px 0" }}>
        {/* Left section: Image + Name + Comment */}
        <Col xs={12} md={8} className="d-flex">
          <Image
            src="/media/Photo.png"
            alt="User"
            rounded
            style={{
              width: "60px",
              height: "60px",
              objectFit: "cover",
              marginRight: "15px",
            }}
          />
          <div>
            <h5
              style={{
                color: "#00614A",
                fontSize: "30px",
                letterSpacing: "1px",
              }}
            >
              {name}
            </h5>
            <p
              style={{
                marginBottom: 0,
                fontSize: "20px",
                letterSpacing: "0.5px",
                fontFamily: "KapraNeueMedium, sans-serif",
              }}
            >
              {comment}
            </p>
          </div>
        </Col>

        {/* Right section: Date + Stars */}
        <Col xs={12} md={4} className="text-md-end text-start mt-3 mt-md-0">
          <div style={{ fontSize: "20px", marginBottom: "8px" }}>{date}</div>
          <div>
            {[...Array(5)].map((_, i) =>
              i < rating ? (
                <FaStar
                  key={i}
                  color="orangered"
                  style={{ width: "20px", height: "20px", margin: "0 1%" }}
                />
              ) : (
                <FaRegStar
                  key={i}
                  color="lightgray"
                  style={{ width: "20px", height: "20px", margin: "0 1%" }}
                />
              )
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

// Parent component rendering the reviews
export default function ProductReviews() {
  const reviews = [
    {
      name: "Ramesh",
      date: "10 / 10 / 2024",
      rating: 4,
      comment: "The Products are fresh and delicious, Everyone has to try it.",
    },
    {
      name: "Sneha",
      date: "02 / 06 / 2024",
      rating: 4,
      comment: "The Products are fresh and delicious, Everyone has to try it.",
    },
    {
      name: "Sneha",
      date: "02 / 06 / 2024",
      rating: 3,
      comment: "The Products are fresh and delicious, Everyone has to try it.",
    },
    {
      name: "Sneha",
      date: "02 / 06 / 2024",
      rating: 3,
      comment: "The Products are fresh and delicious, Everyone has to try it.",
    },
    {
      name: "Ramesh",
      date: "10 / 10 / 2024",
      rating: 4,
      comment: "The Products are fresh and delicious, Everyone has to try it.",
    },
    {
      name: "Sneha",
      date: "02 / 06 / 2024",
      rating: 4,
      comment: "The Products are fresh and delicious, Everyone has to try it.",
    },
    {
      name: "Sneha",
      date: "02 / 06 / 2024",
      rating: 3,
      comment: "The Products are fresh and delicious, Everyone has to try it.",
    },
    {
      name: "Sneha",
      date: "02 / 06 / 2024",
      rating: 3,
      comment: "The Products are fresh and delicious, Everyone has to try it.",
    },
    {
      name: "Ramesh",
      date: "10 / 10 / 2024",
      rating: 4,
      comment: "The Products are fresh and delicious, Everyone has to try it.",
    },
    {
      name: "Sneha",
      date: "02 / 06 / 2024",
      rating: 4,
      comment: "The Products are fresh and delicious, Everyone has to try it.",
    },
    {
      name: "Sneha",
      date: "02 / 06 / 2024",
      rating: 3,
      comment: "The Products are fresh and delicious, Everyone has to try it.",
    },
    {
      name: "Sneha",
      date: "02 / 06 / 2024",
      rating: 3,
      comment: "The Products are fresh and delicious, Everyone has to try it.",
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 4;

  // Logic to slice reviews
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Container
      style={{ fontFamily: "kapraneue, sans-serif", marginTop: "40px", color:'#00614A' }}
    >
      {currentReviews.map((review, index) => (
        <ReviewCard key={index} {...review} />
      ))}

      {/* Pagination */}
      <div className="d-flex justify-content-center mt-4">
  <Pagination className="custom-pagination">
    <Pagination.Prev
      onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
      disabled={currentPage === 1}
    />
    {[...Array(totalPages)].map((_, i) => (
      <Pagination.Item
        key={i}
        active={i + 1 === currentPage}
        onClick={() => handlePageChange(i + 1)}
      >
        {i + 1}
      </Pagination.Item>
    ))}
    <Pagination.Next
      onClick={() =>
        handlePageChange(Math.min(currentPage + 1, totalPages))
      }
      disabled={currentPage === totalPages}
    />
  </Pagination>
</div>

    </Container>
  );
}
