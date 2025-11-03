async function newsId(params) {
   const API = await fetch("https://hacker-news.firebaseio.com/v0/newstories.json");
   const id = await API.json();
   return id;
}

async function dettagliNews(id) {
    const  API = await fetch("https://hacker-news.firebaseio.com/v0/item/" + id + ".json");
    const dettagli = await API.json();
    return dettagli;
}

let allId = [];
let i = 0;

async function loadInitialNews() {
  allId = await newsId();
  loadMore(); 
}

async function loadMore() {
  const idToLoad = allId.slice(i, i + 10);
  for (const id of idToLoad) {
    const news = await dettagliNews(id);
  }
  i += 10;
}

