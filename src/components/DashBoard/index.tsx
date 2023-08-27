import DashBoardContext from "./context";
import defaultVideo from "../../assets/video/mmt.mp4";
import { useState } from "react";
import styles from "./index.module.scss";
import DragRect from "../DragRect";
import { Dropdown } from "antd";

const ServerList = {
  mouse: {
    name: "鼠标",
    id: "mouse",
    dropDown: Array.from({ length: 2 }).map((_, index) => ({
      id: `mouse${index + 1}`,
      name: `鼠标${index + 1}`,
      eventName: `mouse${index + 1}`,
    })),
  },
  keyboard: {
    name: "键盘",
    id: "keyboard",
    dropDown: Array.from({ length: 2 }).map((_, index) => ({
      id: `keyboard${index + 1}`,
      name: `键盘${index + 1}`,
      eventName: `keyboard${index + 1}`,
    })),
  },
  paint: {
    name: "画板",
    id: "paint",
    dropDown: Array.from({ length: 2 }).map((_, index) => ({
      id: `paint${index + 1}`,
      name: `画板${index + 1}`,
      eventName: `paint${index + 1}`,
    })),
  },
  other: {
    name: "其他",
    id: "other",
    dropDown: Array.from({ length: 2 }).map((_, index) => ({
      id: `other${index + 1}`,
      name: `其他${index + 1}`,
      eventName: `other${index + 1}`,
    })),
  },
  a: {
    name: "A",
    id: "a",
    dropDown: Array.from({ length: 2 }).map((_, index) => ({
      id: `a${index + 1}`,
      name: `A${index + 1}`,
      eventName: `a${index + 1}`,
    })),
  },
  b: {
    name: "B",
    id: "b",
    dropDown: Array.from({ length: 2 }).map((_, index) => ({
      id: `b${index + 1}`,
      name: `B${index + 1}`,
      eventName: `b${index + 1}`,
    })),
  },
  c: {
    name: "C",
    id: "c",
    dropDown: Array.from({ length: 2 }).map((_, index) => ({
      id: `c${index + 1}`,
      name: `C${index + 1}`,
      eventName: `c${index + 1}`,
    })),
  },
  d: {
    name: "D",
    id: "d",
    dropDown: Array.from({ length: 2 }).map((_, index) => ({
      id: `d${index + 1}`,
      name: `D${index + 1}`,
      eventName: `d${index + 1}`,
    })),
  },
};
const ServerConfig = [
  {
    title: "测试标题1",
    items: ["mouse", "keyboard", "paint", "other"],
  },
  {
    title: "测试标题2",
    items: ["a", "b", "c", "d"],
  },
];

const DashBoard = () => {
  const [activeContronIds, setActiveContronIds] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState<string>(defaultVideo);

  /**
   * 可以移出去封装处理
   * @param event 事件名称
   */
  const handleEvent = (event: string) => {
    switch (event) {
      case "mouse1": {
        alert("mouse1");
        break;
      }
      default: {
        alert("not implemented");
      }
    }
  };

  return (
    <DashBoardContext.Provider
      value={{
        activeContronIds,
        setActiveContronIds,
      }}
    >
      <DragRect />
      <div className={styles.panelContainer}>
        {ServerConfig.map((item) => {
          return (
            <>
              <p className={styles.panelTitle}>{item.title}</p>
              <ul className={styles.panel}>
                {item.items.map((item) => {
                  const currentItem =
                    ServerList[item as keyof typeof ServerList];
                  return (
                    <li
                      className={styles.panelItem}
                      key={item}
                      onClick={() => {
                        // 如果已经有了，就删除
                        if (activeContronIds.includes(item)) {
                          setActiveContronIds(
                            activeContronIds.filter((id) => id !== item)
                          );
                        }
                        // 如果没有，就添加
                        else {
                          setActiveContronIds([...activeContronIds, item]);
                        }
                      }}
                    >
                      {currentItem.name}
                    </li>
                  );
                })}
              </ul>
            </>
          );
        })}
      </div>
      <div className={styles.controlContainer}>
        {activeContronIds.map((item) => {
          const currentItem = ServerList[item as keyof typeof ServerList];
          return (
            <Dropdown
              menu={{
                items: currentItem.dropDown.map((item) => ({
                  key: item.eventName,
                  label: item.name,
                })),
                onClick: ({ key }) => {
                  handleEvent(key);
                },
              }}
            >
              <div className={styles.controlItem} key={item}>
                {currentItem.name}
              </div>
            </Dropdown>
          );
        })}
      </div>
      <video
        className={styles.bgVideo}
        src={videoUrl}
        autoPlay
        controls
        loop
        controlsList="nodownload nofullscreen"
      />
    </DashBoardContext.Provider>
  );
};

export default DashBoard;
