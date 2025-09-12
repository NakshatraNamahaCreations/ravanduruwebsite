import Accordion from "react-bootstrap/Accordion";
import { useState } from "react";
import { Container, Form } from "react-bootstrap";
import Select from "react-select";
// import Navbar_Menu from "../../Component/Navbar_Menu";

const countryCodes = [
  { value: "+91", label: "+91 (India)" },
  { value: "+1", label: "+1 (USA)" },
  { value: "+44", label: "+44 (UK)" },
  { value: "+61", label: "+61 (Australia)" },
  { value: "+81", label: "+81 (Japan)" },
];

export default function GeneralSettings() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    countryCode: countryCodes[0],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (selectedOption) => {
    setFormData({ ...formData, countryCode: selectedOption });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
  };

  return (
    <>
      {/* NAVBAR */}

      {/* <Navbar_Menu /> */}

      <div className="mt-5">
        <h1
          style={{
            color: "#00614A",
            fontWeight: "bold",
            textAlign: "center",
            fontFamily: "oswald, sans-serif",
            fontSize: "64px",
            letterSpacing: "2px",
          }}
          className="mobile-font"
        >
          YOUR ACCOUNT
        </h1>
      </div>

      <Container
        className="mt-5 general-setting-container"
        style={{ fontFamily: "oswald, sans-serif" }}
      >
        
                <Form onSubmit={handleSubmit}>
                  {/* Name */}
                  <Form.Group className="mb-3">
                    <Form.Label
                      style={{
                        color: "#00614A",
                        fontWeight: "bold",
                        fontSize: "20px",
                        letterSpacing: "1px",
                      }}
                    >
                      Name
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      style={{
                        fontSize: "18px",
                        padding: "12px",
                        borderRadius: "10px",
                        backgroundColor: "#ffffff",
                        border: "1.5px solid #00614A",
                        fontFamily: "oswaldMedium, sans-serif" 
                      }}
                      className="input-account-forms search-input"
                    />
                  </Form.Group>

                  {/* Email */}
                  <Form.Group className="mb-3">
                    <Form.Label
                      style={{
                        color: "#00614A",
                        fontWeight: "bold",
                        fontSize: "20px",
                        letterSpacing: "1px",
                      }}
                    >
                      Email ID
                    </Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      style={{
                        fontSize: "20px",
                        padding: "12px",

                        borderRadius: "10px",
                        backgroundColor: "#ffffff",
                        border: "1.5px solid #00614A",
                        fontFamily: "oswaldMedium, sans-serif" 
                      }}
                      className="input-account-forms search-input"
                    />
                  </Form.Group>

                  {/* Phone Number */}
                  <Form.Group className="mb-3">
                    <Form.Label
                      style={{
                        color: "#00614A",
                        fontWeight: "bold",
                        fontSize: "20px",
                        letterSpacing: "1px",
                      }}
                    >
                      Phone Number
                    </Form.Label>
                    <div style={{ display: "flex", gap: "15px", fontFamily: "oswaldMedium, sans-serif"  }}>
                      {/* Country Code */}
                      <div style={{ flex: "0.4" }}>
                        <Select
                          options={countryCodes}
                          value={formData.countryCode}
                          onChange={handleSelectChange}
                          classNamePrefix="custom"
                          className="phone-code"
                          styles={{
                            control: (base) => ({
                              ...base,
                              fontSize: "20px",
                              padding: "12px",
                              borderRadius: "10px",
                              backgroundColor: "#ffffff",
                              border: "1.5px solid #00614A",
                              letterSpacing:'1px',
                              color:'#00614A'
                            }),
                          }}
                        />
                      </div>
                      {/* Phone Input */}
                      <Form.Control
                        type="tel"
                        name="phone"
                        placeholder="Enter phone number"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        style={{
                          flex: "0.6",
                          fontSize: "20px",
                          padding: "12px",
                          borderRadius: "10px",
                          backgroundColor: "#ffffff",
                          border: "1.5px solid #00614A",
                          fontFamily: "oswaldMedium, sans-serif" 
                        }}
                        className="input-account-forms  search-input"
                      />
                    </div>
                  </Form.Group>
                </Form>
              </Container>
           
   
    </>
  );
}
