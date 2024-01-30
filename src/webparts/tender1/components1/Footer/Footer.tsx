

import * as React from 'react';
import {Container } from 'react-bootstrap';
import './Footer.css'



interface FooterProps{

    Title: string;

}

const Footer: React.FC<FooterProps> = ({Title}) => {



return(


    <Container className='footer'>

    <div className='footer-heading'><h6>{Title}</h6></div>
    
    
    </Container>





)



}

export default Footer;