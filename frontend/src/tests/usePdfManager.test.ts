import { renderHook, act } from "@testing-library/react";
import { usePdfManager } from "../hooks/usePdfManager";
import { api } from "../api/myApi";

jest.mock("../api/myApi", () => ({
  api: {
    getPdfPages: jest.fn(),
    cleanUpTempFiles: jest.fn(),
  },
}));

describe("usePdfManager Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with an empty pages array", () => {
    const { result } = renderHook(() => usePdfManager());
    expect(result.current.pages).toEqual([]);
  });

  it("should fetch and update pages on upload success", async () => {
    const mockPages = [{ page_id: "1", checked: false }];
    (api.getPdfPages as jest.Mock).mockResolvedValue({ data: mockPages });

    const { result } = renderHook(() => usePdfManager());

    await act(async () => {
      await result.current.handleUploadSuccess("file123");
    });

    expect(api.getPdfPages).toHaveBeenCalledWith("file123");
    expect(result.current.pages).toEqual(mockPages);
  });

  it("should update the checked status of a page", async () => {
    const mockPages = [{ page_id: "1", checked: false }];
    (api.getPdfPages as jest.Mock).mockResolvedValue({ data: mockPages });

    const { result } = renderHook(() => usePdfManager());

    await act(async () => {
      await result.current.handleUploadSuccess("file123");
    });

    act(() => {
      result.current.handleCheckboxChange("1", true);
    });

    expect(result.current.pages[0].checked).toBe(true);
  });

  it("should reorder pages when inserting a page", async () => {
    const { result } = renderHook(() => usePdfManager());

    const initialPages = [
      { page_id: "1", checked: false },
      { page_id: "2", checked: false },
      { page_id: "3", checked: false },
    ];

    (api.getPdfPages as jest.Mock).mockResolvedValue({ data: initialPages });

    await act(async () => {
      await result.current.handleUploadSuccess("dummyFileId");
    });

    act(() => {
      result.current.handleInsertPage("3", "1");
    });

    expect(result.current.pages.map((p) => p.page_id)).toEqual(["3", "1", "2"]);
  });

  it("should fetch and update pages on upload success", async () => {
    const mockPages = [{ page_id: "1", checked: false }];
    (api.getPdfPages as jest.Mock).mockResolvedValue({ data: mockPages });

    const { result } = renderHook(() => usePdfManager());

    await act(async () => {
      await result.current.handleUploadSuccess("file123");
    });

    expect(api.getPdfPages).toHaveBeenCalledWith("file123");
    expect(result.current.pages).toEqual(mockPages);
  });
});
