import React from 'react'

const OrderInfo = () => (<div className="mt-5">
        <fieldset style={{boxShadow:'2px 2px 5px',padding:15}}>
            <legend className="bg-white w-auto px-1">INFO</legend>
            <h6>Payment address:  Y Kahn  18253 Topham St Tarzana CA 91335</h6>
            <p><i className="p-3 text-primary fa fa-paypal"></i>Paypal :<em> chabad18@hotmail.com</em></p>
            <p><i className="p-3 text-success fa fa-dollar"></i>Cash App :<em> 8186052066</em></p>
            <p><i style={{color:'#7133a3'}} className="p-3">Z</i>Zelle :<em> chabad18@hotmail.com</em></p>
            <p><i className="p-3 fa fa-list-alt text-info"></i>Check :<em> 18253 Topham St Tarzana CA 91335</em></p>
            <h6>
                Place Lulavim in a cool area and keep in a closed box
                Hadasim and Aravos should be refrigerated
                Inspect all merchandise for Kashrus
                Report any damaged products within 24 hours of receiving shipment.
                <br/>Have a good Yom Tov!
                <br/>Yanky Kahn. <a href="tel:818-605-2066" className="text-dark">818-605-2066</a>
            </h6>
        </fieldset>             
    </div>);


export default OrderInfo;