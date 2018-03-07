let set= function(key, data) {
  return window.localStorage.setItem(key, window.JSON.stringify(data));
};
let set_s= function(key, data) {
  return window.sessionStorage.setItem(key, window.JSON.stringify(data));
};
let get= function(key) {
  return window.JSON.parse(window.localStorage.getItem(key));
};
let get_s= function(key) {
  return window.JSON.parse(window.sessionStorage.getItem(key));
};
let remove= function(key) {
  return window.localStorage.removeItem(key);
};
let remove_s= function(key) {
  return window.sessionStorage.removeItem(key);
};

export default { set,get,remove,set_s,get_s,remove_s}
