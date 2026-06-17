export function xiaoyanCharacter({
  className = "",
  pose = "inspect",
  label = "A-roll素描分身",
} = {}) {
  const sources = {
    push: "data-cards",
    brace: "inspect-equipment",
    walk: "walk",
    stamp: "point-chart",
    inspect: "inspect-equipment",
    point: "point-chart",
    notebook: "notebook",
    writing: "writing",
    seated: "seated-presentation",
    back: "look-back",
  };
  const source = sources[pose] || sources.inspect;

  return `
    <div class="xy-character avatar-pose-${source} ${className}" aria-label="${label}">
      <img src="./media/avatar/${source}.png" alt="" />
    </div>
  `;
}
