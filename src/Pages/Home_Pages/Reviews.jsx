import { Container } from "react-bootstrap";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import BannaleafRd from "/media/BannaleafRd1.png";
import ChakaliPng1 from "/media/ChakaliPng1.png";
import ChakaliPng from "/media/ChakaliPng.png";
import BannaleafRU2 from "/media/BannaleafRU2.png";
import Thata from "/media/Thata.png";
import visiblestar from "/media/Star-visible.png";
import hiddenstar from "/media/Star-hidden.png";

export default function Reviews() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          arrows: false,
        },
      },
    ],
  };

  const reviewData = [
    {
      text: "TASTY CHUTNEY PODI, IT'S YUMMY..!!",
      author: "SNEHA",
    },
    {
      text: "THE PRODUCTS ARE FRESH AND DELICIOUS, EVERYONE HAS TO TRY IT",
      author: "RAHUL",
    },
    // Add more reviews here
  ];

  return (
    <div className="reviews-wrapper" style={{color:'#00614A'}}>
      {/* Background images */}
      <img src={BannaleafRd} className="bg-img leaf-left" alt="BannaleafRd" />
      <img
        src={ChakaliPng1}
        className="bg-img chakali-left"
        alt="ChakaliPng1"
      />
      <img src={ChakaliPng} className="bg-img chakali-right" alt="ChakaliPng" />
      <img
        src={BannaleafRU2}
        className="bg-img leaf-right"
        alt="BannaleafRU2"
      />
      <img src={Thata} className="bg-img thata" alt="Thata" />

      {/* Slider Content */}
      <div style={{ position: "relative", zIndex: 2 }}>
        <Container>
          <Slider {...settings}>
            {reviewData.map((review, index) => (
              <div key={index}>
                <div className="review-card-container">
                  <div className="review-card">
                    <div className="review-card-inner">
                      <h5 style={{fontFamily:"oswaldMedium"}}>{review.text}</h5>
                      <h2 style={{fontFamily:"oswald"}}>{review.author}</h2>
                      <div className="stars">
                        {[
                          visiblestar,
                          visiblestar,
                          visiblestar,
                          visiblestar,
                          hiddenstar,
                        ].map((star, i) => (
                          <img key={i} src={star} alt="star" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </Container>
      </div>
    </div>
  );
}
