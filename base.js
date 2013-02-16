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
    map.shown_areas = [];

    map.markers = {
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
    };

    map.occupation_areas = {
        1939: [
            /* UK */
            {
                path: [
                    new google.maps.LatLng(58.86, -4.12),
                    new google.maps.LatLng(54.13, -5.61),
                    new google.maps.LatLng(53.80, -3.61),
                    new google.maps.LatLng(52.13, -4.61),
                    new google.maps.LatLng(50.13, -5.61),
                    new google.maps.LatLng(51.19, 1.4),
                ],
                color: "#FF0000",
            },
            /* France */
            {
                path: [
                    new google.maps.LatLng(50.98, 1.99),
                    new google.maps.LatLng(48.35, -4.86),
                    new google.maps.LatLng(43.31, -1.65),
                    new google.maps.LatLng(42.52, 3.07),
                    new google.maps.LatLng(44.82, 6.96),
                    new google.maps.LatLng(47.62, 7.62),
                    new google.maps.LatLng(48.96, 8.12),
                ],
                color: "#FF0000",
            },
            /* Poland */
            {
                path: [
                    new google.maps.LatLng(53.83, 14.23),
                    new google.maps.LatLng(51.869, 14.64),
                    new google.maps.LatLng(51.00, 15.07),
                    new google.maps.LatLng(49.04, 22.58),
                    new google.maps.LatLng(47.99, 29.15),
                    new google.maps.LatLng(52.11, 31.77),
                    new google.maps.LatLng(56.10, 28.34),
                    new google.maps.LatLng(53.92, 23.53),
                ],
                color: "#FF0000",
            },
            /* Axis */
            {
                path: [
                    new google.maps.LatLng(54.8, 9.35),
                    new google.maps.LatLng(52.37, 7.02),
                    new google.maps.LatLng(48.96, 8.12),
                    new google.maps.LatLng(47.62, 7.62),
                    new google.maps.LatLng(46.78, 10.41),
                    new google.maps.LatLng(44.82, 6.96),
                    new google.maps.LatLng(43.98, 10.14),
                    new google.maps.LatLng(40.14, 16.74),
                    new google.maps.LatLng(46.32, 13.64),
                    new google.maps.LatLng(48.76, 22.36),
                    new google.maps.LatLng(51.00, 15.07),
                    new google.maps.LatLng(51.869, 14.64),
                    new google.maps.LatLng(53.83, 14.23),
                ],
                color: "#0000FF",
            },
            /* USSR */
            {
                path: [
                    new google.maps.LatLng(69.79, 30.89),
                    new google.maps.LatLng(56.10, 28.34),
                    new google.maps.LatLng(52.11, 31.77),
                    new google.maps.LatLng(47.99, 29.15),
                    new google.maps.LatLng(41.9, 41.72),
                    new google.maps.LatLng(67.97, 50.0),
                ],
                color: "#00BB00",
            },
        ],
        1940: [
            /* UK */
            {
                path: [
                    new google.maps.LatLng(58.86, -4.12),
                    new google.maps.LatLng(54.13, -5.61),
                    new google.maps.LatLng(53.80, -3.61),
                    new google.maps.LatLng(52.13, -4.61),
                    new google.maps.LatLng(50.13, -5.61),
                    new google.maps.LatLng(51.19, 1.4),
                ],
                color: "#FF0000",
            },
            /* Axis */
            {
                path: [
                    new google.maps.LatLng(54.8, 9.35),
                    new google.maps.LatLng(50.98, 1.99),
                    new google.maps.LatLng(48.35, -4.86),
                    new google.maps.LatLng(43.31, -1.65),
                    new google.maps.LatLng(42.52, 3.07),
                    new google.maps.LatLng(44.82, 6.96),
                    new google.maps.LatLng(43.98, 10.14),
                    new google.maps.LatLng(40.14, 16.74),
                    new google.maps.LatLng(46.32, 13.64),
                    new google.maps.LatLng(47.99, 29.15),
                    new google.maps.LatLng(49.04, 22.58),
                    new google.maps.LatLng(53.92, 23.53),
                ],
                color: "#0000FF",
            },
            /* USSR */
            {
                path: [
                    new google.maps.LatLng(69.79, 30.89),
                    new google.maps.LatLng(56.10, 28.34),
                    new google.maps.LatLng(53.92, 23.53),
                    new google.maps.LatLng(49.04, 22.58),
                    new google.maps.LatLng(47.99, 29.15),
                    new google.maps.LatLng(41.9, 41.72),
                    new google.maps.LatLng(67.97, 50.0),
                ],
                color: "#00BB00",
            },
        ],
    };
    map.infowindow = new google.maps.InfoWindow({size: new google.maps.Size(50, 50)});

    var edit_div = document.createElement("div");
    edit_div.style.margin = "5px";
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(edit_div);

    map.drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.POLYGON,
        drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_RIGHT,
            drawingModes: [
                google.maps.drawing.OverlayType.MARKER,
                google.maps.drawing.OverlayType.POLYGON,
            ]
        },
    });

    map.addMarker = function(m) {
        var latlon = new google.maps.LatLng(m.lat, m.lon);
        var marker = new google.maps.Marker({position: latlon, map: this});

        google.maps.event.addListener(marker, 'click', function() {
            map.infowindow.setContent(m.text);
            map.infowindow.open(map, marker);
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
            this.addMarker(m);
    }

    map.removeOccupationAreas = function() {
        for (var i = 0, a; a = this.shown_areas[i]; i++)
            a.setMap(null);
        this.shown_areas.length = 0;
    }

    map.addOccupationArea = function(area) {
        area_poly = new google.maps.Polygon({
            paths: area.path,
            strokeColor: area.color,
            strokeOpacity: 0.8,
            fillColor: area.color,
            fillOpacity: 0.3,
        });

        this.shown_areas.push(area_poly);
        area_poly.setMap(this);
    }

    map.updateOccupationAreas = function(year) {
        this.removeOccupationAreas();
        for (var i = 0, a; a = this.occupation_areas[year][i]; i++)
            this.addOccupationArea(a);
    }

    map.update = function(year) {
        map.updateMarkers(year);
        map.updateOccupationAreas(year);
    }

    function editToolBar()
    {
        this.div = document.createElement("div");
    }

    editToolBar.prototype.addIcon = function(img_src, alt, edit_fn)
    {
        var edit_UI = document.createElement("div");
        edit_UI.style.backgroundColor = "white";
        edit_UI.style.borderStyle = "solid";
        edit_UI.style.borderWidth = "1px";
        edit_UI.style.borderColor = "rgb(113, 123, 135)";
        edit_UI.style.lineHeight = "0";
        edit_UI.style.padding = "4px";
        edit_UI.style.cursor = "pointer";
        edit_UI.style.boxShadow = "rgba(0, 0, 0, 0.4) 0px 2px 4px";
        edit_UI.title = "Edit";
        this.div.appendChild(edit_UI);

        var edit_img = document.createElement("img");
        edit_img.src = img_src;
        edit_img.alt = alt;
        edit_img.height = 16;
        edit_img.width = 16;
        edit_img.draggable = false;
        edit_UI.appendChild(edit_img);

        google.maps.event.addDomListener(edit_UI, "click", edit_fn);
    }

    editToolBar.prototype.show = function()
    {
        this.div.style.display = "";
    }

    editToolBar.prototype.hide = function()
    {
        this.div.style.display = "none";
    }

    var edit_button = new editToolBar();
    edit_button.addIcon("img/edit.png", "Edit", function() {map.setEditable(true)});
    edit_button.show();
    edit_div.appendChild(edit_button.div);

    var edit_tools = new editToolBar();
    edit_tools.addIcon("img/done.png", "Done", function() {map.setEditable(false)});
    edit_tools.hide();
    edit_div.appendChild(edit_tools.div);

    map.setEditable = function(editable)
    {
        if (editable) {
            this.drawingManager.setMap(this);
            for (var i = 0, a; a = this.shown_areas[i]; i++)
                a.setEditable(true);
            edit_button.hide();
            edit_tools.show();
        } else {
            this.drawingManager.setMap(null);
            for (var i = 0, a; a = this.shown_areas[i]; i++)
                a.setEditable(false);
            edit_tools.hide();
            edit_button.show();
        }
    }

    map.overlayComplete = function(ev) {
        ev.overlay.setEditable(true);
    }
    google.maps.event.addListener(map.drawingManager, 'overlaycomplete', map.overlayComplete);

    map.update(document.getElementById("selected_year").innerHTML);
}
google.maps.event.addDomListener(window, "load", initializeMap);
