
/*
DOM helper functions for Patari app. 
Make changes here when Patari webmasters make any breaking changes to their DOMs.

Author: Asad Memon
MIT
*/

var Helpers = function(){
    //nothing to do here
}

Helpers.prototype.getPlaylistContainer = function() {
    return $('ul.detailList');
};

Helpers.prototype.getPlaylistItems = function() {
    var list = this.getPlaylistContainer().find("li");
    var payload = [];
    for (var i=0;i<list.length;i++){
        var cur = $(list[i]);
        var title = cur.attr('title');
        if (cur.find('.info div:eq(1)') && cur.find('.info div:eq(1)').length!=0){
            title+=" - " + cur.find('.info div:eq(1)').text();
        }

        payload.push({
            id: cur.attr('title'), //because they don't give any id to their <li>
            title: title,
            songtitle: cur.attr('title'),
            albumtitle: cur.find('.info div:eq(1)').text(),
            thumbnail: cur.find('.thumb').attr('src'),
            isPlaying: cur.hasClass("active")
        });
    }

    return payload;
};

Helpers.prototype.mediaPlayPause = function() {
    $(".player .playerPlay").click();
};

Helpers.prototype.mediaPrevious = function() {
    $(".player img[title='Previous Song']").click()
};

Helpers.prototype.mediaNext = function() {
    $(".player img[title='Next Song']").click()
};

Helpers.prototype.playPlaylistItem = function(id) {
    var item = this.getPlaylistContainer().find('li[title="'+id+'"]');
    item.click();
};
module.exports = new Helpers();