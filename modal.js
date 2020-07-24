window.addEventListener("load", function () {
  $("#welcomeModal").modal("show");
  $("#welcomeModal").modal({keyboard: false });
  $("#alertDivLogin").hide();
  $("#alertDivAccess").hide();
  validacion();
});
document
  .getElementById("unlock-tab")
  .addEventListener("click", function (event) {
    event.preventDefault();
    $("#alertDivLogin").hide();
    $("#alertDivAccess").hide();
    Array.from(document.getElementsByTagName("input")).forEach((input) => {
      input.value = "";
    });
    validacion();
  });
document
  .getElementById("login-tab")
  .addEventListener("click", function (event) {
    event.preventDefault();
    $("#alertDivLogin").hide();
    $("#alertDivAccess").hide();
    Array.from(document.getElementsByTagName("input")).forEach((input) => {
      input.value = "";
    });
    validacion();
  });
function validacion() {
  document
    .getElementById("submitBtn")
    .addEventListener("click", function (event) {
      event.preventDefault();
      let tabModal = document.getElementsByClassName("tab-pane");
      let loginErrorMessageMail = document.getElementById(
        "loginErrorMessageMail"
      );
      let errorMessageConfirmation = document.getElementById(
        "loginErrorMessageMailConfirm"
      );
      /* let inputs = Array.from(document.getElementsByTagName("input")); */
      let terminosCondicionesMessage = document.getElementsByClassName(
        "terminosCondicionesError"
      );
      let loginMail = document.getElementById("loginMail").value;
      let loginMailConfirm = document.getElementById("loginMailConfirm").value;
      let tokenLogin = document.getElementById("tokenLogin").value;
      let checkTerminosCondiciones = document.getElementById(
        "checkTerminosCondiciones"
      ).checked;
      let loginMailAccess = document.getElementById("loginMailAccess").value;
      let tokenAccess = document.getElementById("tokenAccess").value;
      let emailValidator = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i.test(
        loginMail
      );

      /* ***** OBTEN TU REGALO TAB **** */

      if (tabModal[0].classList.contains("show")) {
        if (loginMail === "" || loginMailConfirm === "" || tokenLogin === "") {
          terminosCondicionesMessage[0].innerHTML =
            "Todos los campos son necesarios";
        } else if (loginMail === loginMailConfirm && emailValidator) {
          errorMessageConfirmation.setAttribute("style", "display: none;");
          if (checkTerminosCondiciones) {
            terminosCondicionesMessage[0].setAttribute(
              "style",
              "visibility: hidden;"
            );
            $.ajax({
              url: "/CuponeraAlsea/validation",
              data: {
                fcToken: tokenLogin,
                fcEmailAsociado: loginMail,
              },
              method: "post", //en este caso
              dataType: "json",
              success: function (response) {
                if (response.fcInError == 1) {
                  // redirecionar
                  window.location.href = "/CuponeraAlsea/" + response.wallet;
                } else {
                  //console.log(response.fcVerror)
                  Array.from(
                    document.getElementsByClassName("alertDiv")
                  ).forEach((alertDiv) => {
                    alertDiv.style.display = "block";
                  });
                  Array.from(
                    document.getElementsByClassName("divErrorMessage")
                  ).forEach((divErrorMessage) => {
                    divErrorMessage.innerHTML = response.fcVerror;
                  });
                }
              },
              error: function (error) {},
            });
          } else {
            terminosCondicionesMessage[0].setAttribute(
              "style",
              "visibility: visible;"
            );
            terminosCondicionesMessage[0].innerHTML =
              "Debes aceptar los Términos y Condiciones";
          }
        } else if (emailValidator) {
            errorMessageConfirmation.setAttribute("style", "display: block;");
            loginErrorMessageMail.setAttribute("style", "display: none;");
        } else {
        loginErrorMessageMail.setAttribute("style", "display: block;");
        }
      }

      /* **** LOGIN TAB **** */

      if (tabModal[1].classList.contains("show")) {
        if (loginMailAccess === "" || tokenAccess === "") {
          terminosCondicionesMessage[1].innerHTML =
            "Todos los campos son necesarios";
            terminosCondicionesMessage[1].setAttribute(
                "style",
                "visibility: visible;"
              );
        } else {
          terminosCondicionesMessage[1].setAttribute(
            "style",
            "visibility: hidden;"
          );
          $.ajax({
            url: "/CuponeraAlsea/validation",
            data: {
              fcToken: tokenAccess,
              fcEmailAsociado: loginMailAccess,
            },
            method: "post", //en este caso
            dataType: "json",
            success: function (response) {
              if (response.fcInError == 1) {
                // redirecionar
                location.href = window.location.href =
                  "/CuponeraAlsea/" + response.wallet;
              } else {
                //console.log(response.fcVerror)
                Array.from(document.getElementsByClassName("alertDiv")).forEach(
                  (alertDiv) => {
                    alertDiv.style.display = "block";
                  }
                );
                Array.from(
                  document.getElementsByClassName("divErrorMessage")
                ).forEach((divErrorMessage) => {
                  divErrorMessage.innerHTML = response.fcVerror;
                });
              }
            },
            error: function (error) {},
          });
        }
      }
    });
}
