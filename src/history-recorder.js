// Save chat history to file.
(() => {
  // Get Chat Bing Messages
  const messages = [];
  const images = [];
  const mainElm = document
    .querySelector("cib-serp")
    .shadowRoot.querySelector("#cib-conversation-main")
    .shadowRoot.querySelector("#cib-chat-main");
  const turnElms = mainElm.querySelectorAll("cib-chat-turn");
  const messageElms = [];
  for (let turnElm of turnElms) {
    for (let group of turnElm.shadowRoot.querySelectorAll(
      "cib-message-group"
    )) {
      messageElms.push(group);
    }
  }

  for (let messageElm of messageElms) {
    const source = messageElm.getAttribute("source");
    let msg = "";
    switch (source) {
      case "user":
        const userMessages = messageElm.shadowRoot
          .querySelector(".cib-message-main")
          .shadowRoot.querySelectorAll(".content");
        for (let item of userMessages) {
          msg = item.textContent;
        }
        break;
      case "bot":
        const botMessages = messageElm.shadowRoot.querySelectorAll(
          `.cib-message-main[type="text"]`
        );
        for (let item of botMessages) {
          msg = item.shadowRoot.querySelector(".ac-textBlock").textContent;
        }

        // Save images
        const imgIframes = messageElm.shadowRoot.querySelectorAll(
          `.cib-message-main[type="host"]`
        );
        if (imgIframes && imgIframes.length > 0) {
          let pics =
            imgIframes[0].shadowRoot.firstElementChild?.contentDocument.querySelectorAll(
              ".mimg"
            );
          if (pics) {
            for (let img of pics) {
              images.push(img.src);
            }
          }
        }
        break;
      default:
        break;
    }
    messages.push({ source, msg });
  }

  let result = "";
  for (let item of messages) {
    result += item.source.toUpperCase() + " : \n" + item.msg + "\n";
  }

  // Save test text to file.
  const a = document.createElement("a");
  const file = new Blob([result], { type: "text/plain" });
  a.href = URL.createObjectURL(file);
  a.download = Math.random().toString(36).substring(2) + ".txt";
  document.body.appendChild(a);
  a.click();
  a.parentNode.removeChild(a);

  // Save images to file.
  for (let img of images) {
    fetch(img, {
      headers: new Headers({
        Origin: location.origin,
      }),
      mode: "cors",
    })
      .then((response) => response.blob())
      .then((blob) => {
        let blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.download = `${Math.random().toString(36).substring(2)}.jpg`;
        a.href = blobUrl;
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch((e) => console.error(e));
  }
})();
