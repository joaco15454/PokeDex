//ELEMENTOS HTML
const containerPokemons = document.querySelector(`.pokemons`)
const nextPage = document.querySelector(`.next-page`)
const previousPage = document.querySelector(`.previous-page`)
const numberPage = document.querySelector(`.numberPage`)
const containerFilter = document.querySelector(`.container_filter`)
const searchPokemon = document.querySelector(`.buscar`)
const allPokemons = document.querySelector(`.allPokemons`)
const agregarFavoritos = document.querySelectorAll(`.agregar-favoritos`)
const abrirFavoritos = document.querySelector(`.abrir_favoritos`)
const carroFavoritos = document.querySelector(`.favoritos`)
const container_fav= document.querySelector(`.container_poke_fav`)
const vaciarCarro = document.querySelector(`.vaciar_carro`)
const mensajeFavorito = document.querySelector(`.agregado_favoritos`)
const inputBuscar = document.querySelector(`.input_buscar`)
const botonBuscar = document.querySelector(`.buscar`)

const mensajeErrorFetch = document.querySelector(`.mensaje_error`)
//FETCH

const urlBase = `https://pokeapi.co/api/v2/pokemon`


const urlFilter = `https://pokeapi.co/api/v2/type/`

const fetchPokemonFilter =  async (filter = 3) => {
    const fetchPokemon = await fetch(`${urlFilter}${filter}`)
    const data = await fetchPokemon.json()
    
    return data.pokemon
}
fetchPokemonFilter()

const fetchPokemon = async (limit=9, offset=0) => {
    const fetchPoke = await fetch(`${urlBase}?limit=${limit}&offset=${offset}`)
    const data = await fetchPoke.json()
    return data
   
}
const fetchPokemonSearch =  async (value) => {
    const fetchPoke = await fetch(`${urlBase}/${value.toLowerCase()}`)
    const data = await fetchPoke.json()
    return data  }

let offsetpage = 0
let pageNumber = 1

let cart = JSON.parse(localStorage.getItem("cart")) || []

const saveLocalStorage = (cartList) => {
    localStorage.setItem("cart", JSON.stringify(cartList));
  };
//INIT
const renderPokemon = (pokemon) => {
    const cardHtml = getPokemonHtml(pokemon)
    containerPokemons.innerHTML=cardHtml
}


const getPokemonHtml = (pokemon) => {
    
    return `
    <div class="poke d-flex justify-content-between align-items-center flex-column">
            <div class="d-flex justify-content-between align-items-center px-2 top-cart">
                <h2 class="name_poke">${pokemon.name.toUpperCase()}</h2>
                <p>HP<span class="hp">${pokemon.stats[0].base_stat}</span></p>
            </div>
            <div class="d-flex justify-content-center align-items-center img_poke">
                <img  src="${pokemon.sprites.other.home.front_default}"/>
            </div>
            <div class="d-flex justify-content-around align-items-center px-2 mid_card">
            <p class="exp">EXP: ${pokemon.base_experience}</p>
                <p class="height">Height: ${pokemon.height / 10}m</p>
                <p class="weight">Weight: ${pokemon.weight / 10}Kg</p>
            </div>
            <div class="row">
                
                <div class="tipo-poke d-flex justify-content-between p-4" data-type="${pokemon.types
                    .map((tipo) => {
                        return `${tipo.type.name}`;
                    })
                    .join("")}">
                    ${pokemon.types
                    .map((tipo) => {
                        return `<span class="${tipo.type.name} poke__type">${tipo.type.name}</span>`;
                    })
                    .join("")}
                </div>
            </div>
            


            <div class="d-flex justify-content-center align-items-center flex-column gap-2 mb-3">
    
                <div class="habilidades d-flex justify-content-around align-items-center">
                    <p>ATTACK</p>
                    <p class="stats">${pokemon.stats[1].base_stat}</p>
      
            
      
                </div>
                

            



            
    
                <div class="habilidades d-flex justify-content-around align-items-center gap-4">
                <p>DEFENSE</p>
                <p class="stats">${pokemon.stats[2].base_stat}</p>
      
            
      
                </div>
                

            




            
    
                <div class="habilidades d-flex justify-content-around align-items-center gap-4">
                <p>SPEED</p>
                <p class="stats">${pokemon.stats[5].base_stat}</p>
      
                
      
                </div>
                
                <i class="fa-solid fa-star agregar-favoritos"
                data-id="${pokemon.id}" 
                data-name="${pokemon.name.toUpperCase()}"
                data-img="${pokemon.sprites.other.home.front_default}"
                data-tipe="${pokemon.types
                    .map((tipo) => {
                        return `${tipo.type.name}`;
                    })
                    .join(" ")}"
                
                ></i>
            </div>

            </div>
            

            


        
    </div>
    `
}


const renderPokemonList = (pokemonsList) => {
    const cardsHtml = pokemonsList
    .map((pokemon) => getPokemonHtml(pokemon))
    containerPokemons.innerHTML=cardsHtml
}

const nextPokemons =  async () => {
        offsetpage+=9
        pageNumber+= 1
        numberPage.innerHTML= `${pageNumber}`
        console.log(offsetpage)
        const {results} = await fetchPokemon(9,offsetpage)
        
        const URLS = results.map((pokemon) => pokemon.url)
        const infoPokemones = await Promise.all (
            URLS.map(async (url) => {
                const nextPokemon = await fetch(url)
                return await nextPokemon.json()
            })
        )
        


        renderPokemonList(infoPokemones)
}


