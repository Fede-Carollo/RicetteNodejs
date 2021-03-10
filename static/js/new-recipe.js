const auth = Auth.instanceClass();

auth.getAuthState()
    .then((isLogged) => {
        if(!isLogged)
        {
            window.location.href = "/login.html?from=nuova-ricetta.html"
        }
    })

let files = [];
let stepAttuale = -1;

jQuery(() => {
    $("#title").trigger("focus");
    $("#ingredientiError").hide();

    ajaxCall("/api/ricette/categorie", "GET", null)
        .then((response) => {
            console.log(response);
            response.categorie.forEach(cat => {
                $("#category").append("<option class='text-capitalize' value='"+ cat +"'>"+ cat +"</option>")
            })
        })
    $("#addNewIngrediente").on("click", addNewIngrediente)
    $("#newIngrediente").on("keyup", (event) => {
        if(event.key == "Enter")
            addNewIngrediente();
    })
    generateStep();

    $("#btnAddStep").on("click", generateStep)

    $("#btnRemoveStep").on("click", removeStep)

    $("#btnSaveRecipe").on("click", saveRecipe)
})

function addNewIngrediente() {
    if($("#newIngrediente").val().length > 0) {
        const times = $("<button class='transparent align-vertical show-on-hover' type='button'></button>").on("click", (event) => {
            const toDelete = $(event.target).parent().parent().parent();
            toDelete.remove();
            if($("#ingredienti").children().length == 0)
            {
                $("#ingredienti").append(`<li class="example-li">
                                            <div class="flex-li">
                                                <span>Vedi qui la lista degli ingredienti</span>
                                            </div>
                                        </li>`)
            }
        })
        .append('<i class="fa fa-times text-danger"></i>')

        $("#ingredienti li.example-li").remove();

        const li = $("<li></li>")
            .append($("<div class='flex-li flex-around-distance'></div>")
                    .append("<span class='align-vertical li-ingredienti'>"+ $("#newIngrediente").val() + "</span>")
                    .append(times))
        $("#ingredienti").append(li);
        $("#newIngrediente").val("");
    }
}

function getIdNumber(htmlElem) {
    return htmlElem.prop("id").toString().substr(htmlElem.prop("id").toString().length -1);
}

function addFiles(filesToUpload, position) {
    const json = files.filter(json => json.position == position)[0];
    if(json)
    {
        json.files.push(...filesToUpload);
    }
    else
    {
        files.push({position: position, files: [...filesToUpload]})
    }
}

function refreshImgs(position) {
    const imgContainer = $("#stepContainerImgs" + position);
    imgContainer.empty();
    const filesToShow = files.filter(json => json.position == position)[0].files;
    for(let i=0; i<filesToShow.length; i++)
    {
        $('<div class="preview-img"></div>')
            .append('<img src="" alt="" />')
            .append($("<button class='transparent times-button' type='button' id='step"+ position +"Img"+ i +"'></button>")
                .on('click', eliminaImg)
                .append("<i class='fa fa-times text-danger'></i>"))
            .appendTo(imgContainer)
    }

    for(let i = 0; i < filesToShow.length; i++)
    {
        let urlreader = new FileReader();
        urlreader.onload = (content) => {
            let src = content.target.result.toString();
            imgContainer.children().eq(i).children(":first").prop('src', src);
        }
        urlreader.readAsDataURL(filesToShow[i]);
    }
}

function eliminaImg(event){
    let id;
    if(event.target.localName == "button"){
        id = $(event.target).prop("id");
    }
    else{
        id = $(event.target).parent().prop("id");
    }
    
    console.log(id);
    const stepNumber = id.substr(4,1);
    const imgNumber = id.substr(8,1);
    files[stepNumber].files.splice(imgNumber, 1);
    refreshImgs(stepNumber);
}

function generateStep() {
    stepAttuale++;

    if(stepAttuale > 0) {
        $("#btnRemoveStep").show("ease");
    }
    else
        $("#btnRemoveStep").hide("ease");

    let newStep = `<div id="step{number}">
    <h2>Step {stepOrder} <span class="title-step"></span><i class="fa fa-chevron-down" id="collapse{number}"></i></h2>
    <div class="content-step">
      <div class="control-group">
        <div class="form-group floating-label-form-group controls">
          <label>Titolo</label>
          <input type="text" class="form-control" placeholder="Titolo" id="stepTitle{number}" value="titolo">
          <p class="help-block text-danger" id="stepTitleError{number}"></p>
        </div>
        <div class="form-group floating-label-form-group controls">
          <label>Descrizione</label>
          <textarea class="form-control" id="stepDescr{number}" placeholder="Descrizione" wrap="soft">descrizione</textarea>
          <p class="help-block text-danger" id="stepDescrError{number}"></p>
        </div>
        <div class="form-group controls">
          <input type="file" multiple accept="image/*" id="stepImgs{number}" style="display:none">
          <button type="button" id="stepSelectImgs{number}" class="btn btn-primary mt-4">Carica immagini step (Facoltativo)</button>
          <p class="help-block text-danger" id="stepImgsError{number}"></p>
          <div class="container-photos" id="stepContainerImgs{number}"></div>
        </div>
        <hr>       
      </div>
    </div>
  </div>`;

    newStep = newStep.toString();
    newStep = newStep.replaceAll("{number}", stepAttuale).replaceAll("{stepOrder}", stepAttuale + 1)
  console.log(newStep)

  $(newStep).appendTo($("#steps-container"));

  $("#collapse" + stepAttuale).prev().hide()
    .on("click", (event) => {$(event.target).next().trigger("click")});

  $("#stepSelectImgs"+ stepAttuale).on("click", (event) => {
    const item = $(event.target);
    const numStep = getIdNumber(item);
    $("#stepImgs" + numStep).trigger("click");
})

$("#stepImgs"+ stepAttuale +"").on("change", (event) => {
    const uploadedFiles = event.target.files;
    const position = getIdNumber($(event.target));
    addFiles(uploadedFiles, position);
    refreshImgs(position);
})

$("#collapse" + stepAttuale).on("click", (event) => {
    const icon = $(event.target);
    const position = getIdNumber(icon);
    const container = icon.parent().next();
    if(icon.hasClass("fa-chevron-down"))
    {
        icon.removeClass("fa-chevron-down")
            .addClass("fa-chevron-right");
        container.hide("ease");
        if($("#stepTitle" + position).val() != "")
            $("#collapse" + position).prev().show("ease").text(" - " + $("#stepTitle" + position).val());
    }
    else
    {
        icon.addClass("fa-chevron-down")
            .removeClass("fa-chevron-right");
        container.show("ease");
        $("#collapse" + stepAttuale).prev().hide("ease")
    }
})
}

