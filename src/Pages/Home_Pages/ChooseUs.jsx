import { Container } from "react-bootstrap";
import OrganicIngradients from "/media/OrganicIngradients.png";
import NoPreservativesorChemicals from "/media/NoPreservativesorChemicals.png";
import HomemadeGoodness from "/media/HomemadeGoodness.png";
import FlavorsThatTellaStory from "/media/FlavorsThatTellaStory.png";
import HealthConsciousChoices from "/media/HealthConsciousChoices.png";
import curveline from "/media/Curveline.png";
import whychooseus from "/media/whychooseus.png";
import Chakaliimagereverse from "/media/Chakaliimage-reverse.png";
import Chakaliimage from "/media/Chakaliimage.png";
import { height, width } from "@fortawesome/free-regular-svg-icons/faAddressBook";
import village from "/media/village.png"

const sections = [
  {
    img: OrganicIngradients,
    alt: "Organic Ingredients",
    title: "100% Organic ingredients:",
    text: "We source only the purest, organically grown ingredients for all our products, ensuring you get the best nature has to offer.",
  },
  {
    img: NoPreservativesorChemicals,
    alt: "No Preservatives or Chemicals",
    title: "No Preservation or Chemicals:",
    text: "Our products are completely free from artificial preservatives, chemicals, or additives, preserving the true flavor of each ingredient.",
  },
  {
    img: HomemadeGoodness,
    alt: "Homemade Goodness",
    title: "Homemade Goodness:",
    text: "Every snack, podi and savory treat is handmade with love following traditional recipes passed down through generations.",
  },
  {
    img: FlavorsThatTellaStory,
    alt: "Flavors That Tell a Story",
    title: "Flavors That Tell a Story:",
    text: "Each product is crafted to offer you an authentic taste of our village, bringing warm, homely flavors from our kitchen straight to your plate.",
  },
  {
    img: HealthConsciousChoices,
    alt: "Health Conscious Choices",
    title: "Health-conscious Choices:",
    text: "With a focus on wholesome, natural ingredients, our products are not only delicious but also a healthy snack option for you and your family.",
  },
];

export default function ChooseUs() {
  const sideImageStyle = {
    width: "60%",
    height: "auto",
    objectFit: "contain",
    position:"relative",
    right: "30%"


  };
 const rightImageStyle ={
  width: "20%",
  height: "auto",
  objectFit:"contain",
  position:"relative",
  right:"20%"
 }

  return (
    <div style={{ position: "relative", fontFamily: "oswald, sans-serif" , color:'#00614A'}}>
      {/* Decorative Images */}
      <div
        style={{ position: "absolute", top: "25%" }}
        className="decorative-image"
      >
        <img src={whychooseus} alt="Laddu" style={sideImageStyle} />
      </div>
      <div
        style={{ position: "absolute", top: "2%", right: "-42%" }}
        className="decorative-image"
      >
        <img
          src={Chakaliimagereverse}
          alt="Chakali Reverse"
          style={rightImageStyle}
        />
      </div>
      

      {/* Content Section */}
      <Container
        className="chooseus-container"
        style={{ padding: "80px 20px 0px 20px" }}
      >
        <h2
          className="chooseus-title"
          style={{
            textAlign: "center",
            fontSize: "35px",
            letterSpacing: "1px",
            marginBottom: "60px",
          }}
        >
          Why Choose Us?
        </h2>

        <div style={{ position: "relative" }}>
          {sections.map((section, index) => (
            <div
              key={index}
              className="chooseus-row"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                alignItems: "center",
                gap: "40px",
                width: "70%",
                margin: "0 auto 50px",
                direction: index % 2 === 1 ? "rtl" : "ltr",
              }}
            >
              <div
                className="chooseus-image"
                style={{ direction: "ltr", textAlign: "center" }}
              >
                <img
                  src={section.img}
                  alt={section.alt}
                  style={{
                    width: "220px",
                    height: "auto",
                    objectFit: "contain",
                    maxWidth: "100%",
                  }}
                />
              </div>
              <div style={{ direction: "ltr" }}>
                <p
                  className="chooseus-text"
                  style={{
                    fontSize: "18px",
                    fontFamily: "oswald, sans-serif",
                    letterSpacing: "1px",
                    lineHeight: "1.7",
                  }}
                >
                  <span
                    style={{
                      fontSize: "22px",
                      fontFamily: "oswald, sans-serif",
                    }}
                  >
                    {section.title}
                  </span>{" "}
                  {section.text}
                </p>
              </div>
            </div>
          ))}

          {/* Optional: hide curve image on mobile */}
          <div
            className="curve-line"
            style={{
              position: "absolute",
              top: "12%",
              left: "80%",
              transform: "translateX(-50%)",
              width: "100%",
              zIndex: "-1",
            }}
          >
            <img
              src={curveline}
              alt="Curve Line"
              style={{ width: "40%", height: "auto", objectFit: "contain" }}
            />
          </div>
        </div>
         <div style={{  position:"absolute", top:"25%" }}>
                    <img
                      src={village}
                      alt="village"
                      style={{ width: "100%", height: "500px", objectFit: "cover" }}
                    />
                  </div>
      </Container>
    </div>
  );
}
