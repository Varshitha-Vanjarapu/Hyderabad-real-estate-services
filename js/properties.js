import { db } from "./firebase-config.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const propertyGrid =
document.getElementById("propertyGrid");

async function loadProperties(){

    try{

        const querySnapshot =
        await getDocs(
            collection(db,"properties")
        );

        propertyGrid.innerHTML = "";

        const properties = [];

        querySnapshot.forEach((doc)=>{

            properties.push({
                id: doc.id,
                ...doc.data()
            });

        });

        properties.sort((a,b)=>{

            return (b.featured === true)
            - (a.featured === true);

        });

        properties.forEach((property)=>{

            const image =
            property.images?.[0] || "";

            propertyGrid.innerHTML += `

            <div class="card property-card">

                ${property.featured ?

                `<div class="featured-badge">
                    ⭐ Featured
                </div>`

                : ""}

                <img
                src="${image}"
                alt="${property.title || "Property"}">

                <div class="card-content">

                    <h3>
                        ${property.title || "Property"}
                    </h3>

                    <p class="property-status ${(property.status || "Available")
                    .toLowerCase()
                    .replace(/\s+/g,"-")}">

                        ${property.status || "Available"}

                    </p>

                    <p>

                        ${(property.description || "No Description")
                        .substring(0,150)}...

                    </p>

                    <a
                    href="property-details.html?id=${property.id}"
                    class="details-btn">

                        View Details

                    </a>

                </div>

            </div>

            `;

        });

    }
    catch(error){

        console.error(error);

        propertyGrid.innerHTML =
        "<h2>Error Loading Properties</h2>";

    }

}

window.searchProperties = function(){

    const searchText =
    document.getElementById("searchInput")
    .value
    .toLowerCase();

    const cards =
    document.querySelectorAll(".property-card");

    cards.forEach(card=>{

        const text =
        card.innerText.toLowerCase();

        if(text.includes(searchText)){

            card.style.display = "block";

        }
        else{

            card.style.display = "none";

        }

    });

}

loadProperties();