import React, { useContext, useEffect, useState } from "react";

import { SpotifyContext } from "../../contexts/Spotify";

const Master = () => {
  const spotifyContext = useContext(SpotifyContext);

  const [isAuthenticated, setIsAuthenticated] = useState(
    spotifyContext.isAuthenticated
  );
  const [sessionName, setSessionName] = useState("");
  const [playlistId, setPlaylistId] = useState("");
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    const [, code] =
      spotifyContext.SPOTIFY_CODE_PARAM.exec(window.location) || [];

    if (!isAuthenticated && !code) {
      window.location = spotifyContext.startTokenRequestUri;
    }

    if (code || spotifyContext.hasAuthExpired()) {
      spotifyContext.getAccessToken(code).then(() => {
        window.history.pushState(
          {},
          document.title,
          spotifyContext.redirectUri
        );
        setIsAuthenticated(true);
      });
    }
  }, []);

  useEffect(() => {
    spotifyContext.getPlaylists().then((playlists) => setPlaylists(playlists));
  }, [isAuthenticated]);

  const createPlaylist = () => {
    spotifyContext
      .createPlaylist(sessionName)
      .then(({ id }) => setPlaylistId(id));
  };

  const selectPlaylist = (id) => {
    setPlaylistId(id);
    spotifyContext.setCurrentPlaylist(id);
  };

  return (
    <div>
      <p>New session</p>
      <div className="Step Create-Or-Select-Playlist">
        <div className="Create-Playlist">
          <span>Create a new playlist :</span>
          <input
            type="text"
            value={sessionName}
            onChange={({ currentTarget: { value } }) => setSessionName(value)}
          />
          <button onClick={createPlaylist}>Create the playlist</button>
        </div>
        <div className="Select-Playlist">
          <span>Choose an existing playlist :</span>
          {playlists.map((playlist) =>
            playlist.id === playlistId ? (
              <span key={playlist.id}>{playlist.name}</span>
            ) : (
              <button
                key={playlist.id}
                onClick={() => selectPlaylist(playlist.id)}
              >
                {playlist.name}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export { Master };
