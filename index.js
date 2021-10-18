const got = require('got');
const puppeteer = require('puppeteer');
const imgur = require('imgur');



(async () => {
    var res = await GetCovidStats('latvia');
    console.log(res);
    return;

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
    await goto(page, `https://www.google.com/search?q=covid+statistics+daily`);
    await Wait(1000);

    var result = await page.evaluate(async function(country) {
        try {
            document.querySelectorAll(".jyfHyd")[1].click();
            await new Promise(resolve => setTimeout(resolve, 500));
            //document.querySelectorAll('.AlKDIb')[1].click();
            //await new Promise(resolve => setTimeout(resolve, 500));
            //document.querySelectorAll(".UbwB7c")[1].focus();
            //await new Promise(resolve => setTimeout(resolve, 500));
            //document.execCommand("insertText", false, country);
            //await new Promise(resolve => setTimeout(resolve, 500));
            //var element = document.querySelectorAll("div.D51jpe.hzhyof:not([style='display: none;']")[0];
            //if (element.getAttribute("data-ddt") == "CONFIRMED_CASES") { return "CONFIRMED_CASES"; }
            //element.click();

            //await new Promise(resolve => setTimeout(resolve, 500));
            //document.querySelectorAll(".AlKDIb")[2].click();
            //await new Promise(resolve => setTimeout(resolve, 500));
            //document.querySelectorAll(".D51jpe.hzhyof")[2].click();

            //await new Promise(resolve => setTimeout(resolve, 500));
            //var script = document.createElement("script");
            //var base64 = null;

            //script.onload = function () {
                //html2canvas(document.querySelector(".PDn9ad.iiUHhf")).then(canvas => {
                    //html2canvas(document.querySelector("body")).then(canvas => {
                    //base64 = canvas.toDataURL("image/png");
                //});
            //};

            //script.src = 'https://html2canvas.hertzen.com/dist/html2canvas.min.js';
            //document.head.appendChild(script);
            //while (base64 == null) { await new Promise(resolve => setTimeout(resolve, 5)); }
            //return base64;

            var script = document.createElement('script');
            var result = null;
    
            script.onload = function () {
                result = $(".PDn9ad.iiUHhf")[0].outerHTML;
            };
    
            script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
            document.head.appendChild(script);
            while (result == null) { await new Promise(resolve => setTimeout(resolve, 5)); }
            //console.log(result);
            return result;
        } catch (e) {
            return "error";
        }
    }, country);

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
