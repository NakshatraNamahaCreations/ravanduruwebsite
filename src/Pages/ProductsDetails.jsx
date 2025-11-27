{
  /*import {
  Container,
  Form,
  FormControl,
  Button,
  Row,
  Col,
} from "react-bootstrap";
// import products from "/media/products.png";
import wishlistheart from "/media/Whishlistheart.png";
import Accordion from "react-bootstrap/Accordion";
import visiblestar from "/media/Star-visible.png";
import hiddenstar from "/media/Star-hidden.png";
import ProductReviews from "./ProductReviews";
import Products_Sliders from "./Products_Sliders";
import Chakaliimageflip from "/media/Chakaliimageflip.png";
import Chakaliimagereverse from "/media/Chakaliimage-reverse.png";
import { Tabs, Tab } from "react-bootstrap";

import { Badge, Table} from "react-bootstrap";
import { FaHeart , FaCheckCircle} from "react-icons/fa";


import lock from "/media/Silverlock.png";
import smile from "/media/Smile.png";
import linelock from "/media/whiteLine.png";
import { useState, useEffect } from "react";
import Reviews from "./Home_Pages/Reviews";
import ReviewPopup from "./ReviewPopup";
import { useParams } from "react-router-dom";
import product from "/media/products.png";
import { addToCart } from "../redux/cartSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Nopalmoil from "/media/Nopalmoil.png";
import natural00 from "/media/natural00.png";
import ScrollToTop from "../Component/ScrollToTop";
import SearchBar from "../Component/SearchBar";
import agase from "/media/agase.png";
import groundnutchatneypudi from "/media/groundnutchatneypudi.png";
import cocnutchatneypudi from "/media/cocnutchatneypudi.png";
import blendcoffeepowder from "/media/blendcoffeepowder.png";
import avalakkimixture from "/media/avalakkimixture.jpg";
import dryfruitsunde from "/media/dryfruitsunde.jpg";
import bananachips from "/media/bananachips.png";
import chakli from "/media/chakli.png";
import powerstarblendcoffeepowder from "/media/powerstarblendcoffeepowder.png";
import hunasethokku from "/media/hunasethokku.png";
import sweets from "/media/sweets.jpg"

export default function ProductsDetails() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [thumbnails, setThumbnails] = useState([]);

  const images = [
    {src: "/media/sweets.jpg", w: "100g", price: 100},
    {src: "/media/products.png", w: "200g", price: 100}
  ]

  const handleAddToCart = () => {
  dispatch(
    addToCart({
      id: productID.id,
      name: productID.name,
      image: productID.image,
      originalPrice: productID.originalPrice,
      discountedPrice: productID.discountedPrice,
      quantity,            // <-- IMPORTANT
      selectedWeight,      // keep weight too if you support variants
    })
  );
  navigate("/your-cart");
  
};


  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  const [mainImage, setMainImage] = useState(images?.[0]?.src || "");
   const [selectedWeight, setSelectedWeight] = useState
  
  // 100g 200g

 ("100g");
    const [price, setPrice] = useState(320);
  const weights = ["100g", "200g"];

  const [quantity, setQuantity] = useState(1);
  const originalPrice = 105;
  const discountedPrice = 100;

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };








const [eta, setEta] = useState(null);




  const productslist = [
       {
         id: 1,
         name: "Ravanduru Special Groundnut Chutney Pudi",
         image: groundnutchatneypudi,
         originalPrice: 105,
         discountedPrice: 100,
          description:
            "KADALE(SHENGAI) CHUTNEY PODI---Rich in flavor and rooted in tradition, the Authentic Ravanduru Special Shengai (Peanut) Chutney Podi is a delightful blend of roasted peanuts, spices, and aromatic herbs, handcrafted in the heart of Ravanduru village. This podi is known for its nutty taste, smooth texture, and a hint of spice that brings every dish to life.Made without any preservatives or artificial additives, it's the perfect companion for idli, dosa, chapati, or hot steamed rice with a drizzle of ghee. Every spoonful reflects the warmth and authenticity of rural South Indian kitchens.Pure, rustic, and irresistibly flavorful — the true taste of Ravanduru.",
       },
       {
         id: 2,
         name: "Ravanduru Special Coconut Chutney Podi",
         image: cocnutchatneypudi,
         originalPrice: 105,
         discountedPrice: 100,
           description:
        "AUTHENTIC RAVANDURU SPECIAL CHUTNEY PODIS----  COCONUT CHUTNEY PODI----- Bringing the rich flavors of the countryside straight to your kitchen, the Authentic Ravanduru Special Coconut Chutney Podi is a fragrant, flavorful blend made from freshly grated, sun-dried coconut and hand-roasted spices. Prepared in small batches using time-honored techniques from the village of Ravanduru, this podi captures the soul of traditional South Indian cooking.Perfect as a side with idli, dosa, rice, or even as a sprinkle on snacks, it offers a deliciously nutty, mildly spiced taste with a rustic homemade charm. No preservatives, just pure authenticity in every spoon.",
       },
       {
         id: 3,
         name: "Ravanduru special Agase Chutney Podi or Pudi",
         image: agase,
         originalPrice: 105,
         discountedPrice: 100,
       },
       {
         id: 4,
         name: "Ravanduru Secret Blend Coffee Powder (70/30 Blend)",
         image: blendcoffeepowder,
         originalPrice: 105,
         discountedPrice: 100,
          description:"AUTHENTIC RAVANDURU SPECIAL SOUTH INDIAN FILTER COFFEE (SECRET BLEND) Start your day with the rich aroma and bold flavor of Authentic Ravanduru Special South Indian Filter Coffee – Secret Blend. Made from a carefully guarded recipe, this signature blend combines premium-quality coffee beans with just the right touch of chicory, roasted and ground to perfection. Every cup offers a smooth, full-bodied experience with a lingering finish – true to the traditional South Indian filter coffee you know and love. Freshly packed without additives or preservatives, this secret blend is your perfect brew for a comforting and energizing start. A sip of tradition, a secret worth savoring – only from Ravanduru."
       },
       {
         id: 5,
         name: "Ravanduru Special Power star blend coffee powder (80/20)",
         image: powerstarblendcoffeepowder,
         originalPrice: 105,
         discountedPrice: 100,
          description:"AUTHENTIC RAVANDURU SPECIAL SOUTH INDIAN FILTER COFFEE (POWER STAR BLEND)----Bold, intense, and energizing — the Authentic Ravanduru Special South Indian Filter Coffee – Power Star Blend is crafted for true coffee lovers who crave a strong, full-bodied brew. Sourced from premium coffee estates and roasted with precision in Ravanduru, this blend packs a punch with its rich flavor, deep aroma, and perfect balance of coffee and chicory. Ideal for your morning kickstart or an afternoon boost, every cup delivers the signature strength and smoothness of traditional South Indian filter coffee. No additives, just pure power in every sip.Strong. Authentic. Unforgettable — that’s the Power Star blend from Ravanduru."
       },
       {
             id: 6,
             name: "Chakhli",
             image: chakli,
             originalPrice: 105,
             discountedPrice: 100,
              description:
        "CHAKLI-----  This recipe was a well-guarded secret, passed down from our Ajji (grandmother) who first began making chakli in her tiny kitchen during Diwali. Using locally sourced rice flour, roasted gram, and a precise blend of hand-pounded spices, she crafted each spiral with love and care. Over time, her crunchy, golden chakli gained a following far beyond the village.\nToday, Ravanduru Stores still makes chakli the traditional way — hand-pressed, sun-dried, and fried to perfection. Whether it's a festive celebration or a rainy afternoon with chai, one bite of our chakli carries the warmth of home and the legacy of a village that knows how to savor simple joys.",
           },
           {
             id: 7,
             name: "Kodubale",
             image: product,
             originalPrice: 105,
             discountedPrice: 100,
              description:
        "kodbale---- Our humble yet irresistible kodbale — a crunchy, ring-shaped snack with a bold, spicy kick.It all began with Our Ajji (grandmother), who would wake up before sunrise to grind fresh coconut, roast lentils, and mix the dough by hand. Her kodbale, shaped into perfect little rings and fried over a wood fire, became the stuff of local legend. The aroma alone would draw neighbors and passersby. Years later, We at Ravanduru Stores have continued this tradition with the same care and authenticity. Our kodbale, crisp on the outside and packed with flavor, is made in small batches, just like Ajji used to. Every bite tells a story — of heritage, homely warmth, and the timeless taste of Karnataka’s favorite snack.",
           },
           {
             id: 8,
             name: "Bananna Chips",
             image: bananachips,
             originalPrice: 105,
             discountedPrice: 100,
             description:
        "BANANNA CHIPS---- It all started decades ago when Thatha (grandfather) began slicing homegrown bananas paper-thin, seasoning them with just the right amount of salt and turmeric, and frying them to perfection in pure coconut oil. What began as a homemade treat for family and friends soon became the village’s favorite snack.To this day, Ravanduru Stores still prepares banana chips the traditional way — hand-cut, slow-fried, and packed fresh with care. Whether enjoyed during festivals or as an everyday treat, each chip carries the taste of tradition and the crunch of a time-honored craft that’s been perfected over generations.",
           },
           {
             id: 9,
             name: "Avalakki Mixture",
             image: avalakkimixture,
             originalPrice: 105,
             discountedPrice: 100,
              description:
        "AVALAKKI MIXTURE ------- Long ago, during monsoon evenings, Ajji and Thatha would gather their grandchildren around a warm kitchen as Ajji and Thatha roasted beaten rice (avalakki) on a gentle flame. Ajji would mix in roasted peanuts, fried curry leaves, crunchy sev, and a special blend of spices — a recipe crafted from love and local ingredients. The aroma would fill the house, and one bowl was never enough.  Today, Ravanduru Stores keeps that tradition alive. Their avalakki mixture is still made in small batches, staying true to the original recipe — light, crispy, and packed with flavor. Whether paired with a cup of filter coffee or eaten straight from the pack, it’s a taste of home, warmth, and the timeless spirit of village life.",
           },
            {
                 id: 10,
                 name: "Jaggary Coconut Barfi(Bellas Kobri Mitayi)",
                 image: sweets,
                 originalPrice: 105,
                 discountedPrice: 100,
                 description:
        "BELLAD KOBRI MITAYI-----Years ago, during harvest festivals, Ajji would gather fresh grated coconut and melt golden jaggery over a wood fire, stirring patiently until the mixture reached the perfect texture. With a pinch of cardamom and a lot of love With Thatha she pressed the warm, fragrant mix into trays and cut them into soft, chewy squares. It was a sweet shared during family gatherings, temple fairs, and moments of celebration. Today, Ravanduru Stores makes this traditional barfi just like Ajji did — with fresh ingredients, no shortcuts, and the same homely touch. Each bite of Bellada Kobri Mitayi is a taste of nostalgia, purity, and the simple joy of a time-honored Karnataka treat.",
               },
               {
                 id: 11,
                 name: "Dry Fruits Unde",
                 image: dryfruitsunde,
                 originalPrice: 105,
                 discountedPrice: 100,
                  description:
        "DRY FRUITS UNDE----- Ravanduru Stores is known for crafting sweets that nourish both body and soul — especially Our wholesome Dry Fruits Unde (dry fruit laddus). This tradition began with Ajja, a spirited elder who believed that food should be both delicious and full of energy. She would gather almonds, cashews, raisins, dates, and a touch of ghee, shaping them into soft, rich laddus that were offered to guests, pilgrims, and tired farmers returning from the fields. No sugar, no additives — just pure, natural goodness. Today, Ravanduru Stores continues that legacy with the same care and purity. Our Dry Fruits Unde is packed with nutrition, handmade in small batches, and perfect for festive gifting or a healthy everyday treat. Every bite is a tribute to simple living, mindful eating, and the timeless taste of tradition.",
               },
               {
                 id: 12,
                 name: "Shankarapoli",
                 image: product,
                 originalPrice: 105,
                 discountedPrice: 100,
                  description:
        "SHANKARPOLI----This story began decades ago when Ajji (grandmother) and her favorite daughter-in-law would prepare Shankarpoli during festivals like Diwali. She would knead a dough of all-purpose flour, ghee, sugar, and a hint of cardamom, rolling it out into thin sheets. These sheets were then cut into diamond shapes and deep-fried to perfection, resulting in a crunchy, sweet snack that became a family favorite. Over the years, Ravanduru Stores has perfected this recipe, ensuring that each piece of Shankarpoli maintains the same traditional taste and texture. Made in small batches, the Shankarpoli is still prepared with the same care and attention to detail, using high-quality ingredients and time-honored methods.Whether enjoyed during festive occasions or as a delightful snack with a cup of tea, Ravanduru Stores' Shankarpoli continues to bring joy to all who taste it, carrying forward a legacy of flavor and tradition.",
               },
                 {
                     id: 13,
                     name: "Ravanduru Special Hunase Thokku",
                     image: hunasethokku,
                     originalPrice: 105,
                     discountedPrice: 100,
                     description:
                       "RAVANDURU SPECIALS TO YOUR PLATE  — tradition, spice, and everything nice. HUNASE THOKKU----Tangy, spicy, and irresistibly flavorful, the Authentic Ravanduru Special Hunase Thokku is a traditional tamarind Thokku made with love and care in the village of Ravanduru. Using handpicked tamarind, slow-cooked with aromatic spices and a hint of jaggery, this thokku strikes the perfect balance between sourness, heat, and a touch of sweetness. Prepared in small batches with no preservatives, it’s the ideal accompaniment for rice, dosa, chapati, or curd rice. Every spoonful delivers a burst of bold, authentic South Indian flavor.A timeless village recipe, packed with punch — only from Ravanduru.",
                   }, 
              
  ];
  
    const { id } = useParams();
  const productID = productslist.find((p) => p.id === parseInt(id));

  if (!productID) {
    return <h2>Product Items not found</h2>;
  }
  // const navigate = useNavigate();
  // const handleAddToCart = (id, name, image, originalPrice, discountedPrice) => {
  //   // dispatch(addToCart({ id, name, image, originalPrice, discountedPrice }));
  //   navigate("/your-cart");
  // };

   

  return (
    <>
      <div
        className="page-content mt-5"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.5s ease-in-out",
        }}
      >
        {/* NAVBAR */
}
{
  /* <Navbar_Menu /> */
}

