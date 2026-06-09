import { auth, db } from "./firebase-config.js";

import {
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
}
from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    getDoc,
    updateDoc,
    serverTimestamp
}
from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

let editingPropertyId = null;

/* LOGIN */

const loginForm =
document.getElementById("loginForm");

if(loginForm){

    loginForm.addEventListener(
        "submit",
        async(e)=>{

            e.preventDefault();

            const email =
            document.getElementById("email").value;

            const password =
            document.getElementById("password").value;

            try{

                await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

                window.location.href =
                "admin-dashboard.html";

            }
            catch(error){

                alert(error.message);

            }

        }
    );

}

/* LOGOUT */

const logoutBtn =
document.getElementById("logoutBtn");

if(logoutBtn){

    logoutBtn.addEventListener(
        "click",
        async()=>{

            await signOut(auth);

            window.location.href =
            "admin-login.html";

        }
    );

}

/* PROTECT DASHBOARD */

onAuthStateChanged(
    auth,
    (user)=>{

        if(
            window.location.pathname
            .includes("admin-dashboard.html")
        ){

            if(!user){

                window.location.href =
                "admin-login.html";

            }

        }

    }
);

/* PASSWORD TOGGLE */

window.togglePassword = function(){

    const password =
    document.getElementById("password");

    if(password){

        password.type =
        password.type === "password"
        ? "text"
        : "password";

    }

};

/* PROPERTY FORM */

const propertyForm =
document.getElementById("propertyForm");

if(propertyForm){

    propertyForm.addEventListener(
        "submit",
        async(e)=>{

            e.preventDefault();

            const title =
            document.getElementById("title").value;

            const description =
            document.getElementById("description").value;

            const propertyStatus =
            document.getElementById("status").value;

            const featured =
            document.getElementById("featured").checked;

            const imageFiles =
            document.getElementById("images").files;

            const saveStatus =
            document.getElementById("saveStatus");

            try{

                saveStatus.innerText =
                "Uploading Images...";

                let imageUrls = [];

                if(imageFiles.length > 0){

                    for(
                        let i = 0;
                        i < imageFiles.length;
                        i++
                    ){

                        const formData =
                        new FormData();

                        formData.append(
                            "file",
                            imageFiles[i]
                        );

                        formData.append(
                            "upload_preset",
                            "property_images"
                        );

                        const response =
                        await fetch(
                            "https://api.cloudinary.com/v1_1/dsxxjdrvr/image/upload",
                            {
                                method:"POST",
                                body:formData
                            }
                        );

                        const data =
                        await response.json();

                        imageUrls.push(
                            data.secure_url
                        );

                    }

                }

                saveStatus.innerText =
                "Saving Property...";

                if(editingPropertyId){

                    const docRef =
                    doc(
                        db,
                        "properties",
                        editingPropertyId
                    );

                    const updateData = {

                        title,
                        description,
                        status:propertyStatus,
                        featured

                    };

                    if(imageUrls.length > 0){

                        updateData.images =
                        imageUrls;

                    }

                    await updateDoc(
                        docRef,
                        updateData
                    );

                    saveStatus.innerText =
                    "Property Updated Successfully 🎉";

                    editingPropertyId =
                    null;

                }
                else{

                    await addDoc(
                        collection(
                            db,
                            "properties"
                        ),
                        {
                            title,
                            description,
                            status:propertyStatus,
                            featured,
                            images:imageUrls,
                            createdAt:
                            serverTimestamp()
                        }
                    );

                    saveStatus.innerText =
                    "Property Saved Successfully 🎉";

                }

                propertyForm.reset();

                loadAdminProperties();

            }
            catch(error){

                console.error(error);

                saveStatus.innerText =
                "Error Saving Property";

            }

        }
    );

}

/* LOAD PROPERTIES */

const propertiesList =
document.getElementById(
    "propertiesList"
);

async function loadAdminProperties(){

    if(!propertiesList) return;

    propertiesList.innerHTML =
    "Loading Properties...";

    const querySnapshot =
    await getDocs(
        collection(db,"properties")
    );

    propertiesList.innerHTML = "";

    querySnapshot.forEach(
        (propertyDoc)=>{

            const property =
            propertyDoc.data();

            const image =
            property.images?.[0] || "";

            propertiesList.innerHTML += `

            <div class="admin-property">

                <img
                src="${image}"
                class="admin-property-image"
                alt="${property.title}">

                <div class="admin-property-info">

                    <h3>

                        ${property.title}

                    </h3>

                    <p>

                        ${property.status || "Available"}

                    </p>

                    ${property.featured ?

                    `<span class="featured-admin">
                        ⭐ Featured
                    </span>`

                    : ""}

                </div>

                <div class="admin-property-actions">

                    <button
                    onclick="editProperty('${propertyDoc.id}')">

                        Edit

                    </button>

                    <button
                    onclick="deleteProperty('${propertyDoc.id}')">

                        Delete

                    </button>

                </div>

            </div>

            `;

        }
    );

}


/* EDIT */

window.editProperty =
async function(id){

    const docRef =
    doc(
        db,
        "properties",
        id
    );

    const docSnap =
    await getDoc(docRef);

    if(docSnap.exists()){

        const property =
        docSnap.data();

        document.getElementById("title").value =
        property.title;

        document.getElementById("description").value =
        property.description;

        document.getElementById("status").value =
        property.status || "Available";

        document.getElementById("featured").checked =
        property.featured || false;

        editingPropertyId = id;

        window.scrollTo({
            top:0,
            behavior:"smooth"
        });

    }

}

/* DELETE */

window.deleteProperty =
async function(id){

    const confirmDelete =
    confirm(
        "Delete this property?"
    );

    if(!confirmDelete) return;

    await deleteDoc(
        doc(
            db,
            "properties",
            id
        )
    );

    loadAdminProperties();

}

loadAdminProperties();
window.searchAdminProperties =
function(){

    const searchText =
    document.getElementById(
        "adminSearch"
    )
    .value
    .toLowerCase();

    const properties =
    document.querySelectorAll(
        ".admin-property"
    );

    properties.forEach((property)=>{

        const text =
        property.innerText
        .toLowerCase();

        if(
            text.includes(searchText)
        ){

            property.style.display =
            "flex";

        }
        else{

            property.style.display =
            "none";

        }

    });

}