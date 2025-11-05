async function getNewsIds() {
  try {
    const response = await fetch(
      "https://hacker-news.firebaseio.com/v0/newstories.json"
    );
    if (!response.ok)
      throw new Error("Errore nel recupero degli ID delle news");
    return await response.json();
  } catch (e) {
    console.error("Errore getNewsIds:", e.message);
    alert("Ops! Problema nel caricare le notizie. Ricarica la pagina.");
    return [];
  }
}

async function getNewsDetail(id) {
  try {
    const response = await fetch(
      `https://hacker-news.firebaseio.com/v0/item/${id}.json`
    );
    if (!response.ok)
      throw new Error(`Errore nel recupero della news con ID ${id}`);
    return await response.json();
  } catch (e) {
    console.error(`Errore getNewsDetail per id ${id}:`, e.message);
    return { title: "News non disponibile", url: "", time: Date.now() / 1000 };
  }
}

let allId = [];
let i = 0;

// ----- LOAD NEWS -----

async function loadInitialNews() {
  try {
    allId = await getNewsIds();
    if (allId.length === 0) return;
    loadMoreNews();
  } catch (e) {
    console.error("Errore loadInitialNews:", e.message);
  }
}

async function loadMoreNews() {
  try {
    const idToLoad = allId.slice(i, i + 10);
    for (const id of idToLoad) {
      const news = await getNewsDetail(id);
      renderNews(news);
    }
    i += 10;
  } catch (e) {
    console.error("Errore loadMoreNews:", e.message);
  }
}

async function renderNews(news) {
  try {
    const container = document.querySelector(".container-news");
    const div = document.createElement("div");
    div.classList.add("news-item");

     div.innerHTML = `
      <h3>${news.title}</h3>
      <a href="${news.url || "index.html"}" target="_blank">${
      news.url || "Link non disponibile"
    }</a>
      <p>${
        new Date(news.time * 1000).toLocaleString() || "Data non disponibile"
      }</p>
      <hr class="divisore"/>
    `;

    container.appendChild(div);
  } catch (e) {
    console.error("Errore renderNews:", e.message);
  }
}

document.addEventListener("DOMContentLoaded", loadInitialNews);
document.querySelector(".btn").addEventListener("click", loadMoreNews);
