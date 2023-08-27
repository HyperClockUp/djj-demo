import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./index.module.scss";

// 一个组件，用于框选，并且移动
const DragRect = () => {
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [endPosition, setEndPosition] = useState({ x: 0, y: 0 });
  const isDrawing = useRef(false);
  const isMoving = useRef(false);
  // 处理锚点拖拽
  const isAnchorMoving = useRef(false);
  // 记录当前被拖拽的锚点
  const [currentAnchor, setCurrentAnchor] = useState<
    "topLeft" | "topRight" | "bottomLeft" | "bottomRight"
  >("topLeft");
  // 处理框选拖动
  // 记录鼠标按下时的位置
  const mouseDownPosition = useRef({ x: 0, y: 0 });
  // 记录鼠标按下时的框选位置
  const mouseDownRectPosition = useRef({ x: 0, y: 0 });
  // 记录鼠标按下时的框选大小
  const mouseDownRectSize = useRef({ width: 0, height: 0 });

  // 处理框选拖动
  const handleRectMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // 开始移动
    isMoving.current = true;
    // 阻止冒泡
    e.stopPropagation();
    // 记录鼠标按下时的位置
    mouseDownPosition.current = { x: e.clientX, y: e.clientY };
    // 记录鼠标按下时的框选位置
    mouseDownRectPosition.current = { x: startPosition.x, y: startPosition.y };
    // 记录鼠标按下时的框选大小
    mouseDownRectSize.current = {
      width: endPosition.x - startPosition.x,
      height: endPosition.y - startPosition.y,
    };
  };

  // 处理框选拖动
  const handleRectMouseMove = useCallback((e: MouseEvent) => {
    if (!isMoving.current) return;
    // 计算移动距离
    const moveX = e.clientX - mouseDownPosition.current.x;
    const moveY = e.clientY - mouseDownPosition.current.y;
    // 设置框选位置
    setStartPosition({
      x: mouseDownRectPosition.current.x + moveX,
      y: mouseDownRectPosition.current.y + moveY,
    });
    setEndPosition({
      x:
        mouseDownRectPosition.current.x +
        mouseDownRectSize.current.width +
        moveX,
      y:
        mouseDownRectPosition.current.y +
        mouseDownRectSize.current.height +
        moveY,
    });
  }, []);

  // 处理框选拖动
  const handleRectMouseUp = useCallback((e: MouseEvent) => {
    // 结束移动
    isMoving.current = false;
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // 清空上一次绘制信息
    setStartPosition({ x: 0, y: 0 });
    setEndPosition({ x: 0, y: 0 });
    setTimeout(() => {
      // 开始绘制
      isDrawing.current = true;
      setStartPosition({ x: e.clientX, y: e.clientY });
    });
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (!isDrawing.current) return;
      // 处理框选过程中的起始点坐标大小问题
      if (e.clientX < startPosition.x) {
        setStartPosition({ x: e.clientX, y: startPosition.y });
      }
      if (e.clientY < startPosition.y) {
        setStartPosition({ x: startPosition.x, y: e.clientY });
      }
      setEndPosition({ x: e.clientX, y: e.clientY });
    },
    [startPosition.x, startPosition.y]
  );

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // 结束绘制
    isDrawing.current = false;
  };

  // 处理锚点的拖拽
  const handleAnchorMouseDown = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    // 阻止冒泡
    e.stopPropagation();
    // 开始移动
    isAnchorMoving.current = true;
  };

  // 锚点拖拽函数工厂
  const handleAnchorMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isAnchorMoving.current) return;
      switch (currentAnchor) {
        case "topLeft":
          setStartPosition({ x: e.clientX, y: e.clientY });
          break;
        case "topRight":
          setStartPosition({ x: startPosition.x, y: e.clientY });
          setEndPosition({ x: e.clientX, y: endPosition.y });
          break;
        case "bottomLeft":
          setStartPosition({ x: e.clientX, y: startPosition.y });
          setEndPosition({ x: endPosition.x, y: e.clientY });
          break;
        case "bottomRight":
          setEndPosition({ x: e.clientX, y: e.clientY });
          break;
      }
    },
    [
      currentAnchor,
      endPosition.x,
      endPosition.y,
      startPosition.x,
      startPosition.y,
    ]
  );

  // 锚点拖拽结束
  const handleAnchorMouseUp = useCallback((e: MouseEvent) => {
    // 结束移动
    isAnchorMoving.current = false;
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleAnchorMouseMove);
    window.addEventListener("mouseup", handleAnchorMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleAnchorMouseMove);
      window.removeEventListener("mouseup", handleAnchorMouseUp);
    };
  }, [handleAnchorMouseMove, handleAnchorMouseUp]);

  useEffect(() => {
    window.addEventListener("mousemove", handleRectMouseMove);
    window.addEventListener("mouseup", handleRectMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleRectMouseMove);
      window.removeEventListener("mouseup", handleRectMouseUp);
    };
  }, [handleRectMouseMove, handleRectMouseUp]);

  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        zIndex: 999,
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div
        className={styles.rect}
        style={{
          width: `${endPosition.x - startPosition.x}px`,
          height: `${endPosition.y - startPosition.y}px`,
          left: `${startPosition.x}px`,
          top: `${startPosition.y}px`,
        }}
        onMouseDown={handleRectMouseDown}
      />
      {/* 四个锚点 */}
      <div
        className={styles.anchor}
        draggable={false}
        style={{
          left: `${startPosition.x - 5}px`,
          top: `${startPosition.y - 5}px`,
          // 左上角手势
          cursor: "nw-resize",
        }}
        onMouseDown={(e) => {
          handleAnchorMouseDown(e);
          setCurrentAnchor("topLeft");
        }}
      />
      <div
        className={styles.anchor}
        draggable={false}
        style={{
          left: `${endPosition.x - 5}px`,
          top: `${endPosition.y - 5}px`,
          // 右下角手势
          cursor: "nw-resize",
        }}
        onMouseDown={(e) => {
          handleAnchorMouseDown(e);
          setCurrentAnchor("bottomRight");
        }}
      />
      <div
        className={styles.anchor}
        draggable={false}
        style={{
          left: `${startPosition.x - 5}px`,
          top: `${endPosition.y - 5}px`,
          // 左下角手势
          cursor: "ne-resize",
        }}
        onMouseDown={(e) => {
          handleAnchorMouseDown(e);
          setCurrentAnchor("bottomLeft");
        }}
      />
      <div
        className={styles.anchor}
        draggable={false}
        style={{
          left: `${endPosition.x - 5}px`,
          top: `${startPosition.y - 5}px`,
          zIndex: 999,
          // 右上角手势
          cursor: "ne-resize",
        }}
        onMouseDown={(e) => {
          handleAnchorMouseDown(e);
          setCurrentAnchor("topRight");
        }}
      />
    </div>
  );
};

export default DragRect;
