import React, { useContext, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import QRCodeGenerator from "qrcode";
import io from "socket.io-client";

import { Player } from "../../../components/Player/Player";
import { SpotifyContext } from "../../../contexts/Spotify";

const SPOTIFY_PLAYER_SRC = "https://sdk.scdn.co/spotify-player.js";
const script = document.createElement("script");
script.setAttribute("src", SPOTIFY_PLAYER_SRC);

let socket = io(process.env.REACT_APP_SOCKET_URI);
let challengersUpdateHandler = () => {};
let lockChallengeHandler = () => {};

socket.on("challengersUpdate", (msg) => challengersUpdateHandler(msg));

socket.on("lockChallenge", (msg) => lockChallengeHandler(msg));

socket.on("challengerRelease", (msg) => challengersUpdateHandler(msg));

const ManageSession = ({ sessionUuid }) => {
  const spotifyContext = useContext(SpotifyContext);

  const [isPlayerScriptLoaded, setPlayerScriptLoadedState] = useState(false);
  const [isPlayerReady, setPlayerReadyState] = useState(false);
  const [player, setPlayer] = useState({});
  const [challengers, setChallengers] = useState([]);
  const [challengerUuid, setChallengerUuid] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [hasSessionStart, setSessionStartStatus] = useState(false);

  challengersUpdateHandler = setChallengers;
  const qrCode = useRef();

  if (!document.querySelector(`[src="${SPOTIFY_PLAYER_SRC}"]`)) {
    document.head.appendChild(script);
  }
  script.onload = () => {
    setPlayerScriptLoadedState(true);
  };

  useEffect(() => {
    if (qrCode.current) {
      QRCodeGenerator.toCanvas(
        qrCode.current,
        `${window.origin}/session/${sessionUuid}`
      );
    }
  }, [qrCode, sessionUuid]);

  useEffect(() => {
    window.onSpotifyWebPlaybackSDKReady = () => {
      const spotifyPlayer = spotifyContext.setupPlayer((deviceId) => {
        setPlayerReadyState(true);
        setDeviceId(deviceId);
      });

      setPlayer(spotifyPlayer);

      socket.emit("join", { sessionUuid });
    };
  }, [spotifyContext, isPlayerScriptLoaded, sessionUuid]);

  lockChallengeHandler = (msg) => {
    player.pause();
    setChallengerUuid(msg);
  };

  const releaseChallenger = (score) => {
    player.getCurrentState().then((playerState) => {
      const { name, artists } = playerState.track_window.current_track;
      const track = {
        name,
        artists: artists
          .map((artist) => artist.name)
          .join(", ")
          .trim(),
      };
      socket.emit("setScore", {
        sessionUuid,
        score,
        track,
      });
      setChallengerUuid("");
      player.resume();
    });
  };

  const startNewChallenge = () => {
    socket.emit("startNewChallenge", sessionUuid);
  };

  const startSession = () => {
    spotifyContext
      .startPlayer(deviceId)
      .then(() => setSessionStartStatus(true));
  };

  return (
    <div className="Step Session-Step">
      <div className="controls-container">
        {!hasSessionStart && deviceId && (
          <button onClick={() => startSession()}>Start the session</button>
        )}
        {isPlayerReady && hasSessionStart && (
          <Player nextTrackCallback={startNewChallenge} />
        )}
        {hasSessionStart && challengerUuid && (
          <button onClick={() => releaseChallenger(0)}>Wrong</button>
        )}
        {hasSessionStart && challengerUuid && (
          <button onClick={() => releaseChallenger(0.5)}>Success .5pt</button>
        )}
        {hasSessionStart && challengerUuid && (
          <button onClick={() => releaseChallenger(1)}>Success 1pt</button>
        )}
      </div>
      <div className="challenger-list">
        {challengers
          .sort((a, b) => b.score - a.score)
          .map((challenger) => (
            <span
              key={challenger.uuid}
              className={challengerUuid === challenger.uuid ? "challenger" : ""}
            >
              {challenger.name}
            </span>
          ))}
      </div>
      <div className="QRCode">
        <canvas ref={qrCode} />
        <a
          href={`${window.origin}/board/${sessionUuid}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Open the board in a new Tab
        </a>
      </div>
    </div>
  );
};

ManageSession.propTypes = {
  sessionUuid: PropTypes.string.isRequired,
};

export { ManageSession };
