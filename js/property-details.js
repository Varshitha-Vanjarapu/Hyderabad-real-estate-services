import { db } from "./firebase-config.js";

import {
    doc,
    getDoc
}
from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const params =
new URLSearchParams(
    window.location.search
);

const propertyId =
params.get("id");

const title =
document.getElementById(
    "propertyTitle"
);

const description =
document.getElementById(
    "propertyDescription"
);

const gallery =
document.getElementById(
    "imageGallery"
);

async function loadProperty(){

    try{

        const docRef =
        doc(
            db,
            "properties",
            propertyId
        );

        const docSnap =
        await getDoc(docRef);

        if(docSnap.exists()){

            const property =
            docSnap.data();
            const whatsappBtn =
document.getElementById("whatsappBtn");

const message = encodeURIComponent(
`Hello,
I am interested in this property:${property.title}
Property ID:${propertyId}
Please provide more details.`
);

whatsappBtn.href =
`https://wa.me/919000116168?text=${message}`;

            title.innerText =
            property.title;

            description.innerText =
            property.description;

            const mainImage =
document.getElementById(
    "mainImage"
);

gallery.innerHTML = "";

if(property.images.length > 0){

    mainImage.src =
    property.images[0];

}

property.images.forEach(
(image,index)=>{

    gallery.innerHTML += `

    <img
    src="${image}"
    class="thumbnail
    ${index === 0 ? "active" : ""}"
    onclick="changeImage('${image}',this)">

    `;

});

        }

    }
    catch(error){

        console.error(error);

        title.innerText =
        "Property Not Found";

    }

}

loadProperty();
window.changeImage =
function(image,element){

    document.getElementById(
        "mainImage"
    ).src = image;

    document
    .querySelectorAll(
        ".thumbnail"
    )
    .forEach((thumb)=>{

        thumb.classList
        .remove("active");

    });

    element.classList
    .add("active");

}