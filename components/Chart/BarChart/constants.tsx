import { format, startOfWeek } from 'date-fns';

export const mockData = [
  // 14 derniers jours
  { day: '2024-12-23', value: 2200 },
  { day: '2024-12-24', value: 1800 },
  { day: '2024-12-25', value: 2000 },
  { day: '2024-12-26', value: 2500 },
  { day: '2024-12-27', value: 1700 },
  { day: '2024-12-28', value: 0 },
  { day: '2024-12-29', value: 10000 },
  { day: '2024-12-30', value: 1600 },
  { day: '2024-12-31', value: 2100 },
  { day: '2025-01-01', value: 1400 },
  { day: '2025-01-02', value: 2300 },
  { day: '2025-01-03', value: 1800 },
  { day: '2025-01-04', value: 2000 },
  { day: '2025-01-05', value: 2500 },

  // 7 jours de la semaine actuelle
  { day: '2025-01-06', value: 2500 },
  { day: '2025-01-07', value: 0},
  { day: '2025-01-08', value: 2000 },
  { day: '2025-01-09', value: 1800 },
  { day: '2025-01-10', value: 0 },
  // { day: '2025-01-11', value: 3000 },
  // { day: '2025-01-12', value: 2200 },
];

const mondayFromThreeWeeksAgo = startOfWeek(
  new Date(new Date().getTime() - 86400000 * 14), // Passer un objet Date ici
  {
    weekStartsOn: 1, // 1 signifie que la semaine commence le lundi
  }
);


export const data = new Array(3).fill(null).map((_, weekIndex) => {
  return new Array(7).fill(null).map((__, dayIndex) => {
    // Calcul de la date pour chaque jour dans la grille
    const day = new Date(
      mondayFromThreeWeeksAgo.getTime() + 86400000 * (weekIndex * 7 + dayIndex)
    );

    // Convertir la date du jour en format "YYYY-MM-DD" pour la comparaison
    const formattedDay = day.toISOString().split('T')[0]; // Ex : "2024-12-30"

    // Trouver la valeur correspondante dans le mockData
    const matchingMock = mockData.find((mock) => {
      const formattedMockDay = new Date(mock.day).toISOString().split('T')[0]; // Ex : "2024-12-30"
      return formattedMockDay === formattedDay;
    });

    // Si une valeur existe dans le mock, l'utiliser, sinon mettre 0 par défaut
    const value = matchingMock ? matchingMock.value : 0;
    console.log(value)

    // Retourner l'objet contenant la date et la valeur
    return {
      day: day,
      value: value,
    };
  });
});

export const getDataConsumeByDays = (dataConsumeByDays: any) => {
  return new Array(3).fill(null).map((_, weekIndex) => {
    return new Array(7).fill(null).map((__, dayIndex) => {
      
      const day = new Date(
        Date.UTC(
          mondayFromThreeWeeksAgo.getUTCFullYear(),
          mondayFromThreeWeeksAgo.getUTCMonth(),
          mondayFromThreeWeeksAgo.getUTCDate()
        ) + 86400000 * (weekIndex * 7 + dayIndex)
      );
      // Forcer le format ISO en UTC
      const formattedDay = day.toISOString();
      
      const matchingData = dataConsumeByDays.find(item => 
        new Date(item.day).toISOString() === formattedDay
      );

      const value = matchingData ? matchingData.value : 0;

      return { day: formattedDay, value };
    });
  });
};
// Generate data for a 3x7 grid (3 weeks, 7 days each)
// export const data = new Array(3).fill(null).map((_, weekIndex) => {
//   return new Array(7).fill(null).map((__, dayIndex) => {
//     // Calculate the date for each day in the grid
//     const day = new Date(
//       mondayFromThreeWeeksAgo.getTime() + 86400000 * (weekIndex * 7 + dayIndex) // Add the corresponding number of days in milliseconds
//     );

//     // Generate a random value for each day
//     const value = Math.random(); // between 0 and 1

//     // Return an object containing the date and random value
//     return {
//       day: day,
//       value: value,
//     };
//   });
// });
/*
Example of a resulting object in the 'data' array:
[
  [
    { day: 2024-06-24T00:00:00.000Z, value: 0.123456789 }, // Monday of the first week
    { day: 2024-06-25T00:00:00.000Z, value: 0.987654321 }, // Tuesday of the first week
    { day: 2024-06-26T00:00:00.000Z, value: 0.456789123 }, // Wednesday of the first week
    { day: 2024-06-27T00:00:00.000Z, value: 0.654321987 }, // Thursday of the first week
    { day: 2024-06-28T00:00:00.000Z, value: 0.789123456 }, // Friday of the first week
    { day: 2024-06-29T00:00:00.000Z, value: 0.321987654 }, // Saturday of the first week
    { day: 2024-06-30T00:00:00.000Z, value: 0.987654321 }, // Sunday of the first week
  ],
  [
    { day: 2024-07-01T00:00:00.000Z, value: 0.123456789 }, // Monday of the second week
    // ... (similar objects for each day of the second week)
  ],
  // ... (similar arrays for each subsequent week)
]
*/