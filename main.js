let page = "1";
const searchInput = document.getElementById("search-input");
const searchInput2 = document.getElementById("search-input-2");
let searchValue = "";
const searchButton = document.querySelector("#search-box button");
const modal = document.querySelector(".modal");
const closeButton = modal.querySelector(".modal button");
const modalBackground = modal.querySelector(".modal-background");
const searchModal = document.querySelector(".search-modal");

closeButton.addEventListener("click", displayModal);
modalBackground.addEventListener("click", displayModal);
searchButton.addEventListener("click", preSearch);

function preSearch() {
  let windowWidth = window.innerWidth;
  if (windowWidth > 768) {
    searchValue = searchInput.value;
    search();
  } else {
    if (searchModal.classList.contains("hidden") == true) {
      searchModal.classList.remove("hidden");
    } else {
      searchValue = searchInput2.value;
      search();
      searchModal.classList.add("hidden");
    }
  }
}

function search() {
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
        <div class="col-lg-12">
        <p class="h1">${pokemon.id}. ${upperCase(pokemon.name)}</p>
        <hr id="search-line" />
      </div>
      <div class="col-lg-4 imgAlign">
        <img src="${pokemon.sprites["front_default"]}" class="img-fluid"
        alt="${pokemon.name} image" />
      </div>
      <div class="col-lg-4">
        <p class="h5">기본정보 (Basic Information)</p>
        <p>타입(Types): ${upperCase(pokemon.types[0].type.name)}</p>
        <p>키(height): ${pokemon.height / 10}m</p>
        <p>몸무게(weight): ${(pokemon.weight / 10).toFixed(1)}kg</p>
      </div>
      <div class="col-lg-4">
        <p class="h5">스탯 (Stats)</p>
        <p>HP: ${pokemon.stats[0].base_stat}</p>
        <p>공격: ${pokemon.stats[1].base_stat}</p>
        <p>방어: ${pokemon.stats[2].base_stat}</p>
        <p>특수공격: ${pokemon.stats[3].base_stat}</p>
        <p>특수방어: ${pokemon.stats[4].base_stat}</p>
        <p>스피드: ${pokemon.stats[5].base_stat}</p>
      </div>
      <div class="row gx-2">
        <div class="col-lg-4">
          <div class="p-3 border bg-light">
            <img src="${pokemon.sprites["back_default"]}" class="img-fluid" />
            <hr />
            <p class="h4">뒷 모습</p>
          </div>
        </div>
        <div class="col-lg-4">
          <div class="p-3 border bg-light">
            <img src="${pokemon.sprites["front_shiny"]}" class="img-fluid" />
            <hr />
            <p class="h4">샤이니 앞 모습</p>
          </div>
        </div>
        <div class="col-lg-4">
          <div class="p-3 border bg-light">
            <img src="${pokemon.sprites["back_shiny"]}" class="img-fluid" />
            <hr />
            <p class="h4">샤이니 뒷 모습</p>
          </div>
        </div>
      </div>
        `;
        document.getElementById("pokedex").innerHTML = pokemonHTML;
        document.querySelector("nav").innerHTML = "";
      })
      .catch((error) => {
        console.log("error", error);
      });
  } else {
    displayModal();
  }
}

const findPokemonGroup = (pageNumber) => {
  searchInput.value = "";
  page = pageNumber;
  let findOffset = 0;
  if (page == 0) {
    findOffset = 0;
  } else {
    findOffset = (page - 1) * 20;
  }
  const url = `https://pokeapi.co/api/v2/pokemon/?limit=20&offset=${findOffset}`;
  fetch(url)
    .then((response) => {
      if (response.status == 200) {
        return response.json();
      } else {
        throw new Error("데이터 불러오기에 실패하였습니다.");
      }
    })
    .then((data) => data.results)
    .then((result) => {
      let pokemonList = [];
      for (i = 0; i <= 19; i++) {
        pokemonList.push(result[i].url);
      }
      findPokemon(pokemonList);
    })
    .catch((error) => console.log("error", error));
};

const findPokemon = (pokemonList) => {
  searchInput.value = "";
  const promises = [];
  for (let i = 0; i <= 19; i++) {
    const resultUrl = pokemonList[i];
    promises.push(fetch(resultUrl).then((res) => res.json()));
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
  let paginationHTML = ``;
  let totalCount = 898;
  let totalPage = Math.ceil(totalCount / 20);
  let pageGroup = Math.ceil(page / 5);
  let last = pageGroup * 5;
  if (last > totalPage) {
    last = totalPage;
  }
  let first = last - 4 <= 0 ? 1 : last - 4;
  if (pageGroup != 1) {
    paginationHTML = `<li class="page-item">
  <a class="page-link" href="#" onclick="findPokemonGroup(${1})">
    <span aria-hidden="true">&lt;&lt;</span>
  </a>
</li><li class="page-item">
<a class="page-link" href="#" onclick="findPokemonGroup(${page - 1})">
  <span aria-hidden="true">&lt;</span>
</a>
</li>`;
  }

  for (let i = first; i <= last; i++) {
    paginationHTML += `<li class="page-item ${
      page == i ? "active" : ""
    }"><a class="page-link" href="#" onclick="findPokemonGroup(${i})">${i}</a></li>`;
  }
  if (last < totalPage) {
    paginationHTML += `<li class="page-item">
  <a class="page-link" href="#" onclick="findPokemonGroup(${page + 1})">
    <span aria-hidden="true">&gt;</span>
  </a>
</li><li class="page-item">
<a class="page-link" href="#" onclick="findPokemonGroup(${totalPage})">
  <span aria-hidden="true">&gt;&gt;</span>
</a>
</li>`;
  }

  document.querySelector(".pagination").innerHTML = paginationHTML;
};

const pokemonHome = (pageNumber) => {
  findPokemonGroup(pageNumber);
};

// 첫 글자만 대문자로 변환
const upperCase = (msg) => {
  return msg[0].toUpperCase() + msg.substring(1);
};

function displayModal() {
  modal.classList.toggle("hidden");
}

pokemonHome(1);
