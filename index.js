const fetchUrl = require("fetch").fetchUrl;
const functions = require("firebase-functions");
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const twilio_phone_number = process.env.TWILIO_PHONE_NUMBER; // Your Twilio number
const to_phone_number = process.env.TO_PHONE_NUMBER; // +447XXXXXXXXX


exports.alertMe = functions
    .runWith({ memory: '1GB' })
    .pubsub.schedule('0 */2 * * *')
    .timeZone('America/New_York')
    .onRun(async context => {
        functions.logger.info("Hello there....checking ETH gas fee for you every 2 hours!");

        // Gets the current ETH gas price. Has a limit on requests.
        const check_gas_url = 'https://owlracle.info/eth/gas';

        fetchUrl(check_gas_url, (error, meta, body) => {
            if (error) {
                console.log("Error is fetching gas fee:" + error);
            } else {
                // mock response
                // const resp = JSON.parse('{"timestamp":"2022-02-17T10:31:52.856Z","baseFee":39.09282494926397,"lastBlock":14223113,"avgTime":13.557788944723619,"avgTx":185.045,"avgGas":87105.97578039169,"speeds":[{"acceptance":0.35,"gasPrice":37.803011288,"estimatedFee":10.115559351676623},{"acceptance":0.6,"gasPrice":41.982056554,"estimatedFee":11.23381366479229},{"acceptance":0.9,"gasPrice":49.135765727,"estimatedFee":13.14804661234284},{"acceptance":1,"gasPrice":62.2967528,"estimatedFee":16.66974346472668}]}');
                const resp = JSON.parse(body);

                const std_gas_fee = Number(resp['speeds'][1]['gasPrice']);

                // alert only if the ETH gas fee is less than 50 GWei
                if (std_gas_fee < 50) {
                    console.log("Fair gas fee alert...");

                    const message = `Current Ethereum base gas fee is ${std_gas_fee} GWei. I repeat ${std_gas_fee} GWei`;

                    const twilioClient = twilio(accountSid, authToken, { accountSid });

                    // Sending a MSG alert
                    // twilioClient.messages
                    //     .create({ body: message, from: twilio_phone_number, to: to_phone_number })
                    //     .then(message => console.log("Twilio msg sent" + message.sid));

                    // Sending a CALL alert to your phone
                    twilioClient.calls
                        .create({
                            twiml: `<Response><Say>${message}</Say></Response>`,
                            to: to_phone_number,
                            from: twilio_phone_number
                        })
                        .then(call => console.log(call.sid));

                    console.log(`Twilio alert sent successfully. Base Gas Fee one must pay: ${std_gas_fee} GWei`);
                } else {
                    console.log(`No need to send an alert. Fees are ridiculously high: ${std_gas_fee} GWei`);
                }
            }
        });
    });
    