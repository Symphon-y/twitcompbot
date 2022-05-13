# TwitCompBot

TwitCompBot is a discord bot that can help the aspiring composer easily find music composition contests by searching twitter everyday for new composition contests. TwitCompBot also has google calendar functionality to automatically post events into a channel from a google calendar of your choice, and finally it has the ability to search twitter for recent tweets from a custom search defined by the $search [search term] function.

## Installation

1. Create a [Discord Bot](https://discord.com/developers/docs/intro)
2. Sign up for a [Twitter Developer Account](https://developer.twitter.com/)
3. Sign up for [Google Developer Account](https://console.cloud.google.com/)
4. Create .env file in installation directory with the above credentials
5. Run 

```bash
npm run start
```

## Usage

```
## In Discord

# Sets the Twitter Feed Channel
$setfeed

# Sets the Calendar Feed Channel
$setcal

# Search's Recent Tweets From the Specified Search Term
$search [search term]
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT License](https://choosealicense.com/licenses/mit/)

Copyright (c) 2022 Travis R. Redden

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
