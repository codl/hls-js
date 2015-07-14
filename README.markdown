# hls.js

[![Build Status](https://travis-ci.org/codl/hls-js.svg?branch=master)](https://travis-ci.org/codl/hls-js)

hls.js is a library for parsing the contents of a M3U playlist according to the HLS specification.

## Usage

    var contents = `#EXTM3U
    #EXT-X-TARGETDURATION:60
    #EXT-X-ALLOW-CACHE:NO

    #EXT-X-PROGRAM-DATE-TIME:2015-07-13T21:27:10+0200
    #EXTINF:60,
    http://example.com/0.ts
    #EXT-X-DISCONTINUITY
    #EXT-X-PROGRAM-DATE-TIME:2015-07-13T21:34:09+0200
    #EXTINF:60,
    http://example.com/1.ts
    #EXT-X-PROGRAM-DATE-TIME:2015-07-13T21:35:09+0200
    #EXTINF:46,
    http://example.com/2.ts
    `

    var playlist = hls(contents);
    console.dir(playlist);
    /*
        {
            "type": "media",
            "target_duration": 60,
            "cacheable": false,
            "segments": [
                {
                    "time": new Date("2015-07-13T21:27:10+0200"),
                    "duration": 60,
                    "url": "http://example.com/0.ts",
                    "encrypted": false,
                    "encryption_method": "NONE"
                },
                {
                    "discontinuous": true,
                    "time": new Date("2015-07-13T21:34:09+0200"),
                    "duration": 60,
                    "url": "http://example.com/1.ts",
                    "encrypted": false,
                    "encryption_method": "NONE"
                },
                {
                    "time": new Date("2015-07-13T21:35:09+0200"),
                    "duration": 46,
                    "url": "http://example.com/1.ts",
                    "encrypted": false,
                    "encryption_method": "NONE"
                },
                "low": 0,
                "high": 2 ]
        }
    */

refer to tests.js for something approaching a reference because i'm too lazy to make one
