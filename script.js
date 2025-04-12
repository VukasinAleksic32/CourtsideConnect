// NavBar Active item
const navLinkEls = document.querySelectorAll(".nav-link");
const windowPathname = window.location.pathname;

navLinkEls.forEach((navLinkEl) => {
  const navLinkPathname = new URL(navLinkEl.href).pathname;

  if (
    windowPathname === navLinkPathname ||
    (windowPathname === "/index.html" && navLinkPathname === "/")
  ) {
    navLinkEl.classList.add("nav-link-active");
  }
});

fetch(
  "https://app.ticketmaster.com/discovery/v2/events.json?apikey=sOGEikSvovIdezvDiOAeTIGurDrVhHOu&size=16&sort=relevance,desc&subGenreId=KZazBEonSMnZfZ7vFJA"
)
  .then((data) => {
    return data.json();
  })
  .then((completedata) => {
    let data1 = "";

    // Check if the API response has the expected structure
    if (
      !completedata ||
      !completedata._embedded ||
      !completedata._embedded.events
    ) {
      document.getElementById("cards").innerHTML = "<p>No events found</p>";
      return;
    }

    // Get the events array
    const events = completedata._embedded.events;

    events.map((values) => {
      // Get name of the game
      let teamName1 = "";
      let teamName2 = "";
      if (values._embedded.attractions[0] && values._embedded.attractions[1]) {
        teamName1 = values._embedded.attractions[0].name;
        teamName2 = values._embedded.attractions[1].name;
      } else {
        return;
      }

      // Get the primary image URL (preferring 16:9 ratio if available)
      let imageUrl = "";
      let preferredImage = "";
      if (
        values._embedded.venues[0].images &&
        values._embedded.venues[0].images.length > 0
      ) {
        // Try to find a 16:9 image firs
        preferredImage = values._embedded.venues[0].images.find(
          (img) => img.ratio === "16_9"
        );
        if (preferredImage) {
          imageUrl = preferredImage.url;
        }
      } else {
        if (values.images && values.images.length > 0) {
          preferredImage = values.images.find(
            (img) => img.ratio === "16_9" && img.width == "640"
          );
          if (preferredImage) {
            imageUrl = preferredImage.url;
          } else {
            imageUrl = values.images[0].url;
          }
        }
      }

      // Format the date
      let formattedDate = "Date not available";
      if (values.dates && values.dates.start && values.dates.start.localDate) {
        const eventDate = new Date(values.dates.start.localDate);
        formattedDate = eventDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        // Add time if available
        if (values.dates.start.localTime) {
          const timeParts = values.dates.start.localTime.split(":");
          let hours = parseInt(timeParts[0]);
          const minutes = timeParts[1];
          const ampm = hours >= 12 ? "PM" : "AM";
          hours = hours % 12;
          hours = hours ? hours : 12; // Convert 0 to 12
          formattedDate += ` at ${hours}:${minutes} ${ampm}`;
        }
      }

      // Get price range
      let priceRange = "Price not available";
      if (values.priceRanges && values.priceRanges.length > 0) {
        const price = values.priceRanges[0];
        priceRange = `From $${price.min}`;
      }

      data1 += `<div class="event-card swiper-slide">
                        <img src="${imageUrl}" alt="img" class="event-card-image">
                        <div class="event-card-body">
                          <p class="event-card-title">${teamName1} vs. ${teamName2}</p>
                            <div>
                              <p class="event-card-price">${priceRange}</p>
                              <p class="event-card-date">${formattedDate}</p>
                              <button type="button" class="button-donate"><a href="${values.url}">Buy Tickets</a></button>
                            </div>
                        </div>
                    </div>`;
    });
    document.getElementById("popular-events-cards").innerHTML = data1;
  })
  .catch((err) => {
    console.error(err);
  });

// Swiper

