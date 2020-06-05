import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { v4 } from "uuid";

import io from "socket.io-client";

const socket = io(process.env.REACT_APP_SOCKET_URI);

let challengersUpdateHandler = () => {};
let challengerReleaseHandler = () => {};
let lockChallengeHandler = () => {};
let availableColorsUpdateHandler = () => {};

socket.on("challengersUpdate", (msg) => challengersUpdateHandler(msg));

socket.on("challengerRelease", (msg) => challengerReleaseHandler(msg));

socket.on("lockChallenge", (msg) => lockChallengeHandler(msg));

socket.on("availableColorsUpdate", (msg) => availableColorsUpdateHandler(msg));

const Session = () => {
  const persistedSessionUuid = sessionStorage.getItem("sessionUuid");
  const { uuid } = useParams();
  const [name, setName] = useState("");
  const [challengers, setChallengers] = useState([]);
  const [inWaitingRoom, setInWaitingRoom] = useState(false);
  const [isChallengeLocked, setChallengeLock] = useState(false);
  const [challengerUuid, setChallengerUuid] = useState("");
  const [playerUuid, setPlayerUuid] = useState(
    persistedSessionUuid === uuid
      ? sessionStorage.getItem("playerUuid") || "-"
      : "-"
  );
  const [inSession, setInSession] = useState(
    playerUuid !== "-" && persistedSessionUuid === uuid
  );
  const [colors, setColors] = useState([]);
  const [playerColor, setPlayerColor] = useState(null);

  challengersUpdateHandler = setChallengers;
  availableColorsUpdateHandler = setColors;

  useEffect(() => {
    if (persistedSessionUuid && persistedSessionUuid !== uuid) {
      setInSession(false);
    }
  }, [uuid, persistedSessionUuid]);

  useEffect(() => {
    if (inSession && challengers.length === 0) {
      socket.emit("join", { sessionUuid: uuid });
    }
  }, [inSession, challengers, uuid]);

  useEffect(() => {
    if (!inSession && !inWaitingRoom) {
      socket.emit("joinWaitingRoom", uuid, (response) => {
        setChallengers(response.challengers);
        setColors(response.colors);
      });
      setInWaitingRoom(true);
    }
  }, [challengers, inSession, inWaitingRoom, uuid]);

  useEffect(() => {
    if (name !== "" && playerColor) {
      setPlayerUuid(v4());
    }
    if (name === "") {
      setPlayerUuid("-");
    }
  }, [name, playerColor]);

  const joinSession = () => {
    if (playerUuid === "-") return;
    sessionStorage.setItem("playerUuid", playerUuid);
    sessionStorage.setItem("sessionUuid", uuid);
    socket.emit("join", {
      sessionUuid: uuid,
      player: { name, uuid: playerUuid, color: playerColor },
    });

    setInSession(true);
  };

  const challenge = () => {
    socket.emit("challenge", { sessionUuid: uuid, playerUuid });
  };

  lockChallengeHandler = (msg) => {
    setChallengeLock(true);
    setChallengerUuid(msg);
  };

  challengerReleaseHandler = (msg) => {
    setChallengeLock(false);
    setChallengerUuid("");
    setChallengers(msg);
  };

  return (
    <div>
      {!inSession && (
        <div className="Join-Session-Form">
          <input
            type="text"
            value={name}
            onChange={({ currentTarget }) => setName(currentTarget.value)}
            onKeyUp={({ keyCode }) => {
              if (keyCode === 13) joinSession();
            }}
          />
          {colors.length > 0 &&
            colors.map((color) => (
              <button
                onClick={() => setPlayerColor(color)}
                key={color}
                style={{ backgroundColor: color }}
              >
                &nbsp;
              </button>
            ))}
          {challengers.length > 0 && (
            <select
              onChange={({ target: { value } }) => {
                setPlayerUuid(value);
              }}
              defaultValue={"-"}
            >
              <option value="-">-</option>
              {challengers.map((challenger) => (
                <option key={challenger.uuid} value={challenger.uuid}>
                  {challenger.name}
                </option>
              ))}
            </select>
          )}
          {playerUuid !== "-" && (
            <button onClick={() => joinSession()}>Join</button>
          )}
        </div>
      )}
      {inSession && !isChallengeLocked && (
        <button onClick={challenge}>Challenge</button>
      )}
      <div>
        {challengers.map((challenger) => (
          <span
            key={challenger.uuid}
            className={challengerUuid === challenger.uuid ? "challenger" : ""}
          >
            {challenger.name} | {challenger.score}
          </span>
        ))}
      </div>
    </div>
  );
};

export { Session };
