import { EntityTreeResponse } from "@api/api.auto";
import React, { ReactNode } from "react";
import treeData from "../../mocks/folderTree1.json";
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
  handleLabelClick: (path: string, selectNode: TreeSelectProps) => any;
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
  // const [state, setState] = React.useState<IState>({
  //   path,
  // });
  // const handleClick = (id:string) => {
  //   console.log("id =", id)
  //   setState({path:id})
  //   props.handleLabelClick(id)

  // }
  return (
    <div>
      {/* <TreeContext.Provider value={state}> */}
      <TreeNode {...props} node={treeData} key={treeData.id} />
      {/* </TreeContext.Provider> */}
    </div>
  );
}
