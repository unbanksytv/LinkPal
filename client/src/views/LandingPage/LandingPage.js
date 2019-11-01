import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// @material-ui/icons

// core components
import Header from "components/Header/Header.js";
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import NavPills from "components/NavPills/NavPills.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import Parallax from "components/Parallax/Parallax.js";

import CenteredTabs from 'tabs'

import styles from "assets/jss/material-kit-react/views/landingPage.js";

// Sections for this page
import ProductSection from "./Sections/ProductSection.js";

// @material-ui/icons
import Camera from "@material-ui/icons/Camera";
import Palette from "@material-ui/icons/Palette";
import BuySteppers from "buyStepper";
import SellSteppers from "sellStepper";

const dashboardRoutes = [];

const useStyles = makeStyles(styles);

export default function LandingPage(props) {
  const classes = useStyles();
  const navImageClasses = classNames(classes.imgRounded, classes.imgGallery);
  const { ...rest } = props;
  return (
    <div>
      <Header
        color="transparent"
        routes={dashboardRoutes}
        brand="LinkPal"
        rightLinks={<HeaderLinks />}
        fixed
        changeColorOnScroll={{
          height: 400,
          color: "white"
        }}
        {...rest}
      />
      <Parallax filter image={require("./landing-bg.jpg")}>
        <div className={classes.container}>
          <GridContainer>
            <GridItem xs={12} sm={12} md={6}>
              <h1 className={classes.title}>Buy or Sell ETH With PayPal (Ropsten Testnet)</h1>
              <h4>
                Decentralized ETH escrow for ETH/FIAT trading using PayPal or credit/debit card. <br /> Ethereum smart contract data provided by Chainlink oracles.
              </h4>
              <br />
              <Button
                color="danger"
                size="lg"
                href="link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fas fa-play" />
                How It Works
              </Button>
            </GridItem>
          </GridContainer>
        </div>
      </Parallax>
      <div className={classNames(classes.main, classes.mainRaised)}>      
        <div className={classes.container}>
          <ProductSection />          
            {/* <CenteredTabs/> */}

            <GridContainer justify="center">
              <GridItem xs={12} sm={12} md={8} className={classes.navWrapper}>
                {/* <h2 className={classes.title}>Trade</h2> */}
                <NavPills
                  alignCenter
                  color="primary"
                  tabs={[
                    {
                      tabButton: "Selling",
                      tabIcon: Camera,
                      tabContent: (
                        <SellSteppers/>                       
                      )
                    },
                    {
                      tabButton: "Buying",
                      tabIcon: Palette,
                      tabContent: (
                       <BuySteppers/>
                      )
                    }
                  ]}
                />
              </GridItem>
            </GridContainer>

          {/* <TeamSection />
          <WorkSection /> */}
        </div>
      </div>
      <Footer />
    </div>
  );
}
