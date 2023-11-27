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

export const getUserData = () => {
    return localStorage.getItem('userData');
}

export const removeUserData = () => {
    localStorage.removeItem('userData');
}
export const setUserData = (val) => {
    localStorage.setItem('userData', val);
}

export const paginationRowsPerPageOptions = () => {
    return [15, 30, 50, 100];
};
