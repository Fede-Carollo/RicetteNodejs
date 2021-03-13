"use strict";
const auth = Auth.instanceClass();
let id;
let filePath = "";

function getFilePath (){
  return filePath;
}

jQuery(() => {
    const params = new URLSearchParams(window.location.search);
    id = params.get('id');
    if(!id)
        window.location.href = "/404pagenotfound.html";
    auth.getAuthState()
      .then((isLogged) => {
        updateHeader(isLogged); 
        {
          if(auth.user.id != id)
          {
            $("#heading-h1").text("Visualizza profilo");
            $("#editProfile").hide();
          }
          else
          {
            $("#editProfile").show();
          }
        }
        if(!isLogged)
        {
          $("#heading-h1").text("Visualizza profilo");
          $("#editProfile").hide();
        }
      })
    ajaxCall(`/api/auth/user/${id}`, "GET", null)
        .then(response => {
            console.log(response);
            renderUser(response.user);
            initModal(response.user);
            ajaxCall(`/api/ricette/user/${response.user._id}`, "GET", null)
                .then(response => {
                    console.log(response);
                    if(response.recipes.length > 0)
                    {
                      response.recipes.forEach(recipe => {
                        renderRecipe(recipe);
                      })
                    }
                    else
                    {
                      $(".grid-recipes").hide();
                      $(".missing-recipes").show("ease");
                      if(!auth.user.isLogged)
                      {
                        $("#pubblicaRicetta").hide();
                      }
                    }
                })
                .catch(err => {

                })
        })
        .catch((jqXHR, test_status, str_error) => {
            window.location.href = "/404pageNotFound.html";
        })
})


function initModal(user) {
  filePath = `${user.profilePhoto || "/img/about-bg.jpg"}`
  const initialValues = {
    nome: user.nome,
    cognome: user.cognome,
    file: false //false non modificato, true si
  }
  $("#editProfile").on("click", () => {
    $("#modalEdit").modal("show");
  })

  $("#editNome").val(user.nome);
  $("#editCognome").val(user.cognome);
  $("#edit-filepicker").on("change", () => {
    if($("#edit-filepicker").prop("files")[0])
    {
      initialValues.file = $("#edit-filepicker").prop("files")[0]
      const fr = new FileReader();
      fr.readAsDataURL(initialValues.file);
      fr.onload = (content) => {
        $("#editProfilePhoto").prop("src", content.target.result)
      }
    }
     
  })
  $("#btnSave").on("click", () => {
    const formData = new FormData();
    switch(checkEdit(initialValues))
    {
      case 0: //solo testo
        ajaxCall("/api/auth/updateName", "POST", {nome: $("#editNome").val(), cognome: $("#editCognome").val()})
          .then((response) => {
            window.location.reload();
          })
          .catch((jqXHR, test_status, str_error) => {
            if(jqXHR.status == 401)
            {
              window.location.href = "login.html?from=view-profile.html?id=" + id;
            }
            console.log(jqXHR, test_status, str_error);
            showSnackBar();
          })
        break;
      case 1: //testo e files
        formData.append("nome", $("#editNome").val());
        formData.append("cognome", $("#editCognome").val())
        formData.append("profilephoto", initialValues.file, "profile-photo" + ext);
        savePhoto("/api/auth/updateNameFile", "POST", formData)
          .then((response) => {
            window.location.reload();
          })
          .catch((jqXHR, test_status, str_error) => {
            if(jqXHR.status == 401)
            {
              window.location.href = "login.html?from=view-profile.html?id=" + id;
            }
            showSnackBar()
          })
        break;
      case 2: //solo immagine
        const ext = initialValues.file.name.substr(initialValues.file.name.lastIndexOf("."));
        formData.append("profilephoto", initialValues.file, "profile-photo" + ext);
        formData.append("nome", $("#editNome").val());
        formData.append("cognome", $("#editCognome").val())
        savePhoto("/api/auth/updateNameFile", "POST", formData)
          .then((response) => {
            window.location.reload();
          })
          .catch((jqXHR, test_status, str_error) => {
            if(jqXHR.status == 401)
            {
              window.location.href = "login.html?from=view-profile.html?id=" + id;
            }
            showSnackBar();
          })
        break;
      case 3:
    }
  })

  $("#modalEdit").on("show.bs.modal", (event) => {  //Callback del modal
    $("#editNome, #editCognome").trigger("input");
    $("#editProfilePhoto").prop("src", filePath)
  })
}

function showSnackBar(errMsg = "Si è verificato un errore") {
  $(".snackbar").addClass("active").text(errMsg);
            setTimeout(() => {
                $(".snackbar").removeClass("active").text("");
                
            }, 5000)
}

function checkEdit(initialValues) {
  if($("#editNome").val() != initialValues.nome || $("#editCognome").val() != initialValues.cognome)
  {
    if(initialValues.file == false) //solo update campi
    {
      return 0;
    }
    else  //update campi e file
    {
      return 1;
    }
  }
  else if(initialValues.file != false)
  {
    return 2;
  }
  return 3;
}


//#region visualizza
function renderUser(user) {
    $("#nome").text(`${user.cognome} ${user.nome}`);
    $("#profilePhoto").prop('src', user.profilePhoto)
    $("#citazione").text(`"${user.citazione}"`)
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
//#endregion