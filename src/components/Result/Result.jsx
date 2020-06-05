import React, { useContext } from "react";
import PropTypes from "prop-types";

import "./Result.css";
import { SpotifyContext } from "../../contexts/Spotify";

const Result = ({ uri, name, artists, preview, addTrackCallback }) => {
  const spotifyContext = useContext(SpotifyContext);
  const addToPlaylist = () => {
    spotifyContext.addTrack(uri).then(() => {
      addTrackCallback();
    });
  };
  return (
    <div className="Result">
      <span>
        {name} | {artists.map((artist) => artist.name).join(", ")}
      </span>
      {preview && <audio controls src={preview} />}
      <button onClick={addToPlaylist}>Add</button>
    </div>
  );
};

Result.propTypes = {
  uri: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  artists: PropTypes.array.isRequired,
  addTrackCallback: PropTypes.func.isRequired,
  preview: PropTypes.string,
};

export { Result };
