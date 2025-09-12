import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { FaStar } from "react-icons/fa";

const ReviewPopup = () => {
  const [show, setShow] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [reviewTitle, setReviewTitle] = useState("");
  const [comments, setComments] = useState("");
  const [file, setFile] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = (e) => {
    e.preventDefault();

    // You can handle form data here
    console.log({
      rating,
      reviewTitle,
      comments,
      file,
    });

    handleClose();
  };

  return (
    <>
      <Button
        variant="none"
        type="submit"
        className="w-50 mt-2"
        onClick={handleShow}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "280px",
          height: "80px",
          fontWeight: "bold",
          color: "#00614A",
          backgroundImage: "url('/media/AddCart.png')",
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          fontSize: "24px",
          letterSpacing: "1px",
          textAlign: "center",
          textDecoration: "none",
          fontFamily: "oswald, sans-serif",
          position: "relative",
          zIndex: 1000,
          pointerEvents: "auto",
          border: "none",
          margin: "20px auto",
        }}
      >
        WRITE REVIEW
      </Button>

      <Modal show={show} onHide={handleClose} centered size="lg" style={{fontFamily: "oswald, sans-serif", letterSpacing:'1px', color:'#00614A'}}>
        <Modal.Header closeButton style={{backgroundColor:'#FCF9F6'}}>
          <Modal.Title className="w-100 text-center" style={{fontSize:'45px', color:'#00614A'}}>Write Review</Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{ backgroundColor: "#FCF9F6", borderRadius: "10px" }}
        >
          <Form onSubmit={handleSubmit}>
            {/* Rating */}
            <Form.Group className="mb-3 w-100">
              <Form.Label style={{color:'#00614A', letterSpacing:'1px', fontSize:'22px'}}>Rating</Form.Label>
              <div>
                {[...Array(5)].map((_, index) => {
                  const starValue = index + 1;
                  return (
                    <label key={starValue}>
                      <input
                        type="radio"
                        name="rating"
                        value={starValue}
                        onClick={() => setRating(starValue)}
                        style={{ display: "none" }}
                      />
                      <FaStar
                        size={30}
                        color={
                          starValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"
                        }
                        onMouseEnter={() => setHover(starValue)}
                        onMouseLeave={() => setHover(null)}
                        style={{ cursor: "pointer", marginRight: "5px" }}
                      />
                    </label>
                  );
                })}
              </div>
            </Form.Group>

            {/* Upload File */}
            <Form.Group className="mb-3 w-100">
              <Form.Label style={{color:'#00614A', letterSpacing:'1px', fontSize:'22px'}}>Upload Picture/Video</Form.Label>
              <Form.Control
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setFile(e.target.files[0])}
                style={{borderRadius:'0', border:'2px solid #00614A', color:'#00614A', fontFamily: "oswaldMedium, sans-serif"}}
                className="search-input"
              />
            </Form.Group>

            {/* Review Title */}
            <Form.Group className="mb-3 w-100">
              <Form.Label style={{color:'#00614A', letterSpacing:'1px', fontSize:'22px'}}>Review Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter review title"
                style={{letterSpacing:'1px', fontSize:'20px', borderRadius:'0', border:'2px solid #00614A', fontFamily: "oswaldMedium, sans-serif"}}
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                className="input-account-forms search-input"
              />
            </Form.Group>

            {/* Comments */}
            <Form.Group className="mb-3 w-100">
              <Form.Label style={{color:'#00614A', letterSpacing:'1px', fontSize:'22px'}}>Your Comments</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Write your comments here..."
                style={{letterSpacing:'1px', fontSize:'20px', borderRadius:'0', border:'2px solid #00614A', fontFamily: "oswaldMedium, sans-serif"}}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="input-account-forms search-input"
              />
            </Form.Group>

            {/* Submit Button */}
            <div className="d-flex justify-content-end">
              <Button
                variant="none"
                onClick={handleClose}
                className="me-2"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "280px",
                  height: "80px",
                  fontWeight: "bold",
                  color: "#00614A",
                  backgroundImage: "url('/media/AddCart.png')",
                  backgroundSize: "contain",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  fontSize: "24px",
                  letterSpacing: "1px",
                  textAlign: "center",
                  textDecoration: "none",
                  fontFamily: "oswald, sans-serif",
                  position: "relative",
                  zIndex: 1000,
                  pointerEvents: "auto",
                  border: "none",
                  margin: "20px auto",
                  textTransform:'uppercase'
                }}
              >
                Cancel Review
              </Button>
              <Button variant="none" type="submit" style={{
                 display: "flex",
                 alignItems: "center",
                 justifyContent: "center",
                 width: "280px",
                 height: "80px",
                 fontWeight: "bold",
                 color: "#00614A",
                 backgroundImage: "url('/media/AddCart.png')",
                 backgroundSize: "contain",
                 backgroundPosition: "center",
                 backgroundRepeat: "no-repeat",
                 fontSize: "24px",
                 letterSpacing: "1px",
                 textAlign: "center",
                 textDecoration: "none",
                 fontFamily: "oswald, sans-serif",
                 position: "relative",
                 zIndex: 1000,
                 pointerEvents: "auto",
                 border: "none",
                 margin: "20px auto",
                 textTransform:'uppercase'
              }}>
                Submit Review
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
  
};

export default ReviewPopup;
