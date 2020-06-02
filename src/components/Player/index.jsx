import React, { useContext, useEffect, useState } from "react";
import { SpotifyContext } from "../../contexts/Spotify";

const Player = () => {
  const { player, setPlayerStateChangeCb } = useContext(SpotifyContext);

  const [state, setState] = useState({});
  const [currentTrack, setCurrentTrack] = useState("");
  const [nextTrack, setNextTrack] = useState("");

  useEffect(() => {
    setPlayerStateChangeCb(setState);
  }, [setPlayerStateChangeCb, player]);

  useEffect(() => {
    if (state.track_window) {
      const { current_track, next_tracks } = state.track_window;
      setCurrentTrack(current_track);
      setNextTrack(next_tracks[0]);
    }
  }, [state]);

  return (
    <div>
      <span className="current-track">Current track : {currentTrack.name}</span>
      <span className="next-track">Next track : {nextTrack.name}</span>
      <button onClick={() => player.togglePlay()}>
        {state.paused ? "Play" : "Pause"}
      </button>
      {nextTrack && (
        <button onClick={() => player.nextTrack()}>Play next track</button>
      )}
    </div>
  );
};

export { Player };
