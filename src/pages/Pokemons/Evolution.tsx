import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getPokemonsData } from "../../app/reducers/getPokemonsData";
import PokemonCardGrid from "../../components/PokemonCardGrid";
import { genericPokemonType } from "../../utils/types";
import Loader from "../../components/Loader";
import pokeballSiluet from "../../assets/pokebalSiluet.png";

function Evolution() {
  const [isLoaded, setIsLoaded] = useState(false);
  const dispatch = useAppDispatch();
  const pokemonData = useAppSelector(({ pokemon }) => pokemon);
  const evolution = pokemonData?.currentPokemon?.evolution;

  useEffect(() => {
    const fetchData = async () => {
      if (Array.isArray(evolution) && evolution.length > 0) {
        const pokemons: genericPokemonType[] = evolution.map(
          ({ pokemon }: { pokemon: genericPokemonType }) => pokemon
        );
        await dispatch(getPokemonsData(pokemons));
      }
      setIsLoaded(true);
    };
    fetchData();
  }, [dispatch, evolution]);

  return (
    <div className="page">
      {isLoaded ? (
        !Array.isArray(evolution) || evolution.length === 0 ? (
          <div className="no-pokemon">
            <img src={pokeballSiluet} alt="pokeball siluet" />
            <p>Nothing evolution Pokemon</p>
          </div>
        ) : (
          <PokemonCardGrid pokemons={pokemonData.randomPokemons!} />
        )
      ) : (
        <div className="loading-pokemon">
          <Loader />
          <p>Loading evolution pokemon</p>
        </div>
      )}
    </div>
  );
}

export default Evolution;
