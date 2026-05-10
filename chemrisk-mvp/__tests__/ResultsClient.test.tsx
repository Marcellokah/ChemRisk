/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ResultsClient from "../app/results/ResultsClient";

describe("ResultsClient Component", () => {
  const mockData = {
    productName: "Test Product",
    ingredients: [{ name: "Test Ing", casNumber: "123-45-6", concentration: "10%" }],
    hazardClasses: ["Class 1"],
    hStatements: ["H100: Test hazard"],
    pStatements: ["P100: Test precaution"],
  };

  test("Rendereli az export gombot", () => {
    render(<ResultsClient data={mockData} />);
    expect(screen.getByText("Exportálás CSV-be")).toBeInTheDocument();
  });

  test("URL object lifecycle a CSV letöltésnél", () => {
    const createObjectURLMock = jest.fn();
    const revokeObjectURLMock = jest.fn();

    // Mock global URL
    global.URL.createObjectURL = createObjectURLMock;
    global.URL.revokeObjectURL = revokeObjectURLMock;

    render(<ResultsClient data={mockData} />);
    
    const button = screen.getByText("Exportálás CSV-be");
    fireEvent.click(button);

    expect(createObjectURLMock).toHaveBeenCalled();
    expect(revokeObjectURLMock).toHaveBeenCalled();
  });
});
