const puppeteer = require('puppeteer');
const imgur = require('imgur');



(async () => {
    var res = await GetCovidStats('latvia');
    if (res != null && res.startsWith("data:")) {
        imgur.setClientId('8d3813e6a4f69d7');
        imgur.uploadBase64(res.replace('data:image/png;base64,', ''))
                .then((json) => {
                    console.log(json.link);
                })
                .catch((err) => {
                    console.error(err.message);
                });
    } else {
        console.log(res);
    }
    //process.exit();
})();



async function GetCovidStats(country) {
    const browser = await puppeteer.launch({
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-web-security",
            //"--incognito",
            //'--lang=bn-BD,bn',
            //"--single-process",
            //"--no-zygote",
        ],
        defaultViewport: null,
        headless: true,
    });

    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({'Accept-Language': 'en-GB'});
    await goto(page, `https://www.google.com/search?q=covid+statistics+${country}`);
    await Wait(2000);

    var result = await page.evaluate(async function() {
        return await new Promise(async resolve => {
            try {    
                //Agree to terms
                document.querySelectorAll(".jyfHyd")[1].click();
                await new Promise(resolve => setTimeout(resolve, 500));

                //Return if no graph found
                if (!document.querySelector(".PDn9ad.iiUHhf")) { resolve("No graph"); }
    
                //Set period to 2 weeks
                document.querySelector("[data-per='LAST_14_DAYS']").click();
		document.querySelector("[data-per='LAST_14_DAYS']").click();
		document.querySelector("[data-per='LAST_14_DAYS']").click();
                await new Promise(resolve => setTimeout(resolve, 5000));
    
                //Take screenshot of graph
                var script = document.createElement("script");
    
                script.onload = function () {
                    //html2canvas(document.querySelector(".PDn9ad.iiUHhf")).then(canvas => {
                    html2canvas(document.querySelector("body")).then(canvas => {
                        resolve(canvas.toDataURL("image/png"));
                    });
                };
    
                script.src = 'https://html2canvas.hertzen.com/dist/html2canvas.min.js';
                document.head.appendChild(script);
            } catch (e) {
                return resolve("error");
            }
        });
    });

    await browser.close();
    return result;
}

async function goto(page, url, options) {
    try {
        await page.goto(url, options)
    } catch (e) {
        await page.close();
        await goto(page, url, options);
    }
}

async function Wait(milleseconds) {
	return new Promise(resolve => setTimeout(resolve, milleseconds))
}
