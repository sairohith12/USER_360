import React from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import pageLoader from '../../../public/json/user360-page-loader.json';
import apiLoader from '../../../public/json/user360-api-loader.json';

export const PageLoader = () => {
  return (
    <div className="loader-container">
      {/* <Lottie
        animationData={pageLoader}
        loop={true}
        style={{ width: 200, height: 200 }}
      /> */}
      <Player
        autoplay
        loop={true}
        src={pageLoader}
        style={{ width: 200, height: 200 }}
        // style={{ height: "200px", width: "200px", margin: "0 auto" }}
      />
      <span className="loader-text">Loading User 360...</span>
    </div>
  );
};

export const ApiLoader = () => {
  return (
    <div className="api-loader">
      {/* <Lottie
        animationData={apiLoader}
        loop={true}
        style={{ width: 64, height: 64 }}
      /> */}
      <Player autoplay loop={true} src={apiLoader} style={{ width: 64, height: 64 }} />
    </div>
  );
};