new Swiper(".swiper", {
  loop: false,
  spaceBetween: 24,
  speed: 750,
  pagination: {
    el: ".swiper-pagination",
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
      slidesPerGroup: 1,
    },
    768: {
      slidesPerView: 2,
      slidesPerGroup: 2,
    },
    1300: {
      slidesPerView: 3,
      slidesPerGroup: 3,
    },
    1600: {
      slidesPerView: 4,
      slidesPerGroup: 4,
    },
  },
});

// Burger Menu for Phones

document.addEventListener("DOMContentLoaded", function () {
  // Get the checkbox that controls the menu
  const menuCheckbox = document.querySelector(".menu");
  // Get the navigation links container
  const navLinks = document.querySelector(".nav-links");

  // Add event listener to the checkbox
  menuCheckbox.addEventListener("change", function () {
    // Toggle the menu-open class based on checkbox state
    if (this.checked) {
      navLinks.classList.add("menu-open");
    } else {
      navLinks.classList.remove("menu-open");
    }
  });

  // Ensure the checkbox is unchecked on page load
  menuCheckbox.checked = false;
});

// Form refresh after submit

function submitform() {
  var form = document.getElementById("contact-form");
  form.submit();
  form.reset();
  return false;
}

// NBA Icons for USA map

fetch(
  "https://app.ticketmaster.com/discovery/v2/attractions.json?apikey=GWzvVGT1KIeaSD2dABtrbyUwkZj7eyGe&subGenreId=KZazBEonSMnZfZ7vFJA&size=30"
)
  .then((data) => {
    return data.json();
  })
  .then((completedata) => {
    let data2 = "";
    let data3 = "";
    if (
      !completedata ||
      !completedata._embedded ||
      !completedata._embedded.attractions
    ) {
      return;
    }
    const attractions = completedata._embedded.attractions;
    attractions.sort((a, b) => a.name.localeCompare(b.name));
    attractions.map((values) => {
      let imageUrl = "";
      // icons
      if (values.images && values.images.length > 0) {
        // Try to find a 16:9 image first
        const preferredImage = values.images.find(
          (img) =>
            img.ratio === "4_3" &&
            parseInt(img.width) === 305 &&
            parseInt(img.height) === 225
        );
        if (preferredImage) {
          imageUrl = preferredImage.url;
        } else {
          // Fallback to the first image
          imageUrl = values.images[0].url;
        }
      }
      // team id
      let teamId = "";
      if (values.name && values.name.length > 0) {
        teamId = values.name.toLowerCase().replaceAll(" ", "-");
      } else {
        teamId = values.name;
      }
      // ikonice
      data2 += `<a href="/pages/team/team.html?teamId=${values.id}" id ="${teamId}"><img src="${imageUrl}" alt="${teamId}" class="nba-team-logo"></a>
                <p>${values.name}</p>`;
      // dropdown meni
      data3 += `<li><a href="/pages/team/team.html?teamId=${values.id}">${values.name}</a></li>`;
    });
    document
      .getElementById("usa-tickets")
      ?.insertAdjacentHTML("beforeend", data2);
    document
      .getElementById("nba-dropdown")
      .insertAdjacentHTML("afterbegin", data3);
    document
      .getElementById("nba-accordion")
      .insertAdjacentHTML("afterbegin", data3);
  })
  .catch((err) => {
    console.error(err);
  });

// WNBA Icons for USA map