{
  /* SEARCH */
}
{
  /*<SearchBar />*/
}

{
  /* PRODUCT DETAILS */
}

{
  /*}   <div style={{ fontFamily: "oswald, sans-serif", color: "#00614A" }}>
         

         <Container className="sticky-parent">
  <Row className="g-3 sticky-row">
    {/* LEFT — COLUMN */
}
{
  /*<Col md={6} className="d-flex justify-content-center">
      <div className="sticky-inner"
      style={{
                position: "sticky",
                top: "0px",
                zIndex: 1,
                display: "flex",
                flexDirection: "column",
                padding: "20px",
                height: "100vh",
                alignItems: "center",
                justifyContent: "start",
                gap: "20px",
              }}>
        
          {/* main image */
}
{
  /*} <img
            src={productID.image}
            alt={productID.name}
            style={{ width: "70%", maxWidth: 1000, height: "auto", objectFit: "cover", zIndex: 2 }}
          />
<div className="d-flex flex-wrap justify-content-center gap-3">
                {images.map((imgObj, index) => (
                  <img
                    key={index}
                    src={imgObj.src}
                    thumbnail
                    onClick={() => {
                      setMainImage(imgObj.src);
                      setSelectedWeight(imgObj.weight);
      setPrice(imgObj.price);
                    }}
                    style={{
                      width: "120px",
                      height: "120px",
                      objectFit: "cover",
                      cursor: "pointer",
                      borderRadius: "10px",
                      border: "2px solid #00614A",
                    }}
                  />
                ))}
              </div>
          

          {/* small ring badges (you already had) */
}
{
  /*} {[
            { img: Nopalmoil, text: "No\nPalm Oil", style: { top: "-10%", left: "5%" } },
            { img: natural00, text: "No\nPreservatives", style: { top: "-10%", right: "5%" } },
            {
              img: natural00,
              text: "Saviours and on the go snacks \n made from locally sourced ingredients",
              style: { bottom: "-30%", width: "100%" },
              isBottom: true,
            },
          ].map((item, i) => (
            <div key={i} style={{ position: "absolute", textAlign: "center", ...item.style }}>
              <img src={item.img} alt="Icon" style={{ width: 40, height: "auto", marginBottom: 5 }} />
              <p
                style={{
                  fontSize: item.isBottom ? 13 : 12,
                  fontWeight: item.isBottom ? 600 : 500,
                  color: "#1c4931",
                  margin: item.isBottom ? "0 20px" : 0,
                  whiteSpace: "pre-line",
                }}
              >
                {item.text}
              </p>
            </div>
          ))}*/
}
{
  /*</div>
      
    </Col>

    {/* RIGHT COLUMN*/
}
{
  /*} <Col md={6} className="d-flex flex-column align-items-start">
      {/* Title */
}
{
  /*<div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <h2 style={{ fontFamily: "poppins", fontWeight: "bold", textTransform:"uppercase",color:"red" }}>
                      {productID.name}
                    </h2>
                   {/*} <Button
                      variant="none"
                      onClick={handleAddToWishlist}
                      style={{
                        fontSize: "24px",
                        color: isInWishlist ? "#FF0000" : "#00614A",
                      }}
                      title={isInWishlist ? "Already in Wishlist" : "Add to Wishlist"}
                    >
                      <FaHeart />
                    </Button>*/
}
{
  /*}  </div>
     

      {/* Price */
}
{
  /*} <div className="price-line mt-3">
        <div className="d-flex align-items-end gap-2">
          <div className="pdp-price" style={{fontFamily:"poppins"}}>₹{productID.discountedPrice * quantity}</div>
         {/*} <div className="strike">₹{productID.originalPrice * quantity}</div>*/
}
{
  /*<Badge bg="success" className="discount-badge" style={{fontFamily:"poppins"}}>
            {Math.max(0, Math.round(((productID.originalPrice - productID.discountedPrice) / productID.originalPrice) * 100))}% OFF
          </Badge>
        </div>
        <div className="text-muted small" style={{fontFamily:"poppins"}}>Inclusive of all taxes</div>
         <div className="mb-4 mt-3">
              <span
                style={{
                  backgroundColor: "#d4f7dc",
                  color: "green",
                  padding: "4px 10px",
                  borderRadius: "20px",
                  fontWeight: 600,
                  fontFamily:"poppins"
                }}
              >
                In stock
              </span>
            </div>
      </div>

      {/* Pack size*/
}
{
  /*} <div className="mt-4">
        <div className="fw-semibold mb-2" style={{fontSize:"25px", fontFamily:"poppins"}}>Select Quantity</div>
        <div className="d-flex flex-wrap gap-2">
          {weights.map((w) => (
            <button
              style={{fontFamily:"poppins"}}
              key={w}
              type="button"
              className={`zepto-chip ${selectedWeight === w ? "active" : ""}`}
              onClick={() => setSelectedWeight(w)}
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity stepper + delivered by */
}
{
  /*<div className="d-flex flex-wrap align-items-center gap-3 mt-4">
        <div className="d-flex align-items-center border rounded-pill">
          <Button variant="link" className="qty-btn" onClick={handleDecrement}>−</Button>
          <span className="px-3">{quantity}</span>
          <Button variant="link" className="qty-btn" onClick={handleIncrement}>＋</Button>
        </div>
       
      </div>

       <div className="alert alert-warning mt-4" style={{fontFamily:"poppins"}}>
               Shop ₹2000 more and enjoy <b>*FREE Shipping*</b> on your order.
            </div>

      {/* CTA buttons (desktop/tablet) */
}
{
  /*<div className="d-flex gap-3 mt-4">
        <Button
          variant="none"
          className="px-4 py-2"
          onClick={handleAddToCart}
          style={{backgroundColor:"#97d7c6",
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
         width: "200px",
          height: "50px",
        fontSize:"20px",
      borderRadius:"0", fontFamily:"poppins",
    fontWeight:"bold"}}
        >
          ADD TO CART
        </Button>
        <Button
          variant="none"
          className="px-4 py-2"
          onClick={handleAddToCart}
          style={{backgroundColor:"#97d7c6",
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
         width: "200px",
          height: "50px",
        fontSize:"20px",
      borderRadius:"0",
    fontFamily:"poppins",
    fontWeight:"bold"}}
        >
          BUY NOW
        </Button>
      </div>

      {/* Details tabs (kept from your code) */
}
{
  /*} <div className="mt-5 w-100" style={{ maxWidth: 720 }}>
        <Tabs id="product-details-tabs" defaultActiveKey="description" justify className="mb-3">
          <Tab
            eventKey="description"
            title={<span style={{ color: "#00614A", fontSize: 18 }}>Product description</span>}
          >
            <div style={{ padding: "16px 8px" }}>
              <p
                style={{
                  fontSize: "16px",
                  letterSpacing: "0.5px",
                  lineHeight: "1.5",
                  fontFamily: "poppins, sans-serif",
                  color: "#00614A",
                }}
                className="story-para"
              >
                {productID.description}
              </p>
            </div>
          </Tab>
          <Tab
            eventKey="ingredients"
            title={<span style={{ color: "#00614A", fontSize: 18 }}>Product ingredients</span>}
          >
            <div style={{ padding: "16px 8px" }}>
              <p
                style={{
                  fontSize: "16px",
                  letterSpacing: "0.5px",
                  lineHeight: "1.5",
                  fontFamily: "poppins, sans-serif",
                  color: "#00614A",
                }}
                className="story-para"
              >
               In the heart of the serene village of RAVANDURU nested amidst rolling hills and lush greenery, emerged a culinary gem -"RAVANDURU STORES". This savories brand, born from tradition and crafted with passion, honors the flavors and heritage of the village.Each savory delight tells a tale of locally sourced ingredients, passed-down recipes and the warmth of community sprit .From cripy snacks to aromatic Podis and more , "RAVANDURU STORES" bring the essence of this quaint village to every palate , inviting the world to savor its rich, flavorful narratives from our home to BHARATH & BEYOND...
              </p>
            </div>
          </Tab>
        </Tabs>
      </div>*/
}
{
  /*<Table bordered responsive className="mt-4" >
                            <tbody>
                              <tr>
                                <td style={{fontFamily:"poppins", padding:"15px"}}><strong>Price + Offer</strong></td>
                                <td style={{fontFamily:"poppins",padding:"15px"}}>₹480.00 <del className="text-muted">₹650.00</del> <span className="text-success">20% Off</span></td>
                              </tr>
                              <tr>
                                <td style={{fontFamily:"poppins",padding:"15px"}}><strong>Highlight</strong></td>
                                <td style={{fontFamily:"poppins", padding:"15px"}}><Badge bg="dark" className="me-2">ONLINE EXCLUSIVE</Badge> <code style={{color:"#000", fontSize:"16px"}}>COLD-PRESSED</code></td>
                              </tr>
                             
                              <tr>
                                <td style={{fontFamily:"poppins", padding:"15px"}}><strong>Popularity Info</strong></td>
                                <td style={{fontFamily:"poppins", padding:"15px"}}>
                                  <span className="d-block bg-light p-1 rounded">423 people viewed this item in last 7 days</span>
                                  <span className="d-block bg-light p-1 rounded mt-1">12 customers purchased in last 72 hrs</span>
                                </td>
                              </tr>
                              <tr>
                                <td style={{fontFamily:"poppins", padding:"15px"}}><strong>Size/Quantity Selector</strong></td>
                                <td style={{fontFamily:"poppins", padding:"15px"}}>(1L Cold-Pressed)(1L Wood-Pressed)(5L)</td>
                              </tr>
                              
                              
                              <tr>
                                <td style={{fontFamily:"poppins", padding:"15px"}}><strong>Customer Benefits</strong></td>
                                <td style={{fontFamily:"poppins", padding:"15px"}}>
                                  <ul className="list-unstyled mb-0">
                                    <li className="mb-2"><FaCheckCircle color="green" className="me-2 " />100% Pure</li>
                                    <li className="mb-2"><FaCheckCircle color="green" className="me-2" />Wood Cold Pressed</li>
                                    <li className="mb-2"><FaCheckCircle color="green" className="me-2" />Lab Tested</li>
                                    <li className="mb-2"><FaCheckCircle color="green" className="me-2" />No Chemicals or Preservatives</li>
                                  </ul>
                                </td>
                              </tr>
                            </tbody>
                          </Table>

    </Col>
  </Row>

  {/* MOBILE sticky CTA */
}
{
  /*<div className="sticky-cta d-md-none">
    <div className="d-flex justify-content-between align-items-center w-100">
      <div>
        <div className="small text-muted">Total</div>
        <div className="fw-bold">₹{productID.discountedPrice * quantity}</div>
      </div>
      <Button variant="success" className="px-4 py-2" onClick={handleAddToCart}>
        Add {quantity} to cart
      </Button>
    </div>
  </div>
</Container>


        </div>

        {/* CUSTOMER REVIEW */
}

