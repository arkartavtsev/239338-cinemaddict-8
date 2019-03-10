import {getRandomNum, getRandomItem} from './util';


const MoviesProperties = {
  TITLES: [
    `The Accused`,
    `Blackmail`,
    `Blue Blazes' Rawden`,
    `1997: fuga da New York`,
    `Moonrise`,
    `Three Friends`,
    `Pulp Fiction`,
    `Seven`,
    `The Good, the Bad and the Ugly`,
    `Memento`,
    `Gladiator`,
    `The Shawshank Redemption`,
    `Forrest Gump`,
    `Intouchables`,
    `The Godfather`
  ],

  GENRES: [
    `Action`,
    `Adventure`,
    `Comedy`,
    `Crime`,
    `Drama`,
    `History`,
    `Horror`,
    `Thriller`,
    `War`,
    `Western`
  ],

  POSTERS_NAMES: [
    `accused`,
    `blackmail`,
    `blue-blazes`,
    `fuga-da-new-york`,
    `moonrise`,
    `three-friends`
  ],

  Description: {
    Length: {
      MIN: 1,
      MAX: 3
    },
    SENTENCES: [
      `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
      `Cras aliquet varius magna, non porta ligula feugiat eget.`,
      `Fusce tristique felis at fermentum pharetra.`,
      `Aliquam id orci ut lectus varius viverra.`,
      `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
      `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
      `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
      `Sed sed nisi sed augue convallis suscipit in sed felis.`,
      `Aliquam erat volutpat.`,
      `Nunc fermentum tortor ac porta dapibus.`,
      `In rutrum ac purus sit amet tempus.`
    ]
  },

  Rating: {
    MIN: 1,
    MAX: 10
  },

  Year: {
    MIN: 1900,
    MAX: 2019
  },

  Duration: {
    MIN: 90,
    MAX: 210
  },

  CommentsCount: {
    MIN: 0,
    MAX: 15
  }
};


const getRandomRating = (min, max) => getRandomNum(min * 10, max * 10) / 10;

const getRandomDescription = (minLength, maxlength, possibleSentences) => {
  const description = new Set();

  for (let i = 0; i < getRandomNum(minLength, maxlength); i++) {
    description.add(getRandomItem(possibleSentences));
  }

  return Array.from(description).join(` `);
};


const generateMovieInfo = (properties) => ({
  title: getRandomItem(properties.TITLES),
  rating: getRandomRating(properties.Rating.MIN, properties.Rating.MAX),
  year: getRandomNum(properties.Year.MIN, properties.Year.MAX),
  duration: getRandomNum(properties.Duration.MIN, properties.Duration.MAX),
  genre: getRandomItem(properties.GENRES),
  description: getRandomDescription(properties.Description.Length.MIN, properties.Description.Length.MAX, properties.Description.SENTENCES),
  posterUrl: `images/posters/${getRandomItem(properties.POSTERS_NAMES)}.jpg`,
  commentsCount: getRandomNum(properties.CommentsCount.MIN, properties.CommentsCount.MAX)
});


export default (count) => {
  let movies = [];

  for (let i = 0; i < count; i++) {
    movies.push(generateMovieInfo(MoviesProperties));
  }

  return movies;
};
