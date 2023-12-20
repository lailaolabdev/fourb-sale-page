import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faPhoneVolume } from "@fortawesome/free-solid-svg-icons";
import { faFacebookF } from "@fortawesome/free-brands-svg-icons";
import { APPZAP_S3_SMALL, CORLOR_APPZAP } from '../constants'

export default function Sidenav({storeImage, storeName, serviceDay, show, onHide}) {
    const [isShow, setIsShow] = useState(false)

    useEffect(() => {
        if(show) setIsShow(true)
        else setIsShow(false)
    }, [show])
    
    return (
        <div className='side-nav-container'>
            <div className='side-nav-overlay' onClick={() => onHide()} style={{width: isShow ? "100vw" : 0}}></div>
            <div className='side-nav-content' style={{left: isShow ? 0 : "-85vw"}}>
                <div
                    className="smart-menu_header"
                    style={{ height: "100px", width: "100%", padding: "20px 10px 20px 0" }}
                >
                    <FontAwesomeIcon icon={faChevronLeft} style={{padding: 10}} color={CORLOR_APPZAP} fontSize={24} onClick={()=> onHide()} />
                    <img className="side-nav-img" src={APPZAP_S3_SMALL + storeImage} alt='' />
                    <div className="shop-name_container">
                        <h3 style={{color: CORLOR_APPZAP}}>{storeName}</h3>
                        <div style={{ fontSize: "12px", marginTop: "8px", color: CORLOR_APPZAP }}>
                            {serviceDay}
                        </div>
                    </div>
                </div>

                <div className='side-nav-contact-us'>
                    <span className='side-nav-contact-us-title'>ຕິດຕໍ່ຫາເຮົາ</span>
                    <a href='https://www.facebook.com/AppZapLaos' target='_blank' style={{textDecorationLine: "none"}}>
                        <div className='side-nav-contact-us-list mt-18'>
                            <FontAwesomeIcon icon={faFacebookF} color={CORLOR_APPZAP} fontSize={24}/>
                            <span className='side-nav-contact-us-text'>AppZap - Eat Earn Everywhere</span>
                        </div>
                    </a>
                    <div className='side-nav-contact-us-list'>
                        <FontAwesomeIcon icon={faPhoneVolume} color={CORLOR_APPZAP} fontSize={24}/>
                        <span className='side-nav-contact-us-text'>+85620 5548 6442</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
