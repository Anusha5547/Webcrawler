/**
  * Assumption 
  * 1) Site is accessible under HTTP or HTTPS protocol.
  * 2) As we Are saving in HTML format therefore Sometime Crude version could be displayed.
  * 3) <tag> string </tag> here string is treated as text node . 
  * 4) Only Those the are changed where text node has no sibling .
  * 5) Only those are node are changed which do not have any children.
  */
const https = require('https');
const http = require('http');
const cheerio = require('cheerio');
const fs = require('fs-extra');

var websiteList = [
                   "Wikipedia.org",
                   "google.com",
                   "youtube.com",
                   "facebook.com",
                   "baidu.com",
                   "Reddit.com",
                   "Yahoo.com",
                    "qq.com",
                    "Taobao.com",
                   "Amazon.com",
                    "Google.co.in",
                    "Tmall.com",
                   "Twitter.com",
                    "Sohu.com",
                    "Instagram.com",
                    "Vk.com",
                    "live.com",
                    "Jd.com",
                   "Sina.com.cn",
                   "Weibo.com",
                   "Yandex.ru",
                   "360.cn",
                   "Google.co.jp",
                   "Google.co.uk",
                   "login.tmall.com",
                   "Google.ru",
                   "Netflix.com",
                   "Google.com.br",
                   "Pornhub.com",
                   "Google.com.hk",
                   "Twitch.tv",
                   "Google.de",
                   "Google.fr",
                   "linkedin.com",
                   "yahoo.co.jp",
                   "t.co",
                   "csdn.net",
                   "microsoft.com",
                   "bing.com",
                   "office.com",
                   "ebay.com",
                   "alipay.com",
                   "xvideos.com",
                   "google.ca",
                   "mail.ru",
                   "google.it",
                   "ok.ru",
                   "msn.com",
                   "pages.tmall.com",
                   "microsoftonline.com"
                 ];
    var failedList = [];

function fetchContentOfUrl(url, websiteName) {
		return new Promise(function (resolve, reject) {
            https.get(url, function (res) {
                var body = "";
                res.setEncoding('utf8');

                res.on('error', function(err) {
                    console.log("Error!")
                });

                res.on('data', function (chunk) {
                    body += chunk;
                });
                res.on('end', function () {
                    resolve(body);
                })
            }).on('error', function(err) {
                //console.log("In! " + url);
                httpFetch('http://www.' + websiteName).then((body) => {
                    resolve(body);
                }).catch((err) => {
                    reject(err);
                });
            });
    });
}

function httpFetch(url) {
    return new Promise(function(resolve, reject) {
        http.get(url, function (res) {
            var body = "";
            res.setEncoding('utf8');
    
            res.on('error', function(err){
                console.log("Error!")
            });
    
            res.on('data', function (chunk) {
                body += chunk;
            });
            res.on('end', function () {
                resolve(body);
            })
        }).on('error', function(err) {
            console.log("In! " + url);
            reject();
        });
    })
}

function DoAll(list) {
    // list = list.splice(0, 1);
	var urlContentPromise = list.map((websiteName) => {
        const website = 'https://www.' + websiteName;
        console.log(website);
        return fetchContentOfUrl(website, websiteName).then((body) => {
            const $ = cheerio.load(body);

            function replaceText(selector, text, newText, flags) {
                var matcher = new RegExp(text, flags);
                $(selector).each(function () {
                    var $this = $(this);
                    // const type = $this['0']['type'];
                    if (!$this.children().length) {
                        // console.log($this.text());
                        $this.text($this.text().replace(matcher, newText));
                    }
                });
            }

            replaceText('*', '\\bthe\\b', 'dexecure', 'gi');
            return fs.writeFile('./webpages/' + websiteName + '.html', $.html(), 'utf-8').then((write) => {
                return {'name': websiteName, 'status': 'Success'};
            });
        }).catch((err) => {
           // console.log(url)
            console.log(err);
        });
    });
	return Promise.all(urlContentPromise).then((result) => {
        console.log(result);
    }).catch((err) => {
        console.log(err);
    })
}

DoAll(websiteList);