{
  /*}  <div style={{ fontFamily: "oswald, sans-serif" }} className="mt-5">
          <h3
            style={{
              textAlign: "center",
              fontSize: "50px",
              letterSpacing: "1px",
              color: "#00614A",
            }}
          >
            Customer reviews
          </h3>
          <div style={{ backgroundColor: "#FBF9F4", padding: "35px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "25px",
                marginBottom: "10px",
              }}
            >
              {[
                visiblestar,
                visiblestar,
                visiblestar,
                visiblestar,
                hiddenstar,
              ].map((star, i) => (
                <img
                  key={i}
                  src={star}
                  alt="star"
                  style={{ width: "50px", height: "50px" }}
                />
              ))}
            </div>

            <div
              style={{
                display: "block",
                justifyItems: "center",
                color: "#00614A",
                marginTop: "2%",
              }}
            >
              <h2 style={{ fontSize: "38px", letterSpacing: "1px" }}>
                4 out of 5
              </h2>
              <p
                style={{
                  fontSize: "26px",
                  fontFamily: "oswaldMedium, sans-serif",
                }}
              >
                Based on 13 reviews
              </p>
            </div>
            <div
              className="review-summary-container"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                gap: "30px",
                padding: "20px",
                backgroundColor: "#f8f8f8",
                borderRadius: "10px",
                maxWidth: "800px",
                margin: "auto",
              }}
            >
              {/* Review stars */
}
{
  /*}  <div className="review-stars">
                {[...Array(5)].map((_, rowIndex) => (
                  <div
                    key={rowIndex}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "10px",
                      margin: "15px 0",
                    }}
                  >
                    {[
                      visiblestar,
                      visiblestar,
                      visiblestar,
                      visiblestar,
                      hiddenstar,
                    ].map((star, i) => (
                      <img
                        key={i}
                        src={star}
                        alt="star"
                        style={{ width: "18px", height: "18px" }}
                      />
                    ))}
                  </div>
                ))}
              </div>*/
}

