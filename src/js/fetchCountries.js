export const fetchCountries = name => {
  
  return fetch(
    `https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`
  ).then(response => {
    if (!response.ok) {
      console.log('No such country');
      throw new Error(response.status);
    }
    console.log('There is such a country');
    return response.json();
  });
};