function removeStep() {
    if(stepAttuale > 0)
    {
        $("#step" + stepAttuale).remove();
        stepAttuale--;
        if(stepAttuale == 0)
        {
            $("#btnRemoveStep").hide("ease");
        }

        files.splice(stepAttuale, 1);
    }
    
}


function saveRecipe() {
    if(!checkRecipeValidity())
        return;
    console.log("Ho passato il test");
    const data = createFormData();
    for(let key of data.entries())
    {
        console.log(key[0], key[1]);
    }

    //$("#btnSaveRecipe").prop("disabled", true);   //TODO: scommentare
    ajaxMultipartCall("/api/ricette", "POST", data, $("#title").val().trim())
        .then((response) => {
            window.location.href = "/";
        })
        .catch((jqXHR, test_status, str_error) => {
            console.log(jqXHR);
            $("#btnSaveRecipe").prop("disabled", false);
            $(".snackbar").addClass("active").text(jqXHR.responseJSON.message || "Qualcosa è andato storto");
            //scrollToError($("#title"))
            setTimeout(() => {
                $(".snackbar").removeClass("active");
            }, 5000)
        })
}

function checkRecipeValidity() {
    let isValid = true;
    if($("#title").val() == "") //titolo ricetta mancante
    {
        scrollToError($("#title"));
        isValid = false;
        return isValid; 
    }

    else if($("#subtitle").val() == "")
    {
        scrollToError($("#subtitle"));
        isValid = false;
        return isValid;
    }

    else if(!$("#timeNeeded").val() || $("#timeNeeded").val() <= 0){
        scrollToError($("#timeNeeded"));
        $("#timeNeeded").val(0)
        isValid = false;
        return isValid;
    }
    else
    {
        if($(".li-ingredienti").length == 0)    //no ingredienti inseriti
        {
           $("#ingredientiError").text("Inserisci almeno un ingrediente").show("ease");
           scrollToError($("#newIngrediente"));
           isValid = false;
           return isValid;
        }
        else {
            $("#ingredientiError").text("").hide("ease");
        }
    }

    for(let i = 0; i <= stepAttuale; i++) {
        if($("#stepTitle" + i).val() == "")
        {
            scrollToError($("#stepTitle" + i));
            $("#stepTitleError" + i).text("Titolo richiesto").show("ease");
            isValid = false;
            break;
        }
        else {
            $("#stepTitleError" + i).text("").hide("ease");
        }

        if($("#stepDescr" + i).val() == "")
        {
            scrollToError($("#stepDescr" + i));
            $("#stepDescrError" + i).text("Descrizione richiesta").show("ease");
            isValid = false;
            break;
        }
        else {
            $("#stepDescrError" + i).text("").hide("ease");
        }
    }
    return isValid;
}

function scrollToError(elem, offset = 200) { 
    $([document.documentElement, document.body]).animate({
        scrollTop: elem.offset().top - offset
    }, 600, () => {
        elem.trigger("focus");
    });
}

function createFormData() {
    let formData = new FormData();
    formData.append("title", $("#title").val().replaceAll("/", ' ').replaceAll('\\', ' '));
    formData.append("description", $("#subtitle").val());
    formData.append("category", $("#category").val());
    formData.append("difficulty", $("#difficulty").val());
    formData.append("timeNeeded", $("#timeNeeded").val());
    formData.append("stepNumber", stepAttuale + 1);
    $.each($("#ingredienti li div span.li-ingredienti"), (i, ingrediente) => {
        formData.append("ingredienti", ingrediente.textContent);
    })
    for(let i = 0; i <= stepAttuale; i++) {
        formData.append("step" + i, $("#stepTitle" + i).val())
        formData.append("step" + i , $("#stepDescr" + i).val());
    }

    for(let json of files) {
        const position = json.position;
        for(let j in json.files)
        {
            console.log(json.files[j])
            const ext = json.files[j].name.substr(json.files[j].name.lastIndexOf("."));
            formData.append("imgs", json.files[j],"step-"+ position + "-img-" + j + ext);
        }
    }
    return formData;
}