{
  /* Review bars */
}
{
  /*<div>
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="review-bar"
                    style={{
                      backgroundColor: "#D9D9D9",
                      width: "300px",
                      height: "18px",
                      borderRadius: "5px",
                      margin: "15px 0",
                    }}
                  ></div>
                ))}
              </div>

              {/* Review counts */
}
{
  /*<div
                className="review-count"
                style={{
                  textAlign: "right",
                  fontSize: "20px",
                  fontWeight: "500",
                }}
              >
                {[125, 60, 30, 15, 10].map((count, i) => (
                  <div
                    key={i}
                    style={{ margin: "4px 0", letterSpacing: "1px" }}
                  >
                    {count}
                  </div>
                ))}
              </div>
            </div>

            {/* Review Button */
}
{
  /*} <ReviewPopup />*/
}
{
  /*</div>
        {/*}  <Reviews/>*/
}
{
  /*} </div>*/
}

{
  /* YOU MAY ALSO */
}
{
  /*}  <div
          style={{
            textAlign: "center",
            backgroundColor: "#FBF9F4",
            fontFamily: "oswald, sans-serif",
            color: "#00614A",
            position: "relative",
            padding: "50px 0",
            overflow: "hidden", // Prevent overflow for absolute images
          }}
        >
          {/* Top Left Chakali Image */
}
{
  /*} <div
            style={{
              position: "absolute",
              top: "0",
              left: "0",
              zIndex: 1,
              pointerEvents: "none",
            }}
            className="chakali-image-left"
          >
            <img
              src={Chakaliimageflip}
              alt="Plate"
              style={{
                width: "150px",
                height: "auto",
                objectFit: "cover",
              }}
            />
          </div>

          {/* Bottom Right Chakali Image */
}
{
  /*<div
            style={{
              position: "absolute",
              bottom: "0",
              right: "0",
              zIndex: 1,
              pointerEvents: "none",
            }}
            className="chakali-image-right"
          >
            <img
              src={Chakaliimagereverse}
              alt="Plate"
              style={{
                width: "150px",
                height: "auto",
                objectFit: "cover",
              }}
            />
          </div>

          {/* Heading and Slider */
}
{
  /* <div className="mt-5">
            <h1
              style={{ fontSize: "40px", letterSpacing: "1px" }}
              className="mobile-font"
            >
              YOU MAY ALSO LIKE
            </h1>
            <div>
              <Products_Sliders />
            </div>
          </div>
        </div>

        {/* LOCK & SMILE */
}

