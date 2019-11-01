import React from 'react';
import './App.css';
import Button from '@material-ui/core/Button';

import TopMenu from './banner'
import CenteredTabs from './tabs'
import 'react-banner/dist/style.css'
import LandingPage from "./views/LandingPage/LandingPage.js";
import OutlinedInputAdornments from './boxes'


import { Provider, Heading, Subhead } from 'rebass'
import {
  Hero, CallToAction, ScrollDownIndicator, Section, Checklist
} from 'react-landing-page'

const featherCheckmark = <svg
  xmlns="http://www.w3.org/2000/svg"
  width="24" height="24"
  viewBox="0 0 24 24"
  fill="none" stroke="currentColor"
  strokeWidth="2"
  strokeLinecap="round"
  strokeLinejoin="round"
>
  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
  <polyline points="22 4 12 14.01 9 11.01"/>
</svg>

class App extends React.Component {
 // const App = props => (
 render() {
   return (
       <div className="App">
      <body>
      
      <TopMenu/>
      <CenteredTabs/>
    
      <OutlinedInputAdornments/>
      <Button variant="contained" color="primary">
      Buy
    </Button>
        <Button variant="contained" color="primary">
      Sell
    </Button>
      </body>
     </div>      
      
    );
  }
}
 
export default App;

