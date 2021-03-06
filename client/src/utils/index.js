const options = { year: "numeric", month: "short", day: "numeric" };

export const formatDate = date =>
  new Date(date).toLocaleDateString("en-US", options);

// force focus on #main when using skip navigation link
// (some browsers will only focus form inputs, links, and buttons)
export const skip = targetId => {
  const removeTabIndex = e => {
    e.target.removeAttribute("tabindex");
  };
  const skipTo = document.getElementById(targetId);
  // Setting 'tabindex' to -1 takes an element out of normal
  // tab flow but allows it to be focused via javascript
  skipTo.tabIndex = -1;
  skipTo.focus(); // focus on the content container
  // console.log(document.activeElement);
  // when focus leaves this element,
  // remove the tabindex attribute
  skipTo.addEventListener("blur", removeTabIndex);
};

const colors = ["red", "orange", "yellow", "green", "blue", "purple", "pink"];

export const glow = () => {
  document.addEventListener("DOMContentLoaded", () => {
    // add glow classes to rainbow stripes
    setTimeout(() => {
      colors.map((color, idx) => {
        setTimeout(() => {
          document.getElementById(color).style.filter = "url(#svgglow)";
        }, 200 * (7 - idx));
        return null;
      });
    }, 2400);
  });
};
