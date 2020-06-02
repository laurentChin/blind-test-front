import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { SpotifyContext } from "../../../contexts/Spotify";

const CreateOrSelectPlaylist = ({
  isAuthenticated,
  playlistId,
  setPlaylistId,
}) => {
  const spotifyContext = useContext(SpotifyContext);

  const [sessionName, setSessionName] = useState("");
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      spotifyContext
        .getPlaylists()
        .then((playlists) => setPlaylists(playlists));
    }
  }, [isAuthenticated, spotifyContext]);

  useEffect(() => {
    if (playlistId) {
      sessionStorage.setItem("playlistId", playlistId);
      spotifyContext.setCurrentPlaylist(playlistId);
    }
  }, [playlistId, spotifyContext]);

  const createPlaylist = () => {
    spotifyContext
      .createPlaylist(sessionName)
      .then(({ id }) => setPlaylistId(id));
  };

  return (
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
              onClick={() => setPlaylistId(playlist.id)}
            >
              {playlist.name}
            </button>
          )
        )}
      </div>
    </div>
  );
};

CreateOrSelectPlaylist.propTypes = {
  playlistId: PropTypes.string.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  setPlaylistId: PropTypes.func.isRequired,
};

export { CreateOrSelectPlaylist };
