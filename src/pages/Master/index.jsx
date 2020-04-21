import React, { useEffect } from "react";

const SPOTIFY_CODE_PARAM = /\?code=(.+)/;

const Master = () => {
  useEffect(() => {
    const [, code] = SPOTIFY_CODE_PARAM.exec(window.location) || [];
    const spotifyTokenList =
      JSON.parse(sessionStorage.getItem("spotifyTokenList")) || {};

    const redirectUri = `${window.location.origin}${window.location.pathname}`;

    if (!spotifyTokenList.accessToken && !code) {
      window.location = `${
        process.env.REACT_APP_SPOTIFY_AUTHORIZE_ENDPOINT
      }?client_id=${
        process.env.REACT_APP_SPOTIFY_CLIENT_ID
      }&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}`;
    }

    if (
      code ||
      (spotifyTokenList.expiresAt &&
        spotifyTokenList.expiresAt < new Date().getTime())
    ) {
      fetch(process.env.REACT_APP_SPOTIFY_TOKEN_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          redirectUri: encodeURIComponent(redirectUri),
          code: code,
          refreshToken: spotifyTokenList.refreshToken,
        }),
      })
        .then((response) => response.json())
        .then(({ access_token, refresh_token, expires_in }) => {
          window.history.pushState({}, document.title, redirectUri);
          sessionStorage.setItem(
            "spotifyTokenList",
            JSON.stringify({
              accessToken: access_token,
              refreshToken: refresh_token || spotifyTokenList.refreshToken,
              expiresAt: new Date().getTime() + expires_in * 1000,
            })
          );
        })
        .finally();
    }
  }, []);
  return (
    <div>
      <p>New session</p>
    </div>
  );
};

export { Master };
