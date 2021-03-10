"use strict";
const auth = Auth.instanceClass();
let id;

jQuery(() => {
    const params = new URLSearchParams(window.location.search);
    id = params.get('id');
    if(!id)
        window.location.href = "/404pagenotfound.html";
    ajaxCall("/api/ricette/" + id, "GET", null)
        .then(response => {
            console.log(response);
            renderRecipe(response.recipe);
        })
        .catch((jqXHR, test_status, str_error) => {
            window.location.href = "/404pageNotFound.html";
        })
})

function renderRecipe(recipe) {
    $("#recipe-title").text(recipe.title);
    $("#recipe-description").text(recipe.description)
    $("#recipe-creator").text(recipe.creatorName).prop("href", `/user.html?id=${recipe.creatorId}`)
    $("#recipe-date").text(getDate(recipe.createdAt))
    $("#recipe-difficulty").text(recipe.difficulty);
    $("#recipe-category").text(recipe.category);
    $("#recipe-timeNeeded").text(` ${recipe.timeNeeded}'`);
    renderIngredients(recipe.ingredienti);
    renderContent(recipe.steps);
}

function getDate(stringDate)  {
    const date = new Date(stringDate);
    return date.toLocaleDateString('it-IT', {year: 'numeric', month: 'long', day: 'numeric' });
}

function renderIngredients(ingredienti) {
    ingredienti.forEach(ingrediente => {
        $(".ingredients-list .ingredients-ul").append($("<li></li>").text(ingrediente));
    })
}

function renderContent(steps) {
    console.log("Steps", steps);
    let stepCount = 1;
    steps.forEach(step => {
        const container = $("<div class='mt-5'></div>");
        const title = $("<h2 class='thin-bold'></h2>").text("Step " + stepCount++  + " - " + step.title);
        const description = $("<p></p>").text(step.description.replaceAll("\n","<br/>"));
        let imgs = [];
        step.imgs.forEach(imgPath => {
            imgs.push($(`<a href="#"><img class="img-fluid" src="/${imgPath.replaceAll(/\\/g, "/")}" alt=""></a>`))
        })

        container.append(title).append(description);
        imgs.forEach(img => {
            container.append(img)
        })
        container.append("<hr></hr>");
        container.appendTo($("#recipe-content .steps-list .recipe-steps"))
    })
}