# SLY’s Influence by Shadow Loyal [SLY]
This is a browser-based script to perform actions within the game Influence.

Current features:
* Bulk lot lease extensions and synchronization
* Bulk whitelist agreement synchronization

Limitations:
* The tool only works with Argent X.

### SECURITY NOTICE
Users are encouraged to build their own instance of browser-compatible resource file. Doing so ensures that you are using trusted code. Pre-built files are provided for convenience. 

### Building your own browserified version
This script uses browserified versions of Starknet, Starknetkit, Influence SDK, and Elastic-Builder. This is necessary to make the functionality offered by these libraries available from an in-browser client-side context.

```
browserify esb-input.js --standalone BrowserESB -o elasticbuilder-browserified.js
```

esb-input.js
```
const esb = require("elastic-builder");
module.exports = {esb};
```
Unfortunately, Starknet, Starknetkit, and Influence SDK are significantly more complicated to browserify due to variations in requirements and build targets. Generally, the source was downloaded and a new node project with necessary requirements was created. Typescript Compiler (tsc) was used to create javascript. The newly created javascript files were then bundled using browserify. The final result was manually modified to replace require references with external references.

### Why TamperMonkey
We are frequently asked why we chose TamperMonkey (userscript) rather than a traditional browser extension/plugin. The simple answer is to encourage user independence.
With a userscript, the user maintains full control over the code that is executed. Everything is in plain text which makes it easier to self-audit. Additionally, the user can easily modify the script without any additional special tools.

### Usage
The script is built as a TamperMonkey script. [TamperMonkey](https://www.tampermonkey.net/) is a userscript manager available for free as a browser extension.

#### Setup
1. Install TamperMonkey
2. Select the SLYs_Influence.user.js file in this repo. View the file and click the "Raw" button to view its source.
3. Copy the source
4. Open Tampermonkey in your browser and click the Add Script tab (icon with a plus symbol)
5. Paste the source into the script window and click File > Save
6. Browse to [https://game.influenceth.io/](https://game.influenceth.io/)
7. Launch the game as normal

## Contact Information
Our discord: https://discord.gg/DCD9CuJFRr

Our github: https://github.com/ImGroovin
