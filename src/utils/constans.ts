export const pokemonApi = process.env.REACT_APP_POKEMON_API;
export const pokemonsRoute = `${pokemonApi}/pokemon?limit=5000`;
export const pokemonRoute = `${pokemonApi}/pokemon`;
export const pokemonSpeciesRoute = `${pokemonApi}/pokemon-species`;

export const pokemonTabs = {
  description: "description",
  evolution: "evolution",
  locations: "locations",
  moves: "moves",
};