{
  /*}  <div
          style={{
            backgroundImage: "url('/media/Nopreservatives.png')",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            padding: "20px 0 0 0",
            height: "auto",
            color: "white",
            fontFamily: "oswald, sans-serif",
          }}
        >
          <div style={{ position: "relative" }}>
            <div
              className="lock-section"
              style={{
                padding: "70px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <img
                src={lock}
                alt="Silver Lock"
                className="lock-image"
                style={{
                  width: "25%",
                  height: "auto",
                  objectFit: "cover",
                  zIndex: "999999",
                }}
              />
              <h3
                style={{
                  fontSize: "40px",
                  marginLeft: "-17%",
                  letterSpacing: "1px",
                }}
              >
                Unlock the path to <br />
                <span style={{ fontWeight: "900", fontSize: "65px" }}>
                  Yummy Snacks
                </span>{" "}
                <br /> with a smile
              </h3>
              <img
                src={smile}
                alt="smile"
                className="smile-image"
                style={{
                  width: "25%",
                  height: "auto",
                  objectFit: "cover",
                  zIndex: "999999",
                }}
              />
            </div>

            <div
              style={{
                position: "absolute",
                bottom: "20%",
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <img
                src={linelock}
                alt="lines"
                className="line-image"
                style={{ width: "55%", height: "auto", objectFit: "cover" }}
              />
            </div>
          </div>
        </div>*/
}

