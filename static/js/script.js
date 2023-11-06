// datatables
new DataTable("#my_table");


// color mode toggle------------------------------------------------------------

/*!
  * Color mode toggler for Bootstrap's docs (https://getbootstrap.com/)
  * Copyright 2011-2023 The Bootstrap Authors
  * Licensed under the Creative Commons Attribution 3.0 Unported License.
*/

(() => {
  "use strict";

  const getStoredTheme = () => localStorage.getItem("theme");
  const setStoredTheme = (theme) => localStorage.setItem("theme", theme);

  const getPreferredTheme = () => {
    const storedTheme = getStoredTheme();
    if (storedTheme) {
      return storedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  const setTheme = (theme) => {
    if (
      theme === "auto" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      document.documentElement.setAttribute("data-bs-theme", "dark");
    } else {
      document.documentElement.setAttribute("data-bs-theme", theme);
    }
  };

  setTheme(getPreferredTheme());

  const showActiveTheme = (theme, focus = false) => {
    const themeSwitcher = document.querySelector("#bd-theme");

    if (!themeSwitcher) {
      return;
    }

    const themeSwitcherText = document.querySelector("#bd-theme-text");
    const activeThemeIcon = document.querySelector(
      ".theme-icon-active use"
    );
    const btnToActive = document.querySelector(
      `[data-bs-theme-value="${theme}"]`
    );
    const svgOfActiveBtn = btnToActive
      .querySelector("svg use")
      .getAttribute("href");

    document
      .querySelectorAll("[data-bs-theme-value]")
      .forEach((element) => {
        element.classList.remove("active");
        element.setAttribute("aria-pressed", "false");
      });

    btnToActive.classList.add("active");
    btnToActive.setAttribute("aria-pressed", "true");
    activeThemeIcon.setAttribute("href", svgOfActiveBtn);
    const themeSwitcherLabel = `${themeSwitcherText.textContent} (${btnToActive.dataset.bsThemeValue})`;
    themeSwitcher.setAttribute("aria-label", themeSwitcherLabel);

    if (focus) {
      themeSwitcher.focus();
    }
  };

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => {
      const storedTheme = getStoredTheme();
      if (storedTheme !== "light" && storedTheme !== "dark") {
        setTheme(getPreferredTheme());
      }
    });

  window.addEventListener("DOMContentLoaded", () => {
    showActiveTheme(getPreferredTheme());

    document.querySelectorAll("[data-bs-theme-value]").forEach((toggle) => {
      toggle.addEventListener("click", () => {
        const theme = toggle.getAttribute("data-bs-theme-value");
        setStoredTheme(theme);
        setTheme(theme);
        showActiveTheme(theme, true);
      });
    });
  });
})();

// ------------------- NEW DASHBOARD GRAPH-----------------------------------------------
/* globals Chart:false */
(() => {
  'use strict'

  // Graphs
  const ctx = document.getElementById('myChart')
  // eslint-disable-next-line no-unused-vars
  const myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
      ],
      datasets: [{
        data: [
          15339,
          21345,
          18483,
          24003,
          23489,
          24092,
          12034
        ],
        lineTension: 0,
        backgroundColor: 'transparent',
        borderColor: '#007bff',
        borderWidth: 4,
        pointBackgroundColor: '#007bff'
      }]
    },
    options: {
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          boxPadding: 3
        }
      }
    }
  })
})()


// ------------------------- set time out for the flashes container-------------------------------------------------
// Use JavaScript to hide the container after 6 seconds
setTimeout(function() {
  var container = document.getElementById("flashes-container");
  container.style.display = "none";
}, 1500); // 1500 milliseconds = 1.5 seconds


// ----RETUTN NONE FOR AN INPUT IF EMPTY IN THE EDIP PRODUCT FORM

  document.addEventListener("DOMContentLoaded", function () {
    // Get a reference to the form
    const form = document.getElementById("edit-product");

    // Add an event listener for form submission
    form.addEventListener("submit", function (event) {
      // Get the input fields
      const nameInput = document.getElementById("product_name");
      const buyingPriceInput = document.getElementById("buying_price");
      const sellingPriceInput = document.getElementById("selling_price");

      // Check if each input is empty and set it to null if it is
      if (nameInput.value === "") {
        nameInput.value = null;
      }
      if (buyingPriceInput.value === "") {
        buyingPriceInput.value = null;
      }
      if (sellingPriceInput.value === "") {
        sellingPriceInput.value = null;
      }
    });
  });

