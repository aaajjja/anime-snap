// define the api endpoint and options for fetching data
const url = 'https://what-anime-is-this.p.rapidapi.com/search';
const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': 'cc9f5ab346msh8f9f0d1136e27c1p1ba21cjsn231af9d22b86',
        'X-RapidAPI-Host': 'what-anime-is-this.p.rapidapi.com'
    }
};
// add a click event listener to the 'searchbutton' element
document.getElementById('searchButton').addEventListener('click', async () => {
    // get the value of the 'imageurlinput' element and trim any whitespace
    const imageUrl = document.getElementById('imageUrlInput').value.trim();
    // check if the image url is empty, and if so, alert the user and return
    if (!imageUrl) {
        alert('Please enter an image URL.');
        return;
    }

    try {
        // Fetch from 'what-anime-is-this' API
        const response = await fetch(url + '?url=' + encodeURIComponent(imageUrl), options);
        // parse the response as JSON
        const result = await response.json();
        
        console.log(result);  // Debugging: log the result

        // check the result contains anime information
        if (result && result.result && result.result.length > 0) {
            const animeInfo = result.result[0];  // Access the first result
            displayResult(animeInfo); // display the result or anime information

            // Fetch additional info from trace.moe api
            const traceMoeResponse = await fetch(`https://api.trace.moe/search?anilistInfo&url=${encodeURIComponent(imageUrl)}`);
            const traceMoeResult = await traceMoeResponse.json();
            console.log(traceMoeResult);  // Debugging: log the result
            if (traceMoeResult.result && traceMoeResult.result.length > 0) {
                const traceMoeAnimeInfo = traceMoeResult.result[0].anilist; // access the first result
                displayAnilistInfo(traceMoeAnimeInfo); // display the additional anime information
            } else {
                console.error('No additional info found on trace.moe');
            }
        } else {
            document.getElementById('result').textContent = 'Anime not found.'; // dispaly a message if the anime is not found
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById('result').textContent = 'Error fetching data.'; // handle and display any errors that occur during the fetch process
    }
});

// function to display the anime information
function displayAnilistInfo(anilistInfo) {
    const resultDiv = document.getElementById('result');

    if (anilistInfo) {
        const titleElement = document.createElement('p');
        // display the title, english title, and native title
        titleElement.textContent = `Title: ${anilistInfo.title.romaji} (${anilistInfo.title.english}, ${anilistInfo.title.native})`;
        resultDiv.appendChild(titleElement);

    } else {
        resultDiv.textContent += '\nAdditional Anilist information not found.'; // display a message if no anime information is found
    }
}

// function to display the additional anime information
function displayResult(animeInfo) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = ''; // clear the any previous result

    // extract anime details from the response 'json'
    const animeTitle = animeInfo.anilist;
    const animeEpisode = animeInfo.episode || 'Unknown';
    const animeImage = animeInfo.image || '';
    const animeVideo = animeInfo.video || '';
    const animeFile = animeInfo.filename || 'Unknown';

    // create and append a paragraph element with the anime id
    const titleElement = document.createElement('p');
    titleElement.textContent = `Anime ID: ${animeTitle}`;
    resultDiv.appendChild(titleElement);

    // create and append a paragraph element with the anime episode
    const episodeElement = document.createElement('p');
    episodeElement.textContent = `Episode: ${animeEpisode}`;
    resultDiv.appendChild(episodeElement);

    // Create and append an image element with the anime image
    const imageElement = document.createElement('img');
    imageElement.src = animeImage;
    imageElement.style.height = '350px';
    resultDiv.appendChild(imageElement);

    // Create and append a video element with the anime video
    const videoElement = document.createElement('video');
    videoElement.src = animeVideo;
    videoElement.style.width = '640px';
    videoElement.style.height = '350px';
    videoElement.autoplay = true;
    videoElement.loop = true;
    videoElement.muted = true;
    resultDiv.appendChild(videoElement);
    
    // Create and append a paragraph element with the anime file
    const fileElement = document.createElement('p');
    fileElement.textContent = `File: ${animeFile}`;
    resultDiv.appendChild(fileElement);
}