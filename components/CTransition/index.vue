<template>
  <transition name="collapse">
    <slot />
  </transition>
</template>

<style lang="scss" scoped>
.collapse-leave,
.collapse-enter-to {
  transition: transform 0.28s;
  transform: scaleY(1);
}
.collapse-enter,
.collapse-leave-to {
  transition: transform 0.28s;
  transform: scaleY(0);
}
</style>
