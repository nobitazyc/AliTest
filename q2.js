const mockUser1 = {
  name: "user1",
  id: 1
};
const mockUser2 = {
  name: "user2",
  id: 2
};
const mockMultipleUsers = [{ name: "user1", id: 1 }, { name: "user2", id: 2 }];

let requestList = [];
let timer;
let cacheData = [];

function getUserByIds(ids) {
  console.log(ids);
  //should return fetch in real time
  return new Promise(resolve => {
    cacheData = [...cacheData, ...mockMultipleUsers];
    return resolve(mockMultipleUsers);
  });
}

function getUserById(id) {
  if (cacheData.find(item => item.id === id)) {
    return new Promise(resolve => {
      return resolve(cacheData.find(item => item.id === id));
    });
  }
  timer && clearTimeout(timer);
  return new Promise((resolve, reject) => {
    requestList.push({ id: id, resolve: resolve, reject: reject });
    timer = setTimeout(() => {
      if (requestList.length === 1) {
        // should call fetch in real time
        if (id === 1) {
          console.log(1);
          cacheData = [...cacheData, mockUser1];
          resolve(mockUser1);
        } else {
          console.log(2);
          cacheData = [...cacheData, mockUser2];
          resolve(mockUser2);
        }
        requestList = [];
      } else {
        getUserByIds(requestList.map(item => item.id))
          .then(data => {
            requestList.forEach(({ resolve, id }) => {
              resolve(data.find(item => item.id === id));
            });
            requestList = [];
          })
          .catch(error => {
            requestList.forEach(requestItem => requestItem.reject(error));
          });
      }
    }, 100);
  });
}

getUserById(1).then(data => console.log(data));
getUserById(2).then(data => console.log(data));
