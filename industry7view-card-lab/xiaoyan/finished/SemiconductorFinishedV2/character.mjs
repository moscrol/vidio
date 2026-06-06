export function xiaoyanCharacter({
  className = "",
  pose = "inspect",
  label = "小研",
} = {}) {
  return `
    <div class="xy-character pose-${pose} ${className}" aria-label="${label}">
      <div class="xy-head"><span></span></div>
      <i class="xy-body"></i>
      <i class="xy-arm xy-arm-left"></i>
      <i class="xy-arm xy-arm-right"></i>
      <i class="xy-leg xy-leg-left"></i>
      <i class="xy-leg xy-leg-right"></i>
      <div class="xy-magnifier"><i></i></div>
    </div>
  `;
}