{
  /*} <ScrollToTop />

        {/* FOOTER */
}
{
  /* <Footer /> */
}
{
  /*</div>
    </>
  );
}*/
}

import { Container, Button, Row, Col, Badge, Table } from "react-bootstrap";
import wishlistheart from "/media/Whishlistheart.png";
import Accordion from "react-bootstrap/Accordion";
import visiblestar from "/media/Star-visible.png";
import hiddenstar from "/media/Star-hidden.png";
import ProductReviews from "./ProductReviews";
import Products_Sliders from "./Products_Sliders";
import Chakaliimageflip from "/media/Chakaliimageflip.png";
import Chakaliimagereverse from "/media/Chakaliimage-reverse.png";
import './ProductDetails.css';
//import axios from "axios";

import { FaHeart, FaCheckCircle } from "react-icons/fa";

import lock from "/media/Silverlock.png";
import smile from "/media/Smile.png";
import linelock from "/media/whiteLine.png";
import { useState, useEffect } from "react";
import Reviews from "./Home_Pages/Reviews";
import ReviewPopup from "./ReviewPopup";
import { useParams, useNavigate } from "react-router-dom";
import product from "/media/products.png";
import { addToCart } from "../redux/cartSlice";
import { useDispatch } from "react-redux";
import Nopalmoil from "/media/Nopalmoil.png";
import natural00 from "/media/natural00.png";
import ScrollToTop from "../Component/ScrollToTop";
// import SearchBar from "../Component/SearchBar";
import agase from "/media/agase.png";
import groundnutchatneypudi from "/media/groundnutchatneypudi.png";
import cocnutchatneypudi from "/media/cocnutchatneypudi.png";
import blendcoffeepowder from "/media/blendcoffeepowder.png";
import avalakkimixture from "/media/avalakkimixture.jpg";
import dryfruitsunde from "/media/dryfruitsunde.jpg";
import bananachips from "/media/bananachips.png";
import chakli from "/media/chakli.png";
import powerstarblendcoffeepowder from "/media/powerstarblendcoffeepowder.png";
import hunasethokku from "/media/hunasethokku.png";
import sweets from "/media/sweets.jpg";


const API_BASE = "https://api.ravandurustores.com";
const toAbsolute = (img) =>
  typeof img === "string" && /^https?:\/\//i.test(img)
    ? img
    : `${API_BASE}${img?.startsWith("/") ? img : `/${img || ""}`}`;




export default function ProductsDetails() {
  
  const dispatch = useDispatch();
 

  const [isVisible, setIsVisible] = useState(false);

    const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [thumbnails, setThumbnails] = useState([]);
  const [mainImage, setMainImage] = useState("");
  const [price, setPrice] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInWishlist, setIsInWishlist] = useState(false);


  useEffect(() => {
    let abort = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const resp = await fetch(`${API_BASE}/api/products/${encodeURIComponent(id)}`);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = await resp.json();
        if (abort) return;

        const clampPct = (pct) => Math.min(100, Math.max(0, Number(pct || 0)));
const priceAfterPct = (base, pct) =>
  +(Math.max(0, Number(base) * (1 - clampPct(pct) / 100))).toFixed(2);
const pctFromPrices = (base, final) =>
  Number(base) > 0 ? Math.round(((Number(base) - Number(final)) / Number(base)) * 100) : 0;


        const variants = Array.isArray(data?.variants) ? data.variants : [];
const images   = Array.isArray(data?.images)   ? data.images   : [];

// read admin percentage (e.g., 5)
const pct = clampPct(data?.discountPercentage);

// Build image/variant cards with computed prices using admin %.
// If your API also returns a `discountPrice`, we use the pct first; fall back to that.
const imgs = images.map((img, i) => {
  const v = variants[i] ?? variants[0] ?? {};
  const base = Number(
    v.price ?? data.price ?? data.mrp ?? data.originalPrice ?? 0
  );

  const final = pct > 0
    ? priceAfterPct(base, pct)
    : Number(data.discountPrice ?? base);

  return {
    src: toAbsolute(img),
    weight: v.quantity ?? "",
    unit: v.unit ?? "",
    price: final,                 // final price (used in UI)
    originalPrice: base,          // keep base for strike-through/you save (optional)
    discountedPrice: final,
  };
});

const base0  = imgs[0]?.originalPrice ?? 0;
const final0 = imgs[0]?.discountedPrice ?? 0;

const formatted = {
  id: data._id,
  name: data.name,
  category: data.category,
  description: data.description,
  ingredientsDescription: data.ingredientsDescription,
  variants,
  images: imgs,

  // expose base/final and the ADMIN percentage for UI use
  originalPrice: base0,
  discountedPrice: final0,
  discountPercentage: pct > 0 ? pct : pctFromPrices(base0, final0),
};

setProduct(formatted);
setThumbnails(imgs);
setMainImage(imgs[0]?.src || "/media/placeholder.png");
setSelectedVariant(variants[0] ?? null);
setPrice(imgs[0]?.price ?? formatted.discountedPrice);

      } catch (e) {
        console.error("Product fetch failed:", e);
        if (!abort) setError("Failed to load product details");
      } finally {
        if (!abort) setLoading(false);
      }
    })();
    return () => { abort = true; };
  }, [id]);

  const handleIncrement = () => setQuantity(q => q + 1);
  const handleDecrement = () => setQuantity(q => (q > 1 ? q - 1 : 1));

 const handleAddToCart = () => {
  if (!product) return;

  const variant = selectedVariant || product.variants?.[0] || {};
  const weightLabel = [
    (variant.quantity ?? "").toString(),
    variant.unit ?? ""
  ].join(""); // e.g. "33kg"

  // Build the item the way your cartSlice expects it
  const item = {
    id: product.id,                
    name: product.name,
    image: mainImage || product.images?.[0]?.src || productPlaceholder,
    price: price || product.discountedPrice || product.originalPrice || 0,
    originalPrice: product.originalPrice ?? 0,
    discountedPrice: product.discountedPrice ?? 0,
    variantId: variant._id,         
    weight: weightLabel,            
    quantity,
  };



  dispatch(addToCart(item));
  navigate("/your-cart");
};

