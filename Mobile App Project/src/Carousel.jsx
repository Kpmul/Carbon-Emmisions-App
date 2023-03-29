import { Carousel } from "react-bootstrap";
import React, { useState } from "react";
import pathImage from "./images/path.jpeg";
import yosimite from "./images/yosimite.jpg";
import amazon from "./images/amazon.jpg";

function SecondChild() {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };
  return (
    <div classname="SecondChild">
      <Carousel activeIndex={index} onSelect={handleSelect}>
        <Carousel.Item>
          <img className="d-block w-100" src={pathImage} alt="First slide" />
          <Carousel.Caption>
            <h3>Wicklow Forest</h3>
            <p>Save the planet</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img className="d-block w-100" src={amazon} alt="Second slide" />

          <Carousel.Caption>
            <h3>Amazon Forest</h3>
            <p>Help us reserve this beauty</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img className="d-block w-100" src={yosimite} alt="Third slide" />

          <Carousel.Caption>
            <h3>Yosimite Park</h3>
            <p>Be conscious</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </div>
  );
}

export default SecondChild;
