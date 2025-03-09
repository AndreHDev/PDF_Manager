import { renderHook, act } from "@testing-library/react";
import { useDragAndDrop } from "../hooks/useDragAndDrop";

jest.mock("../utils/logger");

describe("useDragAndDrop Hook", () => {
  let insertPageMock: jest.Mock;

  beforeEach(() => {
    insertPageMock = jest.fn();
    jest.clearAllMocks();
  });

  it("should set targetPageId on handleDragOver", () => {
    const { result } = renderHook(() => useDragAndDrop(insertPageMock));

    const event = {
      preventDefault: jest.fn(),
    } as unknown as React.DragEvent<HTMLDivElement>;

    act(() => {
      result.current.handleDragOver(event, "targetPageId");
    });

    expect(event.preventDefault).toHaveBeenCalled();
    expect(result.current.targetPageId).toBe("targetPageId");
  });

  it("should prevent default behavior on handleDragOver", () => {
    const { result } = renderHook(() => useDragAndDrop(insertPageMock));

    const event = {
      preventDefault: jest.fn(),
    } as unknown as React.DragEvent<HTMLDivElement>;

    act(() => {
      result.current.handleDragOver(event, "targetPageId");
    });

    expect(event.preventDefault).toHaveBeenCalled();
  });

  it("should not call insertPage if draggedPage is null on handleDrop", () => {
    const { result } = renderHook(() => useDragAndDrop(insertPageMock));

    const event = {
      preventDefault: jest.fn(),
      target: {
        closest: jest.fn().mockReturnValue({ getAttribute: () => "targetPageId" }),
      },
    } as unknown as React.DragEvent<HTMLDivElement>;

    act(() => {
      result.current.handleDrop(event);
    });

    expect(event.preventDefault).toHaveBeenCalled();
    expect(insertPageMock).not.toHaveBeenCalled();
  });

  it("should not call insertPage if targetElement is null on handleDrop", () => {
    const { result } = renderHook(() => useDragAndDrop(insertPageMock));

    const event = {
      preventDefault: jest.fn(),
      target: {
        closest: jest.fn().mockReturnValue(null),
      },
    } as unknown as React.DragEvent<HTMLDivElement>;

    act(() => {
      result.current.handleDragStart(event, "draggedPageId");
      result.current.handleDrop(event);
    });

    expect(event.preventDefault).toHaveBeenCalled();
    expect(insertPageMock).not.toHaveBeenCalled();
  });

  it("should not call insertPage if draggedPageId equals targetPageId on handleDrop", () => {
    const { result } = renderHook(() => useDragAndDrop(insertPageMock));

    const event = {
      preventDefault: jest.fn(),
      target: {
        closest: jest.fn().mockReturnValue({ getAttribute: () => "draggedPageId" }),
      },
    } as unknown as React.DragEvent<HTMLDivElement>;

    act(() => {
      result.current.handleDragStart(event, "draggedPageId");
      result.current.handleDragOver(event, "draggedPageId");
      result.current.handleDrop(event);
    });

    expect(event.preventDefault).toHaveBeenCalled();
    expect(insertPageMock).not.toHaveBeenCalled();
  });
});
