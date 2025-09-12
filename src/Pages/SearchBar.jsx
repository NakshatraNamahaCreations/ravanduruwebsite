import { Container, Button, Form, FormControl } from "react-bootstrap";

export default function SearchBar() {
  return (
    <>
      {/* SEARCH */}
      <Container
        className="my-4 search-container"
        style={{
          margin: "auto",
          width: "850px",
          fontFamily: "kapraneue, sans-serif",
        }}
      >
        <Form className="d-flex custom-search">
          <FormControl
            type="search"
            placeholder="Search our products..."
            className="me-2 input-account-forms search-input"
            style={{
              border: "1.5px solid #00614A",
              
              fontFamily:"poppins"
            }}
          />
          <Button
            variant="none"
            className="search-button"
            style={{
              fontWeight: "bold",
              color: "#00614A",
              backgroundImage: "url('/media/Searchbutton.png')",
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              border: "none",
              padding: "25px 30px",
              fontSize: "24px",
              fontFamily:"poppins"
            }}
          >
            SEARCH
          </Button>
        </Form>
      </Container>
    </>
  );
}