fetch(
  "https://app.ticketmaster.com/discovery/v2/attractions.json?apikey=GWzvVGT1KIeaSD2dABtrbyUwkZj7eyGe&subGenreId=KZazBEonSMnZfZ7vFJF&size=13"
)
  .then((data) => {
    return data.json();
  })
  .then((completedata) => {
    let data3 = "";
    let data4 = "";
    if (
      !completedata ||
      !completedata._embedded ||
      !completedata._embedded.attractions
    ) {
      return;
    }
    const attractions = completedata._embedded.attractions;
    attractions.sort((a, b) => a.name.localeCompare(b.name));
    attractions.map((values) => {
      let imageUrl = "";
      // icons
      if (values.images && values.images.length > 0) {
        // Try to find a 16:9 image first
        const preferredImage = values.images.find(
          (img) =>
            img.ratio === "4_3" &&
            parseInt(img.width) === 305 &&
            parseInt(img.height) === 225
        );
        if (preferredImage) {
          imageUrl = preferredImage.url;
        } else {
          // Fallback to the first image
          imageUrl = values.images[0].url;
        }
      }
      // team id
      let teamId = "";
      if (values.name && values.name.length > 0) {
        teamId = values.name.toLowerCase().replaceAll(" ", "-");
      } else {
        teamId = values.name;
      }

      data3 += `<a href="/pages/team/team.html?teamId=${values.id}" id ="${teamId}"><img src="${imageUrl}" alt="${teamId}" class="nba-team-logo"></a>
              <p>${values.name}</p>`;
      data4 += `<li><a href="/pages/team/team.html?teamId=${values.id}">${values.name}</a></li>`;
    });
    document
      .getElementById("usa-tickets")
      ?.insertAdjacentHTML("beforeend", data3);
    document
      .getElementById("wnba-dropdown")
      .insertAdjacentHTML("afterbegin", data4);
    document
      .getElementById("wnba-accordion")
      .insertAdjacentHTML("afterbegin", data4);
  })
  .catch((err) => {
    console.error(err);
  });

