const inputWord = document.getElementById("inputword");
const searchBtn = document.getElementById("search");
const result = document.getElementById("result");
const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";

searchBtn.addEventListener("click", getWord);
// inputWord.addEventListener("keypress", sendword);
result.innerHTML = "";

async function getWord() {
  const word = inputWord.value.trim();
  let ui = "";
  if (!word) {
    return (result.innerHTML = `<h1>you must enter a word</h1>`);
  }

  try {
    if (!navigator.onLine) {
      result.innerHTML = `<p>you are offline</p>`;
      console.log("user is offline");
      return;
    }

    const response = await fetch(`${url}${word}`);

    if (response.status === 404) {
      return (result.innerHTML = `<p>word not found</p>`);
    } else if (response.status === 429) {
      return (result.innerHTML = `<p>too many request wait for 5 minute</p>`);
    } else if (response.status === 500) {
      return (result.innerHTML = `<p>server error</p>`);
    }

    const data = await response.json();
    console.log(data);

    const title = data[0].word;
    // const phonetic = data[0].phonetic;
    const phonetics = data[0].phonetics[1]?.text || " no phonetic";
    const audioUrl = data[0].phonetics[0]?.audio;
    const meanings = data[0].meanings;
    const origin = data[0].origin;

    ui += `<h1 class="text-bold text-2xl" >word: ${title}</h1>`;
    ui += `<p class=" font-normal" onClick=playAudio(${audioUrl})><svg width="15px" height="15px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M19 6C20.5 7.5 21 10 21 12C21 14 20.5 16.5 19 18M16 8.99998C16.5 9.49998 17 10.5 17 12C17 13.5 16.5 14.5 16 15M3 10.5V13.5C3 14.6046 3.5 15.5 5.5 16C7.5 16.5 9 21 12 21C14 21 14 3 12 3C9 3 7.5 7.5 5.5 8C3.5 8.5 3 9.39543 3 10.5Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg></p>`;
    ui += `<p class=" font-normal">phonetic: ${phonetics}</p>`;

    meanings.forEach((meaning) => {
      const partOfSpeech = meaning.partOfSpeech;
      const definitions = meaning.definitions;

      ui += `<h2 class="font-bold text-xl">${partOfSpeech}</h2>`;
      definitions.forEach((def) => {
        const definition = def.definition;
        const example = def?.example || "";
        ui += `<h2 class="font-normal text-base">${definition}</h2>`;
        ui += `<h2 class="font-semibold text-xs">${example}</h2>`;
      });
    });

    result.innerHTML = ui;
  } catch (error) {
    console.log("there is an whille fetching:", error);
  }
}

function playAudio(myAudioUrl) {
    const audio = new Audio(myAudioUrl)
    audio.play()
    
}
