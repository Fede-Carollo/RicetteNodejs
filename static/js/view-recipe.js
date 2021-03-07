"use strict";
const auth = Auth.instanceClass();
let id;

jQuery(() => {
    const params = new URLSearchParams(window.location.search);
    id = params.get('id');
    if(!id)
        window.location.href = "/404pagenotfound.html";
})