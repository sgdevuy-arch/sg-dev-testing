document.addEventListener("DOMContentLoaded", () => {

  // ==============================
  // ELEMENTOS
  // ==============================

  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");

  const dropdown = document.querySelector(".nav-dropdown");
  const dropdownBtn = document.querySelector(".nav-dropdown-btn");


  // ==============================
  // MENÚ HAMBURGUESA
  // ==============================

  if (menuToggle && navMenu) {

    menuToggle.addEventListener("click", () => {

      const abierto = navMenu.classList.toggle("active");

      menuToggle.setAttribute(
        "aria-expanded",
        abierto
      );

    });

  }


  // ==============================
  // SOLUCIONES
  // ==============================

  if (dropdown && dropdownBtn) {

    dropdownBtn.addEventListener("click", (event) => {

      event.stopPropagation();

      const abierto =
        dropdown.classList.toggle("open");

      dropdownBtn.setAttribute(
        "aria-expanded",
        abierto
      );

    });

  }


  // ==============================
  // CERRAR AL HACER CLICK FUERA
  // ==============================

  document.addEventListener("click", (event) => {

    if (
      dropdown &&
      !dropdown.contains(event.target)
    ) {

      dropdown.classList.remove("open");

      if (dropdownBtn) {
        dropdownBtn.setAttribute(
          "aria-expanded",
          "false"
        );
      }

    }

  });


  // ==============================
  // CERRAR AL HACER CLICK EN UN LINK
  // ==============================

  document.querySelectorAll(".nav-menu a").forEach((link) => {

    link.addEventListener("click", () => {

      if (navMenu) {
        navMenu.classList.remove("active");
      }

      if (menuToggle) {
        menuToggle.setAttribute(
          "aria-expanded",
          "false"
        );
      }

      if (dropdown) {
        dropdown.classList.remove("open");
      }

      if (dropdownBtn) {
        dropdownBtn.setAttribute(
          "aria-expanded",
          "false"
        );
      }

    });

  });

});