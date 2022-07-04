import { ApolloProvider } from "@apollo/client";
import { createGenerateClassName, StylesProvider, ThemeProvider } from "@material-ui/core";
import Stm from "@pages/SimpleTeacherModule";
import { SnackbarProvider } from "notistack";
import { Provider } from "react-redux";
import { HashRouter, Redirect, Route, Switch } from "react-router-dom";
import { gqlapi } from "./api";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { Loading } from "./components/Loading";
import { Locale } from "./components/Locale";
import { Notification } from "./components/Notification";
import ContentLibraryLayout from "./layout/ContentLibrary";
import ContentEdit from "./pages/ContentEdit/index";
import ContentPreview from "./pages/ContentPreview";
import MyContentList from "./pages/MyContentList/index";
import Preview from "./pages/Preview";
import { ReportAchievementDetail } from "./pages/ReportAchievementDetail";
import { ReportAchievementList } from "./pages/ReportAchievementList";
import { ReportCategories } from "./pages/ReportCategories";
import { ReportDashboard } from "./pages/ReportDashboard";
import { ReportLearningSummary } from "./pages/ReportLearningSummary";
import ReportStudentProgress from "./pages/ReportStudentProgress";
import ReportStudentUsage from "./pages/ReportStudentUsage";
import ReportTeachingLoad from "./pages/ReportTeachingLoad";
import { store } from "./reducers";
import theme from "./theme";

const generateClassName = createGenerateClassName({
  productionPrefix: "cms",
  seed: "cms",
});
function App() {
  return (
    <ApolloProvider client={gqlapi}>
      <ThemeProvider theme={theme}>
        <StylesProvider generateClassName={generateClassName}>
          <HashRouter>
            <Provider store={store}>
              <Locale>
                <Loading />
                <ContentLibraryLayout />
                <SnackbarProvider>
                  <Switch>
                    <Route path={Preview.routeBasePath}>
                      <Preview />
                    </Route>
                    {/* CMS */}
                    <Route path={MyContentList.routeBasePath}>
                      <MyContentList />
                    </Route>
                    <Route path={ContentEdit.routeMatchPath}>
                      <ContentEdit />
                    </Route>
                    <Route path={ContentEdit.routeBasePath}>
                      <Redirect to={ContentEdit.routeRedirectDefault} />
                    </Route>
                    <Route path={ContentPreview.routeMatchPath}>
                      <ContentPreview />
                    </Route>
                    <Route exact path={"/"}>
                      <Redirect to={MyContentList.routeBasePath} />
                    </Route>
                    {/* report */}
                    <Route path={ReportAchievementList.routeBasePath}>
                      <ReportAchievementList />
                    </Route>
                    <Route path={ReportAchievementDetail.routeBasePath}>
                      <ReportAchievementDetail />
                    </Route>
                    <Route path={ReportDashboard.routeBasePath}>
                      <ReportDashboard />
                    </Route>
                    <Route path={ReportTeachingLoad.routeBasePath}>
                      <ReportTeachingLoad />
                    </Route>
                    <Route path={ReportCategories.routeBasePath}>
                      <ReportCategories />
                    </Route>
                    <Route path={ReportStudentProgress.routeBasePath}>
                      <ReportStudentProgress />
                    </Route>
                    <Route path={ReportLearningSummary.routeMatchPath}>
                      <ReportLearningSummary />
                    </Route>
                    <Route path={ReportStudentUsage.routeBasePath}>
                      <ReportStudentUsage />
                    </Route>
                    <Route path={Stm.routeMatchPath}>
                      <Stm />
                    </Route>
                    <Route path="/report">
                      <Redirect to={ReportDashboard.routeBasePath} />
                    </Route>
                    <Route path="/library">
                      <Redirect to={MyContentList.routeBasePath + "?publish_status=published&page=1"} />
                    </Route>
                  </Switch>
                  <Notification />
                  <ConfirmDialog />
                </SnackbarProvider>
              </Locale>
            </Provider>
          </HashRouter>
        </StylesProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;
