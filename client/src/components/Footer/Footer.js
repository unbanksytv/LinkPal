/*eslint-disable*/
import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// nodejs library that concatenates classes
import classNames from "classnames";
// material-ui core components
import { List, ListItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

// @material-ui/icons
import Favorite from "@material-ui/icons/Favorite";

import styles from "assets/jss/material-kit-react/components/footerStyle.js";

const useStyles = makeStyles(styles);

export default function Footer(props) {
  const classes = useStyles();
  const { whiteFont } = props;
  const footerClasses = classNames({
    [classes.footer]: true,
    [classes.footerWhiteFont]: whiteFont
  });
  const aClasses = classNames({
    [classes.a]: true,
    [classes.footerWhiteFont]: whiteFont
  });
  return (
    <footer className={footerClasses}>
      <div className={classes.container}>
        <div className={classes.left}>
           <List className={classes.list}>
            <ListItem className={classes.inlineBlock}>
              <a
                href="https://www.twitter.com/linkpal_io"
                className={classes.block}
                target="_blank"
              >
                Twitter
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a
                href="https://t.me/joinchat/E8SAPEUVQHSiKjSyGWkf9g"
                className={classes.block}
                target="_blank"
              >
                Telegram
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a
                href="https://github.com/vvoluom/LinkPal"
                className={classes.block}
                target="_blank"
              >
                GitHub
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a
                href="http://www.reddit.com/r/linkpal/"
                className={classes.block}
                target="_blank"
              >
                Reddit
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a
                href="https://ropsten.etherscan.io/address/0xd770fa5b25ce0c48ccfbd925b753322c1f69bcb3"
                className={classes.block}
                target="_blank"
              >
                Ropsten Etherscan
              </a>
            </ListItem>
          </List> 
        </div>
        <div className={classes.right}>          
        be <a
            href="http://linkpal.io"
            className={aClasses}
            target="_blank"
          > <b>LinkPal</b>
          </a> free. 
        </div>
      </div>
    </footer>
  );
}

Footer.propTypes = {
  whiteFont: PropTypes.bool
};
