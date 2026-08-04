const REDIRECT_KEY = "redirectAfterAuth";

export const saveRedirect = (url) => {
    sessionStorage.setItem(REDIRECT_KEY, url);
};

export const redirectAfterAuth = (navigate) => {
    const url = sessionStorage.getItem(REDIRECT_KEY) || "/";

    sessionStorage.removeItem(REDIRECT_KEY);

    navigate(url, { replace: true });
};  