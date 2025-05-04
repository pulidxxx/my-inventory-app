import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeToggle } from "./ThemeToggle";

// Mock de localStorage
const mockLocalStorage = (() => {
    let store: Record<string, string> = {};

    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
            store[key] = value.toString();
        },
        clear: () => {
            store = {};
        },
    };
})();

// Mock de document.body.setAttribute
const mockSetAttribute = jest.fn();

beforeAll(() => {
    Object.defineProperty(window, "localStorage", {
        value: mockLocalStorage,
    });

    Object.defineProperty(document.body, "setAttribute", {
        value: mockSetAttribute,
    });
});

beforeEach(() => {
    // Limpiar mocks antes de cada prueba
    mockLocalStorage.clear();
    mockSetAttribute.mockClear();
});

describe("ThemeToggle Component", () => {
    it("renders correctly with light mode as default when no theme is set", () => {
        render(<ThemeToggle />);

        const toggle = screen.getByRole("checkbox");
        expect(toggle).not.toBeChecked();
        expect(screen.getByText("Modo claro")).toBeInTheDocument();
    });

    it("renders in dark mode when localStorage has 'dark' theme", () => {
        mockLocalStorage.setItem("theme", "dark");
        render(<ThemeToggle />);

        const toggle = screen.getByRole("checkbox");
        expect(toggle).toBeChecked();
        expect(screen.getByText("Modo oscuro")).toBeInTheDocument();
    });

    it("toggles between light and dark mode when clicked", async () => {
        render(<ThemeToggle />);
        const toggle = screen.getByRole("checkbox");

        // De light a dark
        await userEvent.click(toggle);
        expect(toggle).toBeChecked();
        expect(screen.getByText("Modo oscuro")).toBeInTheDocument();
        expect(mockLocalStorage.getItem("theme")).toBe("dark");
        expect(mockSetAttribute).toHaveBeenCalledWith("data-theme", "dark");

        // De dark a light
        await userEvent.click(toggle);
        expect(toggle).not.toBeChecked();
        expect(screen.getByText("Modo claro")).toBeInTheDocument();
        expect(mockLocalStorage.getItem("theme")).toBe("light");
        expect(mockSetAttribute).toHaveBeenCalledWith("data-theme", "light");
    });

    it("updates document body attribute on mount", () => {
        mockLocalStorage.setItem("theme", "dark");
        render(<ThemeToggle />);
        expect(mockSetAttribute).toHaveBeenCalledWith("data-theme", "dark");
    });

    it("initializes with light mode if localStorage has invalid value", () => {
        mockLocalStorage.setItem("theme", "invalid");
        render(<ThemeToggle />);

        const toggle = screen.getByRole("checkbox");
        expect(toggle).not.toBeChecked();
        expect(screen.getByText("Modo claro")).toBeInTheDocument();
    });

    it("matches snapshot in light mode", () => {
        const { asFragment } = render(<ThemeToggle />);
        expect(asFragment()).toMatchSnapshot();
    });

    it("matches snapshot in dark mode", () => {
        mockLocalStorage.setItem("theme", "dark");
        const { asFragment } = render(<ThemeToggle />);
        expect(asFragment()).toMatchSnapshot();
    });
});
