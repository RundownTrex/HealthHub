import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { StyleSheet } from "react-native";
import colors from "../../utils/colors";

function BackIcon(props) {
  return (
    <Svg
      width={20}
      height={20}
      viewBox="0 0 9 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M7.386 14.253a.462.462 0 00.619-.687L1.353 7.55c-.172-.155-.172-.378 0-.533l6.652-5.81a.48.48 0 00.051-.652.48.48 0 00-.653-.052L.751 6.33a1.257 1.257 0 00-.017 1.908l6.652 6.015z"
        fill = {colors.whitetext}
      />
    </Svg>
  );
}

export default BackIcon;
