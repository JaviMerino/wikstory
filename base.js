function show_person(n, name, show) {
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
    document.getElementById("map").src = "img/maps/" + year + ".png";

    var people = document.getElementById("people").getElementsByClassName("person");
    var i;
    for (i = 0; i < people.length; i++) {
        var childNode = people[i];
        show_person(childNode, "Churchill", year >= 1940);
        show_person(childNode, "Stalin", year >= 1941);
        show_person(childNode, "Roosevelt", year >= 1941);
    }
}

function showShortBio()
{
    document.getElementById("short_bio_hitler").style.display = "";
}

function _closeShortBio(shortBioNode)
{
    shortBioNode.style.display = "none";
}

function closeShortBioMouse()
{
    //_closeShortBio(document.getElementById("short_bio_hitler"));
}

function closeShortBio(button)
{
    button.parentNode.parentNode.parentNode.style.display = "none";
}
