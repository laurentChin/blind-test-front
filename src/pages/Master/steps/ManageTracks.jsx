import React, { useContext, useEffect, useState } from "react";
import { Search } from "../../../components/Search";
import { SpotifyContext } from "../../../contexts/Spotify";
import PropTypes from "prop-types";

const ManageTracks = ({ playlistId }) => {
  const spotifyContext = useContext(SpotifyContext);

  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    spotifyContext.getTracks(playlistId).then((tracks) => setTracks(tracks));
  }, [playlistId, spotifyContext]);

  const removeTrack = (uri) => {
    spotifyContext.removeTrack(uri).then(() => {
      spotifyContext.getTracks(playlistId).then((tracks) => setTracks(tracks));
    });
  };

  return (
    <div className="Step Manage-Tracks">
      {tracks.map((track) => (
        <div key={track.id}>
          {track.name}{" "}
          <button onClick={() => removeTrack(track.uri)}>Remove</button>
        </div>
      ))}
      <Search
        excludedTracks={tracks}
        addTrackCallback={() =>
          spotifyContext
            .getTracks(playlistId)
            .then((tracks) => setTracks(tracks))
        }
      />
    </div>
  );
};

ManageTracks.propTypes = {
  playlistId: PropTypes.string.isRequired,
};

export { ManageTracks };
