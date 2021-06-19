document.addEventListener('DOMContentLoaded', function() {
    load_map()
})

function load_map() {
    mapboxgl.accessToken = 'pk.eyJ1IjoibGlhbTk5IiwiYSI6ImNrcHZxcXNnajA2aWMydXRjb3M4bGhsNWIifQ.J2SCX3HfV0q1tuN_Wl7nhA';
    var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-69.97248548654704, 12.513033718422756],
    zoom: 11
    });

    // Create a default Marker and add it to the map.
    var marker1 = new mapboxgl.Marker()
        .setLngLat([-69.99193, 12.48537])
        .addTo(map);
}