const changeSearchParameter = async (e) => {
    if (
        !e.target.classList.contains("filter") 
    ){
        return
    }
    const selecteSearchParameter = e.target.dataset.filter;

    

    const pokemons = await fetchPokemonFilter(selecteSearchParameter)
    console.log(pokemons)    
        const URLS = pokemons.map((pokemon) => pokemon.pokemon.url)
        const infoPokemones = await Promise.all (
            URLS.map(async (url) => {
                const nextPokemon = await fetch(url)
                return await nextPokemon.json()
            })
        )
        console.log(infoPokemones)


        renderPokemonList(infoPokemones)
    
}


const previousPokemons = async () => {
    if (offsetpage===0 || pageNumber===1 ) {
        console.log("el offset es 0, no retorna ")
        return
    }
    pageNumber -= 1
    numberPage.innerHTML= `${pageNumber}`
    offsetpage-=9
    console.log(offsetpage)
    const {results} = await fetchPokemon(9,offsetpage)
        
    const URLS = results.map((pokemon) => pokemon.url)
    const infoPokemones = await Promise.all (
            URLS.map(async (url) => {
                const nextPokemon = await fetch(url)
                return await nextPokemon.json()
            })
        )
        


        renderPokemonList(infoPokemones)
}
 
const renderCartProducts = ({id,name,img,tipe}) => {
    
    return `
    <div class="cart_poke mt-5">
        <i class="fa-solid fa-xmark quitarPoke" data-id="${id}"></i>
        <h1 data-name="${name}" class=""> ${name}</h1>
        <img src="${img}"/>
        <div class="row">
                
                <div class="tipo-poke d-flex justify-content-between p-4">
                    <span class="${tipe} ">${tipe}</span>
                    
                </div>
            </div>
    </div>
    





    
    `
}

const renderCart = () => {
    container_fav.innerHTML = cart.map(renderCartProducts).join("")
}

const createCartPoke = (product) => {
    cart= [...cart, {...product}];
}
const checkCartState = () => {
    saveLocalStorage(cart);
    renderCart();
}
const mensajeAgregado = () => {
    mensajeFavorito.classList.remove("ocultoMsg")
    setTimeout(() => {
        mensajeFavorito.classList.add("ocultoMsg");
      }, 1500);
}
const addPokeCart = (e) => {
    if (!e.target.classList.contains("agregar-favoritos")) 
    {   
        return; }
    
    
        
    const {id,name, img, tipe } = e.target.dataset;
    const product =  {id,name, img, tipe }
    console.log(product)
    console.log(isInCart(product.id))
    if (isInCart(product)) {
        
        return
    }
    mensajeAgregado()
    createCartPoke(product)

    checkCartState()
}
const isInCart = ({id}) => {
    cart.some((product) => product.id === id);
}
const quitarFavorito = ({id}) => {
    console.log("EStoy en quitar favorito")
    
    cart = cart.filter((product) => product.id !== id);
    console.log(cart)
    checkCartState();
}
const init = () => {

    


    allPokemons.addEventListener(`click`, async () => {
        
        const {results} = await fetchPokemon()
        
        const URLS = results.map((pokemon) => pokemon.url)
        const infoPokemones = await Promise.all (
            URLS.map(async (url) => {
                const nextPokemon = await fetch(url)
                return await nextPokemon.json()
            })
        )
        console.log(infoPokemones)


        renderPokemonList(infoPokemones)
    })

    window.addEventListener(`DOMContentLoaded`, async () => {
        checkCartState()
        const {results} = await fetchPokemon()
        
        const URLS = results.map((pokemon) => pokemon.url)
        const infoPokemones = await Promise.all (
            URLS.map(async (url) => {
                const nextPokemon = await fetch(url)
                return await nextPokemon.json()
            })
        )
        console.log(infoPokemones)


        renderPokemonList(infoPokemones)
    })
    containerPokemons.addEventListener("click", (e)=> {
        if (!e.target.classList.contains("agregar-favoritos")) {
            return
        }
        if (e.target.classList.contains("agregado")) {
            const {id} = e.target.dataset
            quitarFavorito({id})
            e.target.classList.toggle("agregado")
            return
        }
        e.target.classList.toggle("agregado")
        addPokeCart(e);
        checkCartState()
    })
    nextPage.addEventListener(`click`, nextPokemons)

    previousPage.addEventListener(`click`, previousPokemons)

    containerFilter.addEventListener("click",changeSearchParameter)


    abrirFavoritos.addEventListener(`click`, () => {
        carroFavoritos.classList.toggle(`oculto`)
        
    })
    carroFavoritos.addEventListener("click", (e) => {
        if (!e.target.classList.contains("quitarPoke")) {
            return
        }
        const {id} = e.target.dataset
        console.log(e.target.classList.contains("agregado"))
        
        quitarFavorito({id})


    })
    vaciarCarro.addEventListener("click", () => {
        cart = []
        checkCartState()
    })

    botonBuscar.addEventListener("click", async (e) => {
        e.preventDefault()
        
        buscarPoke(inputBuscar.value)
        
        
    })
}
const mensajeError = (msg) => {
    mensajeErrorFetch.textContent=msg
}
const buscarPoke = async (poke) => {
    let resultados = []
    try {
        const results = await fetchPokemonSearch(poke)
        console.log(results)
        resultados = results
        mensajeError("")
        } catch (error) {
            mensajeError("No se ha encontrado ningun pokemon.")
        } finally {
            
            renderPokemon(resultados)
        }
    
    
}
init()