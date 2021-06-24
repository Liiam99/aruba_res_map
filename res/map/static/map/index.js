document.addEventListener('DOMContentLoaded', function() {
    // Initialises Bootstrap's tooltip functionality.
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    const sliders = document.querySelectorAll('.form-range');
    sliders.forEach(slider => {
        slider.addEventListener('input', (e) => slider_change(e.target));
    });

    load_map();
});


/*
Updates a slider's value and the total points remaining. Restricts the
slider if no points left.
*/
function slider_change(slider) {
    const slider_type = slider.id.replace("-range", "");
    const slider_display = document.getElementById(`${slider_type}-points`);
    const old_value = slider_display.innerHTML;
    const new_value = slider.value;
    const change = new_value - old_value;

    // Allows the slider to change if there are points left to divide.
    let points = document.getElementById('points');
    if (points.innerHTML - change < 0 || points.innerHTML - change > 100) {
        slider.value = old_value;
    }
    else {
        points.innerHTML = parseInt(points.innerHTML) - change;
        slider_display.innerHTML = new_value;
    }

    rank_locations();
}


/*
Loads the Mapbox map with all the locations retrieved from the database.
*/
function load_map() {
    mapboxgl.accessToken = 'pk.eyJ1IjoibGlhbTk5IiwiYSI6ImNrcHZxcXNnajA2aWMydXRjb3M4bGhsNWIifQ.J2SCX3HfV0q1tuN_Wl7nhA';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/liam99/ckq8i79x20bd018n3cv16vdo0',
        center: [-69.97248548654704, 12.513033718422756],
        zoom: 11
    });

    // Loads all the locations with their names and descriptions.
    fetch('/locations')
    .then(response => response.json())
    .then(locations => {
        locations.forEach(location => {
            popup_content = create_popup_content(location)
            let popup = new mapboxgl.Popup({ offset: 25 })
                .setHTML(popup_content);

            let element = document.createElement('div');
            element.id = location.name;

            new mapboxgl.Marker(element)
                .setLngLat(location.coords)
                .setPopup(popup)
                .addTo(map);
        });

        sessionStorage.setItem('locations', JSON.stringify(locations));
    });
}


/*
Creates a Bootstrap dynamic tabbed interface with descriptions.
*/
function create_popup_content(location) {
    let content = document.createElement('div')

    let title = document.createElement('h3')
    title.innerHTML = location.name
    title.className = "popup-title"

    let nav = document.createElement('nav')
    let nav_tab = document.createElement('div')
    nav_tab.id = "nav-tab"
    nav_tab.className = "nav justify-content-center nav-tabs"
    nav_tab.setAttribute('role', 'tablist')
    nav.appendChild(nav_tab)

    let tab_box = document.createElement('div')
    tab_box.id = "nav-tabContent"
    tab_box.className ="tab-content"

    // Fills each tab with the description.
    for (let tab_name in location.descriptions) {
        if (location.descriptions.hasOwnProperty(tab_name)) {
            let nav_button = document.createElement('button')
            nav_button.className = "nav-link"
            nav_button.id = `nav-${tab_name}-tab`
            nav_button.setAttribute("data-bs-toggle", "tab")
            nav_button.setAttribute("data-bs-target", `#nav-${tab_name}`)
            nav_button.type = "button"
            nav_button.setAttribute("role", "tab")
            nav_button.setAttribute("aria-controls", `#nav-${tab_name}`)
            nav_button.setAttribute("aria-selected", "false")
            nav_button.innerHTML = tab_name.charAt(0).toUpperCase() + tab_name.slice(1)

            if (tab_name == "efficiency") {
                nav_button.innerHTML = "Energy " + nav_button.innerHTML
            } else if (tab_name != "overview") {
                nav_button.innerHTML += " Impact"
            }

            nav_tab.appendChild(nav_button)

            let tab = document.createElement('div')
            tab.className = "tab-pane fade"
            tab.id = `nav-${tab_name}`
            tab.setAttribute('role', "tabpanel")
            tab.setAttribute('aria-labelledby', `nav-${tab_name}-tab`)
            tab.innerHTML = location.descriptions[tab_name]
            tab.innerHTML = tab.innerHTML.replace(/\n/g, "<br>")

            tab_box.appendChild(tab)

            if (nav.childNodes.length == 1 && tab_box.childNodes.length == 1) {
                nav_button.className += " active"
                nav_button.setAttribute("aria-selected", "true")
                tab.className += " show active"
            }
        }
    }

    content.append(title)
    content.appendChild(nav)
    content.appendChild(tab_box)

    return content.innerHTML
}


/*
Ranks the locations from lowest (=best) to highest (=worst) score.
*/
function rank_locations() {
    const ranked_locations = {};
    const sliders = document.querySelectorAll('.form-range');

    // Calculates the total score for each location.
    let locations = JSON.parse(sessionStorage.getItem('locations'));
    locations.forEach((location) => {
        let total_ranking = 0;

        sliders.forEach(slider => {
            let slider_type = slider.id.replace("-range", "");
            total_ranking += location.rankings[slider_type] * slider.value;
        });

        ranked_locations[location.name] = total_ranking;
    });

    // Orders the locations based on their rankings from low to high.
    const ordered_locations = [];
    while (Object.keys(ranked_locations).length > 0) {
        let lowest_ranking = 0;
        let best_location = 0;

        // Finds the location with the lowest score remaining.
        for (let location in ranked_locations) {
            if (ranked_locations.hasOwnProperty(location)) {
                let location_ranking = ranked_locations[location];

                // Keeps track of location with lowest (best) ranking.
                if (location_ranking < lowest_ranking || lowest_ranking == 0) {
                    lowest_ranking = location_ranking;
                    best_location = location;
                }
            }
        }

        ordered_locations.push(best_location);
        delete ranked_locations[best_location];
    }

    colour_locations(ordered_locations);
}


/*
Colours the location according to their ranking.
*/
function colour_locations(locations) {
    let points = document.getElementById('points').innerHTML;
    if (points == 100) {
        locations.forEach(location => {
            let location_icon = document.getElementById(location);
            location_icon.style.backgroundImage = "url('static/map/images/gray_icon.png')";
        });
    }
    else {
        locations.forEach((location, index) => {
            let location_icon = document.getElementById(location);
            if (index == 0 || index == 1) {
                location_icon.style.backgroundImage = "url('static/map/images/green_icon.png')";
            }
            else if (index > 1 && index < 5) {
                location_icon.style.backgroundImage = "url('static/map/images/orange_icon.png')";
            }
            else if (index == 5 || index == 6) {
                location_icon.style.backgroundImage = "url('static/map/images/red_icon.png')";
            }
        });
    }
}
