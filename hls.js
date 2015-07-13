function extract_attributes(list){
    var step = "key";
    var attributes = {};
    var key;
    while(list.length > 0){
        if(step == "key"){
            key = list.substr(0, list.indexOf("="));
            list = list.substr(key.length + 1);
            step = "value";
        }
        else {
            var value;
            if(list[0] == '"'){
                list = list.substr(1);
                value = list.substr(0, list.indexOf('"'));
                list = list.substr(value.length + 2);
            }
            else {
                value = list.substr(0, list.indexOf(","));
                list = list.substr(value.length + 1);
            }
            attributes[key] = value;

            step = "key";
        }
    }

    return attributes;
}

function hls(input){
    var out = {};
    var lines = input.split("\n");
    var sequence = 0;

    out.segments = [];
    out.segments.low = 0;

    out.playlists = [];
    out.cacheable = true;

    var enc = { METHOD: "NONE" }

    for(var i = 0; i < lines.length; i++){
        var line = lines[i].trim();

        if(i == 0 && line != "#EXTM3U"){
            throw new Error("missing EXTM3U header");
        }

        else if(line.startsWith("#EXT-X-TARGETDURATION:")){
            out.type = "media";
            out.target_duration = line.substr("#EXT-X-TARGETDURATION:".length) - 0
        }

        else if(line.startsWith("#EXT-X-STREAM-INF:")){
            out.type = "variant";
            var playlist = {};
            var args = line.substr("#EXT-X-STREAM-INF:".length).split(",");
            for(var j = 0; j < args.length; j++){
                var key = args[j].split("=")[0];
                var value = args[j].split("=")[1];
                if(key == "BANDWIDTH"){
                    playlist.bandwidth = value - 0;
                }
                else if(key == "CODECS"){
                    playlist.codecs = value.substr(1, value.length-2);
                }
                else if(key == "PROGRAM-ID"){
                    playlist.program = value - 0;
                }
            }

            out.playlists.push(playlist);
        }

        else if(line.startsWith("#EXT-X-MEDIA-SEQUENCE:")){
            sequence = line.substr("#EXT-X-MEDIA-SEQUENCE:".length) - 0;
            out.segments.low = sequence;
        }

        else if(line.startsWith("#EXTINF:")){
            var duration = line.substr("#EXTINF:".length).split(",")[0] - 0;
            if(!out.segments[sequence]) out.segments[sequence] = {};
            out.segments[sequence].duration = duration;
        }

        else if(line == "#EXT-X-ENDLIST"){
            out.ended = true;
        }

        else if(line == "#EXT-X-DISCONTINUITY"){
            if(!out.segments[sequence]) out.segments[sequence] = {};
            out.segments[sequence].discontinuous = true;
        }

        else if(line.startsWith("#EXT-X-PROGRAM-DATE-TIME:")){
            var date = line.substr("#EXT-X-PROGRAM-DATE-TIME:".length);

            if(!out.segments[sequence]) out.segments[sequence] = {};
            out.segments[sequence].time = new Date(date);
        }

        else if(line == "#EXT-X-ALLOW-CACHE:NO"){
            out.cacheable = false;
        }

        else if(line.startsWith("#EXT-X-VERSION:")){
            out.version = line.substr("#EXT-X-VERSION:".length) - 0;
        }

        else if(line.startsWith("#EXT-X-PLAYLIST-TYPE:")){
            out.playlist_type = line.substr("#EXT-X-PLAYLIST-TYPE:".length);
        }

        else if(line.startsWith("#EXT-X-KEY:")){
            enc = extract_attributes(line.substr("#EXT-X-KEY:".length));
        }

        else if(!line.startsWith("#") && line != ""){
            if(out.type == "media"){
                out.segments[sequence].url = line;
                out.segments.high = sequence;

                out.segments[sequence].encryption_method = enc.METHOD;
                out.segments[sequence].key = enc.URI || null;
                out.segments[sequence].iv = enc.IV || null;
                out.segments[sequence].encrypted = enc.METHOD != "NONE";

                sequence += 1;
            }
            else {
                out.playlists[out.playlists.length - 1].url = line;
            }
        }
    }

    return out;
}

module.exports = hls;
