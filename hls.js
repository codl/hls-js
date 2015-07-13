function hls(input){
    var out = {};
    var lines = input.split("\n");
    var sequence = 0;

    out.segments = [];

    for(var i = 0; i < lines.length; i++){
        var line = lines[i].trim();

        if(i == 0 && line != "#EXTM3U"){
            throw new Error("missing EXTM3U header");
        }

        else if(line.startsWith("#EXT-X-TARGETDURATION:")){
            out.type = "media";
            out.target_duration = line.substr("#EXT-X-TARGETDURATION:".length) - 0
        }

        else if(line.startsWith("#EXT-X-MEDIA-SEQUENCE:")){
            sequence = line.substr("#EXT-X-MEDIA-SEQUENCE:".length) - 0;
        }

        else if(line.startsWith("#EXTINF:")){
            var duration = line.substr("#EXTINF:".length).split(",")[0] - 0;
            out.segments[sequence] = { "duration": duration };
        }

        else if(!line.startsWith("#") && line != ""){
            out.segments[sequence].url = line;
            sequence += 1;
        }
    }

    return out;
}

module.exports = hls;
