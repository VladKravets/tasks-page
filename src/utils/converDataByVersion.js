// import http from 'http/index';

// const requestHelper = (id) => {
//   let item = null;

//   http.get(`/documents/${id}/versions/`).then((res) => {
//     http.get(`/documents/${res.data[0].id}`).then((result) => {
//       item = result.data;
//     });
//   });

//   return item;
// };

export const convertDataByVersion = (data) => {
  return data;
};
