"use client";
import React, { useState, useEffect } from "react";
import { isWindows, isMacOs } from "react-device-detect";

const DownloadComponent = (props) => {
  const [platform, setPlatform] = useState(null);

  useEffect(() => {
    if (isWindows) {
      setPlatform("windows");
    } else if (isMacOs) {
      setPlatform("mac");
    } else {
      setPlatform("unsupported");
    }
  }, []); // Runs only once after component mounts

  return (
    <div>
      {platform === "windows" && (
        <div>
          <div style={{ color: "black" }}>
            <i
              className="fa-brands fa-windows"
              style={{ paddingRight: "20px", color: "black" }}
            ></i>
           {props.name}
          </div>
        </div>
      )}
      {platform === "mac" && (
        <div>
          <div target="_blank" style={{ color: "black" }}>
            <i
              className="fa-brands fa-apple"
              style={{ paddingRight: "20px", color: "black" }}
            ></i>
            {props.name}
          </div>
        </div>
      )}
      {platform === "unsupported" && (
        <div>{props.name}</div>
      )}
    </div>
  );
};

export default DownloadComponent;
