// ____________________________________________________________________________ CREO LA RICHIESTA PER LO SCAMBIO DEL TOKEN

const richiestaToken = new Request("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: new Headers({
        "Content-Type": "application/x-www-form-urlencoded"
    }),
    body: new URLSearchParams("?grant_type=client_credentials&client_id=(INSERISCI QUI IL TUO CLIENT ID)&client_secret=(INSERISCI QUI IL TUO CLIENT SECRET)"),
});

// ____________________________________________________________________________ INVIO LA RICHIESTA PER LO SCAMBIO DEL TOKEN

fetch(richiestaToken)
    .then(response => response.json())
    .then(obj => {
        let token = obj.access_token;
        const textarea = document.querySelector(".textarea");
        textarea.addEventListener("keydown", function() {
            if(event.key == "Enter") {
                if(document.querySelector(".result")) document.querySelector(".result").remove();
                const artistaRicerca = textarea.value;
                textarea.blur();

                // ________________________________________________________________________ CREO LA RICHIESTA PER L'ARTISTA

                const richiestaArtista = new Request("https://api.spotify.com/v1/search?q=" + artistaRicerca + "&type=artist", {
                    method: "GET",
                    headers: new Headers({
                        "Authorization": "Bearer " + token,
                    }),
                });

                // ________________________________________________________________________ INVIO LA RICHIESTA PER L'ARTISTA

                fetch(richiestaArtista)
                    .then(response => response.json())
                    .then(obj => {
                        let artista = obj.artists.items[0]; 
                        if(artista) {
                            let nome = artista.name;
                            let fotoArtista = artista.images[0].url;
                            let idArtista = artista.id;


                            const divResult = document.createElement("div");
                            divResult.className = "result";
                            const titoloArista = document.createElement("p");
                            titoloArista.className = "titleP";
                            titoloArista.appendChild(document.createTextNode("Risultato più rilevante"));
                            divResult.appendChild(titoloArista);
                            const divArtista = document.createElement("div");
                            divArtista.className = "artista";
                            const imgArtista = document.createElement("img");
                            imgArtista.src = fotoArtista;
                            imgArtista.className = "fotoArtista";
                            divArtista.appendChild(imgArtista);
                            const nomeArtista = document.createElement("p");
                            nomeArtista.className = "nomeArtista";
                            nomeArtista.appendChild(document.createTextNode(nome));
                            divArtista.appendChild(nomeArtista);
                            const descrizioneRicerca = document.createElement("p");
                            descrizioneRicerca.className = "descrizioneRicerca";
                            descrizioneRicerca.appendChild(document.createTextNode("Artista"));
                            divArtista.appendChild(descrizioneRicerca);
                            divResult.appendChild(divArtista);
                            document.querySelector(".right-menu").appendChild(divResult);


                            // ________________________________________________________________ CREO LA RICHIESTA PER LA DISCOGRAFIA

                            const richiestaAlbum = new Request("https://api.spotify.com/v1/artists/" + idArtista + "/albums", {
                                method: "GET",
                                headers: new Headers({
                                    "Authorization": "Bearer " + token,
                                }),
                            });

                            // ________________________________________________________________ INVIO LA RICHIESTA PER LA DISCOGRAFIA

                            fetch(richiestaAlbum)
                                .then(response => response.json())
                                .then(obj => {
                                    let arrAlbum = [];
                                    const titoloAlbum = document.createElement("p");
                                    titoloAlbum.className = "titleP";
                                    titoloAlbum.appendChild(document.createTextNode("Album"));
                                    divResult.appendChild(titoloAlbum);
                                    const divAlbums = document.createElement("div");
                                    divAlbums.className = "albums";
                                    obj.items.forEach(element => {
                                        let nomeAlbum = element.name;
                                        let coverAlbum = element.images[0].url;
                                        if(!arrAlbum.includes(nomeAlbum)) {
                                            arrAlbum.push(nomeAlbum);
                                            
                                            
                                            const album = document.createElement("div");
                                            album.className = "album";
                                            const imgAlbum = document.createElement("img");
                                            imgAlbum.src = coverAlbum;
                                            imgAlbum.className = "fotoAlbum";
                                            album.appendChild(imgAlbum);
                                            const nomeTitoloAlbum = document.createElement("p");
                                            nomeTitoloAlbum.className = "nomeAlbum";
                                            nomeTitoloAlbum.appendChild(document.createTextNode(nomeAlbum));
                                            album.appendChild(nomeTitoloAlbum);
                                            const annoAlbum = document.createElement("p");
                                            annoAlbum.className = "annoAlbum";
                                            annoAlbum.appendChild(document.createTextNode(element.release_date.substring(0, 4)));
                                            album.appendChild(annoAlbum);
                                            divAlbums.appendChild(album);


                                        }
                                    });
                                    divResult.appendChild(divAlbums);
                                });
                        }
                        else {
                        }
                    });
            }
        });
    })
    .catch(error => console.error(error));

