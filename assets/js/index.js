document.addEventListener("DOMContentLoaded", () => {
  const game = new Game("canvas");
  game.start();

  document.addEventListener("keydown", (e) => {
    game.onKeyEvent(e);
  });

  document.getElementById("pause").addEventListener("click", () => {
    game.pause();
  });
});
