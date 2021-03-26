import moment from 'moment';

export const formatChartObject = (array) => {
  const done = [
    array.map((m) => {
      return {
        value: m.Value,
        date: moment(m.Time).format('YYYY/MM/DD HH:mm'),
      };
    }),
  ];
  console.log(done);
  return done[0];
};
