import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FilesClient from "../app/files/FilesClient";
import { ExtractedData } from "../app/types";

const mockFile: ExtractedData = {
  fileName: "Test Product.pdf",
  productName: "Test Product",
  ingredients: [
    {
      name: "Water",
      casNumber: "7732-18-5",
      concentration: "50%",
    },
  ],
  hazardClasses: ["Acute Tox. 4"],
  hStatements: ["H302: Harmful if swallowed."],
  pStatements: ["P301+P312: IF SWALLOWED: Call a POISON CENTER."],
};

describe("FilesClient Component", () => {
  const mockOnFilesChange = jest.fn();

  beforeEach(() => {
    mockOnFilesChange.mockClear();
  });

  it("renders empty state when no files", () => {
    render(
      <FilesClient files={[]} onFilesChange={mockOnFilesChange} />
    );
    expect(screen.getByText("Még nincsenek feltöltött fájlok")).toBeInTheDocument();
    expect(screen.getByText("Első fájl feltöltése")).toBeInTheDocument();
  });

  it("renders file list when files are provided", () => {
    const files = [
      {
        id: "1",
        fileName: mockFile.fileName,
        uploadDate: new Date().toISOString(),
        data: mockFile,
      },
    ];

    render(
      <FilesClient files={files} onFilesChange={mockOnFilesChange} />
    );

    expect(screen.getByText("Test Product.pdf")).toBeInTheDocument();
    expect(screen.getByText("Test Product")).toBeInTheDocument();
  });

  it("expands file details when clicked", async () => {
    const files = [
      {
        id: "1",
        fileName: mockFile.fileName,
        uploadDate: new Date().toISOString(),
        data: mockFile,
      },
    ];

    render(
      <FilesClient files={files} onFilesChange={mockOnFilesChange} />
    );

    // Click to expand
    const fileHeader = screen.getByText("Test Product.pdf").closest("div").parentElement.parentElement;
    fireEvent.click(fileHeader);

    // Check if details are shown
    await waitFor(() => {
      expect(screen.getByText("Terméknév")).toBeInTheDocument();
      expect(screen.getByText("Water")).toBeInTheDocument();
    });
  });

  it("shows ingredients information", async () => {
    const files = [
      {
        id: "1",
        fileName: mockFile.fileName,
        uploadDate: new Date().toISOString(),
        data: mockFile,
      },
    ];

    render(
      <FilesClient files={files} onFilesChange={mockOnFilesChange} />
    );

    // Expand the file
    fireEvent.click(screen.getByText("Test Product.pdf").closest("div").parentElement.parentElement);

    await waitFor(() => {
      expect(screen.getByText(/Összetevők/)).toBeInTheDocument();
      expect(screen.getByText("Water")).toBeInTheDocument();
      expect(screen.getByText(/7732-18-5/)).toBeInTheDocument();
    });
  });
});
