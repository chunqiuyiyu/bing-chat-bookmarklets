// Chat with Bing chat quickly
(() => {
  const selection = getSelection().toString();
  if (selection) {
    open(`https://www.bing.com/search?q=${selection}&showconv=1&sendquery=1`);
  } else {
    open("https://www.bing.com/search?q=Bing+AI&showconv=1");
  }
})();
