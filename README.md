# What

Do you know an average millennial spends 3.5 hours a day tracking Ethereum gas fees trying to find the best price? :astonished: (Okay, that's totally made up).

But yeah that's how I feel like I've spent a lifetime tracking the gas fees. What if you can write a code that does it for you and rings you on your phone if there's an attractive price on offer?

## Here we go
This project does exactly what you read above.

- Checks current ETH gas fee :chart:
- Does nothing if the prices are too high (like what you'd do otherwise :cry:)
- Or if there's surprsingly a rare scenario where the gas fees are pretty cheap :money_mouth_face:, you'll get a phone call pushing you to spend the last few dollars left in you wallet :pouch: 

## Tech
- We're using [Google Firebase functions](https://firebase.google.com/docs/functions) to run a Cron every 'X' period
- Fetches Gas fees from [owlracle](https://owlracle.info/eth)
- Uses [Twilio's](https://www.twilio.com/docs/voice) awesome API to ring you

### Voila! You can now save millions of bucks :moneybag: and time :hourglass:
