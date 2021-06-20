document.addEventListener('DOMContentLoaded', function() {
    // Transforms the menu with discplines in a drag-and-drop list
    const drag_area = document.getElementById('items');
    new Sortable(drag_area, {
        animation: 350,
        chosenClass: "chosen",
        dragClass: "drag",
        ghostClass: "ghost",
        onSort: rank_locations
    })

    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
    })

    load_map()
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


/*
Ranks the locations by multiplying their rankings and comparing total scores.
*/
function rank_locations() {
    var preferences = document.querySelectorAll('.list-group-item')
    var ranked_locations = {}

    fetch('/locations')
    .then(response => response.json())
    .then(locations => {
        locations.forEach((location) => {
            var total_ranking = 0

            preferences.forEach((preference, index) => {
                total_ranking += location.rankings[preference.id] * (4 - index)
            })

            ranked_locations[location.name] = total_ranking
        })

        var ordered_locations = []

        // Orders the locations based on their rankings from low to high.
        while (Object.keys(ranked_locations).length > 0) {
            var lowest_ranking = 0
            var best_location = 0

            for (let location in ranked_locations) {
                location_ranking = ranked_locations[location]

                // Keeps track of location with lowest (best) ranking.
                if (location_ranking < lowest_ranking || lowest_ranking == 0) {
                    lowest_ranking = location_ranking
                    best_location = location
                }
            }

            // Ads location to its correct position and deletes it from the queue.
            ordered_locations.push(best_location)
            delete ranked_locations[best_location]
        }

        colour_locations(ordered_locations)
        console.log(ordered_locations)
    })
}


/*
Colours the location according to their ranking.
*/
function colour_locations(locations) {
    locations.forEach((location, index) => {
        location_icon = document.getElementById(location)
        if (index == 0 || index == 1) {
            location_icon.style.backgroundImage = "url('static/map/images/green_icon.png')";
        }
        else if (index > 1 && index < 5) {
            location_icon.style.backgroundImage = "url('static/map/images/orange_icon.png')";
        }
        else if (index == 5 || index == 6) {
            location_icon.style.backgroundImage = "url('static/map/images/red_icon.png')";
        }
    })
}