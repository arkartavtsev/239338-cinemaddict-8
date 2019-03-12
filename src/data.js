import {getRandomNum, getRandomItem, getUniqueRandomItems} from './util';


const Properties = {
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

  POSTERS_NAMES: [
    `accused`,
    `blackmail`,
    `blue-blazes`,
    `fuga-da-new-york`,
    `moonrise`,
    `three-friends`
  ],

  AGE_RATINGS: [
    3,
    7,
    12,
    16,
    18
  ],

  COUNTRIES: [
    `USA`,
    `UK`,
    `France`,
    `Italy`,
    `Germany`,
    `Spain`
  ],

  PEOPLE: [
    `Brad Bird`,
    `Samuel L. Jackson`,
    `Catherine Keener`,
    `Sophia Bush`,
    `Sergio Leone`,
    `Peter Jackson`,
    `Mahershala Ali`,
    `Bradley Cooper`,
    `Francis Ford Coppola`,
    `Christopher Nolan`
  ],

  Genres: {
    Count: {
      MIN: 2,
      MAX: 3
    },
    NAMES: [
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
  },

  Comments: {
    Count: {
      MIN: 0,
      MAX: 15
    },
    PERIOD: 2,
    EMOJIES: [
      `&#x1F634`,
      `&#x1F610`,
      `&#x1F600`
    ]
  },

  TextContent: {
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

  WritersCount: {
    MIN: 1,
    MAX: 2
  },

  ActorsCount: {
    MIN: 2,
    MAX: 4
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
  }
};


const getRandomRating = (min, max) => getRandomNum(min * 10, max * 10) / 10;

const getRandomPastDateWithinYears = (years) => Date.now() + (getRandomNum(-years, 0) * 365 + getRandomNum(-365, 0)) * 24 * 60 * 60 * 1000;

const getRandomText = (properties) => getUniqueRandomItems(properties.Length.MIN, properties.Length.MAX, properties.SENTENCES).join(` `);


const generateComment = (properties) => ({
  author: getRandomItem(properties.PEOPLE),
  date: getRandomPastDateWithinYears(properties.Comments.PERIOD),
  text: getRandomText(properties.TextContent),
  emoji: getRandomItem(properties.Comments.EMOJIES)
});


const generateMovieInfo = (properties) => {
  const title = getRandomItem(properties.TITLES);

  return {
    title,
    originalTitle: title,

    rating: getRandomRating(properties.Rating.MIN, properties.Rating.MAX),
    ageRating: getRandomItem(properties.AGE_RATINGS),

    country: getRandomItem(properties.COUNTRIES),
    releaseDate: getRandomPastDateWithinYears(properties.Year.MAX - properties.Year.MIN),

    director: getRandomItem(properties.PEOPLE),
    writers: getUniqueRandomItems(properties.WritersCount.MIN, properties.WritersCount.MAX, properties.PEOPLE),
    actors: getUniqueRandomItems(properties.ActorsCount.MIN, properties.ActorsCount.MAX, properties.PEOPLE),

    duration: getRandomNum(properties.Duration.MIN, properties.Duration.MAX),
    genres: getUniqueRandomItems(properties.Genres.Count.MIN, properties.Genres.Count.MAX, properties.Genres.NAMES),
    description: getRandomText(properties.TextContent),
    posterUrl: `images/posters/${getRandomItem(properties.POSTERS_NAMES)}.jpg`,

    comments: generateItems(getRandomNum(properties.Comments.Count.MIN, properties.Comments.Count.MAX), generateComment)
  };
};


const generateItems = (count, callback) => {
  let comments = [];

  for (let i = 0; i < count; i++) {
    comments.push(callback(Properties));
  }

  return comments;
};


export default (count) => generateItems(count, generateMovieInfo);
