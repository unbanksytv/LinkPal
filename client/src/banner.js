import React from 'react'
import Banner from 'react-banner'
import 'react-banner/dist/style.css'
 
export default function TopMenu(){
    return (
        <Banner
        logo="LinkPal"
        url={ window.location.pathname }
        items={[
            { "content": "Create Listing", "url": "/create" },
            { "content": "Active Listings", "url": "/verify" },
            {
                "content": "About",
                "url": "/about",
                "children": [
                    { "content": "LinkPal", "url": "/about/LinkPal" },
                    { "content": "Chainlink", "url": "/about/chainlink" }
                ]
            }
        ]} />
    )
}