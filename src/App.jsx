import React from "react";
import { useRoute, Header, Footer } from "./components/Layout";
import Home from "./pages/Home";
import Explorer from "./pages/Explorer";
import ArtifactDetail from "./pages/ArtifactDetail";
import MapPage from "./pages/MapPage";
import TimelinePage from "./pages/TimelinePage";
import LegacyPage from "./pages/LegacyPage";
import ComparePage from "./pages/ComparePage";
import AboutPage from "./pages/AboutPage";
import { NotFound } from "./components/ui";

function parse(route) {
  const [path, qs] = route.split("?");
  const query = Object.fromEntries(new URLSearchParams(qs || ""));
  return { path: path || "/", query };
}

export default function App() {
  const route = useRoute();
  const { path, query } = parse(route);

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [path]);

  let page;
  if (path === "/") page = <Home />;
  else if (path === "/explorer") page = <Explorer query={query} />;
  else if (path.startsWith("/relic/")) page = <ArtifactDetail id={path.replace("/relic/", "")} />;
  else if (path === "/map") page = <MapPage query={query} />;
  else if (path === "/timeline") page = <TimelinePage query={query} />;
  else if (path === "/legacy") page = <LegacyPage query={query} />;
  else if (path === "/compare") page = <ComparePage query={query} />;
  else if (path === "/about") page = <AboutPage />;
  else page = <NotFound what="Page" />;

  return (
    <>
      <Header route={path} />
      <main>{page}</main>
      <Footer />
    </>
  );
}
