import "./index.scss";

const articleContainer = document.querySelector(".articles-container");

const displayArticles = (articles) => {
  const articlesDOM = articles.map((article) => {
    const articleNode = document.createElement("div");
    articleNode.classList.add("article");
    articleNode.innerHTML = `
        <img
        src=${
          article.image ? article.image : "assets/image/default_profile.png"
        }
        alt=""
        />
        <h2>${article.title}</h2>
        <p class="article-author">${article.author}</p>
        <p class="article-content">${article.content}</p>
        <div class="article-actions">
        <button class="btn btn-danger" data-id=${article._id}>Supprimer</button>
        </div>`;

    return articleNode;
  });

  articleContainer.innerHTML = "";
  articleContainer.append(...articlesDOM);

  const deleteBtn = articleContainer.querySelectorAll(".btn-danger");

  deleteBtn.forEach((button) => {
    button.addEventListener("click", async (event) => {
      event.preventDefault();
      try {
        const target = event.target;
        const articleId = target.dataset.id;

        const response = await fetch(
          `https://restapi.fr/api/dwwm_benjamin/${articleId}`,
          { method: "DELETE" }
        );
        const body = await response.json();
        fetchArticles();
        console.log(body);
      } catch (error) {
        console.log(error);
      }
    });
  });
};

const fetchArticles = async () => {
  try {
    const response = await fetch("https://restapi.fr/api/dwwm_benjamin");
    const articles = await response.json();

    if (articles) {
      if (!articles.length !== 0) {
        displayArticles([articles]);
      } else {
        displayArticles(articles);
      }
    } else {
      articleContainer.innerHTML = "<p>Pas d'articles...<p>";
    }
  } catch (error) {
    console.log(error);
  }
};

fetchArticles();
