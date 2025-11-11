async function getNewsIds() {
  const response = await fetch("https://hacker-news.firebaseio.com/v0/newstories.json");
  if (!response.ok) throw new Error("Failed to fetch news IDs");
  return response.json();
}

async function getNewsDetails(id) {
  const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
  if (!response.ok) throw new Error(`Failed to fetch news with ID ${id}`);
  return response.json();
}

let allIds = [];
let index = 0;

const loader = document.getElementById("loader");
const container = document.querySelector(".container-news");
const loadMoreButton = document.querySelector(".btn");

async function loadInitialNews() {
  try {
    showLoader(true);
    allIds = await getNewsIds();
    if (allIds.length > 0) {
      await loadMoreNews();
    }
  } catch (error) {
    console.error("Error:", error.message);
    loader.textContent = "Error loading news.";
  }
}

async function loadMoreNews() {
  try {
    showLoader(true);
    container.style.display = "none"; 

    const idsToLoad = allIds.slice(index, index + 10);
    const newsElements = [];

    for (const id of idsToLoad) {
      const news = await getNewsDetails(id);
      if (!news) continue;

      const div = document.createElement("div");

      const title = document.createElement("h3");
      title.textContent = news.title;

      const link = document.createElement("a");
      link.href = news.url || "#";
      link.target = "_blank";
      link.textContent = news.url || "Link not available";

      const date = document.createElement("p");
      date.textContent = new Date(news.time * 1000).toLocaleString() || "No date available";

      const hr = document.createElement("hr");
      hr.classList.add("divisor");

      div.appendChild(title);
      div.appendChild(link);
      div.appendChild(date);
      div.appendChild(hr);

      newsElements.push(div);
    }

    newsElements.forEach(el => container.appendChild(el));

    container.style.display = "block";
  } catch (error) {
    console.error("Error loading batch:", error.message);
  } finally {
    showLoader(false);
  }
}

function showLoader(show) {
  loader.style.display = show ? "block" : "none";
}

document.addEventListener("DOMContentLoaded", loadInitialNews);
loadMoreButton.addEventListener("click", loadMoreNews);
