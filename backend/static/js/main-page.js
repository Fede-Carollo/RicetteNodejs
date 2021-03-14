const auth = Auth.instanceClass();
let ricette = [];
jQuery(() => {
    auth.getAuthState().then((isLogged) => {
        updateHeader(isLogged)
        resetPaginator();
        ajaxCall("/api/ricette/", "GET", null)
        .then((response) => {
            console.log(response);
            if(response.ricette.length > 0)
            {
              ricette = response.ricette
              initPaginator();
            }
            else
            {
              $(".grid-recipes").hide();
              $(".missing-recipes").show("ease");
              $("#paginatorRecipes").hide()
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

function resetPaginator(){
  paginator = {
      currentPage: 0,
      itemsPerPage: 6,
      min: 1,
      max: null
  }
}
function initPaginator()
{
    paginator.max = Math.ceil(ricette.length/paginator.itemsPerPage);
    $("#paginatorRecipes").css("visibility", "visible");
    //#region aggiornamento numeri paginator
    while($("#paginatorRecipes .pagination .page-item").length > 2)
    {
        $("#paginatorRecipes .pagination .page-item").eq(1).remove();
    }
    let next = $("#paginatorRecipes .pagination .page-item").eq(1).remove();
    for(let i=1; i <= paginator.max; i++)
    {
        $("<li class='page-item'><a class='page-link' href='#'>"+ i +"</a></li>")
            .appendTo($("#paginatorRecipes .pagination").eq(0));
    }
    $("#paginatorRecipes .pagination").append(next);
    $("#paginatorRecipes .pagination .page-item").on("click", (event) => {
        
        if(ricette.length == 0)
        {
            $(".missing.recipes").show();
            $(".grid-recipes").hide();
            $("#paginatorRecipes").hide();
        }
        else
        {
            $(".missing.recipes").hide();
            $(".grid-recipes").show();
            $("#paginatorRecipes").show();
        }
        let btn = $(event.target).eq(0);
        let val = btn.text();
        let hasChanged = false;
        if(val.indexOf("«") != -1)
        {
            if(paginator.currentPage > paginator.min)
            {
                paginator.currentPage--;
                hasChanged = true;
            }
                
        }
        else if(val.indexOf("»") != -1)
        {
            if(paginator.currentPage < paginator.max)
            {
                paginator.currentPage++;
                hasChanged = true;
            }
                
        }
        else
        {
            if(paginator.currentPage != +val)
            {
                paginator.currentPage = +val;
                hasChanged = true;
            }
        }
        
        if(hasChanged)
            showRecipesPage();
    });
    ////#endregion
    $("#paginatorRecipes .pagination .page-item").eq(1).trigger("click");
}

let paginator = {
    currentPage: 0,
    itemsPerPage: 8,
    min: 1,
    max: null
}

function showRecipesPage() {
  $(".grid-recipes").empty();
    for(let i = (paginator.currentPage-1)*paginator.itemsPerPage; i < (paginator.currentPage)*paginator.itemsPerPage && i < ricette.length ; i++ )
        {
            createRecipe(ricette[i])
        }
}