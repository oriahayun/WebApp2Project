export const isObjEmpty = (obj) => Object.keys(obj).length === 0;

export const getToken = () => {
    return localStorage.getItem('accessToken');
}

export const removeToken = () => {
    localStorage.removeItem('accessToken');
}
export const setToken = (val) => {
    localStorage.setItem('accessToken', val);
}