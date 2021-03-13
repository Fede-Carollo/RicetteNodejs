const auth = Auth.instanceClass();
jQuery(() => {
    auth.getAuthState().then((isLogged) => {
        updateHeader(isLogged)

        ajaxCall("/api/ricette/", "GET", null)
        .then((response) => {
            console.log(response);
            if(response.ricette.length > 0)
              for(let recipe of response.ricette)
                createRecipe(recipe);
            else
            {
              $(".grid-recipes").hide();
              $(".missing-recipes").show("ease");
            }
        })
        .catch((jqXHR, test_status, str_error) => {
          $(".snackbar").addClass("active").text(jqXHR.responseJSON.message);
            setTimeout(() => {
                $(".snackbar").removeClass("active").text("");
                
            }, 5000)
        })
    })
})

function createRecipe(recipe) {
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
      `<small class="text-muted"><a href="/view-profile.html?id=${recipe.creatorId}">${recipe.creatorName || ""}</a></small>` + 
    `</div>
  </div>`

  $(".grid-recipes").append(newRecipe);
}