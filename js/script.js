console.log("Hyderabad Real Estate Services Loaded");

// Contact & Sell Property Forms

document.addEventListener("DOMContentLoaded", () => {

    const forms = document.querySelectorAll("form");

    forms.forEach(form => {

        form.addEventListener("submit", (e) => {

            e.preventDefault();

            alert(
                "Thank you! Our team will contact you shortly."
            );

            form.reset();

        });

    });

});

// Property Search

function searchProperties() {

    const searchText =
        document
        .getElementById("searchInput")
        .value
        .toLowerCase()
        .trim();

    const properties =
        document.querySelectorAll(".property-card");

    properties.forEach(property => {

        const location =
            property
            .getAttribute("data-location")
            .toLowerCase();

        const title =
            property
            .getAttribute("data-title")
            .toLowerCase();

        if (
            location.includes(searchText) ||
            title.includes(searchText)
        ) {

            property.style.display = "block";

        } else {

            property.style.display = "none";

        }

    });

}

// Enter key support

document.addEventListener("keydown", function(event){

    if(event.key === "Enter"){

        const searchBox =
        document.getElementById("searchInput");

        if(searchBox){

            searchProperties();

        }

    }

});
function toggleMenu(){

    const navLinks =
    document.getElementById("nav-links");

    navLinks.classList.toggle("active");

}