const handleAddToWishlist = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) {
      alert("Please log in to add to wishlist.");
      navigate("/login");
      return;
    }
    try {
     await fetch("https://api.ravandurustores.com/api/wishlist/add", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: user.id, productId: product.id }) });

      setIsInWishlist(true);
      alert("Product added to wishlist!");
    } catch (err) {
      if (err.response?.data?.message === "Product already in wishlist") {
        alert("Product is already in your wishlist.");
      } else {
        console.error("Error adding to wishlist:", err);
        alert("Something went wrong. Try again.");
      }
    }
  };

  const lineTotal = (price || 0) * quantity;

  if (loading) return <p>Loading product details...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return <p>Product not found.</p>;

  // helpers (top of the file or above the return)
const toNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const orig = toNumber(product?.originalPrice);
const disc = toNumber(product?.discountedPrice ?? product?.price ?? orig);

// percent shown in the badge only
const percentOff =
  orig > 0 && disc >= 0 && orig > disc
    ? Math.max(0, Math.round(((orig - disc) / orig) * 100))
    : 0;

// price displayed = original price * quantity (NOT reduced)
const displayAmount = orig > 0 ? orig * (quantity || 1) : (toNumber(price) * (quantity || 1));

const toPoints = (text = "") =>
  text
    .split(/[,.\n]/)       // split by comma, full stop, newline
    .map((t) => t.trim())
    .filter((t) => t.length > 0);

    const isMobile = window.innerWidth < 768;

  

  return (
    <>
     
<Row className="g-3" style={{padding:"30px"}}>
  {/* LEFT — STICKY COLUMN */}
  <Col
    md={6}
    className="position-sticky align-self-start left-product"
    style={{ top: 'calc(var(--nav-h, 80px) + 12px)', zIndex: 2 }}
  >
    {/* main image */}
    <img
      src={mainImage}
      alt={product.name}
      style={{ width: "100%", height: 350, objectFit: "contain" }}
    />

    {/* thumbnails */}
    <div className="d-flex flex-wrap justify-content-center gap-3 mt-3 ">
      {thumbnails.map((t, index) => {
        const active = mainImage === t.src;
        return (
          <img
            key={index}
            src={t.src}
            alt={`thumb-${index}`}
            onClick={() => {
              setMainImage(t.src);
              setPrice(t.price);
              // optionally sync variant with the clicked thumbnail index:
              if (product.variants?.[index]) {
                setSelectedVariant(product.variants[index]);
              }
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setMainImage(t.src);
                setPrice(t.price);
                if (product.variants?.[index]) {
                  setSelectedVariant(product.variants[index]);
                }
              }
            }}
            style={{
              width: 120,
              height: 120,
              objectFit: "cover",
              cursor: "pointer",
              borderRadius: 10,
              border: active ? "2px solid #00614A" : "2px solid #E3EEE9",
            }}
          />
        );
      })}
    </div>
  </Col>

  {/* RIGHT COLUMN */}
  <Col md={6} className="d-flex flex-column align-items-start right-product-desc">
    {/* Title */}
    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
      <h3
        style={{
          fontFamily: "poppins",
          fontWeight: "bold",
          textTransform: "uppercase",
          color: "red",
        }}
      >
        {product.name}
      </h3>
      
    </div>

    {/* Price */}
    <div className="price-line mt-3">
  <div className="d-flex align-items-end gap-2">
    <div className="pdp-price" style={{ fontFamily: "poppins" }}>
      ₹{displayAmount.toFixed(2)}
    </div>

    {percentOff > 0 && (
      <Badge
        bg="success"
        className="discount-badge"
        style={{
          fontFamily: "poppins",
          // optional: ensure it’s visible even if bootstrap CSS is missing/overridden
          backgroundColor: "#28a745",
          color: "#fff",
          borderRadius: "12px",
          padding: "4px 8px",
          fontSize: "12px",
          fontWeight: 600,
        }}
      >
        {percentOff}% OFF
      </Badge>
    )}

    <Button
                      variant="none"
                      onClick={handleAddToWishlist}
                      style={{
                        fontSize: "24px",
                        color: isInWishlist ? "#FF0000" : "#00614A",
                      }}
                      title={isInWishlist ? "Already in Wishlist" : "Add to Wishlist"}
                    >
                      <FaHeart />
                    </Button>
  </div>

  <div className="text-muted small" style={{ fontFamily: "poppins" }}>
    Inclusive of all taxes
  </div>

  <div className="mb-4 mt-3">
    <span
      style={{
        backgroundColor: "#d4f7dc",
        color: "green",
        padding: "4px 10px",
        borderRadius: "20px",
        fontWeight: 600,
        fontFamily: "poppins",
      }}
    >
      In stock
    </span>
  </div>
