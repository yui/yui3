YUI.add('yql-api-mock', function (Y) {
    Y.YQL = function (query, callback) {
        var data = null;

        switch (query) {
        case 'SELECT * FROM flickr.photos.search(100) WHERE (text="yuiconf") AND (safe_search = 1) AND (media = "photos") AND (api_key = "1895311ec0d2e23431a6407f3e8dffcc")':
            data = {
                'query': {
                    'results': {
                        'photo': [{
                            "farm": "6",
                            "id": "10731269363",
                            "isfamily": "0",
                            "isfriend": "0",
                            "ispublic": "1",
                            "owner": "32363719@N04",
                            "secret": "d4a53d38bb",
                            "server": "5491",
                            "title": "Evil Smugmug logo. #yuiconf"
                        }, {
                            "farm": "9",
                            "id": "8206794756",
                            "isfamily": "0",
                            "isfriend": "0",
                            "ispublic": "1",
                            "owner": "42995562@N00",
                            "secret": "309ea45658",
                            "server": "8343",
                            "title": "Evan Goer: This is not a grammar lecture."
                        }, {
                            "farm": "9",
                            "id": "8205707949",
                            "isfamily": "0",
                            "isfriend": "0",
                            "ispublic": "1",
                            "owner": "42995562@N00",
                            "secret": "d9452568a0",
                            "server": "8204",
                            "title": "@ericf"
                        }, {
                            "farm": "9",
                            "id": "8206796598",
                            "isfamily": "0",
                            "isfriend": "0",
                            "ispublic": "1",
                            "owner": "42995562@N00",
                            "secret": "745c297314",
                            "server": "8069",
                            "title": "Discussing YUI in the Main Room"
                        }, {
                            "farm": "9",
                            "id": "8205703761",
                            "isfamily": "0",
                            "isfriend": "0",
                            "ispublic": "1",
                            "owner": "42995562@N00",
                            "secret": "9392e9f456",
                            "server": "8069",
                            "title": "Luke Smith Answering Questions"
                        }, {
                            "farm": "9",
                            "id": "8205708891",
                            "isfamily": "0",
                            "isfriend": "0",
                            "ispublic": "1",
                            "owner": "42995562@N00",
                            "secret": "a4b773cf05",
                            "server": "8337",
                            "title": "Tilo Mitra"
                        }, {
                            "farm": "9",
                            "id": "8205710047",
                            "isfamily": "0",
                            "isfriend": "0",
                            "ispublic": "1",
                            "owner": "42995562@N00",
                            "secret": "de6acd06c0",
                            "server": "8482",
                            "title": "YUI Cupcake"
                        }, {
                            "farm": "9",
                            "id": "8206800094",
                            "isfamily": "0",
                            "isfriend": "0",
                            "ispublic": "1",
                            "owner": "42995562@N00",
                            "secret": "344379ee91",
                            "server": "8202",
                            "title": "YUI Cupcakes"
                        }, {
                            "farm": "9",
                            "id": "8205702719",
                            "isfamily": "0",
                            "isfriend": "0",
                            "ispublic": "1",
                            "owner": "42995562@N00",
                            "secret": "478caa6514",
                            "server": "8207",
                            "title": "Luke Smith Attribute Walkthrough"
                        }, {
                            "farm": "9",
                            "id": "8206797592",
                            "isfamily": "0",
                            "isfriend": "0",
                            "ispublic": "1",
                            "owner": "42995562@N00",
                            "secret": "219a20d8e1",
                            "server": "8341",
                            "title": "YUI, OSS & Community Title Card"
                        }, {
                            "farm": "9",
                            "id": "8185843223",
                            "isfamily": "0",
                            "isfriend": "0",
                            "ispublic": "1",
                            "owner": "52201706@N04",
                            "secret": "5b3a423201",
                            "server": "8206",
                            "title": "YUIConf 2012"
                        }, {
                            "farm": "9",
                            "id": "8183882165",
                            "isfamily": "0",
                            "isfriend": "0",
                            "ispublic": "1",
                            "owner": "42995562@N00",
                            "secret": "31b4398e9b",
                            "server": "8204",
                            "title": "YUIConf Yeti demo test"
                        }, {
                            "farm": "7",
                            "id": "6357181053",
                            "isfamily": "0",
                            "isfriend": "0",
                            "ispublic": "1",
                            "owner": "46465959@N05",
                            "secret": "b54403dcb0",
                            "server": "6102",
                            "title": "yuiconf2011_logo"
                        }, {
                            "farm": "7",
                            "id": "6312553444",
                            "isfamily": "0",
                            "isfriend": "0",
                            "ispublic": "1",
                            "owner": "70408381@N00",
                            "secret": "0b8fc706bb",
                            "server": "6238",
                            "title": "Section 8"
                        }, {
                            "farm": "7",
                            "id": "6312550870",
                            "isfamily": "0",
                            "isfriend": "0",
                            "ispublic": "1",
                            "owner": "70408381@N00",
                            "secret": "3d1faf35c8",
                            "server": "6109",
                            "title": "Industrial Strength"
                        }, {
                            "farm": "7",
                            "id": "6310367075",
                            "isfamily": "0",
                            "isfriend": "0",
                            "ispublic": "1",
                            "owner": "70408381@N00",
                            "secret": "2c39fec3bf",
                            "server": "6032",
                            "title": "Crockford: JS Scientist"
                        }, {
                            "farm": "7",
                            "id": "6310880710",
                            "isfamily": "0",
                            "isfriend": "0",
                            "ispublic": "1",
                            "owner": "70408381@N00",
                            "secret": "8fb226f13a",
                            "server": "6237",
                            "title": "Crocktalk '11"
                        }, {
                            "farm": "7",
                            "id": "6310052012",
                            "isfamily": "0",
                            "isfriend": "0",
                            "ispublic": "1",
                            "owner": "70408381@N00",
                            "secret": "ac8cfa98ff",
                            "server": "6212",
                            "title": "Y!"
                        }, {
                            "farm": "7",
                            "id": "6307565567",
                            "isfamily": "0",
                            "isfriend": "0",
                            "ispublic": "1",
                            "owner": "64474515@N00",
                            "secret": "55d5c9df85",
                            "server": "6091",
                            "title": "#YUIconf"
                        }, {
                            "farm": "6",
                            "id": "5443645747",
                            "isfamily": "0",
                            "isfriend": "0",
                            "ispublic": "1",
                            "owner": "97898435@N00",
                            "secret": "bbee8726f8",
                            "server": "5011",
                            "title": "The XXX Problem"
                        }, {
                            "farm": "6",
                            "id": "5328337656",
                            "isfamily": "0",
                            "isfriend": "0",
                            "ispublic": "1",
                            "owner": "39039882@N00",
                            "secret": "215f7081e3",
                            "server": "5282",
                            "title": "IMG_2211"
                        }, {
                            "farm": "6",
                            "id": "5327727631",
                            "isfamily": "0",
                            "isfriend": "0",
                            "ispublic": "1",
                            "owner": "39039882@N00",
                            "secret": "608313af75",
                            "server": "5202",
                            "title": "IMG_2215"
                        }, {
                            "farm": "6",
                            "id": "5328338170",
                            "isfamily": "0",
                            "isfriend": "0",
                            "ispublic": "1",
                            "owner": "39039882@N00",
                            "secret": "7b917a814d",
                            "server": "5041",
                            "title": "IMG_2216"
                        }, {
                            "farm": "6",
                            "id": "5265304569",
                            "isfamily": "0",
                            "isfriend": "0",
                            "ispublic": "1",
                            "owner": "57716551@N00",
                            "secret": "1c5dd391cf",
                            "server": "5289",
                            "title": "YUIConf"
                        }, {
                            "farm": "6",
                            "id": "5223926442",
                            "isfamily": "0",
                            "isfriend": "0",
                            "ispublic": "1",
                            "owner": "40044945@N00",
                            "secret": "2aa9757830",
                            "server": "5049",
                            "title": "Project Future"
                        }, {
                            "farm": "6",
                            "id": "5223927126",
                            "isfamily": "0",
                            "isfriend": "0",
                            "ispublic": "1",
                            "owner": "40044945@N00",
                            "secret": "503dcfa9e5",
                            "server": "5245",
                            "title": "Guys"
                        }, {
                            "farm": "5",
                            "id": "5223925520",
                            "isfamily": "0",
                            "isfriend": "0",
                            "ispublic": "1",
                            "owner": "40044945@N00",
                            "secret": "32d341bf0b",
                            "server": "4152",
                            "title": "Project Future"
                        }, {
                            "farm": "6",
                            "id": "5223328507",
                            "isfamily": "0",
                            "isfriend": "0",
                            "ispublic": "1",
                            "owner": "40044945@N00",
                            "secret": "8380e46392",
                            "server": "5250",
                            "title": "Project Future"
                        }, {
                            "farm": "5",
                            "id": "5223903960",
                            "isfamily": "0",
                            "isfriend": "0",
                            "ispublic": "1",
                            "owner": "40044945@N00",
                            "secret": "bcf25e30be",
                            "server": "4084",
                            "title": "Cliff, this is for you!"
                        }, {
                            "farm": "6",
                            "id": "5223306223",
                            "isfamily": "0",
                            "isfriend": "0",
                            "ispublic": "1",
                            "owner": "40044945@N00",
                            "secret": "1d0d00f613",
                            "server": "5164",
                            "title": "The hallway"
                        }, {
                            "farm": "5",
                            "id": "5223903126",
                            "isfamily": "0",
                            "isfriend": "0",
                            "ispublic": "1",
                            "owner": "40044945@N00",
                            "secret": "023a303931",
                            "server": "4148",
                            "title": "YUI counter"
                        }, {
                            "farm": "5",
                            "id": "5214351674",
                            "isfamily": "0",
                            "isfriend": "0",
                            "ispublic": "1",
                            "owner": "40044945@N00",
                            "secret": "503404513d",
                            "server": "4130",
                            "title": "YUI badge"
                        }, {
                            "farm": "6",
                            "id": "5213759771",
                            "isfamily": "0",
                            "isfriend": "0",
                            "ispublic": "1",
                            "owner": "40044945@N00",
                            "secret": "fc535a698d",
                            "server": "5166",
                            "title": "Future of Frontend Engineering"
                        }, {
                            "farm": "5",
                            "id": "5213764291",
                            "isfamily": "0",
                            "isfriend": "0",
                            "ispublic": "1",
                            "owner": "40044945@N00",
                            "secret": "0bf9c4f428",
                            "server": "4084",
                            "title": "Handling Data in YUI3"
                        }, {
                            "farm": "5",
                            "id": "5214355982",
                            "isfamily": "0",
                            "isfriend": "0",
                            "ispublic": "1",
                            "owner": "40044945@N00",
                            "secret": "7bd8c5054c",
                            "server": "4088",
                            "title": "YUIConf 2010"
                        }, {
                            "farm": "6",
                            "id": "5214353340",
                            "isfamily": "0",
                            "isfriend": "0",
                            "ispublic": "1",
                            "owner": "40044945@N00",
                            "secret": "419c7156a0",
                            "server": "5164",
                            "title": "YUIConf 2010"
                        }, {
                            "farm": "5",
                            "id": "5213760493",
                            "isfamily": "0",
                            "isfriend": "0",
                            "ispublic": "1",
                            "owner": "40044945@N00",
                            "secret": "6b145fa7d1",
                            "server": "4106",
                            "title": "Chris has a question"
                        }, {
                            "farm": "6",
                            "id": "5214352212",
                            "isfamily": "0",
                            "isfriend": "0",
                            "ispublic": "1",
                            "owner": "40044945@N00",
                            "secret": "da192a3891",
                            "server": "5290",
                            "title": "YUIConf 2010"
                        }, {
                            "farm": "6",
                            "id": "5213760987",
                            "isfamily": "0",
                            "isfriend": "0",
                            "ispublic": "1",
                            "owner": "40044945@N00",
                            "secret": "298868b0f0",
                            "server": "5001",
                            "title": "YUIConf 2010"
                        }, {
                            "farm": "6",
                            "id": "5213756945",
                            "isfamily": "0",
                            "isfriend": "0",
                            "ispublic": "1",
                            "owner": "40044945@N00",
                            "secret": "9f8ab3d614",
                            "server": "5209",
                            "title": "signing in"
                        }, {
                            "farm": "6",
                            "id": "5213758511",
                            "isfamily": "0",
                            "isfriend": "0",
                            "ispublic": "1",
                            "owner": "40044945@N00",
                            "secret": "9d86b543d3",
                            "server": "5007",
                            "title": "YUI Conf 2010"
                        }, {
                            "farm": "2",
                            "id": "5185416114",
                            "isfamily": "0",
                            "isfriend": "0",
                            "ispublic": "1",
                            "owner": "29423152@N00",
                            "secret": "79e2821834",
                            "server": "1040",
                            "title": "YUI Intern Tilo Mitra"
                        }, {
                            "farm": "2",
                            "id": "5184798951",
                            "isfamily": "0",
                            "isfriend": "0",
                            "ispublic": "1",
                            "owner": "29423152@N00",
                            "secret": "0f727c7206",
                            "server": "1030",
                            "title": "YUIConf 2010 Opening Notes Audience"
                        }, {
                            "farm": "2",
                            "id": "5185405828",
                            "isfamily": "0",
                            "isfriend": "0",
                            "ispublic": "1",
                            "owner": "29423152@N00",
                            "secret": "84b9d0675c",
                            "server": "1001",
                            "title": "Reid Burke, Speaking about YETI"
                        }, {
                            "farm": "5",
                            "id": "5184811857",
                            "isfamily": "0",
                            "isfriend": "0",
                            "ispublic": "1",
                            "owner": "29423152@N00",
                            "secret": "001809fe7e",
                            "server": "4127",
                            "title": "Satyen Desai"
                        }, {
                            "farm": "2",
                            "id": "5184801259",
                            "isfamily": "0",
                            "isfriend": "0",
                            "ispublic": "1",
                            "owner": "29423152@N00",
                            "secret": "d3cd371f9a",
                            "server": "1002",
                            "title": "YUIConf 2010 Panel"
                        }, {
                            "farm": "5",
                            "id": "5184813901",
                            "isfamily": "0",
                            "isfriend": "0",
                            "ispublic": "1",
                            "owner": "29423152@N00",
                            "secret": "4da77fe525",
                            "server": "4144",
                            "title": "Dav Glass"
                        }, {
                            "farm": "2",
                            "id": "5185408676",
                            "isfamily": "0",
                            "isfriend": "0",
                            "ispublic": "1",
                            "owner": "29423152@N00",
                            "secret": "426266ec0e",
                            "server": "1290",
                            "title": "Luke Smith"
                        }, {
                            "farm": "5",
                            "id": "5185399838",
                            "isfamily": "0",
                            "isfriend": "0",
                            "ispublic": "1",
                            "owner": "29423152@N00",
                            "secret": "c3f8458287",
                            "server": "4090",
                            "title": "Eric Miraglia, Opening YUIConf 2010"
                        }, {
                            "farm": "2",
                            "id": "5184804687",
                            "isfamily": "0",
                            "isfriend": "0",
                            "ispublic": "1",
                            "owner": "29423152@N00",
                            "secret": "63f4ecc067",
                            "server": "1429",
                            "title": "Reid Burke, Speaking about YETI"
                        }, {
                            "farm": "2",
                            "id": "5185414334",
                            "isfamily": "0",
                            "isfriend": "0",
                            "ispublic": "1",
                            "owner": "29423152@N00",
                            "secret": "7431d1ab62",
                            "server": "1039",
                            "title": "Eric Ferraiuolo"
                        }]
                    }
                }
            };
            break;
        case 'select * from feed where url="http://www.smashingmagazine.com/wp-rss.php"':
            data = {
                "query": {
                    "results": {
                        "entry": [{
                            "title": {
                                "type": "html",
                                "content": "Interview: How I Work: Meetup&#8217;s Andres Glusman On The Power Of UX And Lean Startup Methods"
                            },
                            "link": [{
                                "href": "http://www.smashingmagazine.com/2014/01/17/how-i-work-andres-glusman-vp-of-meetup/",
                                "rel": "alternate",
                                "type": "text/html"
                            }]
                        }, {
                            "title": {
                                "type": "html",
                                "content": "Creating Custom Shipping Methods In Magento"
                            },
                            "link": [{
                                "href": "http://www.smashingmagazine.com/2014/01/15/creating-custom-shipping-methods-in-magento/",
                                "rel": "alternate",
                                "type": "text/html"
                            }]
                        }, {
                            "title": {
                                "type": "html",
                                "content": "Editing Tips For Business Web Content"
                            },
                            "link": [{
                                "href": "http://www.smashingmagazine.com/2014/01/14/editing-tips-for-business-web-content/",
                                "rel": "alternate",
                                "type": "text/html"
                            }]
                        }, {
                            "title": {
                                "type": "html",
                                "content": "Writing A Better JavaScript Library For The DOM"
                            },
                            "link": [{
                                "href": "http://www.smashingmagazine.com/2014/01/13/writing-a-better-javascript-library-for-the-dom/",
                                "rel": "alternate",
                                "type": "text/html"
                            }]
                        }]
                    }
                }
            };
            break;
        case 'select * from feed where url="http://rss.news.yahoo.com/rss/us"':
            data = {
                "query": {
                    "results": {
                        "entry": [{
                            "title": {
                                "type": "html",
                                "content": "Christie\'s staff held disaster aid \'hostage\' over project: NJ mayor"
                            },
                            "link": [{
                                "href": "http://news.yahoo.com/christie-39-staff-held-disaster-aid-39-hostage-021932850--finance.html",
                                "rel": "alternate",
                                "type": "text/html"
                            }]
                        }, {
                            "title": {
                                "type": "html",
                                "content": "Dennis Rodman checks into alcohol rehab center: agent"
                            },
                            "link": [{
                                "href": "http://news.yahoo.com/dennis-rodman-checks-alcohol-rehab-center-agent-030420468--nba.html",
                                "rel": "alternate",
                                "type": "text/html"
                            }]
                        }, {
                            "title": {
                                "type": "html",
                                "content": "Obamacare rules on equal coverage delayed: NY Times"
                            },
                            "link": [{
                                "href": "http://news.yahoo.com/obamacare-rules-equal-coverage-delayed-ny-times-221209281--sector.html",
                                "rel": "alternate",
                                "type": "text/html"
                            }]
                        }, {
                            "title": {
                                "type": "html",
                                "content": "10 arrested in protest of Calif. officer acquittal"
                            },
                            "link": [{
                                "href": "http://news.yahoo.com/10-arrested-protest-calif-officer-acquittal-051857833.html",
                                "rel": "alternate",
                                "type": "text/html"
                            }]
                        }]
                    }
                }
            };
            break;
        case 'select * from feed where url="http://rss.slashdot.org/Slashdot/slashdot"':
            data = {
                "query": {
                    "results": {
                        "entry": [{
                            "title": {
                                "type": "html",
                                "content": "Rosetta Probe Awakens, Prepares To Chase Comet"
                            },
                            "link": [{
                                "href": "http://rss.slashdot.org/~r/Slashdot/slashdot/~3/THmHJCuXCaU/story01.htm",
                                "rel": "alternate",
                                "type": "text/html"
                            }]
                        }, {
                            "title": {
                                "type": "html",
                                "content": "Hacker Says He Could Access 70,000 Healthcare.Gov Records In 4 Minutes"
                            },
                            "link": [{
                                "href": "http://rss.slashdot.org/~r/Slashdot/slashdot/~3/vAhbYi3jLKc/story01.htm",
                                "rel": "alternate",
                                "type": "text/html"
                            }]
                        }, {
                            "title": {
                                "type": "html",
                                "content": "Sniffing and Decoding NRF24L01+ and Bluetooth LE Packets For Under $30"
                            },
                            "link": [{
                                "href": "http://rss.slashdot.org/~r/Slashdot/slashdot/~3/VTOcB8EV6h4/story01.htm",
                                "rel": "alternate",
                                "type": "text/html"
                            }]
                        }, {
                            "title": {
                                "type": "html",
                                "content": "10 arrested in protest of Calif. officer acquittalSites Blocked By Smartfilter, Censored in Saudi Arabia"
                            },
                            "link": [{
                                "href": "http://rss.slashdot.org/~r/Slashdot/slashdot/~3/fxpk9JyLTb0/story01.htm",
                                "rel": "alternate",
                                "type": "text/html"
                            }]
                        }]
                    }
                }
            };
            break;
        case 'select * from feed where url="http://feeds.yuiblog.com/YahooUserInterfaceBlog"':
            data = {
                "query": {
                    "results": {
                        "entry": [{
                            "title": {
                                "type": "html",
                                "content": "YUIConf 2013 Talk: David Gomez on Forget Everything You Know About Testing, and Start Testing!"
                            },
                            "link": [{
                                "href": "http://feeds.yuiblog.com/~r/YahooUserInterfaceBlog/~3/3Hx6j1MF1fI/",
                                "rel": "alternate",
                                "type": "text/html"
                            }]
                        }, {
                            "title": {
                                "type": "html",
                                "content": "YUI Weekly for January 17, 2014"
                            },
                            "link": [{
                                "href": "http://feeds.yuiblog.com/~r/YahooUserInterfaceBlog/~3/DnGUSG7So1s/",
                                "rel": "alternate",
                                "type": "text/html"
                            }]
                        }, {
                            "title": {
                                "type": "html",
                                "content": "YUIConf 2013 Talk: Andrew Wooldridge on YUI in 2013: A Year in Review, and Town Hall Discussion"
                            },
                            "link": [{
                                "href": "http://feeds.yuiblog.com/~r/YahooUserInterfaceBlog/~3/QSbkxey-b9c/",
                                "rel": "alternate",
                                "type": "text/html"
                            }]
                        }, {
                            "title": {
                                "type": "html",
                                "content": "YUIConf 2013 Talk: Jonathan Tsai and William Seo on Staying DRY with YUI"
                            },
                            "link": [{
                                "href": "http://feeds.yuiblog.com/~r/YahooUserInterfaceBlog/~3/12-cGth5Ig4/",
                                "rel": "alternate",
                                "type": "text/html"
                            }]
                        }]
                    }
                }
            };
            break;
        case 'select * from feed where url="http://feeds.feedburner.com/ajaxian"':
            data = {
                "query": {
                    "results": {
                        "entry": [{
                            "title": {
                                "type": "html",
                                "content": "Mobile Proxies: A New Era Dawns"
                            },
                            "link": [{
                                "href": "http://feedproxy.google.com/~r/ajaxian/~3/-7BXaCUTU_Q/mobile-proxies-a-new-era-dawns",
                                "rel": "alternate",
                                "type": "text/html"
                            }]
                        }, {
                            "title": {
                                "type": "html",
                                "content": "Here comes Traversty traversing the DOM"
                            },
                            "link": [{
                                "href": "http://feedproxy.google.com/~r/ajaxian/~3/UXQXsTrgImE/here-comes-traversty-traversing-the-dom",
                                "rel": "alternate",
                                "type": "text/html"
                            }]
                        }, {
                            "title": {
                                "type": "html",
                                "content": "Fat Fractal enters the BaaS fray"
                            },
                            "link": [{
                                "href": "http://feedproxy.google.com/~r/ajaxian/~3/lQHIQW5mRiY/fat-fractal-enters-the-baas-fray",
                                "rel": "alternate",
                                "type": "text/html"
                            }]
                        }, {
                            "title": {
                                "type": "html",
                                "content": "Windows 8 HTML5 WinRT RSS reader app"
                            },
                            "link": [{
                                "href": "http://feedproxy.google.com/~r/ajaxian/~3/yWmY6KNYxLc/windows-8-html5-winrt-rss-reader-app",
                                "rel": "alternate",
                                "type": "text/html"
                            }]
                        }]
                    }
                }
            };
            break;
        case 'select * from feed where url="http://daringfireball.net/index.xml"':
            data = {
                "query": {
                    "results": {
                        "entry": [{
                            "title": {
                                "type": "html",
                                "content": "Benedict Evans Joins Andreessen Horowitz"
                            },
                            "link": [{
                                "href": "http://ben-evans.com/benedictevans/2014/1/18/a16z",
                                "rel": "alternate",
                                "type": "text/html"
                            }]
                        }, {
                            "title": {
                                "type": "html",
                                "content": "‘The Floppy 2: The Zip Disk’"
                            },
                            "link": [{
                                "href": "http://www.muleradio.net/thetalkshow/67/",
                                "rel": "alternate",
                                "type": "text/html"
                            }]
                        }, {
                            "title": {
                                "type": "html",
                                "content": "The Five Best Punctuation Marks in Literature"
                            },
                            "link": [{
                                "href": "http://www.vulture.com/2014/01/best-punctuation-marks-literature-nabokov-eliot-dickens-levi.html",
                                "rel": "alternate",
                                "type": "text/html"
                            }]
                        }, {
                            "title": {
                                "type": "html",
                                "content": "Farhad Manjoo Takes Over Pogue’s ‘State of the Art’ Column at The New York Times"
                            },
                            "link": [{
                                "href": "http://www.linkedin.com/today/post/article/20140117045121-554905-i-got-a-new-job-an-explanation?published=t&_mSplash=1",
                                "rel": "alternate",
                                "type": "text/html"
                            }]
                        }]
                    }
                }
            };
            break;
        }

        callback(data);
    };
});