
const CITY_INFO = 'locationInfo'
const getCity = () =>JSON.parse(localStorage.getItem(CITY_INFO))
const setCity = (city) => localStorage.setItem(CITY_INFO, JSON.stringify(city))
export {
  getCity,
  setCity
}