// Team Page !
document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const teamIdValue = urlParams.get("teamId");

  if (teamIdValue) {
    const teamapiUrl = `https://app.ticketmaster.com/discovery/v2/attractions.json?apikey=sOGEikSvovIdezvDiOAeTIGurDrVhHOu&id=${teamIdValue}`;
    const ticketsapiUrl = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=sOGEikSvovIdezvDiOAeTIGurDrVhHOu&size=16&attractionId=${teamIdValue}&sort=date,asc`;

    // Team Api
    fetch(teamapiUrl)
      .then((data) => {
        return data.json();
      })
      .then((completedata) => {
        if (
          !completedata ||
          !completedata._embedded ||
          !completedata._embedded.attractions
        ) {
          document.getElementById("teamTitle").textContent = "Error";
          return;
        }
        const team = completedata._embedded.attractions;
        data5 = "";
        data6 = "";
        team.map((values) => {
          // Prefered Image extraction !

          if (values.images && values.images.length > 0) {
            // Try to find a 16:9 image first
            const preferredImage = values.images.find(
              (img) =>
                img.ratio === "16_9" &&
                parseInt(img.width) === 2048 &&
                parseInt(img.height) === 1152
            );
            if (preferredImage) {
              imageUrl = preferredImage.url;
            } else {
              // Fallback to the first image
              imageUrl = values.images[0].url;
            }
          }
          data5 += ` <img src="${imageUrl}" alt="" id="">
                     <h2>${values.name}</h2>`;
          data6 += `${values.name}`;
        });
        document.title = data6 + " Tickets";
        document
          .getElementById("team-picture")
          ?.insertAdjacentHTML("afterbegin", data5);
        document.getElementById(
          "team-header"
        ).textContent = `All ${data6} events.`;
      })
      .catch((err) => {
        console.error(err);
      });
    // Tickets Team Api
    fetch(ticketsapiUrl)
      .then((data) => {
        return data.json();
      })
      .then((completedata) => {
        // Check if the API response has the expected structure
        if (
          !completedata ||
          !completedata._embedded ||
          !completedata._embedded.events
        ) {
          document.getElementById("team-event-cards").innerHTML =
            "<p>No events found</p>";
          return;
        }

        // Get the events array
        const events = completedata._embedded.events;
        const eventCardsContainer = document.getElementById("team-event-cards");
        let data1 = "";

        function karta(values) {
          // Get name of the game
          let teamName1 = "";
          let teamName2 = "";
          if (
            values._embedded.attractions[0] &&
            values._embedded.attractions[1]
          ) {
            teamName1 = values._embedded.attractions[0].name;
            teamName2 = values._embedded.attractions[1].name;
          } else {
            return;
          }

          // Format the date
          let formattedDay = "";
          let formattedMonth = "";
          let formattedWeekday = "";
          if (
            values.dates &&
            values.dates.start &&
            values.dates.start.localDate
          ) {
            const eventDate = new Date(values.dates.start.localDate);
            formattedDay = eventDate.toLocaleDateString("en-US", {
              day: "2-digit",
            });
            formattedMonth = eventDate.toLocaleDateString("en-US", {
              month: "short",
            });
            formattedWeekday = eventDate.toLocaleDateString("en-US", {
              weekday: "short",
            });
          }

          // Add time and location
          let locationTime = "";
          if (values.dates.start.localTime) {
            const timeParts = values.dates.start.localTime.split(":");
            let hours = parseInt(timeParts[0]);
            const minutes = timeParts[1];
            const ampm = hours >= 12 ? "PM" : "AM";
            hours = hours % 12;
            hours = hours ? hours : 12; // Convert 0 to 12
            locationTime += `${hours}:${minutes} ${ampm}`;
          } else {
            locationTime += `TBD`;
          }

          if (values._embedded.venues) {
            locationTime += ` - ${values._embedded.venues[0].name} - ${values._embedded.venues[0].city.name}, ${values._embedded.venues[0].state.stateCode}`;
          }

          // Add promoter if available
          let gamePromoter = "Test";
          if (values.promoters) {
            gamePromoter = values.promoters[0].name;
          }

          // Get price range
          let priceRange = "Price not available";
          if (values.priceRanges && values.priceRanges.length > 0) {
            const price = values.priceRanges[0];
            priceRange = `From $${price.min}`;
          }

          // Append to the data1 string
          data1 += `<a href = ${values.url} class="team-event-card-link">
                    <div class="team-event-card">                        
                      <div class="team-event-date">
                        <p>${formattedMonth}</p>
                        <h3>${formattedDay}</h3>
                        <sub>${formattedWeekday}</sub>
                      </div>
                      <div class="team-event-information">
                        <h3 class="team-event-name">${teamName1} vs. ${teamName2}</h3>
                        <p class="team-event-location">${locationTime}</p>
                      </div>
                      <p class="team-event-price">${priceRange}</p>
                    </div>
                    </a>`;
        }

        function renderEvents(filterType) {
          // Reset data1 to clear previous content
          data1 = "";
          events.forEach((values) => {
            // Skip if attractions data is incomplete
            if (
              !values._embedded.attractions ||
              !values._embedded.attractions[0] ||
              !values._embedded.attractions[1]
            ) {
              return;
            }
            // Apply filters based on button type
            if (
              filterType === "home" &&
              teamIdValue == values._embedded.attractions[0].id
            ) {
              karta(values);
            } else if (
              filterType === "away" &&
              teamIdValue == values._embedded.attractions[1].id
            ) {
              karta(values);
            } else if (filterType === "all") {
              karta(values);
            }
          });
          eventCardsContainer.innerHTML = data1;
        }

        // Button selectors - move this outside any loops
        const homeButton = document.querySelector("#team-home");
        const awayButton = document.querySelector("#team-away");
        const allButton = document.querySelector("#team-all");

        // Set up event listeners ONCE (not in a loop/map)
        homeButton.addEventListener("click", () => {
          document.getElementById("triggerId").textContent = "Home";
          renderEvents("home");
        });

        awayButton.addEventListener("click", () => {
          document.getElementById("triggerId").textContent = "Away";
          renderEvents("away");
        });

        allButton.addEventListener("click", () => {
          document.getElementById("triggerId").textContent = "Home/Away";
          renderEvents("all");
        });
        renderEvents("all");
      })
      .catch((err) => {
        console.error(err);
      });
  } else {
    // Handle case when no team parameter is provided
    document.getElementById("teamTitle").textContent = "No team selected";
    console.log("error");
  }
});
