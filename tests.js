var hls = require("./hls");
var tap = require("tap");


tap.test("hls", function(t){
    var examples = {};

    examples.simple = '#EXTM3U\n' +
        '#EXT-X-TARGETDURATION:5220\n' +
        '#EXTINF:5220,\n' +
        'http://media.example.com/entire.ts\n' +
        '#EXT-X-ENDLIST\n';

    examples.sliding = '#EXTM3U\n' +
        '#EXT-X-TARGETDURATION:8\n' +
        '#EXT-X-MEDIA-SEQUENCE:2680\n' +
        '\n' +
        '#EXTINF:8,\n' +
        'https://priv.example.com/fileSequence2680.ts\n' +
        '#EXTINF:8,\n' +
        'https://priv.example.com/fileSequence2681.ts\n' +
        '#EXTINF:8,\n' +
        'https://priv.example.com/fileSequence2682.ts\n';

    examples.encrypted = '#EXTM3U\n' +
        '#EXT-X-MEDIA-SEQUENCE:7794\n' +
        '#EXT-X-TARGETDURATION:15\n' +
        '\n' +
        '#EXT-X-KEY:METHOD=AES-128,URI="https://priv.example.com/key.php?r=52"\n' +
        '\n' +
        '#EXTINF:15,\n' +
        'http://media.example.com/fileSequence52-1.ts\n' +
        '#EXTINF:15,\n' +
        'http://media.example.com/fileSequence52-2.ts\n' +
        '#EXTINF:15,\n' +
        'http://media.example.com/fileSequence52-3.ts\n' +
        '\n' +
        '#EXT-X-KEY:METHOD=AES-128,URI="https://priv.example.com/key.php?r=53"\n' +
        '\n' +
        '#EXTINF:15,\n' +
        'http://media.example.com/fileSequence53-1.ts\n';

    examples.variant = '#EXTM3U\n' +
        '#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=1280000\n' +
        'http://example.com/low.m3u8\n' +
        '#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=2560000\n' +
        'http://example.com/mid.m3u8\n' +
        '#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=7680000\n' +
        'http://example.com/hi.m3u8\n' +
        '#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=65000,CODECS="mp4a.40.5"\n' +
        'http://example.com/audio-only.m3u8\n';

    t.throws(function() { hls(""); }, "expects an EXTM3U header");

    t.test("given a media playlist", function(tt){
        var simple = hls(examples.simple);

        tt.equal(simple.type, "media", "has a media type");
        tt.equal(simple.target_duration, 5220, "sets the target duration");

        tt.equal(simple.segments[0].url, 'http://media.example.com/entire.ts', "sets segment urls");
        tt.equal(simple.segments[0].duration, 5220, "sets segment duration");

        var sliding = hls(examples.sliding);

        tt.equal(sliding.segments[2680].url, 'https://priv.example.com/fileSequence2680.ts', "with a sliding window, respects EXT-X-MEDIA-SEQUENCE");
    });

    // t.test("given a variant playlist", function(tt){
});
