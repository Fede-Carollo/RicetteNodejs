const auth = Auth.instanceClass();
jQuery(() => {
    auth.getAuthState().then((isLogged) => {
        if(isLogged)
        {
            $("#liLogin").hide();
        }
        else
        {
            $("#liProfile").hide();
        }

        ajaxCall("/api/ricette/", "GET", null)
        .then((response) => {
            console.log(response);
            for(let recipe of response.ricette)
                createRecipe(recipe);
        })
    })
})

function createRecipe(recipe) {
    let newRecipe = `<div class="container-recipe">
    <div class="card my-card" onclick="window.location.href='/view-recipe.html?id=${recipe._id}'">
    <img class="card-img-top" src="${recipe.mainImg || "/img/about-bg.jpg"}" alt="">` +    //TODO: default img in base alla categoria
    `<div class="card-body">
        <h5 class="card-title text-center">${recipe.title}</h5>
        <div class="recipe-info">
        <div>
        <span>Difficoltà: </span> <span>${recipe.difficulty}</span>
        </div>
        <div>
          <span>Tempo necessario: </span> <span><i class="fa fa-clock"></i> ${recipe.timeNeeded}'</span>
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
      `<small class="text-muted"><a href="/view-recipe.html?id=${recipe._id}">${recipe.creatorName || ""}</a></small>` +
    `</div>
  </div>`

  $(".grid-recipes").append(newRecipe);
}