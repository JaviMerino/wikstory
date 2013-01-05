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
    document.getElementById("map").src = "img/maps/" + year + ".png";

    var people = document.getElementById("people").getElementsByClassName("person");
    var i;
    for (i = 0; i < people.length; i++) {
        var childNode = people[i];
        showPerson(childNode, "Churchill", year >= 1940);
        showPerson(childNode, "Stalin", year >= 1941);
        showPerson(childNode, "Roosevelt", year >= 1941);
    }
}

function getShortBioNode(node)
{
    var name = /_[^_]+$/.exec(node.id)[0]
    return document.getElementById("short_bio" + name);
}

function showShortBio(node)
{
    cancelCloseShortBio();
    getShortBioNode(node).style.display = "";
}

function closeShortBio(shortBioNode)
{
    shortBioNode.style.display = "none";
}

var myTimeout;
function closeShortBioMaybe(node)
{
    myTimeout = setTimeout(function() {closeShortBio(getShortBioNode(node))}, 100);
}

function closeShortBioButton(button)
{
    closeShortBio(button.parentNode.parentNode.parentNode);
}

function cancelCloseShortBio()
{
    clearTimeout(myTimeout);
}
