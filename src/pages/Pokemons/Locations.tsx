import { useAppSelector } from "../../app/hooks";
import pokeballPin from "../../assets/pokebalLocation.png";

function Locations() {
  const pokemonData = useAppSelector(
    ({ pokemon: { currentPokemon } }) => currentPokemon
  );
  const encounters = pokemonData?.encounters || [];

  return (
    <div className="pokemon-locations">
      {encounters.length > 0 ? (
        <ul className="pokemon-locations-list">
          {encounters.map((encounter: string) => (
            <li key={encounter} className="pokemon-location">
              {encounter}
            </li>
          ))}
        </ul>
      ) : (
        <div className="no-encounters">
          <img src={pokeballPin} alt="No Pokeball" />
          <p>Locations catching pokemon not found</p>
          <img src={pokeballPin} alt="No Pokeball" />
        </div>
      )}
    </div>
  );
}

export default Locations;
