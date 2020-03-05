<template>
  <div class="icon icon-success icon-success-animated">
    <svg width="64" height="64" viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g stroke="#000" stroke-width="5">
        <circle cx="65" cy="65" r="62"/>
        <path d="M40.5 67.5L59.5 83L93.5 48.5" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
    </svg>
  </div>
</template>

<style lang="scss">
.icon-success-animated {
  svg {
    display: inline;
    circle {
      stroke-dasharray: 480px, 480px;
      stroke-dashoffset: 960px;
      animation: checkmark-circle 0.4s ease-in-out backwards;
    }
    path {
      stroke-dasharray: 100px, 100px;
      stroke-dashoffset: 200px;
      animation: checkmark 0.25s ease-in-out 0.38s backwards;
    }
  }
}
.inverted-colors .icon-success-animated svg g {
  stroke: #fff;
}
@keyframes checkmark-circle {
  0% {
    stroke-dashoffset: 480px;
  }
  100% {
    stroke-dashoffset: 960px;
  }
}
@keyframes checkmark {
  0% {
    stroke-dashoffset: 100px;
  }
  100% {
    stroke-dashoffset: 0px;
  }
}
</style>