</div>


    {/* Pack size (variants as chips) */}
    {Array.isArray(product.variants) && product.variants.length > 0 && (
      <div className="mt-4">
        <div
          className="fw-semibold mb-2"
          style={{ fontSize: "25px", fontFamily: "poppins" }}
        >
          Select Quantity
        </div>
        <div className="d-flex flex-wrap gap-2">
          {product.variants.map((v, i) => {
            const label = `${v.quantity ?? ""}${v.unit ?? ""}`.trim() || "Default";
            const active =
              selectedVariant?._id
                ? selectedVariant._id === v._id
                : i === 0;
            return (
              <button
                key={v._id || i}
                type="button"
                className={`zepto-chip ${active ? "active" : ""}`}
                onClick={() => {
                  setSelectedVariant(v);
                  setPrice(v.price ?? product.discountedPrice);
                  // optional: change main image to same index
                  if (thumbnails[i]?.src) setMainImage(thumbnails[i].src);
                }}
                style={{
                  fontFamily: "poppins",
                  border: active ? "2px solid #00614a" : "1px solid #00614A",
                  background: active ? "rgba(2, 92, 20, 1)" : "transparent",
                  borderRadius: 999,
                  padding: "6px 14px",
                  cursor: "pointer",
                  color: active ? "#fff" : "inherit",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    )}

    {/* Quantity stepper */}
    <div className="d-flex flex-wrap align-items-center gap-3 mt-4 ">
      <div className="d-flex align-items-center border rounded-pill">
        <Button variant="link" className="qty-btn" onClick={() => setQuantity(q => Math.max(1, q - 1))}>
          −
        </Button>
        <span className="px-3">{quantity}</span>
        <Button variant="link" className="qty-btn" onClick={() => setQuantity(q => q + 1)}>
          ＋
        </Button>
      </div>
    </div>

    <div className="alert alert-warning mt-4" style={{ fontFamily: "poppins" }}>
      Enjoy 5% OFF on all products – shop now and save on every order!
    </div>

    {/* CTAs */}
    <div className="d-flex gap-3 mt-4 ">
      <Button
        variant="none"
        className="px-4 py-2 cart-btn"
        onClick={handleAddToCart}
        style={{
          backgroundColor: "#97d7c6",
          width: "200px",
          height: "50px",
          fontSize: "18px",
          borderRadius: "0",
          fontFamily: "poppins",
          fontWeight: "bold",
        }}
      >
        ADD TO CART
      </Button>
      <Button
        variant="none"
        className="px-4 py-2 buy-btn"
        onClick={handleAddToCart}
        style={{
          backgroundColor: "#97d7c6",
          width: "200px",
          height: "50px",
          fontSize: "18px",
          borderRadius: "0",
          fontFamily: "poppins",
          fontWeight: "bold",
        }}
      >
        BUY NOW
      </Button>
    </div>



{/* --- Details table --- */}
{!isMobile ? (
  /* ➤ DESKTOP VIEW — SHOW TABLE */
  <Table bordered responsive className="mt-4 mb-5">
    <tbody>
      <tr>
        <td style={{ fontFamily: "poppins", padding: "15px", width: "30%" }}>
          <strong>Product Description</strong>
        </td>
        <td style={{ fontFamily: "poppins", padding: "15px" }}>
          {product?.description || "No description available."}
        </td>
      </tr>

      <tr>
        <td style={{ fontFamily: "poppins", padding: "14px", width: "30%" }}>
          <strong>Product Ingredients</strong>
        </td>
        <td style={{ fontFamily: "poppins", padding: "14px" }}>
          {product?.ingredientsDescription || "No description available."}
        </td>
      </tr>
    </tbody>
  </Table>
) : (
  /* ➤ MOBILE VIEW — SHOW BULLET POINTS */
  <div className="mt-4 mb-5" style={{ fontFamily: "poppins" }}>
    
    {/* Product Description */}
    <h4 style={{ fontWeight: "600", color: "#00614A", fontSize: 18 }}>
      Product Description
    </h4>
    <ul style={{ paddingLeft: "20px", marginBottom: "20px" }}>
      {toPoints(product?.description).length ? (
        toPoints(product?.description).map((point, index) => (
          <li key={index} style={{ marginBottom: "6px", fontSize: 15 }}>
            {point}
          </li>
        ))
      ) : (
        <li>No description available.</li>
      )}
    </ul>

    {/* Product Ingredients */}
    <h4 style={{ fontWeight: "600", color: "#00614A", fontSize: 18 }}>
      Product Ingredients
    </h4>
    <ul style={{ paddingLeft: "20px" }}>
      {toPoints(product?.ingredientsDescription).length ? (
        toPoints(product?.ingredientsDescription).map((point, index) => (
          <li key={index} style={{ marginBottom: "6px", fontSize: 15 }}>
            {point}
          </li>
        ))
      ) : (
        <li>No description available.</li>
      )}
    </ul>
  </div>
)}

 </Col>
</Row>
<div className="mt-5">
            <h3
              style={{ fontSize: "25px", letterSpacing: "1px", fontFamily:"poppins", fontWeight:"bold" , marginLeft:"40px"}}
              
            >
              YOU MAY ALSO LIKE
            </h3>
            <div>
              <Products_Sliders />
            </div>
          </div>
        
 
        <ScrollToTop />
     
    </>
  );
}
