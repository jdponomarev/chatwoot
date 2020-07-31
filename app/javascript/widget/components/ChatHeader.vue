<template>
  <header class="header-collapsed">
    <div class="header-branding">
      <img v-if="avatarUrl" :src="avatarUrl" alt="avatar" />
      <h2 class="title" v-html="title"></h2>
      <div class="header-call" @click="createRoom">
        <img src="https://misc.hb.bizmrg.com/p-replace-color%20(1).png" />
      </div>
    </div>
    <span class="close-button" @click="closeWindow"></span>
  </header>
</template>

<script>

import { mapGetters } from 'vuex';
import { IFrameHelper } from 'widget/helpers/utils';
import axios from 'axios';
import {
  sendMessageAPI,
  getMessagesAPI,
  sendAttachmentAPI,
  toggleTyping,
  setUserLastSeenAt,
} from 'widget/api/conversation';

export const dailyApi = axios.create({});



export const createTemporaryMessage = ({ attachments, content }) => {
  const timestamp = new Date().getTime() / 1000;
  return {
    id: getUuid(),
    content,
    attachments,
    status: 'in_progress',
    created_at: timestamp,
    message_type: MESSAGE_TYPE.INCOMING,
  };
};

//sendMessage: async ({ commit }, params) => {
//    const { content } = params;
//    commit('pushMessageToConversation', createTemporaryMessage({ content }));
//    await sendMessageAPI(content);
//},


export default {
  name: 'ChatHeader',
  props: {
    avatarUrl: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
  },
  computed: {
    ...mapGetters({
      widgetColor: 'appConfig/getWidgetColor',
    }),
  },
  methods: {
    closeWindow() {
      if (IFrameHelper.isIFrame()) {
        IFrameHelper.sendMessage({
          event: 'toggleBubble',
        });
      }
    },
    async createRoom(){
      if(confirm("Вы действительно хотите начать видео чат?")){
        let dailyData = await axios({
          method: 'POST',
          url:"https://api.daily.co/v1/rooms",
          headers:{
            "Authorization":"Bearer 3da1f8c99ff586c587dae2c298cd05880f90a31051696c0cd8b4683b2bc5a20e"
          },
          data:{}
        });
        console.log("dailyData",dailyData);
        window.open(dailyData.data.url);
        
        await sendMessageAPI("Создан видео-чат: "+dailyData.data.url);
        
      }
    }
  },
};
</script>

<style scoped lang="scss">
@import '~widget/assets/scss/variables.scss';
@import '~widget/assets/scss/mixins.scss';

.header-collapsed {
  display: flex;
  justify-content: space-between;
  padding: $space-two $space-medium;
  width: 100%;
  box-sizing: border-box;
  color: $color-white;

  .header-branding {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    
    img {
      border-radius: 50%;
    }
    .header-call{
      width: 50px;
      height: 50px;
      color: #000;
      vertical-align: middle;
      line-height: 30px;
      cursor:pointer;
      img{
        width: 50px;
        height: 50px;
        border-radius: 0;
      }
      img:hover{
        opacity: 0.8;
      }
    }
  }

  .title {
    font-size: $font-size-large;
    font-weight: $font-weight-medium;
    color: $color-heading;
  }

  img {
    height: 24px;
    width: 24px;
    margin-right: $space-small;
  }

  .close-button {
    display: none;
  }
}
</style>
