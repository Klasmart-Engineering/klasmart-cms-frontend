import { configureStore } from "@reduxjs/toolkit";
import assessment from "./assessment";
import confirm from "./confirm";
import content from "./content";
import loading, { actSetLoading } from "./loading";
import { createLoadingMiddleware } from "./middleware/loadingMiddleware";
import notify from "./notify";
import outcome from "./outcome";
import schedule from "./schedule";
const loadingMiddleware = createLoadingMiddleware({
  enableLoadingPayload: { type: actSetLoading.type, payload: true },
  disableLoadingPayload: { type: actSetLoading.type, payload: false },
});

export const store = configureStore({
  reducer: {
    loading,
    confirm,
    notify,
    content,
    outcome,
    schedule,
    assessment,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(loadingMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
