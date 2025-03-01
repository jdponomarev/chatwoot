import axios from 'axios';
import actions from '../../conversations/actions';
import * as types from '../../../mutation-types';

const commit = jest.fn();
const dispatch = jest.fn();
global.axios = axios;
jest.mock('axios');

describe('#actions', () => {
  describe('#getConversation', () => {
    it('sends correct actions if API is success', async () => {
      axios.get.mockResolvedValue({
        data: { id: 1, meta: { sender: { id: 1, name: 'Contact 1' } } },
      });
      await actions.getConversation({ commit }, 1);
      expect(commit.mock.calls).toEqual([
        [
          types.default.UPDATE_CONVERSATION,
          { id: 1, meta: { sender: { id: 1, name: 'Contact 1' } } },
        ],
        ['contacts/SET_CONTACT_ITEM', { id: 1, name: 'Contact 1' }],
      ]);
    });
    it('sends correct actions if API is error', async () => {
      axios.get.mockRejectedValue({ message: 'Incorrect header' });
      await actions.getConversation({ commit });
      expect(commit.mock.calls).toEqual([]);
    });
  });
  describe('#muteConversation', () => {
    it('sends correct actions if API is success', async () => {
      axios.get.mockResolvedValue(null);
      await actions.muteConversation({ commit }, 1);
      expect(commit.mock.calls).toEqual([[types.default.MUTE_CONVERSATION]]);
    });
    it('sends correct actions if API is error', async () => {
      axios.get.mockRejectedValue({ message: 'Incorrect header' });
      await actions.getConversation({ commit });
      expect(commit.mock.calls).toEqual([]);
    });
  });

  describe('#updateConversation', () => {
    it('sends setContact action and update_conversation mutation', () => {
      const conversation = {
        id: 1,
        messages: [],
        meta: { sender: { id: 1, name: 'john-doe' } },
      };
      actions.updateConversation({ commit, dispatch }, conversation);
      expect(commit.mock.calls).toEqual([
        [types.default.UPDATE_CONVERSATION, conversation],
      ]);
      expect(dispatch.mock.calls).toEqual([
        [
          'contacts/setContact',
          {
            id: 1,
            name: 'john-doe',
          },
        ],
      ]);
    });
  });

  describe('#addConversation', () => {
    it('doesnot send mutation if conversation is from a different inbox', () => {
      const conversation = {
        id: 1,
        messages: [],
        meta: { sender: { id: 1, name: 'john-doe' } },
        inbox_id: 2,
      };
      actions.addConversation(
        { commit, dispatch, state: { currentInbox: 1 } },
        conversation
      );
      expect(commit.mock.calls).toEqual([]);
      expect(dispatch.mock.calls).toEqual([]);
    });

    it('sends correct mutations', () => {
      const conversation = {
        id: 1,
        messages: [],
        meta: { sender: { id: 1, name: 'john-doe' } },
        inbox_id: 1,
      };
      actions.addConversation(
        { commit, dispatch, state: { currentInbox: 1 } },
        conversation
      );
      expect(commit.mock.calls).toEqual([
        [types.default.ADD_CONVERSATION, conversation],
      ]);
      expect(dispatch.mock.calls).toEqual([
        [
          'contacts/setContact',
          {
            id: 1,
            name: 'john-doe',
          },
        ],
      ]);
    });

    it('sends correct mutations if inbox filter is not available', () => {
      const conversation = {
        id: 1,
        messages: [],
        meta: { sender: { id: 1, name: 'john-doe' } },
        inbox_id: 1,
      };
      actions.addConversation({ commit, dispatch, state: {} }, conversation);
      expect(commit.mock.calls).toEqual([
        [types.default.ADD_CONVERSATION, conversation],
      ]);
      expect(dispatch.mock.calls).toEqual([
        [
          'contacts/setContact',
          {
            id: 1,
            name: 'john-doe',
          },
        ],
      ]);
    });
  });
  describe('#addMessage', () => {
    it('sends correct mutations if message is incoming', () => {
      const message = {
        id: 1,
        message_type: 0,
        conversation_id: 1,
      };
      actions.addMessage({ commit }, message);
      expect(commit.mock.calls).toEqual([
        [types.default.ADD_MESSAGE, message],
        [
          types.default.SET_CONVERSATION_CAN_REPLY,
          { conversationId: 1, canReply: true },
        ],
      ]);
    });
    it('sends correct mutations if message is not an incoming message', () => {
      const message = {
        id: 1,
        message_type: 1,
        conversation_id: 1,
      };
      actions.addMessage({ commit }, message);
      expect(commit.mock.calls).toEqual([[types.default.ADD_MESSAGE, message]]);
    });
  });
});
