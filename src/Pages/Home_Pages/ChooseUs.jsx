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
import village from "/media/village.png";

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
  return (
    <div className="chooseus-root" style={{ fontFamily: "oswald, sans-serif", color: "#00614A", position: "relative" }}>
      {/* Decorative side image (desktop) */}
      <div className="decorative-side">
        <img src={whychooseus} alt="why choose us" className="decorative-side-img" />
      </div>

      {/* Right decorative chakali (desktop) */}
      <div className="decorative-right">
        <img src={Chakaliimagereverse} alt="Chakali Reverse" className="decorative-right-img" />
      </div>

      {/* Background village (light decorative) */}
      <div className="decorative-village">
        <img src={village} alt="village" className="decorative-village-img" />
      </div>

      <Container className="chooseus-container">
        <h2 className="chooseus-title">Why Choose Us?</h2>

        <div className="chooseus-list">
          {sections.map((section, index) => {
            const isOdd = index % 2 === 1;
            return (
              <div
                key={index}
                className={`chooseus-row ${isOdd ? "row-odd" : "row-even"}`}
              >
                <div className="chooseus-image">
                  <img src={section.img} alt={section.alt} className="section-img" />
                </div>

                <div className="chooseus-copy">
                  <p className="chooseus-text">
                    <span className="chooseus-title-small">{section.title}</span>{" "}
                    {section.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* curve decorative (positioned behind) */}
        <div className="curve-line">
          <img src={curveline} alt="Curve Line" className="curve-img" />
        </div>
      </Container>
    </div>
  );
}
