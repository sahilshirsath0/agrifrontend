import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProductCard from "../components/ProductCard";
import "./History.css";


const historyItems = [
  { id: 1, title: "Organic Fertilizer", image: "https://source.unsplash.com/200x200/?fertilizer", price: 299 },
  { id: 7, title: "Growth Promoter", image: "https://source.unsplash.com/200x200/?crop", price: 349 },
];

const History = () => {
  return (
    <Container>
      <h2 className="section-title">Purchase History</h2>
      <Row>
        {historyItems.map((product) => (
          <Col key={product.id} xs={6} sm={4} md={3} lg={3} className="mb-4">
            <ProductCard title={product.title} image={product.image} price={product.price} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default History;
