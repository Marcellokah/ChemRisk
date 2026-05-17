/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ResultsClient from "../app/results/ResultsClient";
import * as XLSX from "xlsx-js-style";

// Mock the xlsx library
jest.mock("xlsx-js-style", () => ({
  utils: {
    json_to_sheet: jest.fn(() => ({})),
    book_new: jest.fn(() => ({})),
    book_append_sheet: jest.fn(),
  },
  writeFile: jest.fn(),
}));

describe("ResultsClient Component", () => {
  const mockDataList = [{
    fileName: "test.pdf",
    productName: "Test Product",
    ingredients: [{ name: "Test Ing", casNumber: "123-45-6", concentration: "10%" }],
    hazardClasses: ["Class 1"],
    hStatements: ["H100: Test hazard"],
    pStatements: ["P100: Test precaution"],
  }];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Rendereli az export gombot", () => {
    render(<ResultsClient dataList={mockDataList} />);
    expect(screen.getByText("Exportálás Excel-be")).toBeInTheDocument();
  });

  test("Meghívja a writeFileXLSX függvényt a gombnyomásra", () => {
    render(<ResultsClient dataList={mockDataList} />);
    
    const button = screen.getByText("Exportálás Excel-be");
    fireEvent.click(button);

    expect(XLSX.writeFile).toHaveBeenCalled();
  });

  test("Az export a kötött oszlopmappinget használja és az emberi mezőket üresen hagyja", () => {
    render(<ResultsClient dataList={mockDataList} />);

    const button = screen.getByText("Exportálás Excel-be");
    fireEvent.click(button);

    const jsonToSheetMock = XLSX.utils.json_to_sheet as jest.Mock;
    const firstRow = jsonToSheetMock.mock.calls[0][0][0];

    expect(firstRow["Anyag / keverék neve"]).toBe("Test Product");
    expect(firstRow["Veszélyes összetevők - CAS szám"]).toBe("123-45-6");
    expect(firstRow["H mondat"]).toBe("100");
    expect(firstRow["P mondat"]).toBe("100");
    expect(firstRow["Exponált munkavállalók száma"]).toBe("");
    expect(firstRow["Kockázati szint elfogadható?"]).toBe("");
  });
});
