/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ResultsClient from "../app/results/ResultsClient";
import * as XLSX from "xlsx";

// Mock the xlsx library
jest.mock("xlsx", () => ({
  utils: {
    json_to_sheet: jest.fn(),
    book_new: jest.fn(() => ({})),
    book_append_sheet: jest.fn(),
  },
  writeFile: jest.fn(),
}));

describe("ResultsClient Component", () => {
  const mockData = {
    productName: "Test Product",
    ingredients: [{ name: "Test Ing", casNumber: "123-45-6", concentration: "10%" }],
    hazardClasses: ["Class 1"],
    hStatements: ["H100: Test hazard"],
    pStatements: ["P100: Test precaution"],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Rendereli az export gombot", () => {
    render(<ResultsClient data={mockData} />);
    expect(screen.getByText("Exportálás Excel-be")).toBeInTheDocument();
  });

  test("Meghívja a writeFileXLSX függvényt a gombnyomásra", () => {
    render(<ResultsClient data={mockData} />);
    
    const button = screen.getByText("Exportálás Excel-be");
    fireEvent.click(button);

    expect(XLSX.writeFile).toHaveBeenCalled();
  });
});
