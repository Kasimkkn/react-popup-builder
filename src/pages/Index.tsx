
import React from "react";
import AppLayout from "../components/layout/AppLayout";
import { Helmet } from 'react-helmet';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Popup Builder - Create Custom Popups</title>
        <meta name="description" content="Create beautiful, customizable popups without code. Design, preview, and export production-ready code in minutes." />
      </Helmet>
      <AppLayout />
    </>
  );
};

export default Index;
