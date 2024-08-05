import React, { useState,useEffect } from 'react';
export default function HomeWorld({character})
{

  const [homeWorld, sethomeWorld] =useState(null);
  const [error,setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(character.homeworld)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(homeWorld => {
        sethomeWorld(homeWorld);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []);

  return(
    <>
           { homeWorld && <p>Home World: {homeWorld.name}</p> }
           { homeWorld && <p>Terrain: {homeWorld.terrain}</p> }
           { homeWorld && <p>Climate: {homeWorld.climate}</p> }
           { homeWorld && <p>Residents: {(homeWorld.residents).length}</p> }

           </> 
  );

}