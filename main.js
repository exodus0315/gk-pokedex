let url = "";
const searchInput = document.getElementById("search-input");
const searchButton = document.querySelector("#search-box button");
const searchModal = document.getElementById("searchModal");
const modal = document.querySelector(".modal");
const closeButton = modal.querySelector("button");
const modalBackground = modal.querySelector(".modal-background");

closeButton.addEventListener("click", displayModal);
modalBackground.addEventListener("click", displayModal);

searchButton.addEventListener("click", search);

function search() {
  let searchValue = searchInput.value;
  if (searchValue != "") {
    fetch(`https://pokeapi.co/api/v2/pokemon/${searchValue}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(response.status);
        }
      })
      .then((pokemon) => {
        let pokemonHTML = "";
        pokemonHTML += `
          <div class="card">
          <img src="${pokemon.sprites["front_default"]}" class="card-img-top">
          <div class="card-body">
            <h4 class="card-title">${pokemon.id}. ${upperCase(
          pokemon.name
        )}</h4>
            <p>타입(Types): ${upperCase(pokemon.types[0].type.name)}</p>
            <p>키(height): ${pokemon.height / 10}m</p>
            <p>몸무게(weight): ${(pokemon.weight / 10).toFixed(1)}kg</p>
          </div>
          </div>
        `;

        document.getElementById("pokedex").innerHTML = pokemonHTML;
        document.getElementById("pagination").innerHTML =
          "검색 시 페이지네이션 필요없으니 안보이게하기";
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    displayModal();
  }
}

const pokemonHome = () => {
  const promises = [];
  for (let i = 1; i <= 20; i++) {
    const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
    promises.push(fetch(url).then((res) => res.json()));
  }
  Promise.all(promises).then((results) => {
    const pokemon = results.map((result) => ({
      name: result.name,
      image: result.sprites["front_default"],
      type: result.types[0].type.name,
      id: result.id,
      height: result.height,
      weight: result.weight,
    }));
    displayPokemon(pokemon);
  });
};

const displayPokemon = (pokemon) => {
  console.log(pokemon);
  const pokemonHTML = pokemon
    .map(
      (pokemons) => `
      <div class="card">
      <img src="${pokemons.image}" class="card-img-top">
      <div class="card-body">
        <h4 class="card-title">${pokemons.id}. ${upperCase(pokemons.name)}</h4>
        <p>타입(Types): ${upperCase(pokemons.type)}</p>
        <p>키(height): ${pokemons.height / 10}m</p>
        <p>몸무게(weight): ${(pokemons.weight / 10).toFixed(1)}kg</p>
      </div>
      </div>
    `
    )
    .join("");

  document.getElementById("pokedex").innerHTML = pokemonHTML;
  pagination();
};

const pagination = () => {
  document.getElementById("pagination").innerHTML =
    "페이지네이션 적용시 텍스트 바뀜 (테스트중)";
};

// 첫 글자만 대문자로 변환
const upperCase = (msg) => {
  return msg[0].toUpperCase() + msg.substring(1);
};

function displayModal() {
  modal.classList.toggle("hidden");
}

pokemonHome();
