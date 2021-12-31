const moveHome = () => {
  window.history.pushState("signin", "", "/");
  window.history.go(0);
};

export const movePage = (page) => {
  window.history.pushState(
    window.location.href,
    "",
    `http://localhost:3000${page}`
  );
  window.history.go(0);
};

export const delay = (time) => {
  setTimeout(() => {}, time);
};

export const setTimeRemoveAlarm = (setAlarmModal) => {
  setTimeout(() => {
    setAlarmModal((old) => old.slice(1));
  }, 3000);
};

export default moveHome;
