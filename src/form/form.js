import "./form.scss";
import { openModal } from "../assets/javascript/modal";

const form = document.querySelector("form");
const errorList = document.querySelector("#errors");
const cancelBtn = document.querySelector(".btn-secondary");
let articleId;

const initForm = async () => {
  const param = new URL(location.href);
  articleId = param.searchParams.get("id");
  const submitBtn = document.querySelector(".btn-primary");

  if (articleId) {
    const response = await fetch(
      `https://restapi.fr/api/dwwm_benjamin/${articleId}`
    );
    if (response.status < 299) {
      const article = await response.json();
      submitBtn.innerText = "Sauvegarder";
      fillForm(article);
    }
  }
};

const fillForm = (article) => {
  const author = document.querySelector('input[name="author"]');
  const image = document.querySelector('input[name="image"]');
  const category = document.querySelector('select[name="category"]');
  const title = document.querySelector('input[name="title"]');
  const content = document.querySelector("textarea");

  author.value = article.author;
  image.value = article.image;
  category.value = article.category;
  title.value = article.title;
  content.value = article.content;
};

initForm();

cancelBtn.addEventListener("click", async () => {
  const answer = await openModal(
    "attention, en annulant vous perdrez votre article, confirmez vous votre annulation"
  );
  if (answer) {
    location.assign("./index.html");
  }
});

const formIsValide = (data) => {
  let errors = [];
  if (!data.author || !data.category || !data.content || !data.title) {
    errors.push("vous devez renseigner tout les champs");
  }

  if (errors.length) {
    // si quelquechose => true
    let errorHtml = "";
    errors.forEach((error) => {
      errorHtml += `<li>${error}</li>`;
    });
    errorList.innerHTML = errorHtml;
    return false;
  } else {
    errorList.innerHTML = "";
    return true;
  }
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const entries = formData.entries();

  const data = Object.fromEntries(entries);

  if (formIsValide(data)) {
    try {
      const json = JSON.stringify(data);
      let response;

      if (articleId) {
        response = await fetch(
          `https://restapi.fr/api/dwwm_benjamin/${articleId}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: json,
          }
        );
      } else {
        response = await fetch("https://restapi.fr/api/dwwm_benjamin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: json,
        });
      }

      if (response.status < 299) {
        location.assign("./index.html");
      }
      console.log(body);
    } catch (error) {
      console.log(error);
    }
  }
});