// ____________________________________________________________________________ SCRIPT PER LA GRAFICA


const homeLi = document.querySelector(".home");
const searchLi = document.querySelector(".search");
const textarea = document.querySelector(".textarea");
const containerRicerca = document.querySelector(".containerRicerca");
const btnRemove = document.querySelector("#btnRemove");
const divInfo = document.querySelector(".info");

btnRemove.addEventListener("click", removeTextArea);
textarea.addEventListener("keyup", controllaRemove);
textarea.addEventListener("focus", focusSearch);
textarea.addEventListener("focusout", focusoutSearch);

containerRicerca.addEventListener("mouseover", overContainer);
containerRicerca.addEventListener("mouseout", outContainer);

homeLi.addEventListener("click", changeStateHome);
searchLi.addEventListener("click", changeStateSearch);

homeLi.addEventListener("mouseover", overStateHome);
searchLi.addEventListener("mouseover", overStateSearch);

homeLi.addEventListener("mouseout", outStateHome);
searchLi.addEventListener("mouseout", outStateSearch);

let homeWhite = 1;
let searchWhite = 0;
let inRicerca = 0;

function controllaRemove() {
    if (textarea.value == "") {
        btnRemove.style.display = "none";
    }
    else {
        btnRemove.style.display = "block";
    }
}

function removeTextArea() {
    textarea.value = "";
    textarea.focus();
    btnRemove.style.display = "none";
}

function overContainer() {
    containerRicerca.style.border = "1px solid white";
    containerRicerca.style.backgroundColor = "#272727";
    const iconRicerca = document.querySelector("#ricercaIcon");
    iconRicerca.style.color = "white";
}

function focusSearch() {
    containerRicerca.style.border = "1px solid white";
    containerRicerca.style.backgroundColor = "#272727";
    const iconRicerca = document.querySelector("#ricercaIcon");
    iconRicerca.style.color = "white";
    inRicerca = 1;
}

function outContainer() {
    if(inRicerca == 0) {
        containerRicerca.style.border = "1px solid transparent";
        containerRicerca.style.backgroundColor = "#242424";
        const iconRicerca = document.querySelector("#ricercaIcon");
        iconRicerca.style.color = "#a5a5a5";
    }
}

function focusoutSearch() {
    containerRicerca.style.border = "1px solid transparent";
    containerRicerca.style.backgroundColor = "#242424";
    const iconRicerca = document.querySelector("#ricercaIcon");
    iconRicerca.style.color = "#a5a5a5";
    inRicerca = 0;
}

function outStateHome() {
    if(homeWhite == 0) {
        homeLi.style.color = "#4a4a4a";
        const faviconHome = document.querySelector("#faviHome");
        faviconHome.style.color = "#4a4a4a";
    }
}

function outStateSearch() {
    if(searchWhite == 0) {
        searchLi.style.color = "#4a4a4a";
        const faviconSearch = document.querySelector("#faviSearch");
        faviconSearch.style.color = "#4a4a4a";
    }
}

function overStateHome() {
    if(homeWhite == 0) {
        homeLi.style.color = "#989898";
        const faviconHome = document.querySelector("#faviHome");
        faviconHome.style.color = "#989898";
    }
}

function overStateSearch() {
    if(searchWhite == 0) {
        searchLi.style.color = "#989898";
        const faviconSearch = document.querySelector("#faviSearch");
        faviconSearch.style.color = "#989898";
    }
}

function changeStateHome() {
    homeLi.style.color = "#ffffff";
    const faviconHome = document.querySelector("#faviHome");
    faviconHome.style.color = "#ffffff";
    searchLi.style.color = "#4a4a4a";
    const faviconSearch = document.querySelector("#faviSearch");
    faviconSearch.style.color = "#4a4a4a";
    containerRicerca.style.display = "none";
    divInfo.style.display = "block";
    divInfo.style.display = "flex";      
    divInfo.style.flexDirection = "column";    
    if(document.querySelector(".result")) document.querySelector(".result").style.display = "none"; 
    homeWhite = 1;
    searchWhite = 0;
}

function changeStateSearch() {
    homeLi.style.color = "#4a4a4a";
    const faviconHome = document.querySelector("#faviHome");
    faviconHome.style.color = "#4a4a4a";
    searchLi.style.color = "#ffffff";
    const faviconSearch = document.querySelector("#faviSearch");
    faviconSearch.style.color = "#ffffff";
    containerRicerca.style.display = "block";
    containerRicerca.style.display = "block";
    containerRicerca.style.display = "flex";      
    containerRicerca.style.flexDirection = "row";  
    if(textarea.value == "") {
        btnRemove.style.display = "none";
    }
    divInfo.style.display = "none";
    if(document.querySelector(".result")) {
        document.querySelector(".result").style.display = "block";
        document.querySelector(".result").style.display = "flex";      
        document.querySelector(".result").style.flexDirection = "column";        
    }  

    homeWhite = 0;
    searchWhite = 1;
}