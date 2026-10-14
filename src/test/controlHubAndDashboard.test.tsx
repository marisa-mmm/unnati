import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react";
import HomeControlHubDashboard from "@/components/HomeControlHubDashboard";

describe("UNNATI Control Hub & Home Dashboard Tests", () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it("renders Instant Forensic Claim Search and KPI metrics", () => {
    const handleSearch = vi.fn();
    const handleSelectTool = vi.fn();

    const root = createRoot(container);
    act(() => {
      root.render(
        <HomeControlHubDashboard
          onSearch={handleSearch}
          onSelectTool={handleSelectTool}
        />
      );
    });

    expect(container.textContent).toContain("Instant Forensic Claim Search");
    expect(container.textContent).toContain("ALL 6 ENGINES OPERATIONAL");
    expect(container.textContent).toContain("Rumors Scanned");
    expect(container.textContent).toContain("Bot Flag Rate");
  });

  it("submits claim when trending topic pill is clicked", () => {
    const handleSearch = vi.fn();
    const handleSelectTool = vi.fn();

    const root = createRoot(container);
    act(() => {
      root.render(
        <HomeControlHubDashboard
          onSearch={handleSearch}
          onSelectTool={handleSelectTool}
        />
      );
    });

    const rbiButton = Array.from(container.querySelectorAll("button")).find((b) =>
      b.textContent?.includes("RBI 2000 Note Ban Circular")
    );
    expect(rbiButton).toBeDefined();

    act(() => {
      rbiButton?.click();
    });

    expect(handleSearch).toHaveBeenCalledWith("RBI 2000 Note Ban Circular");
  });

  it("calls onSelectTool when specialized forensic engine button is clicked", () => {
    const handleSearch = vi.fn();
    const handleSelectTool = vi.fn();

    const root = createRoot(container);
    act(() => {
      root.render(
        <HomeControlHubDashboard
          onSearch={handleSearch}
          onSelectTool={handleSelectTool}
        />
      );
    });

    const deepfakeButton = Array.from(container.querySelectorAll("button")).find((b) =>
      b.textContent?.includes("Deepfake Forensics")
    );
    expect(deepfakeButton).toBeDefined();

    act(() => {
      deepfakeButton?.click();
    });

    expect(handleSelectTool).toHaveBeenCalledWith("deepfake");
  });

  it("submits search form with typed query", () => {
    const handleSearch = vi.fn();
    const handleSelectTool = vi.fn();

    const root = createRoot(container);
    act(() => {
      root.render(
        <HomeControlHubDashboard
          onSearch={handleSearch}
          onSelectTool={handleSelectTool}
        />
      );
    });

    const input = container.querySelector("input") as HTMLInputElement;
    expect(input).toBeDefined();

    act(() => {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value"
      )?.set;
      nativeInputValueSetter?.call(input, "AI deepfake voice call scam");
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
    });

    act(() => {
      const form = container.querySelector("form");
      form?.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    });

    expect(handleSearch).toHaveBeenCalledWith("AI deepfake voice call scam");
  });
});
