// @ts-nocheck
import axios from "axios";
import { extractColors } from "extract-colors";
import { useEffect, useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import Wrapper from "../sections/Wrapper";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { setCurrentPokemon } from "../app/slices/PokemonSlice";
import { setPokemonTab } from "../app/slices/AppSlice";
import Loader from "../components/Loader";
import Description from "./Pokemons/Description";
import Evolution from "./Pokemons/Evolution";
import Locations from "./Pokemons/Locations";
import CapableMoves from "./Pokemons/CapableMoves";
import { defaultImages, images } from "../utils";
import {
  pokemonRoute,
  pokemonSpeciesRoute,
  pokemonTabs,
} from "../utils/constans";

function Pokemon() {
  const params = useParams();
  const dispatch = useAppDispatch();
  const [isDataLoading, setIsDataLoading] = useState(true);
  const currentPokemonTab = useAppSelector(
    ({ app: { currentPokemonTab } }) => currentPokemonTab
  );
  const currentPokemon = useAppSelector(
    ({ pokemon: { currentPokemon } }) => currentPokemon
  );

  const getRecursiveEvolution = useCallback(
    (evolutionChain, level, evolutionData) => {
      if (!evolutionChain.evolves_to.length) {
        return evolutionData.push({
          pokemon: {
            ...evolutionChain.species,
            url: evolutionChain.species.url.replace(
              "pokemon-species",
              "pokemon"
            ),
          },
          level,
        });
      }
      evolutionData.push({
        pokemon: {
          ...evolutionChain.species,
          url: evolutionChain.species.url.replace("pokemon-species", "pokemon"),
        },
        level,
      });
      return getRecursiveEvolution(
        evolutionChain.evolves_to[0],
        level + 1,
        evolutionData
      );
    },
    []
  );

  const getEvolutionData = useCallback(
    (evolutionChain) => {
      const evolutionData = [];
      getRecursiveEvolution(evolutionChain, 1, evolutionData);
      return evolutionData;
    },
    [getRecursiveEvolution]
  );

  const getPokemonInfo = useCallback(
    async (image) => {
      const { data } = await axios.get(`${pokemonRoute}/${params?.id}`);
      try {
        const encounters = [];
        const { data: dataEncounters } = await axios.get(
          data.location_area_encounters
        );
        const { data: speciesData } = await axios.get(
          `${pokemonSpeciesRoute}/${data.id}`
        );
        const { data: evolutionData } = await axios.get(
          speciesData.evolution_chain.url
        );
        const pokemonAbilities = {
          abilities: data.abilities.map(({ ability }) => ability.name),
          moves: data.moves.map(({ move }) => move.name),
        };
        const evolution = getEvolutionData(evolutionData.chain);

        let evolutionLevel;
        evolutionLevel = evolution?.find(
          ({ pokemon }) => pokemon?.name === data?.name
        ).level;

        dataEncounters.forEach((encounter) => {
          encounters.push(
            encounter.location_area.name.toUpperCase().split("-").join(" ")
          );
        });

        const stats = await data.stats.map(({ stat, base_stat }) => ({
          name: stat.name,
          value: base_stat,
        }));

        dispatch(
          setCurrentPokemon({
            id: data.id,
            name: data.name,
            types: data.types.map(({ type: { name } }) => name),
            image,
            stats,
            encounters,
            evolutionLevel,
            evolution,
            pokemonAbilities,
          })
        );
      } catch (error) {
        const encounters = [];
        const { data: dataEncounters } = await axios.get(
          data.location_area_encounters
        );
        dataEncounters.forEach((encounter) => {
          encounters.push(
            encounter.location_area.name.toUpperCase().split("-").join(" ")
          );
        });

        const pokemonAbilities = {
          abilities: data.abilities.map(({ ability }) => ability.name),
          moves: data.moves.map(({ move }) => move.name),
        };

        const stats = await data.stats.map(({ stat, base_stat }) => ({
          name: stat.name,
          value: base_stat,
        }));

        dispatch(
          setCurrentPokemon({
            id: data.id,
            name: data.name,
            types: data.types.map(({ type: { name } }) => name),
            image,
            stats,
            encounters,
            evolutionLevel: "N/A",
            evolution: "N/A",
            pokemonAbilities,
          })
        );
      }
      setIsDataLoading(false);
    },
    [getEvolutionData, params.id, dispatch]
  );

  useEffect(() => {
    dispatch(setPokemonTab(pokemonTabs.description));
  }, [dispatch]);

  useEffect(() => {
    const imageElemet = document.createElement("img");
    imageElemet.src = images[params.id];
    let image = images[params.id];
    if (!image) {
      image = defaultImages[params.id];
    }
    if (!image) {
      throw error("Image pokemon data not found.");
    }

    const options = {
      pixels: 10000,
      distance: 1,
      splitPower: 10,
      colorValidator: (red, green, blue, alpha = 255) => alpha > 250,
      saturationDistance: 0.2,
      lightnessDistance: 0.2,
      hueDistance: 0.083333333,
    };

    const getColor = async () => {
      const color = await extractColors(imageElemet.src, options);
      const root = document.documentElement;
      root.style.setProperty("--accent-color", color[0].hex.split('"')[0]);
    };
    getColor();

    getPokemonInfo(image);
    if (!getPokemonInfo) {
      throw error("Image getPokemonInfo pokemon data not found.");
    }
  }, [params, getPokemonInfo]);

  return (
    <div>
      {!isDataLoading && currentPokemon ? (
        <>
          {currentPokemonTab === pokemonTabs.description && <Description />}
          {currentPokemonTab === pokemonTabs.evolution && <Evolution />}
          {currentPokemonTab === pokemonTabs.locations && <Locations />}
          {currentPokemonTab === pokemonTabs.moves && <CapableMoves />}
        </>
      ) : (
        <div className="loading-pokemon">
          <Loader />
          <p>Loading pokemon</p>
        </div>
      )}
    </div>
  );
}

export default Wrapper(Pokemon);
