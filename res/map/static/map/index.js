document.addEventListener('DOMContentLoaded', function() {
    // Transforms the menu with discplines in a drag-and-drop list
    const drag_area = document.getElementById('items');
    new Sortable(drag_area, {
        animation: 350,
        chosenClass: "chosen",
        dragClass: "drag",
        ghostClass: "ghost"
    })

    load_map()

    filter_locations()
})

/*
Loads the Mapbox map with all the locations retrieved from the database.
*/
function load_map() {
    mapboxgl.accessToken = 'pk.eyJ1IjoibGlhbTk5IiwiYSI6ImNrcHZxcXNnajA2aWMydXRjb3M4bGhsNWIifQ.J2SCX3HfV0q1tuN_Wl7nhA';
    var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-69.97248548654704, 12.513033718422756],
    zoom: 11
    });

    // Loads all the locations with their names and descriptions.
    fetch('/locations')
    .then(response => response.json())
    .then(locations => {
        locations.forEach((location) => {
            var popup = new mapboxgl.Popup({ offset: 25 })
                .setHTML('<h3>' + location.name +
                    '</h3><p>' + location.description + '</p>')

            var element = document.createElement('div')
            element.id = location.name

            new mapboxgl.Marker(element)
                .setLngLat(location.coords)
                .setPopup(popup)
                .addTo(map)
        })
    })
}

function filter_locations() {

}
