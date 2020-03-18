<template>
  <ScrollView class="page detail-page">
    <div class="detail-top">
      <div class="content">
        <div class="detail-balance">
          <span class="balance-label">Balance</span>
          <FormattedToken class="account-balance" :value="'123 aergo'" />
        </div>
      </div>
    </div>
    <div class="detail-bottom">
      <div class="content">
        <div class="detail-box">
          <div class="account-detail-address">
            <Identicon :text="$route.params.address" />
            <span class="account-address">{{$route.params.address}}</span>
          </div>
          <p><router-link :to="{ name: 'account-export' }" class="text-link">Export</router-link></p>
        </div>
      </div>
    </div>
  </ScrollView>
</template>

<script lang="ts">
import { ScrollView } from '@aergo-connect/lib-ui/src/layouts';
import { FormattedToken, Identicon } from '@aergo-connect/lib-ui/src/content';

import Vue from 'vue';
import Component from 'vue-class-component'

@Component({
  components: {
    ScrollView,
    FormattedToken,
    Identicon,
  },
})
export default class AccountDetails extends Vue {
}
</script>

<style lang="scss">
.detail-balance {
  display: flex;
  flex-direction: column;
  background-color: #fff;

  .balance-label {
    font-size: (12/16)*1rem;
    font-weight: 500;
  }
  .account-balance {
    line-height: 1.8;

    .value {
      font-weight: 600;
      font-size: (28/16)*1rem;
    }
    .unit {
      font-size: (20/16)*1rem;
    }
  }
}
.detail-box {
  border-radius: 2px;
  box-shadow: 0 12px 20px 0 rgba(34, 34, 34, 0.08);
  min-height: 200px;
  background-color: #fff;
  font-size: (13/16)*1rem;

  .account-address {
    word-break: break-all;
    line-height: 1.3;
    color: #000;
  }
  .account-detail-address {
    padding: 24px;
  }
}

/* Two-tone trick effect. Extend the upper (white) box and then pull the lower (black) box up */
.detail-top {
  background-color: #fff;
  padding-bottom: 80px;
}
.detail-bottom {
  margin-top: -100px;
}
.detail-page {
  background-color: #222;
}
</style>