import { EntityTreeResponse } from "@api/api.auto";
import React, { ReactNode } from "react";
import { TreeNode } from "./TreeNode";

export interface treeProps {
  treeData: EntityTreeResponse[];
  handleLabelClick: (path: string) => any;
}
export interface TreeSelectProps {
  item_count?: number;
  showChildren: boolean;
  name?: string;
}
export interface TreeNodeProps {
  node: EntityTreeResponse;
  handleLabelClick: (path: string) => any;
  defaultCollapseIcon: ReactNode;
  defaultExpandIcon: ReactNode;
  defaultIconPosition: "left" | "right";
  defaultPath: string;
}
export const TreeContext = React.createContext<IState>({ path: "" });

interface IState {
  path: string;
}

export default function TreeViewFolder(props: TreeNodeProps) {
  return (
    <div>
      <TreeNode {...props} key={props.node.id} />
    </div>
  );
}
