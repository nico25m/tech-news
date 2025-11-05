async function newsId() {
  try {
    const urlApi = await fetch(
      "https://hacker-news.firebaseio.com/v0/newstories.json"
    );
    if (!urlApi.ok) throw new Error("Errore nel recupero degli ID delle news");
    return await urlApi.json();
  } catch (e) {
    console.log("Errore:", e.message);
  }
}

async function dettagliNews(id) {
  try {
    const urlApi = await fetch(
      `https://hacker-news.firebaseio.com/v0/item/${id}.json`
    );
    if (!urlApi.ok) throw new Error(`Errore nel recupero della news con ID ${id}`);
    return await urlApi.json();
  } catch (e) {
    console.log(`Errore:`, e.message);
  }
}

let allId = [];
let i = 0;

async function caricamentoNews() {
  try {
    allId = await newsId();
    if (allId.length === 0) return;
    loadMore();
  } catch (e) {
    console.log("Errore loadInitialNews:", e.message);
  }
}

async function loadMore() {
  try {
    const idToLoad = allId.slice(i, i + 10);
    for (const id of idToLoad) {
      const news = await dettagliNews(id);
      News(news);
    }
    i += 10;
  } catch (e) {
    console.error("Errore:", e.message);
  }
}

async function News(news) {
  try {
    const container = document.querySelector(".container-news");
    const div = document.createElement("div");

     div.innerHTML =
      `<h3>
        ${news.title}
      </h3>
      <a href="${news.url || "index.html"}" target="_blank">
        ${news.url || "Link non disponibile"}
      </a>
      <p>
        ${new Date(news.time * 1000).toLocaleString() || "Data non disponibile"}
      </p>
      <hr class="divisore"/>`;

    container.appendChild(div);
  } catch (e) {
    console.log("Errore:", e.message);
  }
}

document.addEventListener("DOMContentLoaded", caricamentoNews);
document.querySelector(".btn").addEventListener("click", loadMore);
