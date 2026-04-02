import { createHashRouter } from "react-router";
import { MainContent } from "./MainContent";
import { StandaloneWidget } from "./components/StandaloneWidget";
import { LayoutProposals } from "./components/LayoutProposals";
import { DetachedRigView } from "./components/DetachedRigView";

export const router = createHashRouter([
  {
    path: "/",
    Component: MainContent,
  },
  {
    path: "/standalone/:widgetId",
    Component: StandaloneWidget,
  },
  {
    path: "/proposals",
    Component: LayoutProposals,
  },
  {
    path: "/rig/:rigId",
    Component: DetachedRigView,
  },
]);
