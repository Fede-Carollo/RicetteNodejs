"use strict";
const auth = Auth.instanceClass();
let id;

jQuery(() => {
    const params = new URLSearchParams(window.location.search);
    id = params.get('id');
    if(!id)
        window.location.href = "/404pagenotfound.html";
        
    ajaxCall(`/api/auth/user/${id}`, "GET", null)
        .then(response => {
            console.log(response);
            renderUser(response.user);
            ajaxCall(`/api/ricette/user/${response.user._id}`, "GET", null)
                .then(response => {
                    console.log(response);
                    response.recipes.forEach(recipe => {
                        renderRecipe(recipe);
                    })
                })
                .catch(err => {

                })
        })
        .catch((jqXHR, test_status, str_error) => {
            window.location.href = "/404pageNotFound.html";
        })
})

function renderUser(user) {
    $("#nome").text(`${user.cognome} ${user.nome}`);
    $("#profilePhoto").prop('src', user.profilePhoto)
    $("#citazione").text(user.citazione)
}

function renderRecipe(recipe) {
    let newRecipe = `<div class="container-recipe">
    <div class="card my-card" onclick="window.location.href='/view-recipe.html?id=${recipe._id}'">
    <img class="card-img-top" src="${recipe.headerPhoto || "/img/about-bg.jpg"}" alt="">` +    //TODO: default img in base alla categoria
    `<div class="card-body">
        <h5 class="card-title text-center">${recipe.title}</h5>
        <div class="recipe-info">
        <div>
            <div>${recipe.difficulty}</div>
        </div>
        <div>
            <div>${recipe.category}</div>
        </div>
        <div>
          <div>Tempo: <i class="fa fa-clock"></i> ${recipe.timeNeeded}'</div>
        </div>
      </div>` + 
        `<div class="card-text">
        <p>${recipe.description}</p>
        <div class="blur"></div>
        <div class="continue-reading">
          <a href="/view-recipe.html?id=${recipe._id}">Continua a leggere</a>
          <i class="fa fa-arrow-right"></i>
        </div>
      </div>` +
    `</div>
      <div class="card-footer">` +
      `<small class="text-muted">${(new Date(recipe.createdAt)).toLocaleDateString()}</small>` +
      `<small class="text-muted"><a href="/view-profile.html?id=${recipe.creatorId}">${recipe.creatorName || ""}</a></small>` +  //TODO: indirizzo sbagliato
    `</div>
  </div>`

  $(".grid-recipes").append(newRecipe);
}