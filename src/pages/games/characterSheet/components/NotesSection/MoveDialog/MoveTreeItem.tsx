import { TreeItem } from "@mui/x-tree-view";

import { NoteFolder } from "api-calls/notes/_notes.type";

export interface MoveTreeItemProps {
  folderId: string;
  folders: Record<string, NoteFolder>;
  tree: Record<string, string[]>;
  currentFolderId: string | undefined;
}
export function MoveTreeItem(props: MoveTreeItemProps) {
  const { folderId, folders, tree, currentFolderId } = props;

  const children = tree[folderId] ?? [];

  return (
    <TreeItem
      itemId={folderId}
      label={folders[folderId].name}
      disabled={folderId === currentFolderId}
    >
      {children.map((childId) => (
        <MoveTreeItem
          key={childId}
          folderId={childId}
          folders={folders}
          tree={tree}
          currentFolderId={currentFolderId}
        />
      ))}
    </TreeItem>
  );
}
