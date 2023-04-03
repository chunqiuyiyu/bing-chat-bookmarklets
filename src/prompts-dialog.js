// Use prompts easily in a dialog
(() => {
  function openOnce(url, target) {
    const width = 400;
    const height = 320;

    // open a blank "target" window
    // or get the reference to the existing "target" window
    const winRef = window.open(
      "",
      target,
      `left=${screen.width / 2 - width / 2},top=${
        screen.height / 2 - height / 2
      },height=${height},width=${width},scrollbars`
    );

    // if the "target" window was just opened, change its url
    if (winRef.location.href === "about:blank") {
      winRef.location.href = url;
    }
    return winRef;
  }

  const w = openOnce("", "Prompts Dialog");

  const htmlString = `<html lang="en"> <head>
          <meta charset="UTF-8" />
          <title>Prompts Dialog</title>
          <style>
            body {
              padding: 0 1em;
              text-align: center;
            }
            ul {
              list-style: none;
              padding: 0;
            }
            li {
              background: #eee;
              border-bottom: 2px solid #ddd;
              border-radius: 3px;
              padding: 0 6px;
              color: lightseagreen;
              display: inline-block;
              cursor: pointer;
              margin: 0.4em 0.7em;
            }
            .msg {
              margin-right: 0.3em;
            }
            .msg:hover {
              background: #ddd;
            }
            .tip {
              color: gray;
              font-size: 14px;
              visibility: hidden;
              margin-bottom: 0.5em;
            }
            a {
              color: gray;
              font-size: 14px;
              float: right;
            }
          </style>
        </head>
        <body>
          <div class="tip">✅ Messages Copied!</div>
          <label for="q">Prompts: </label
          ><input
            id="q"
            name="q"
            value=""
            type="search"
            autocomplete="off"
            placeholder="text here…"
          />&nbsp;<button>Add</button>

          <ul></ul>
          <br><a target="_blank" href="https://github.com/chunqiuyiyu/bing-chat-prompt-keywords">More info</a>
        </body>
      </html>`;

  w.document.write(htmlString);
  w.document.close();

  let data = localStorage.getItem("BingChatPromptKeywords");

  if (!data) {
    // https://github.com/chunqiuyiyu/bing-chat-prompt-keywords
    const defaultData = [
      "act_as",
      "acsii-art",
      "code",
      "draw",
      "hi",
      "let's_play",
      "no_search",
      "quiz",
      "outline",
      "photograph",
      "similar_to",
      "translate",
      "vs",
    ];

    data = defaultData;
    localStorage.setItem("BingChatPromptKeywords", JSON.stringify(defaultData));
  } else {
    data = JSON.parse(data);
  }

  const ul = w.document.querySelector("ul");

  const renderList = (data) => {
    ul.innerHTML = "";
    data.forEach((item) => {
      const li = document.createElement("li");
      li.innerHTML = `<span class="msg">${item}</span><span class="close" style="font-size: 12px">❌</span>`;

      ul.appendChild(li);

      // Click on the list item to copy the text to the clipboard
      li.querySelector(".msg").onclick = (e) => {
        const text = e.target.innerText;
        w.navigator.clipboard.writeText(text).then(
          () => {
            const tip = w.document.querySelector(".tip");
            tip.style.visibility = "visible";
            setTimeout(() => {
              tip.style.visibility = "hidden";
            }, 1000);
          },
          (err) => {
            console.error("Async: Could not copy text: ", err);
          }
        );
      };

      // Click on the close button to remove the list item
      li.querySelector(".close").onclick = (e) => {
        e.stopPropagation();
        e.target.parentNode.remove();
        // Remove from localStorage
        const newData = data.filter(
          (item) => item !== e.target.parentNode.querySelector(".msg").innerText
        );

        localStorage.setItem("BingChatPromptKeywords", JSON.stringify(newData));
      };
    });
  };

  renderList(data);

  // Filter the list items
  const input = w.document.querySelector("input");
  input.value = window.getSelection().toString();
  input.addEventListener("input", (e) => {
    console.log(e);

    const filter = e.target.value.toUpperCase();
    const li = ul.querySelectorAll("li");
    li.forEach((item) => {
      const text = item.querySelector(".msg").innerText.toUpperCase();
      if (text.indexOf(filter) > -1) {
        item.style.display = "";
      } else {
        item.style.display = "none";
      }
    });
  });

  // Add new list item
  const button = w.document.querySelector("button");
  button.onclick = () => {
    // Add input value to localStorage
    data = JSON.parse(localStorage.getItem("BingChatPromptKeywords"));
    // push new item, check if it's already in the list
    const newData = data.includes(input.value) ? data : [input.value, ...data];

    localStorage.setItem("BingChatPromptKeywords", JSON.stringify(data));

    renderList(newData);
  };
})();
