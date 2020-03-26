<template functional>
  <dl class="table key-value-table">
    <slot></slot>
  </dl>
</template>

<style lang="scss">
$padding: 7px;
$lineHeight: 20px;

.key-value-table {
  display: grid;
  margin: 0;
  grid-template-columns: auto auto;

  font-size: (13/16)*1rem;

  dt, dd {
    padding: $padding 0;
    margin: 0;
    box-sizing: border-box;
    line-height: $lineHeight;
    break-inside: avoid;
    box-shadow: inset 0 -1px 0 0 rgba(34, 34, 34, 0.1);
  }
  dt {
    grid-column: 1;
    font-weight: 500;
    color: rgba(34, 34, 34, 0.65);
    padding-right: 10px;
  }
  dd {
    grid-column: 2;
    word-break: break-word;
    text-align: right;
  }
  dd.textEllipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.inverted-colors .key-value-table {
  dt, dd {
    box-shadow: inset 0 -1px 0 0 rgba(255, 255, 255, 0.1);
  }
  dt {
    color: rgba(255, 255, 255, 0.65);
  }
}
</style>
