'use strict';

/**
 * order controller
 */
// sk_test_51NEUkCSGCv3lqfV6QK76RnJL3lPS8EHDa9sqUXtG9IcYgY6FsDJGC8fGGx7dF8ctsy5kIsFg6Quwzzx3H9NUp9Yg00V4pDIwyv
// const stripe = require('stripe')(process.env.STRIPE_SECRET);

const https = require('https');
const { createCoreController } = require('@strapi/strapi').factories;
const PaytmChecksum = require('paytmchecksum');

module.exports = createCoreController('api::order.order', ({ strapi }) => ({

    async create(ctx) {
        var paytmParams = {};

        paytmParams.body = {
            "requestType": "Payment",
            "mid": process.env.MID,
            "websiteName": "YOUR_WEBSITE_NAME",
            "orderId": "ORDERID_98765",
            "callbackUrl": "https://localhost:1337/api/order/preTransaction",
            "txnAmount": {
                "value": "1.00",
                "currency": "INR",
            },
            "userInfo": {
                "custId": "CUST_001",
            },
        };

        let checksum = await PaytmChecksum.generateSignature(JSON.stringify(paytmParams.body), process.env.M_KEY);
        
        paytmParams.head = {
            "signature": checksum
        };

        var post_data = JSON.stringify(paytmParams);

        var options = {
            /* for Staging */
            hostname: 'securegw-stage.paytm.in',

            /* for Production */
            // hostname: 'securegw.paytm.in',

            port: 443,
            path: `/theia/api/v1/initiateTransaction?mid=${process.env.MID}&orderId=ORDERID_98765`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': post_data.length
            }
        };

        var response = "";
        var post_req = https.request(options, function (post_res) {
            post_res.on('data', function (chunk) {
                response += chunk;
            });

            post_res.on('end', function () {
                console.log('Response: ', response);
                // Handle the response data as required
            });
        });

        post_req.write(post_data);
        post_req.end();
        ctx.body("Hello World");
    }
}));
