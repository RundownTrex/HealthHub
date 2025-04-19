import * as React from "react";
import Svg, { Path } from "react-native-svg";
import colors from "../../utils/colors";

function RightArrow(props) {
  return (
    <Svg
      width={25}
      height={25}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M16.707 18.707a1 1 0 01-1.414-1.414L19.586 13H2a1 1 0 010-2h17.586l-4.293-4.293a1 1 0 011.414-1.414l6 6a1 1 0 010 1.414z"
        fill={colors.whitetext}
      />
    </Svg>
  );
}

export default RightArrow;
