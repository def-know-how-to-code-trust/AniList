const LtoC = {
    'Mandarin Chinese': 'zh',
    'Spanish': 'es',
    'Traditional Chinese': 'zh-TW',
    'Hindi': 'hi',
    'Korean': 'ko',
    'Japanese': 'ja',
};

const CtoL = {
    'zh': 'Mandarin Chinese',
    'es': 'Spanish',
    'zh-TW': 'Traditional Chinese',
    'hi': 'Hindi',
    'ko': 'Korean',
    'ja': 'Japanese',
};

const gridContainer = document.getElementById("grid-container");

function generateGridItem(anime) {
    const gridItem = document.createElement("div");
    gridItem.classList.add("grid-item");

    const image = document.createElement("img");
    image.src = anime.image;
    image.alt = anime.Name_org;
    image.width = 200;
    image.height = 300;
    gridItem.appendChild(image);

    const h2 = document.createElement("h2");
    h2.textContent = anime.Name_org;
    gridItem.appendChild(h2);

    const japaneseName = document.createElement("p");
    japaneseName.textContent = anime.Name_eng;
    gridItem.appendChild(japaneseName);

    const rating = document.createElement("p");
    rating.textContent = `Rating: ${anime.Score}`;
    gridItem.appendChild(rating);

    const category = document.createElement("p");
    category.textContent = `Category: ${anime.Genres}`;
    gridItem.appendChild(category);

    const airingStatus = document.createElement("p");
    airingStatus.textContent = `Airing Status: ${anime.Status}`;
    gridItem.appendChild(airingStatus);

    gridItem.onclick = function () {
        console.log(`Clicked on ${anime.Name_eng}`);
        // sessionStorage.setItem("selectedAnime",anime._ANIMEID);
        sessionStorage.setItem("selectedAnime", JSON.stringify(anime));
        window.location.href = "anime-details.html";
    };

    return gridItem;
}
function generateGrid() {
    console.log("Generating grid...");
    fetch("https://1nngfb0k32.execute-api.us-east-1.amazonaws.com/default/AnimeDBFun")
        .then(response => response.json())
        .then(animeList => {
            console.log(animeList);
            animeList.forEach(anime => {
                gridContainer.appendChild(generateGridItem(anime));
            });
        });
}

//function to fetch a singular anime based on id
function fetchAnime() {
    const id = sessionStorage.getItem("selectedAnime");
    console.log("Fetching anime...");
    console.log(`https://1nngfb0k32.execute-api.us-east-1.amazonaws.com/default/AnimeDBFun?id=${id}`)
    fetch(`https://1nngfb0k32.execute-api.us-east-1.amazonaws.com/default/AnimeDBFun?id=${id}`)
        .then(response => response.json())
        .then(anime => {
            console.log(anime);
            gridContainer.appendChild(generateGridItem(anime));
        });
}
//FUNCTION TO DISPLAY ANIME DETAIILS
async function displayAnimeDetails() {
    const selectedAnime = sessionStorage.getItem('selectedAnime');
    console.log(selectedAnime);
    const anime = JSON.parse(selectedAnime);
    if (selectedAnime) {
        const anime = JSON.parse(selectedAnime);
        console.log(anime);
        const image = document.querySelector('.image img');
        const title = document.querySelector('.title');
        const titleEng = document.querySelector('.eng');
        const synopsis = document.querySelector('.synopsis');
        const rating = document.querySelector('.rating');
        const category = document.querySelector('.category');
        const airingStatus = document.querySelector('.airing-status');
        const studio = document.querySelector('.studio');
        const duration = document.querySelector('.duration');
        const episodes = document.querySelector('.episodes');
        const type = document.querySelector('.type');
        const releaseDate = document.querySelector('.release-date');
        const score = document.querySelector('.score');

        image.src = anime.image;
        title.textContent = anime.Name_org;
        titleEng.textContent = anime.Name_eng;
        synopsis.textContent = anime.Synopsis;
        rating.textContent = anime.Rating;
        category.textContent = anime.Genres;
        airingStatus.textContent = anime.Status;
        studio.textContent = anime.Studios;
        score.textContent = anime.Score;
        duration.textContent = anime.Duration;
        episodes.textContent = anime.Episodes;
        type.textContent = anime.Type;
        releaseDate.textContent = anime.Release_Date;
    }
}

function hideDetailsTranslate() {
    var detailsTranslate = document.querySelector(".containerT");
    detailsTranslate.style.display = "none";
}

function showDetailsTranslate() {
    var detailsTranslate = document.querySelector(".containerT");
    detailsTranslate.style.display = "block";
}

async function translate(target, text) {
    let translatedText;
    await fetch("https://jq273eczgl.execute-api.us-east-1.amazonaws.com/default/translatoFUN",{
        method: 'POST',
        body: JSON.stringify({
            'text': text.replace(/"/g, '\\"'),
            'targetLang': target
        })
    })
    .then(response => response.json())
    .then(data => {
        translatedText = data;
    });
    return translatedText;
}

// function displayAnimeDetailsPerp() {
//     const selectedAnime = sessionStorage.getItem('selectedAnime');
//     console.log(selectedAnime);
//     const anime = JSON.parse(selectedAnime);
//     for (i=0; i<anime.length; i++) {
//         text = anime[i];
//         console.log(text);
//     }
//     console.log(text);
// }

async function displayAnimeTRAN() {
    console.log("Fetching anime tans...");
    const selectedAnime = sessionStorage.getItem('selectedAnime');
    console.log("TANS",selectedAnime);
    target = sessionStorage.getItem('lang_p');
    if (selectedAnime) {
        const anime = JSON.parse(selectedAnime);
        console.log(anime);
        const titleT = document.querySelector('.titleT');
        const TtitleEng = document.querySelector('.engT');
        const Tsynopsis = document.querySelector('.synopsisT');
        const ratingT = document.querySelector('.ratingT');
        const Tcategory = document.querySelector('.categoryT');
        const TairingStatus = document.querySelector('.airing-statusT');
        const Tstudio = document.querySelector('.studioT');
        const Tduration = document.querySelector('.durationT');
        const episodesT = document.querySelector('.episodesT');
        const Ttype = document.querySelector('.typeT');
        const TreleaseDate = document.querySelector('.release-dateT');
        const scoreT = document.querySelector('.scoreT');

        titleT.textContent = anime.Name_org;
        TT = await translate(target, anime.Name_eng.replace(/"/g, '\\"'));
        TtitleEng.textContent = TT;

        TS = await translate(target, anime.Synopsis.replace(/"/g, '\\"'));
        Tsynopsis.textContent = TS

        ratingT.textContent = anime.Rating;

        TC = await translate(target, anime.Genres.replace(/"/g, '\\"'));
        Tcategory.textContent = TC;

        TA = await translate(target, anime.Status.replace(/"/g, '\\"'));
        TairingStatus.textContent = TA;

        TST= await translate(target, anime.Studios.replace(/"/g, '\\"'));
        Tstudio.textContent = TST;

        scoreT.textContent = anime.Score;

        TD = await translate(target, anime.Duration.replace(/"/g, '\\"'));
        Tduration.textContent = TD;

        episodesT.textContent = anime.Episodes;

        TTY = await translate(target, anime.Type.replace(/"/g, '\\"'));
        Ttype.textContent = TTY;

        TRE = await translate(target, anime.Release_Date.replace(/"/g, '\\"'));
        TreleaseDate.textContent = TRE;
    }
    // target = sessionStorage.getItem('lang_p');
    // text = anime.Synopsis;
    // plswork = text.replace(/"/g, '\\"')
    // translate(target, plswork);
}