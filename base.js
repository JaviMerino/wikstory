/* This will be moved to a JSON file soon */
var markers = {
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
document.addEventListener("DOMContentLoaded", function(){updateTimer(Object.keys(markers)[0])});

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

    /* No clue why, but there's 22px below the header */
    var header_bottom_margin = 22;

    var mnp_height = window.innerHeight - title_height - header_bottom_margin;
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

function createTimeline()
{
    var timeline_container_div = document.createElement("div");
    timeline_container_div.style.margin = "5px";

    var timeline_div = document.createElement("div");
    timeline_div.id = "timeline";
    timeline_container_div.appendChild(timeline_div);

    var selected_year_div = document.createElement("div");
    selected_year_div.className = "selected_year";
    timeline_div.appendChild(selected_year_div);

    var min_year = "1939"; // XXX Use the markers
    var max_year = "1945";
    var timeline_slider = document.createElement("div");
    timeline_slider.id = "timeline_slider";
    timeline_slider.insertAdjacentHTML("afterbegin", min_year);
    var slider = document.createElement("input");
    slider.type = "range";
    slider.min = min_year;
    slider.max = max_year;
    slider.value = min_year;
    slider.id = "timeline_range";
    slider.addEventListener("change", function() {updateTimer(this.value)});
    timeline_slider.appendChild(slider);
    timeline_slider.insertAdjacentHTML("beforeend", max_year);
    timeline_div.appendChild(timeline_slider);

    return timeline_container_div;
}

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
        styles: [
            {
                featureType: "administrative",
                stylers: [{
                    visibility: "off",
                }],
            },
            {
                featureType: "road",
                stylers: [{
                    visibility: "off",
                }],
            },
        ],
    };

    map = new google.maps.Map(document.getElementById("map_container"), myOptions);

    map.shown_markers = [];
    map.shown_areas = [];

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

    map.timeline_container_div = createTimeline();
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(map.timeline_container_div);

    var edit_div = document.createElement("div");
    edit_div.style.margin = "5px";
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(edit_div);

    map.drawingManager = new google.maps.drawing.DrawingManager({
        drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_RIGHT,
            drawingModes: [
                google.maps.drawing.OverlayType.MARKER,
                google.maps.drawing.OverlayType.POLYGON,
            ],
        },
        polygonOptions: {
            editable: true,
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

        for (var i = 0, m; m = markers[year][i]; i++)
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

    map.saveShownAreas = function() {
        var coords = "[";

        for (var i = 0, a; a = this.shown_areas[i]; i++) {
            var array_area_coords = a.getPaths().getArray()[0].getArray();

            var area_coords = "[";
            for (var j = 0, this_point; this_point = array_area_coords[j]; j++) {
                var this_point_str = "[" + this_point.lat() + ", " + this_point.lng() + "]";
                area_coords += this_point_str + ", ";
            }
            area_coords = area_coords.slice(0, area_coords.length - 2);
            area_coords += "]";

            coords += area_coords + ", ";
        }
        coords = coords.slice(0, coords.length - 2);
        coords += "]";

        alert("Would send to the server: " + coords);
    }

    map.update = function(year) {
        map.timeline_container_div.getElementsByClassName("selected_year")[0].innerHTML = year;

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
        edit_UI.className = "edit_UI";
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
            map.saveShownAreas();
            this.drawingManager.setMap(null);
            for (var i = 0, a; a = this.shown_areas[i]; i++)
                a.setEditable(false);
            edit_tools.hide();
            edit_button.show();
        }
    }

    map.overlayComplete = function(ev) {
        map.shown_areas.push(ev.overlay);
        map.drawingManager.setDrawingMode(null);
    }
    google.maps.event.addListener(map.drawingManager, 'overlaycomplete', map.overlayComplete);

    map.update(Object.keys(markers)[0]);
}
google.maps.event.addDomListener(window, "load", initializeMap);
