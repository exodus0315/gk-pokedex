let url;
let result_pokemon = [];

const test = () => {
  fetch("https://pokeapi.co/api/v2/pokemon/pikachu")
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response.status);
      }
    })
    .then((pokemon) => {
      render(pokemon);
    })
    .catch((error) => {
      console.log(error);
    });
};

const render = (pokemon) => {
  result_pokemon = pokemon;
  console.log(result_pokemon);
  let pokeHTML = "";
  pokeHTML += `<div class="row g-3">
  <div class="col-3">
    <div class="pk-card">
      <img class="pokemon-image" src="${result_pokemon.sprites["front_default"]}" />
      <p class="pokemon-text">${result_pokemon.name}</p>
    </div>
  </div>
</div>`;

  document.getElementById("pokedex").innerHTML = pokeHTML;
};

test();
