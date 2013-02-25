var topic = {
    map: {
        center: {lat: 51.869, lon: 14.64},
        zoom: 4,
    },
    events: {
        1939: [
            { lat: 51.869, lon: 14.64, text: "Germany invades Poland" },
        ],
        1940: [
            {lat: 49.74, lon: 4.81, text: "Germany invades France"},
            {lat: 51.86, lon: -0.87, text: "Battle of Britain"},
        ],
        1941: [
            {lat: 55.61, lon: 26.5, text: "Germany attacks the Soviet Union"},
            {lat: 21.33, lon: -157.98, text: "Japanese attack on Pearl Harbor"},
        ],
        1942: [
            {lat: 40.3, lon: -73.4, text: "Second Happy Time"},
            {lat: 28.2, lon: -177.35, text: "Battle of Midway"},
            {lat: 48.67, lon: 44.3, text: "Battle of Stalingrad"},
            {lat: 30.837, lon: 28.98, text: "Battles of El Alamein"},
        ],
        1943: [
            {lat: 7.12, lon: 171.1, text: "Gilbert and Marshall Islands Campaign"},
            {lat: 37.65, lon: 14.05, text: "Allied invasion of Italy"},
            {lat: 52.97, lon: 36.07, text: "Operation Kutuzov"},
        ],
        1944: [
            {lat: 49.37, lon: 0.88, text: "Normandy Landings"},
            {lat: 53.89, lon: 28.24, text: "Operation Bagration"},
            {lat: 20, lon: 130, text: "Battle of the Philippines"},
        ],
        1945: [
            {lat: 52.52, lon: 13.37, text: "Germany surrenders"},
            {lat: 24.78, lon: 141.32, text: "Battle of Iwo Jima"},
            {lat: 36, lon: 139.6, text: "Japan surrenders"},
        ],
    },
};

function showPerson(n, name, show) {
    if (n.innerHTML.indexOf(name) != -1) {
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
        map.update(year);
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

function initializeMap()
{
    var center = new Microsoft.Maps.Location(topic.map.center.lat, topic.map.center.lon);
    var map_options = {
        credentials: "AqagUV4QNBjwoaerEmW1XMLHlccfzBEjTi9PXlrLhVuXgDQa22OxGzf6fdBXMJz9",
        center: center,
        zoom: topic.map.zoom,
        mapTypeId: Microsoft.Maps.MapTypeId.aerial,
        enableClickLogo: false,
        showMapTypeSelector: false,
    };

    map = new Microsoft.Maps.Map(document.getElementById("map_container"), map_options);

    map.shown_pushpins = [];

    map.infobox = new Microsoft.Maps.Infobox(new Microsoft.Maps.Location(0, 0), {visible: false});
    map.entities.push(map.infobox);

    map.addPushpin = function(m) {
        var latlon = new Microsoft.Maps.Location(m.lat, m.lon);
        var pushpin = new Microsoft.Maps.Pushpin(latlon, {});

        Microsoft.Maps.Events.addHandler(pushpin, 'click', function() {
            map.infobox.setLocation(latlon);
            map.infobox.setOptions({
                visible: true,
                description: m.text,
            });
        });

        map.entities.push(pushpin);
        this.shown_pushpins.push(pushpin);
    }

    map.removePushpins = function() {
        for (var i = 0, p; p = this.shown_pushpins[i]; i++)
            map.entities.remove(p);
        this.shown_pushpins.length = 0;
    }

    map.updatePushpins = function(year) {
        this.removePushpins();

        for (var i = 0, p; p = topic.events[year][i]; i++)
            this.addPushpin(p);
    }

    map.update = function(year) {
        map.updatePushpins(year);
    }

    map.update(document.getElementById("selected_year").innerHTML);
}
window.addEventListener("load", initializeMap);
