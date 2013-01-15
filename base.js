function showPerson(n, name, show) {
    if (n.innerText.indexOf(name) != -1) {
        if (show)
            n.style.display = "";
        else
            n.style.display = "none";
    }
}

function updateTimer(year)
{
    document.getElementById("selected_year").innerHTML = year;

    var people = document.getElementById("people").getElementsByClassName("person");
    var i;
    for (i = 0; i < people.length; i++) {
        var childNode = people[i];
        showPerson(childNode, "Churchill", year >= 1940);
        showPerson(childNode, "Stalin", year >= 1941);
        showPerson(childNode, "Roosevelt", year >= 1941);
    }

    if (map)
        map.updateMarkers(year);
}
document.addEventListener("DOMContentLoaded", function(){updateTimer(document.getElementById("selected_year").innerHTML)});

function initializeShortBio() {
    function ShortBio(shortBioNode) {
        var timeout;
        var self = this;

        this.cancelClose = function()
        {
            clearTimeout(timeout);
        }

        this.show = function()
        {
            self.cancelClose();
            shortBioNode.style.display = "";
        }

        this.close = function()
        {
            shortBioNode.style.display = "none";
        }

        this.closeMaybe = function()
        {
            timeout = setTimeout(function() {self.close()}, 100);
        }
    }

    var persons = document.getElementsByClassName("person_overlay");
    for (var i = 0, person; person = persons[i]; i++) {
        var shortBioNode = person.getElementsByClassName("short_bio_overlay")[0]
        var myShortBio = new ShortBio(shortBioNode);
        shortBioNode.onmouseover = myShortBio.cancelClose;
        shortBioNode.onmouseout = myShortBio.closeMaybe;

        var personNode = person.getElementsByClassName("person")[0];
        personNode.onmouseover = myShortBio.show;
        personNode.onmouseout = myShortBio.closeMaybe;

        person.getElementsByClassName("short_bio_close_button")[0].onclick = myShortBio.close;
    }
}
document.addEventListener("DOMContentLoaded", initializeShortBio);

function editShortBio(url_article)
{
    alert("This information was automatically extracted from the Wikipedia article.  Edit " + url_article + " if you think any of this information is inaccurate.");
}

/*
 * This could be optimized by caching the title and timeline height.
 * The only thing that changes on resize is the window.innerHeight.
 */
function fillScreen()
{
    var title_height = document.getElementsByTagName("header")[0].clientHeight;

    var timeline_node = document.getElementById("timeline");
    var timeline_margin_top = parseInt(window.getComputedStyle(timeline_node).marginTop);
    var timeline_height = timeline_node.clientHeight + 2*timeline_margin_top;

    /* No clue where this come from, but I'm missing 2px somewhere */
    var bottom_margin = 2;

    var mnp_height = window.innerHeight - title_height - timeline_height - bottom_margin;
    document.getElementById("map_container").style.height = mnp_height + "px";
    document.getElementById("people").style.height = mnp_height + "px";

    var short_bios = document.getElementsByClassName("short_bio");
    var sb_style = window.getComputedStyle(short_bios[0]);
    var sb_padding = parseInt(sb_style.paddingTop);
    var sb_box_shadow = parseInt(sb_style.boxShadow.split(" ")[5]);
    var sb_margins = 2*sb_padding + 2*sb_box_shadow;
    for (var i = 0, short_bio; short_bio = short_bios[i]; i++)
        short_bio.style.maxHeight = (mnp_height - sb_margins) + "px";
}
window.addEventListener("load", fillScreen);
window.addEventListener("resize", fillScreen);

var map;

function initializeMap() {
    var latlon = new google.maps.LatLng(51.869, 14.64);
    var myOptions = {
        center: latlon,
        zoom: 4,
        mapTypeId: google.maps.MapTypeId.TERRAIN,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
    };

    map = new google.maps.Map(document.getElementById("map_container"), myOptions);
    map.shown_markers = [];
    map.markers = {
        1939: [
            { lat: 51.869, lon: 14.64, text: "Germany invades Poland" },
        ],
        1940: [],
        1941: [],
        1942: [],
        1943: [],
        1944: [],
        1945: [],
    };

    map.addMarker = function(lat, lon, text) {
        var latlon = new google.maps.LatLng(lat, lon);
        var infowindow = new google.maps.InfoWindow({
            content: text,
            size: new google.maps.Size(50, 50)
        });

        var marker = new google.maps.Marker({position: latlon, map: this});

        google.maps.event.addListener(marker, 'click', function() {
            infowindow.open(map, marker)
        });
        this.shown_markers.push(marker);
    }

    map.removeMarkers = function() {
        for (var i = 0, m; m = this.shown_markers[i]; i++)
            m.setMap(null);
        this.shown_markers.length = 0;
    }

    map.updateMarkers = function(year) {
        this.removeMarkers();

        for (var i = 0, m; m = this.markers[year][i]; i++)
            this.addMarker(m.lat, m.lon, m.text);
    }

    map.updateMarkers(document.getElementById("selected_year").innerHTML);
}
google.maps.event.addDomListener(window, "load", initializeMap);
