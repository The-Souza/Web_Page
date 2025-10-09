import { Component, type JSX } from "react";
import type { UserIconProps } from "./UserIcon.types";
import { USER_ICON } from "./UserIcon.variants";

export class UserIcon extends Component<UserIconProps> {
  static defaultProps = {
    userName: "",
    icon: "classic",
  };

  render(): JSX.Element {
    const { userName, icon } = this.props;

    return (
      <div className="flex items-center gap-3">
        <span className="text-greenLight">{USER_ICON[icon]()}</span>

        <span className="text-greenLight text-lg font-extrabold font-lato">
          {userName}
        </span>
      </div>
    );
  }
}
