/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, act } from "@testing-library/react";
import io from "socket.io-client";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("qrcode");

import { Board } from "./Board";

describe("<Board />", () => {
  it("should display the list of challengers with theirs name and score sorted by score", async () => {
    const { getByText, queryByText, container } = render(
      <Router>
        <Board />
      </Router>
    );

    expect(queryByText("name1 | 1")).toBeFalsy();
    expect(queryByText("name2 | 3")).toBeFalsy();

    await act(async () => {
      io().emit("challengersUpdate", [
        { uuid: "qwewrw-1232553", name: "name1", score: 1 },
        { uuid: "wuefgeew-82687234", name: "name2", score: 3 },
      ]);

      await process.nextTick(() => {});

      expect(getByText("name1 | 1")).toBeTruthy();
      expect(getByText("name2 | 3")).toBeTruthy();

      const challengers = container.querySelectorAll(".challenger-list span");
      expect(challengers[0].textContent).toEqual("name2 | 3");
      expect(challengers[1].textContent).toEqual("name1 | 1");
    });
  });

  it("should display the current active challengers", async () => {
    const { container } = render(
      <Router>
        <Board />
      </Router>
    );

    await act(async () => {
      io().emit("challengersUpdate", [
        { uuid: "qwewrw-1232553", name: "currentChallenger", score: 1 },
        { uuid: "wuefgeew-82687234", name: "name2", score: 3 },
      ]);

      io().emit("lockChallenge", "qwewrw-1232553");

      await process.nextTick(() => {});

      expect(
        container.querySelector(".current-challenger").textContent
      ).toEqual("currentChallenger");
    });
  });

  it("should display the track info in case of success active challengers", async () => {
    const { getByText, queryByText, rerender } = render(
      <Router>
        <Board />
      </Router>
    );

    await act(async () => {
      io().emit("challengeResult", {
        track: { name: "Hallelujah", artists: "Jeff Buckley" },
        score: 1,
      });

      await process.nextTick(() => {});

      expect(getByText("Hallelujah")).toBeTruthy();
      expect(getByText("Jeff Buckley")).toBeTruthy();
    });

    await act(async () => {
      io().emit("challengeResult", {
        track: { name: "Hallelujah", artists: "Jeff Buckley" },
        score: 0,
      });

      rerender(
        <Router>
          <Board />
        </Router>
      );

      await process.nextTick(() => {});

      expect(queryByText("Hallelujah")).toBeFalsy();
      expect(queryByText("Jeff Buckley")).toBeFalsy();
    });
  });
});
