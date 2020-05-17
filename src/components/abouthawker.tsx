import React from "react";
import Slider from "react-slick";

import {Image} from 'semantic-ui-react';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./slick-theme.css"

class SimpleSlider extends React.Component {
  render() {
    var settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    };
    return (
    <div style={divStyle}>
        <Slider {...settings}>
        <div>
          <Image rounded centered fluid src="https://hawker-images.s3-ap-southeast-1.amazonaws.com/dummyimages/2ebbb4a1a5e741b771f61620518_original_.jpg"/>
        </div>
        <div>
          <Image rounded centered fluid src="https://hawker-images.s3-ap-southeast-1.amazonaws.com/dummyimages/chickenrice_566x424_fillbg_1b71b0de73.jpg"/>
        </div>
        <div>
          <Image rounded centered fluid src="https://hawker-images.s3-ap-southeast-1.amazonaws.com/dummyimages/e5d685f5e24f9837e7dd22e2f8e1c617.jpg"/>
        </div>
      </Slider>
    </div>
    );
  }
}

const divStyle= {
    "margin": "2em"
}

export default SimpleSlider